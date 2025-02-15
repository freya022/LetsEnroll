package dev.freya02.commandinator.bot.api.provider

import dev.freya02.commandinator.bot.config.Config
import io.github.freya022.botcommands.api.core.service.annotations.BConfiguration
import io.github.freya022.botcommands.api.core.service.annotations.BService
import io.ktor.client.*
import io.ktor.client.engine.okhttp.*

@BConfiguration
object HttpClientProvider {

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
        }
    }
}