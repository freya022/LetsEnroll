package dev.freya02.letsenroll.api.exceptions

import kotlinx.serialization.Serializable
import org.springframework.http.HttpStatus
import org.springframework.http.HttpStatusCode
import org.springframework.http.ResponseEntity

@Serializable
data class ExceptionDTO(val error: String)

fun exceptionResponse(status: HttpStatus, message: String? = null): ResponseEntity<ExceptionDTO> = ResponseEntity.status(status).body(message?.let(::ExceptionDTO))
fun exceptionResponse(status: HttpStatusCode, message: String? = null): ResponseEntity<ExceptionDTO> = ResponseEntity.status(status).body(message?.let(::ExceptionDTO))