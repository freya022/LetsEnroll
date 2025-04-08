package dev.freya02.letsenroll.api.controllers

import dev.freya02.letsenroll.api.dto.UserDTO
import dev.freya02.letsenroll.api.utils.get
import jakarta.servlet.http.HttpServletRequest
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class UserController {

    @GetMapping("/api/user")
    fun getUser(request: HttpServletRequest, authentication: OAuth2AuthenticationToken): UserDTO {
        val principal = authentication.principal
        return UserDTO(
            principal["id"]!!,
            principal["global_name"] ?: principal["username"]!!,
            principal["avatar"],
        )
    }
}