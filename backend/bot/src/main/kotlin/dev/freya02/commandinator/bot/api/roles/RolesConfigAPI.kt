package dev.freya02.commandinator.bot.api.roles

import dev.freya02.commandinator.api.dto.RolesConfigDTO
import io.github.freya022.botcommands.api.core.service.annotations.BService
import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.request.*

@BService
class RolesConfigAPI(
    private val apiClient: HttpClient,
) {

    suspend fun test(): RolesConfigDTO {
        return apiClient.get("/api/roles").body()
    }
}