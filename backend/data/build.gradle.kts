plugins {
    id("letsenroll-conventions")
    alias(libs.plugins.kotlinx.serialization)
}

dependencies {
    api(libs.kotlinx.serialization.json)
}