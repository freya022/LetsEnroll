plugins {
    id("commandinator-conventions")
    alias(libs.plugins.kotlinx.serialization)
}

dependencies {
    api(libs.kotlinx.serialization.json)
}