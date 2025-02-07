package dev.freya02.commandinator.api.security

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.annotation.web.invoke
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.csrf.CookieCsrfTokenRepository

@Configuration
@EnableWebSecurity
class SecurityConfig {

    @Bean
    fun filterChain(http: HttpSecurity): SecurityFilterChain {
        http {
            authorizeHttpRequests {
//                authorize("/api/authorized/discord", permitAll)
//                authorize("/oauth2/**", permitAll)
//                authorize("/api/**", authenticated)
                authorize("/api/something", authenticated)

                authorize(anyRequest, permitAll)
//                authorize(anyRequest, denyAll)
            }

            oauth2Login {

            }

            anonymous {
                disable()
            }

            csrf {
                // Make CSRF token accessible to scripts
                csrfTokenRepository = CookieCsrfTokenRepository.withHttpOnlyFalse()
            }
        }

        return http.build()
    }
}