plugins {
    id("letsenroll-conventions")
    application
    alias(libs.plugins.kotlinx.serialization)
}

application {
    mainClass = "dev.freya02.letsenroll.emoji.generator.EmojiGeneratorKt"
}

dependencies {
    // Serialization
    implementation(libs.kotlinx.serialization.json)

    // HTTP client
    implementation(libs.ktor.client.core)
    implementation(libs.ktor.client.okhttp)
}
