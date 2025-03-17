package dev.freya02.commandinator.api.exceptions

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity

fun exceptionResponse(status: HttpStatus, message: String? = null): ResponseEntity<String> = ResponseEntity.status(status).body(message)