import org.jetbrains.kotlin.gradle.dsl.JvmTarget

plugins {
    kotlin("jvm")
}

group = "dev.freya02"
version = "1.0"

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(24)
    }

    sourceCompatibility = JavaVersion.VERSION_23
    targetCompatibility = JavaVersion.VERSION_23
}

repositories {
    mavenLocal()
    mavenCentral()
}

dependencies {
    testImplementation(kotlin("test"))
    testImplementation("org.junit.jupiter:junit-jupiter-params:5.10.0")

    implementation("io.github.oshai:kotlin-logging-jvm:7.0.0")
}

kotlin {
    compilerOptions {
        jvmTarget = JvmTarget.JVM_23

        freeCompilerArgs.addAll("-Xjsr305=strict", "-Xwhen-guards")
    }
}

tasks.withType<Test> {
    useJUnitPlatform()
}