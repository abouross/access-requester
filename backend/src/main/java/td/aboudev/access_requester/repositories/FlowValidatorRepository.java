package td.aboudev.access_requester.repositories;

import org.springframework.data.repository.Repository;
import td.aboudev.access_requester.entities.FlowValidator;
import td.aboudev.access_requester.entities.User;
import td.aboudev.access_requester.entities.ValidationFlow;

import java.util.List;

public interface FlowValidatorRepository extends Repository<FlowValidator, Long> {
    void save(FlowValidator validator);

    void deleteById(Long id);

    boolean existsByValidatorAndFlow(User validator, ValidationFlow flow);

    boolean existsByFlowAndPosition(ValidationFlow flow, Integer position);

    List<FlowValidator> findAllByFlowOrderByPositionAsc(ValidationFlow flow);

    void saveAll(Iterable<FlowValidator> validators);
}
