package dev.freya02.commandinator.bot.api.roles

import dev.freya02.commandinator.api.dto.RolesConfig
import io.github.freya022.botcommands.api.core.service.annotations.BService
import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.request.*

@BService
class RolesConfigAPI(
    private val apiClient: HttpClient,
) {

    suspend fun test(): RolesConfig {
        return apiClient.get("/api/roles").body()
    }
}