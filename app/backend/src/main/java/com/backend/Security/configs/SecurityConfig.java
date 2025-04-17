package com.backend.Security.configs;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final UserDetailsService userDetailsService;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    // Constructor injection instead of @Autowired
    public SecurityConfig(UserDetailsService userDetailsService, JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.userDetailsService = userDetailsService;
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // Enable CORS
                .authorizeHttpRequests(auth -> {
                    auth.requestMatchers(
                            "/api/auth/**",
                            "/api/auth/me",
                            "/api/auth/refresh-token",
                            "/v3/api-docs/**",
                            "/swagger-ui/**",
                            "/swagger-ui.html",
                            "favicon.ico",
                            "/error",

                            "/api/v1/service-providers",
                            "/api/v1/service-providers/{id}",

                            "/api/v1/services/{providerID}",
                            "/api/v1/services/provider/{providerID}"
                    ).permitAll();
                    auth.requestMatchers("/api/v1/customers/admin/**").hasAuthority("ROLE_ADMIN");

                    auth.requestMatchers("/api/v1/roles/admin/**").hasAuthority("ROLE_ADMIN");

                    auth.requestMatchers("/api/v1/bookings/customer/**").hasAuthority("ROLE_CUSTOMER");
                    auth.requestMatchers("/api/v1/bookings/provider/**").hasAuthority("ROLE_VENDOR");
                    auth.requestMatchers("/api/v1/bookings/status/**").hasAuthority("ROLE_VENDOR");

                    auth.requestMatchers("/api/v1/reviews/customer/**").hasAuthority("ROLE_CUSTOMER");

                    auth.requestMatchers("/api/v1/services/create/**").hasAuthority("ROLE_VENDOR");
                    auth.requestMatchers("/api/v1/services/update/**").hasAuthority("ROLE_VENDOR");
                    auth.requestMatchers("/api/v1/services/delete/**").hasAuthority("ROLE_VENDOR");

                    auth.requestMatchers("/api/v1/service-history/customer/**").hasAuthority("ROLE_CUSTOMER");
                    auth.requestMatchers("/api/v1/service-history/provider/**").hasAuthority("ROLE_VENDOR");

                    auth.requestMatchers("/api/v1/service-providers/create/**").hasAuthority("ROLE_VENDOR");
                    auth.requestMatchers("/api/v1/service-providers/update/**").hasAuthority("ROLE_VENDOR");
                    auth.requestMatchers("/api/v1/service-providers/delete/**").hasAuthority("ROLE_VENDOR");












//                    auth.requestMatchers("/error").permitAll();

                    auth.anyRequest().authenticated();
                })
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }





//    @Bean
//    public CorsConfigurationSource corsConfigurationSource() {
//        CorsConfiguration configuration = new CorsConfiguration();
//        configuration.setAllowedOrigins(Arrays.asList(
//                "http://localhost:3000",
//                "http://localhost:3001",
//                "http://localhost:5173"
//        ));
//        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
//        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Auth-Token"));
//        configuration.setExposedHeaders(Arrays.asList("X-Auth-Token"));
//        configuration.setAllowCredentials(true); // If you are using credentials, "*" is not allowed
//
//        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//        source.registerCorsConfiguration("/**", configuration);
//        return source;
//    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000")); // Your React app URL
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

}
