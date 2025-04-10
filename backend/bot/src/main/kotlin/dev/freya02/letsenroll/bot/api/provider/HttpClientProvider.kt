package dev.freya02.letsenroll.bot.api.provider

import dev.freya02.letsenroll.bot.annotations.Disabled
import dev.freya02.letsenroll.bot.config.Config
import io.github.freya022.botcommands.api.core.service.annotations.BConfiguration
import io.github.freya022.botcommands.api.core.service.annotations.BService
import io.ktor.client.*
import io.ktor.client.engine.okhttp.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.json.*

@BConfiguration
object HttpClientProvider {

    @Disabled("Not used anymore, but could be in the future")
    @BService
    fun apiClient(apiConfig: Config.Api): HttpClient {
        return HttpClient(OkHttp) {
            engine {
                addInterceptor { chain ->
                    val relativeUrl = chain.request().url
                    val request = chain.request().newBuilder()
                        .url(relativeUrl.newBuilder().scheme("http").host(apiConfig.host).port(apiConfig.port).build())
                        .addHeader("Authorization", "Bearer ${apiConfig.jwt}")
                        .build()
                    chain.proceed(request)
                }
            }

            install(ContentNegotiation) {
                json()
            }
        }
    }
}