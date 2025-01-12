import org.jetbrains.kotlin.gradle.dsl.JvmTarget

plugins {
    alias(libs.plugins.kotlin)
    alias(libs.plugins.kotlinx.serialization)
}

group = "dev.freya02"
version = "1.0-SNAPSHOT"

repositories {
    mavenLocal()
    mavenCentral()
}

dependencies {
    implementation(libs.logback.classic)
    implementation(libs.stacktrace.decoroutinator)

    implementation(libs.ktoml)
    implementation(libs.jackson.dataformat.yaml)

    implementation(libs.botcommands)
    implementation(libs.jda)

    implementation(libs.postgresql)
    implementation(libs.hikaricp)

    implementation(libs.bundles.flyway)
}

java {
    targetCompatibility = JavaVersion.VERSION_21
}

kotlin {
    compilerOptions {
        jvmTarget = JvmTarget.JVM_21
    }
}