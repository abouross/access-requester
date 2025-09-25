package td.aboudev.access_requester.configs.properties;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.List;

@Getter
@Setter
@ConfigurationProperties(prefix = "cors")
public class CorsProperties {
    private List<String> corsOrigins;
    private List<String> corsMethods;
    private List<String> corsHeaders;
}
