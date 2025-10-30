package td.aboudev.access_requester.repositories;

import org.springframework.data.repository.Repository;
import td.aboudev.access_requester.entities.Delegation;

public interface DelegationRepository extends Repository<Delegation, Long> {
    void save(Delegation delegation);

    void deleteById(long id);

    Delegation findById(long id);
}
