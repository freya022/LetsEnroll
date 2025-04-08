package dev.freya02.letsenroll.api.serialization

import kotlinx.serialization.json.Json
import org.springframework.boot.autoconfigure.http.HttpMessageConverters
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.converter.HttpMessageConverter
import org.springframework.http.converter.json.KotlinSerializationJsonHttpMessageConverter

// This only exists to ensure the [[Json]] instance used is the same for HTTP message converters and general usages
@Configuration
class HttpMessageConvertersProvider {

    // https://github.com/spring-projects/spring-boot/issues/39853#issuecomment-1985907327
    // https://docs.spring.io/spring-boot/reference/web/servlet.html#web.servlet.spring-mvc.message-converters
    @Bean
    fun httpMessageConverters(json: Json): HttpMessageConverters {
        val customConverter = KotlinSerializationJsonHttpMessageConverter(json)

        return object : HttpMessageConverters() {
            override fun postProcessConverters(converters: MutableList<HttpMessageConverter<*>>): List<HttpMessageConverter<*>> {
                return replaceConverterWithCustomJsonInstance(converters)
            }

            override fun postProcessPartConverters(converters: MutableList<HttpMessageConverter<*>>): List<HttpMessageConverter<*>> {
                return replaceConverterWithCustomJsonInstance(converters)
            }

            private fun replaceConverterWithCustomJsonInstance(converters: MutableList<HttpMessageConverter<*>>): MutableList<HttpMessageConverter<*>> {
                val baseConverter = converters.filterIsInstance<KotlinSerializationJsonHttpMessageConverter>().single()
                val baseConverterIndex = converters.indexOf(baseConverter)

                converters[baseConverterIndex] = customConverter
                return converters
            }
        }
    }
}