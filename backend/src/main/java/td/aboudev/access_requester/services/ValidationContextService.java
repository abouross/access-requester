package td.aboudev.access_requester.services;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import td.aboudev.access_requester.entities.BaseValidator;
import td.aboudev.access_requester.entities.PermanentValidator;
import td.aboudev.access_requester.entities.User;
import td.aboudev.access_requester.entities.ValidationContext;
import td.aboudev.access_requester.exceptions.BadRequestException;
import td.aboudev.access_requester.exceptions.EntityNotFoundException;
import td.aboudev.access_requester.models.PageModel;
import td.aboudev.access_requester.models.dtos.ValidationContextDto;
import td.aboudev.access_requester.models.dtos.ValidatorDto;
import td.aboudev.access_requester.models.forms.ReorderValidatorsForm;
import td.aboudev.access_requester.models.forms.ValidationContextForm;
import td.aboudev.access_requester.models.forms.ValidatorForm;
import td.aboudev.access_requester.repositories.PermanentValidatorRepository;
import td.aboudev.access_requester.repositories.UserRepository;
import td.aboudev.access_requester.repositories.ValidationContextRepository;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ValidationContextService {
    private final ValidationContextRepository contextRepository;
    private final UserRepository userRepository;
    private final PermanentValidatorRepository validatorRepository;
    private final TranslationService translation;
    @Value("${db_referenced_row_error}")
    private int referencedRowErrNo;

    /**
     * List all Flow contexts
     *
     * @param pageable Page parameters like sort, size...
     * @return A page model of flow context dto
     */
    public PageModel<ValidationContextDto.List> list(Pageable pageable) {
        return new PageModel<>(
                contextRepository.findAll(pageable)
                        .map(ValidationContextDto.List::newInstance)
        );
    }

    /**
     * List activated contexts only
     *
     * @return A page model of flow context dto
     */
    public List<ValidationContextDto.List> listActive() {
        return contextRepository.findAllByEnabled(true)
                .stream()
                .map(ValidationContextDto.List::newInstance)
                .toList();
    }

    /**
     * Retrieve an details of flow by id
     *
     * @param id The flow context id
     * @return Detailed flow context
     */
    public ValidationContextDto.Detail get(Integer id) {
        return ValidationContextDto.Detail.newInstance(getEntity(id));
    }

    /**
     * Create a new flow context
     *
     * @param form Information to create a flow context
     * @return Detailed flow context
     */
    public ValidationContextDto.Detail create(ValidationContextForm form) {
        ValidationContext context = ValidationContext.builder()
                .name(form.getName())
                .enabled(form.getEnabled())
                .description(form.getDescription())
                .build();
        contextRepository.save(context);
        return ValidationContextDto.Detail.newInstance(context);
    }

    /**
     * Update a flow context
     *
     * @param id   Id that we want to update
     * @param form Information to update the flow context
     * @return Detailed flow context
     */
    public ValidationContextDto.Detail update(Integer id, ValidationContextForm form) {
        ValidationContext context = contextRepository.findById(id)
                .orElseThrow(() -> new BadRequestException(translation.trans("context.not_found")));
        context.setName(form.getName());
        context.setEnabled(form.getEnabled());
        context.setDescription(form.getDescription());
        contextRepository.save(context);
        return ValidationContextDto.Detail.newInstance(context);
    }

    /**
     * Add permanent validator to flow context
     *
     * @param id   The flow context id
     * @param form Validator information to add
     * @return Validator DTO
     */
    public ValidatorDto addValidator(Integer id, ValidatorForm form) {
        ValidationContext context = contextRepository.findById(id)
                .orElseThrow(() -> new BadRequestException(translation.trans("context.not_found")));
        User user = userRepository.findById(form.getValidator())
                .orElseThrow(() -> new BadRequestException(translation.trans("user.not_found")));
        if (validatorRepository.existsByValidatorAndContext(user, context))
            throw new BadRequestException(translation.trans("validator.already_exist", new String[]{user.display()}));
        if (validatorRepository.existsByContextAndPosition(context, form.getPosition()))
            throw new BadRequestException(translation.trans("validator.position_taken"));
        PermanentValidator validator = new PermanentValidator(user, form.getPosition(), context);
        validatorRepository.save(validator);
        return new ValidatorDto(
                validator.getId(),
                validator.getValidator(),
                validator.getPosition()
        );
    }

    /**
     * Remove permanent validator from list
     *
     * @param id  Flow context id
     * @param vId Validator id
     * @return Update list of permanent validators
     */
    public List<ValidatorDto> deleteValidator(Integer id, Long vId) {
        ValidationContext context = contextRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(translation.trans("context.not_found")));
        validatorRepository.deleteById(vId);
        List<PermanentValidator> validators = validatorRepository.findAllByContextOrderByPositionAsc(context);
        if (!validators.isEmpty()) {
            for (int pos = 0; pos < validators.size(); pos++) {
                validators.get(pos)
                        .setPosition(pos + 1);
            }
            validatorRepository.saveAll(validators);
        }

        return validators.stream()
                .map(permanentValidator -> new ValidatorDto(permanentValidator.getId(), permanentValidator.getValidator(), permanentValidator.getPosition()))
                .toList();
    }

    /**
     * Change permanent validator order
     *
     * @param id   Flow context id
     * @param form Ordered validators
     * @return Updated validators list
     */
    public List<ValidatorDto> reorderValidators(Integer id, ReorderValidatorsForm form) {
        ValidationContext context = contextRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(translation.trans("context.not_found")));
        List<PermanentValidator> validators = context.getValidators();
        for (ValidatorForm validatorForm : form.getValidators()) {
            BaseValidator validator = validators.stream()
                    .filter(v -> v.getId().equals(validatorForm.getValidator()))
                    .findFirst()
                    .orElseThrow(() -> new BadRequestException(("Validateur introuvable avec l'ID: " + validatorForm.getValidator())));
            validator.setPosition(validatorForm.getPosition());
        }
        validatorRepository.saveAll(validators);
        return validators.stream()
                .map(permanentValidator -> new ValidatorDto(permanentValidator.getId(), permanentValidator.getValidator(), permanentValidator.getPosition()))
                .sorted(Comparator.comparingInt(ValidatorDto::getPosition))
                .toList();
    }

    /**
     * Delete a Flow context
     *
     * @param id ID of the flow context
     */
    public void delete(Integer id) {
        try {
            contextRepository.deleteById(id);
        } catch (DataIntegrityViolationException e) {
            Throwable cause = e.getCause();
            while (!(cause instanceof java.sql.SQLIntegrityConstraintViolationException) && cause != null) {
                cause = cause.getCause();
                if (cause != null) {
                    java.sql.SQLIntegrityConstraintViolationException sqlException = (java.sql.SQLIntegrityConstraintViolationException) cause;
                    if (sqlException.getErrorCode() == referencedRowErrNo)
                        throw new BadRequestException(translation.trans("context.delete_used_context"));
                }
            }
            throw e;
        }
    }

    /**
     * Get validation context entity by id
     *
     * @param id Context id
     * @return Context entity
     */
    public ValidationContext getEntity(Integer id) {
        return contextRepository.findById(id)
                .orElseThrow(EntityNotFoundException::new);
    }
}
