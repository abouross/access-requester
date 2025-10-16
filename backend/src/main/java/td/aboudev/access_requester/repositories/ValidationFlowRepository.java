package td.aboudev.access_requester.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import td.aboudev.access_requester.entities.User;
import td.aboudev.access_requester.entities.ValidationContext;
import td.aboudev.access_requester.entities.ValidationFlow;

import java.util.Optional;

public interface ValidationFlowRepository extends Repository<ValidationFlow, Long> {
    Page<ValidationFlow> findAllByContext(ValidationContext context, Pageable pageable);

    @Query("SELECT v FROM ValidationFlow  v where v.context=?1 and (lower(v.user.username) like lower(?2) or lower(v.user.firstName) like lower(?2) or lower(v.user.lastName) like lower(?2))")
    Page<ValidationFlow> search(ValidationContext context, String search, Pageable pageable);

    boolean existsByContextAndUser(ValidationContext context, User user);

    void save(ValidationFlow validationFlow);

    Optional<ValidationFlow> findById(Long id);
}
