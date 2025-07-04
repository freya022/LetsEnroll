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
    implementation("org.jetbrains.kotlin:kotlin-gradle-plugin:2.2.0")
    implementation("com.google.cloud.tools:jib-gradle-plugin:3.4.4")
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
