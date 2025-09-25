package td.aboudev.access_requester.configs;

import jakarta.servlet.DispatcherType;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import td.aboudev.access_requester.configs.properties.CorsProperties;
import td.aboudev.access_requester.configs.properties.RolesMapProperties;
import td.aboudev.access_requester.security.jwt.AuthEntryPointJwt;
import td.aboudev.access_requester.security.jwt.AuthTokenFilter;
import td.aboudev.access_requester.security.jwt.JwtLogoutHandler;

@Configuration
@EnableConfigurationProperties({CorsProperties.class, RolesMapProperties.class})
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    private final AuthEntryPointJwt authEntryPointJwt;
    private final AuthTokenFilter authTokenFilter;
    private final CorsProperties corsProperties;
    private final JwtLogoutHandler jwtLogoutHandler;

    @Bean
    public SecurityFilterChain configure(HttpSecurity http) throws Exception {
        return http.csrf(AbstractHttpConfigurer::disable).cors(cors -> cors.configurationSource(exchange -> {
                    CorsConfiguration config = new CorsConfiguration();
                    config.setAllowedOrigins(corsProperties.getCorsOrigins());
                    config.setAllowedMethods(corsProperties.getCorsMethods());
                    config.setAllowedHeaders(corsProperties.getCorsHeaders());
                    config.setAllowCredentials(false);
                    return config;
                }))
                .authorizeHttpRequests(auth -> {
                    auth.requestMatchers("/api/login").permitAll();
                    // To prevent 401 or 403 error when exception raised
                    auth.dispatcherTypeMatchers(DispatcherType.ERROR).permitAll();
                    auth.anyRequest().authenticated();
                })
                .exceptionHandling(exception -> exception.authenticationEntryPoint(authEntryPointJwt))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(authTokenFilter, UsernamePasswordAuthenticationFilter.class)
                .logout(logout -> logout.logoutUrl("/api/logout")
                        .addLogoutHandler(jwtLogoutHandler)
                        .logoutSuccessHandler(jwtLogoutHandler))
                .build();
    }
}
