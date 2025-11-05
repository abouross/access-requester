package td.aboudev.access_requester.repositories;

import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.Repository;
import td.aboudev.access_requester.entities.Application;

import java.util.Optional;

public interface ApplicationRepository extends Repository<Application, Long> {

    Page<Application> findAll(Pageable pageable);

    Page<Application> findAll(Example<Application> example, Pageable pageable);

    void save(Application application);

    Optional<Application> findById(Long id);
}
