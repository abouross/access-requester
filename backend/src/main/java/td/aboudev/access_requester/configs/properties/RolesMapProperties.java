package td.aboudev.access_requester.configs.properties;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.HashMap;
import java.util.Map;

@Getter
@Setter
@ConfigurationProperties(prefix = "roles")
public class RolesMapProperties {
    private Map<String, String> map = new HashMap<>();
}
