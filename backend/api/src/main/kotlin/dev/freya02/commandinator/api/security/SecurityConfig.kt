package dev.freya02.commandinator.api.security

import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
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
import org.springframework.security.web.authentication.logout.HttpStatusReturningLogoutSuccessHandler
import org.springframework.security.web.csrf.*
import java.util.function.Supplier

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

            logout {
                logoutSuccessHandler = HttpStatusReturningLogoutSuccessHandler(HttpStatus.OK)
            }

            csrf {
                // Make CSRF token accessible to scripts
                // The CSRF token is not requested explicitly,
                // it is sent and set when doing the first request,
                // which should be read-only (getting the logged-in user, for example)
                csrfTokenRepository = CookieCsrfTokenRepository.withHttpOnlyFalse()
                csrfTokenRequestHandler = SpaCsrfTokenRequestHandler()
            }
        }

        return http.build()
    }

    // https://docs.spring.io/spring-security/reference/servlet/exploits/csrf.html#csrf-integration-javascript-spa magic
    private class SpaCsrfTokenRequestHandler : CsrfTokenRequestHandler {

        private val plain: CsrfTokenRequestHandler = CsrfTokenRequestAttributeHandler()
        private val xor: CsrfTokenRequestHandler = XorCsrfTokenRequestAttributeHandler()

        override fun handle(
            request: HttpServletRequest,
            response: HttpServletResponse,
            csrfToken: Supplier<CsrfToken>
        ) {
            xor.handle(request, response, csrfToken)
            csrfToken.get()
        }

        override fun resolveCsrfTokenValue(request: HttpServletRequest, csrfToken: CsrfToken): String? {
            val headerValue = request.getHeader(csrfToken.headerName)

            /**
             * If the request contains a request header, use CsrfTokenRequestAttributeHandler
             * to resolve the CsrfToken. This applies when a single-page application includes
             * the header value automatically, which was obtained via a cookie containing the
             * raw CsrfToken.
             *
             * In all other cases (e.g. if the request contains a request parameter), use
             * XorCsrfTokenRequestAttributeHandler to resolve the CsrfToken. This applies
             * when a server-side rendered form includes the _csrf request parameter as a
             * hidden input.
             */
            val requestHandler = if (headerValue?.isNotBlank() == true) plain else xor
            return requestHandler.resolveCsrfTokenValue(request, csrfToken)
        }
    }
}