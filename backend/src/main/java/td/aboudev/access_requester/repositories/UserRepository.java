package td.aboudev.access_requester.repositories;

import org.springframework.data.repository.Repository;
import td.aboudev.access_requester.entities.User;

public interface UserRepository extends Repository<User, Long> {
    User findByUsername(String username);

    void save(User user);
}

