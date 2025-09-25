package td.aboudev.access_requester.repositories;

import org.springframework.data.repository.Repository;
import td.aboudev.access_requester.entities.JwtBlackList;

import java.util.Date;
import java.util.List;

public interface JwtBlackListRepository extends Repository<JwtBlackList, String> {
    void save(JwtBlackList jwtBlackList);

    boolean existsByToken(String token);

    List<JwtBlackList> findAllByExpirationDateBefore(Date expirationDateAfter);

    void deleteAll(Iterable<JwtBlackList> entities);
}

