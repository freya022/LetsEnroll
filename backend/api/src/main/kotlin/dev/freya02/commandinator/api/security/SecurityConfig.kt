package dev.freya02.commandinator.api.security

import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpStatus
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.annotation.web.invoke
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.HttpStatusEntryPoint
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler
import org.springframework.security.web.csrf.CookieCsrfTokenRepository

@Configuration
@EnableWebSecurity
class SecurityConfig(
    @Value("\${api.front-url}") private val frontUrl: String,
) {

    @Bean
    fun filterChain(http: HttpSecurity): SecurityFilterChain {
        http {
            authorizeHttpRequests {
                authorize("/oauth2/**", permitAll)
                authorize("/error", permitAll) // Exceptions and messages are removed
                authorize("/api/**", authenticated)

                authorize(anyRequest, denyAll)
            }

            exceptionHandling {
                authenticationEntryPoint = HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)
            }

            oauth2Login {
                authenticationSuccessHandler = SimpleUrlAuthenticationSuccessHandler("${frontUrl}/dashboard").apply {
                    setAlwaysUseDefaultTargetUrl(true)
                }
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