package dev.freya02.commandinator.api.controllers

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

class Something(
    val name: String
)

@RestController
class TestController {

    @GetMapping("/api/authorized/discord")
    fun authorized(): Something {
        return Something("authorized")
    }

    @GetMapping("/api/something")
    fun something(): Something {
        return Something("something")
    }
}