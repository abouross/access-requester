package td.aboudev.access_requester.repositories;

import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import td.aboudev.access_requester.entities.User;
import td.aboudev.access_requester.models.GroupedResult;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends Repository<User, Long> {
    User findByUsername(String username);

    void save(User user);

    Page<User> findAll(Pageable pageable);

    Page<User> findAll(Example<User> example, Pageable pageable);

    Optional<User> findById(Long id);

    void deleteById(Long id);

    @Query("SELECT new td.aboudev.access_requester.models.GroupedResult(u.enabled, COUNT(u)) FROM User u GROUP BY u.enabled")
    List<GroupedResult> countByStatus();
}

