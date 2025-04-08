package dev.freya02.letsenroll.api.controllers.advice

import dev.freya02.letsenroll.api.exceptions.ExceptionDTO
import dev.freya02.letsenroll.api.exceptions.exceptionResponse
import io.github.oshai.kotlinlogging.KotlinLogging
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice
import org.springframework.web.client.HttpClientErrorException

private val logger = KotlinLogging.logger { }

@RestControllerAdvice
class TooManyRequestsPassThroughRestControllerAdvice {

    @ExceptionHandler
    fun handleException(exception: HttpClientErrorException): ResponseEntity<ExceptionDTO> {
        if (exception.statusCode != HttpStatus.TOO_MANY_REQUESTS)
            throw exception

        logger.catching(exception)
        return exceptionResponse(HttpStatus.TOO_MANY_REQUESTS, "Too many requests")
    }
}