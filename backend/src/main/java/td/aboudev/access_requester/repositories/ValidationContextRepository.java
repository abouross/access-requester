package td.aboudev.access_requester.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.Repository;
import td.aboudev.access_requester.entities.ValidationContext;

import java.util.List;
import java.util.Optional;

public interface ValidationContextRepository extends Repository<ValidationContext, Integer> {
    Page<ValidationContext> findAll(Pageable pageable);

    List<ValidationContext> findAllByEnabled(Boolean enabled);

    Optional<ValidationContext> findById(Integer id);

    void save(ValidationContext context);

    void deleteById(Integer id);
}
