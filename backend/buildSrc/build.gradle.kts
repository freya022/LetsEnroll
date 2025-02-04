plugins {
    `kotlin-dsl`
}

repositories {
    mavenLocal()
    mavenCentral()
    gradlePluginPortal()
}

dependencies {
    implementation("org.jetbrains.kotlin:kotlin-gradle-plugin:2.1.20-Beta2")
    implementation("com.google.cloud.tools:jib-gradle-plugin:3.4.4")
}