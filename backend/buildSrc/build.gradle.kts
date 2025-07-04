import org.jetbrains.kotlin.gradle.dsl.JvmTarget

plugins {
    `kotlin-dsl`
}

repositories {
    mavenCentral()
    gradlePluginPortal()
}

dependencies {
    // Change in version catalog too
    implementation(libs.kotlin.plugin)
    implementation(libs.jib.plugin)
}

java {
    sourceCompatibility = JavaVersion.VERSION_21
    targetCompatibility = JavaVersion.VERSION_21
}

kotlin {
    compilerOptions {
        // Do with what Gradle supports
        jvmTarget = JvmTarget.JVM_21

        freeCompilerArgs.addAll(
            "-Xjsr305=strict",
        )
    }
}
