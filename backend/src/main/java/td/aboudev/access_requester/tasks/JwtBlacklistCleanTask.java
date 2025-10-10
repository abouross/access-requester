package td.aboudev.access_requester.tasks;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import td.aboudev.access_requester.entities.JwtBlackList;
import td.aboudev.access_requester.repositories.JwtBlackListRepository;

import java.util.Date;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtBlacklistCleanTask {
    private final JwtBlackListRepository repository;

    @Scheduled(cron = "${jwt.blacklist-clean}")
    public void clean() {
        log.trace("Jwt blacklist clean started");
        List<JwtBlackList> jwtFound = repository.findAllByExpirationDateBefore(new Date());
        log.debug("{} expired jwt found. Deleting...", jwtFound.size());
        repository.deleteAll(jwtFound);
        log.trace("Jwt blacklist clean finished");
    }
}
