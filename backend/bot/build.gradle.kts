plugins {
    id("letsenroll-conventions")
    id("letsenroll-app-conventions")
    alias(libs.plugins.kotlinx.serialization)
}

dependencies {
    // Configuration
    implementation(libs.dotenv.kotlin)

    implementation(libs.kotlin.logging)

    // Serialization (data and localization)
    implementation(libs.jackson.dataformat.yaml)
    implementation(libs.kotlinx.serialization.json)

    implementation(libs.botcommands)
    runtimeOnly(libs.botcommands.method.accessors.classfile)
    implementation(libs.botcommands.jda.ktx)
    implementation(libs.botcommands.typesafe.messages.core)
    runtimeOnly(libs.botcommands.typesafe.messages.bc)
    implementation(libs.jda) {
        exclude(module = "opus-java")
        exclude(module = "tink")
    }

    implementation(libs.postgresql)
    implementation(libs.hikaricp)

    implementation(libs.bundles.flyway)

    implementation(libs.nimbus.jose.jwt)

    implementation(libs.ktor.client.core)
    implementation(libs.ktor.client.okhttp)
    implementation(libs.ktor.client.content.negotiation)
    implementation(libs.ktor.serialization.kotlinx.json)

    implementation(libs.ktor.server.core)
    implementation(libs.ktor.server.netty)
    implementation(libs.ktor.server.resources)
    implementation(libs.ktor.server.content.negotiation)

    implementation(projects.data)

    testImplementation(libs.bundles.testing)
    testImplementation(libs.mockk)
}

jib {
    from {
        image = "eclipse-temurin:25-jre"
    }

    to {
        image = "ghcr.io/freya022/letsenroll-bot"
    }

    container {
        mainClass = "dev.freya02.letsenroll.bot.MainKt"
        jvmFlags = listOf("-XX:+UseCompactObjectHeaders")
    }
}
