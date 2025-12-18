package td.aboudev.access_requester.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.Repository;
import td.aboudev.access_requester.entities.AccessRequest;
import td.aboudev.access_requester.entities.User;

public interface AccessRequestRepository extends Repository<AccessRequest, Long> {
    Page<AccessRequest> findAll(Pageable pageable);

    Page<AccessRequest> findAllByInitiator(User currentUser, Pageable pageable);

    void save(AccessRequest accessRequest);
}
