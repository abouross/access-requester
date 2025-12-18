package td.aboudev.access_requester.services;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import td.aboudev.access_requester.entities.AccessRequest;
import td.aboudev.access_requester.entities.User;
import td.aboudev.access_requester.models.PageModel;
import td.aboudev.access_requester.models.dtos.AccessRequestDto;
import td.aboudev.access_requester.models.forms.AccessRequestForm;
import td.aboudev.access_requester.repositories.AccessRequestRepository;

import java.util.Date;

@Service
@RequiredArgsConstructor
public class AccessRequestService {
    private final AccessRequestRepository accessRequestRepository;
    private final SecurityService securityService;
    private final UserService userService;

    /**
     * List access requests depends on role if admin all request will be returned, else only a current user requests will be returned
     *
     * @param search   search key for access request
     * @param pageable Pagination information
     * @return Page of found access requests
     */
    public PageModel<AccessRequestDto.List> list(String search, Pageable pageable) {
        User currentUser = securityService.getCurrentUser();
        if (!pageable.getSort().isSorted()) {
            pageable = PageRequest.of(
                    pageable.getPageNumber(),
                    pageable.getPageSize(),
                    Sort.by("createdAt").descending()
            );
        }
        if (currentUser.getRoles().contains("ADMIN")) {
            return new PageModel<>(accessRequestRepository.findAll(pageable)
                    .map(AccessRequestDto.List::newInstance));
        }
        return new PageModel<>(
                accessRequestRepository.findAllByInitiator(currentUser, pageable)
                        .map(AccessRequestDto.List::newInstance)
        );
    }

    /**
     * Create new access request. Also depends on roles. Admin can create request  for other initiator other than him.
     *
     * @param form Access request form
     * @return Created access request
     */
    public AccessRequestDto.List create(@Valid AccessRequestForm form) {
        User currentUser = securityService.getCurrentUser();

        User initiator = currentUser.getRoles().contains("ADMIN") && form.getInitiatorId() != null ?
                userService.getUser(form.getInitiatorId()) : currentUser;

        AccessRequest accessRequest = AccessRequest.builder()
                .initiator(initiator)
                .createdAt(new Date())
                .createdBy(currentUser)
                .status(AccessRequest.AccessRequestStatus.NEW_REQUEST)
                .build();

        accessRequestRepository.save(accessRequest);
        return AccessRequestDto.List.newInstance(accessRequest);
    }
}
