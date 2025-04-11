package dev.freya02.letsenroll.api.controllers

import org.springframework.http.MediaType
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class VersionController {

    private val versionHash by lazy {
        javaClass.getResourceAsStream("/version.txt")!!.bufferedReader().use { it.readText() }
    }

    @GetMapping("/api/version", produces = [MediaType.TEXT_PLAIN_VALUE])
    fun getVersion(): String = versionHash
}