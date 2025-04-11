package dev.freya02.letsenroll.api.controllers

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class VersionController {

    private val versionHash by lazy {
        javaClass.getResourceAsStream("/version.txt")!!.bufferedReader().use { it.readText() }
    }

    @GetMapping("/api/version")
    fun getVersion(): String = versionHash
}