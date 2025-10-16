package td.aboudev.access_requester.services;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import td.aboudev.access_requester.entities.*;
import td.aboudev.access_requester.exceptions.BadRequestException;
import td.aboudev.access_requester.exceptions.EntityNotFoundException;
import td.aboudev.access_requester.models.PageModel;
import td.aboudev.access_requester.models.dtos.ValidationFlowDto;
import td.aboudev.access_requester.models.dtos.ValidatorDto;
import td.aboudev.access_requester.models.forms.ReorderValidatorsForm;
import td.aboudev.access_requester.models.forms.ValidationFlowForm;
import td.aboudev.access_requester.models.forms.ValidatorForm;
import td.aboudev.access_requester.repositories.FlowValidatorRepository;
import td.aboudev.access_requester.repositories.UserRepository;
import td.aboudev.access_requester.repositories.ValidationContextRepository;
import td.aboudev.access_requester.repositories.ValidationFlowRepository;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ValidationFlowService {
    private final ValidationFlowRepository repository;
    private final FlowValidatorRepository validatorRepository;
    private final ValidationContextRepository contextRepository;
    private final UserRepository userRepository;
    private final TranslationService translationService;

    /**
     * Pageable list of flows for an context
     *
     * @param pageable  Pagination query
     * @param contextId Validation context id
     * @param search    Search key
     * @return Page of flows list
     */
    public PageModel<ValidationFlowDto.List> list(Pageable pageable, Integer contextId, String search) {
        ValidationContext context = contextRepository.findById(contextId)
                .orElseThrow(() -> new EntityNotFoundException(translationService.trans("context.not_found")));
        if (search == null || search.trim().isEmpty()) {
            return new PageModel<>(repository.findAllByContext(context, pageable)
                    .map(ValidationFlowDto.List::getInstance)
            );
        }
        return new PageModel<>(repository.search(context, "%" + search.trim() + "%", pageable)
                .map(ValidationFlowDto.List::getInstance)
        );
    }

    /**
     * Create new validation flow
     *
     * @param form Validation flow form
     * @return Created validation flow
     */
    public ValidationFlowDto.List create(ValidationFlowForm form) {
        ValidationContext context = contextRepository.findById(form.getContext())
                .orElseThrow(() -> new BadRequestException(translationService.trans("context.not_found")));
        if (!context.getEnabled())
            throw new BadRequestException(translationService.trans("context.disabled"));
        User user = userRepository.findById(form.getUser())
                .orElseThrow(() -> new BadRequestException(translationService.trans("user.not_found")));
        if (!user.getEnabled())
            throw new BadRequestException(translationService.trans("user.disabled"));
        if (repository.existsByContextAndUser(context, user))
            throw new BadRequestException(translationService.trans("flow.already_exists"));
        ValidationFlow flow = ValidationFlow.builder()
                .context(context)
                .user(user)
                .build();
        repository.save(flow);
        return ValidationFlowDto.List.getInstance(flow);
    }

    public ValidationFlowDto.Detail get(Long id) {
        return ValidationFlowDto.Detail.getInstance(
                repository.findById(id)
                        .orElseThrow(EntityNotFoundException::new)
        );
    }

    /**
     * Add validator to the validation flow
     *
     * @param id   Validation flow id
     * @param form Validator form
     * @return Added validation
     */
    public ValidatorDto addValidator(Long id, ValidatorForm form) {
        ValidationFlow flow = repository.findById(id)
                .orElseThrow(() -> new BadRequestException(translationService.trans("flow.not_found")));
        User person = userRepository.findById(form.getValidator())
                .orElseThrow(() -> new BadRequestException(translationService.trans("user.not_found")));
        if (person.getId().equals(flow.getUser().getId()))
            throw new BadRequestException(translationService.trans("flow.self_validation"));
        if (validatorRepository.existsByValidatorAndFlow(person, flow))
            throw new BadRequestException(translationService.trans("validator.already_exist", new String[]{person.display()}));
        if (validatorRepository.existsByFlowAndPosition(flow, form.getPosition()))
            throw new BadRequestException(translationService.trans("flow.position_taken"));
        FlowValidator validator = new FlowValidator(person, form.getPosition(), flow);
        validatorRepository.save(validator);
        return new ValidatorDto(
                validator.getId(),
                validator.getValidator(),
                validator.getPosition()
        );
    }

    /**
     * Remove validator from Flow validators list
     *
     * @param id  Validation flow id
     * @param vId Validation id
     * @return Removed validator
     */
    public List<ValidatorDto> deleteValidator(Long id, Long vId) {
        ValidationFlow flow = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(translationService.trans("flow.not_found")));
        validatorRepository.deleteById(vId);
        List<FlowValidator> validators = validatorRepository.findAllByFlowOrderByPositionAsc(flow);
        if (!validators.isEmpty()) {
            for (int pos = 0; pos < validators.size(); pos++) {
                validators.get(pos)
                        .setPosition(pos + 1);
            }
            validatorRepository.saveAll(validators);
        }
        return validators.stream()
                .map(flowValidator -> new ValidatorDto(flowValidator.getId(), flowValidator.getValidator(), flowValidator.getPosition()))
                .toList();
    }

    /**
     * Reorder flow validators list
     *
     * @param id   Validation flow id
     * @param form Validators form
     * @return reaordered list of validators
     */
    public List<ValidatorDto> reorderValidators(Long id, ReorderValidatorsForm form) {
        ValidationFlow flow = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(translationService.trans("flow.not_found")));
        List<FlowValidator> validators = flow.getValidators();
        for (ValidatorForm validatorForm : form.getValidators()) {
            BaseValidator validator = validators.stream()
                    .filter(v -> v.getId().equals(validatorForm.getValidator()))
                    .findFirst()
                    .orElseThrow(() -> new BadRequestException(translationService.trans("validator.not_found_id", new String[]{id.toString()})));
            validator.setPosition(validatorForm.getPosition());
        }
        validatorRepository.saveAll(validators);
        return validators.stream()
                .map(permanentValidator -> new ValidatorDto(permanentValidator.getId(), permanentValidator.getValidator(), permanentValidator.getPosition()))
                .sorted(Comparator.comparingInt(ValidatorDto::getPosition))
                .toList();
    }
}
