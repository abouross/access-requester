package td.aboudev.access_requester.services;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import td.aboudev.access_requester.entities.Application;
import td.aboudev.access_requester.entities.ValidationContext;
import td.aboudev.access_requester.exceptions.BadRequestException;
import td.aboudev.access_requester.exceptions.EntityNotFoundException;
import td.aboudev.access_requester.models.PageModel;
import td.aboudev.access_requester.models.dtos.ApplicationDto;
import td.aboudev.access_requester.models.dtos.ValidationContextDto;
import td.aboudev.access_requester.models.forms.ApplicationForm;
import td.aboudev.access_requester.repositories.ApplicationRepository;
import td.aboudev.access_requester.repositories.UserRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ApplicationService {
    private final ApplicationRepository applicationRepository;
    private final ValidationContextService contextService;
    private final UserRepository userRepository;
    private final TranslationService translationService;

    /**
     * Page List of applications with search.
     *
     * @param search   Search key
     * @param pageable Pagination query (sort, pageSize, page...)
     * @return Page of applications
     */
    public PageModel<ApplicationDto.List> list(String search, Pageable pageable) {
        if (search == null || search.trim().isEmpty()) {
            return new PageModel<>(
                    applicationRepository.findAll(pageable)
                            .map(ApplicationDto.List::newInstance)
            );
        }

        Application application = Application.builder()
                .name(search.trim())
                .description(search.trim())
                .build();

        ExampleMatcher matcher = ExampleMatcher.matchingAny()
                .withIgnoreCase()
                .withIgnoreNullValues()
                .withStringMatcher(ExampleMatcher.StringMatcher.CONTAINING);
        Example<Application> example = Example.of(application, matcher);
        return new PageModel<>(
                applicationRepository.findAll(example, pageable)
                        .map(ApplicationDto.List::newInstance)
        );
    }

    /**
     * List actives contexts
     *
     * @return Enabled contexts list
     */
    public List<ValidationContextDto.List> activesContexts() {
        return contextService.listActive();
    }

    /**
     * Create new application
     *
     * @param form Application form
     * @return Create application
     */
    public ApplicationDto.List create(ApplicationForm form) {
        ValidationContext context = contextService.getEntity(form.getValidationContext());
        Application application = Application.builder()
                .name(form.getName())
                .context(context)
                .description(form.getDescription())
                .enabled(form.getEnabled())
                .build();
        applicationRepository.save(application);
        return ApplicationDto.List.newInstance(application);
    }

    /**
     * Get Application details by id
     *
     * @param id Application ID
     * @return Application details
     */
    public ApplicationDto.Details get(Long id) {
        return ApplicationDto.Details.newInstance(
                applicationRepository.findById(id)
                        .orElseThrow(EntityNotFoundException::new)
        );
    }

    /**
     * Update an existing application
     *
     * @param id   Application ID
     * @param form New information form
     * @return Update application
     */
    public ApplicationDto.Details update(Long id, @Valid ApplicationForm form) {
        Application application = applicationRepository.findById(id)
                .orElseThrow(EntityNotFoundException::new);

        ValidationContext context = contextService.getEntity(form.getValidationContext());

        application.setName(form.getName());
        application.setContext(context);
        application.setDescription(form.getDescription());
        application.setEnabled(form.getEnabled());

        applicationRepository.save(application);
        return ApplicationDto.Details.newInstance(application);
    }

    /**
     * Add application role
     *
     * @param id   Application ID
     * @param role role
     */
    public void addRole(Long id, String role) {
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new BadRequestException(translationService.trans(
                        "applications.not_found",
                        new Object[]{id}
                )));
        application.getRoles().add(role);
        applicationRepository.save(application);
    }

    public void removeRole(Long id, String role) {
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new BadRequestException(translationService.trans(
                        "applications.not_found",
                        new Object[]{id}
                )));
        application.getRoles().remove(role);
        applicationRepository.save(application);
    }
}
