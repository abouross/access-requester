package td.aboudev.access_requester.repositories;

import org.springframework.data.repository.Repository;
import td.aboudev.access_requester.entities.PermanentValidator;
import td.aboudev.access_requester.entities.User;
import td.aboudev.access_requester.entities.ValidationContext;

import java.util.List;

public interface PermanentValidatorRepository extends Repository<PermanentValidator, Long> {
    void save(PermanentValidator validator);

    void deleteById(Long id);

    boolean existsByValidatorAndContext(User validator, ValidationContext context);

    boolean existsByContextAndPosition(ValidationContext context, Integer position);

    List<PermanentValidator> findAllByContextOrderByPositionAsc(ValidationContext context);

    void saveAll(Iterable<PermanentValidator> validators);
}
