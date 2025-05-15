plugins {
	id("letsenroll-conventions")
	id("letsenroll-app-conventions")

	alias(libs.plugins.spring)
	alias(libs.plugins.jpa)
	alias(libs.plugins.spring.boot)

	alias(libs.plugins.kotlinx.serialization)

	kotlin("kapt")
}

val generateVersionFile = tasks.register<GenerateVersionFileTask>("generateVersionFile") {
	outputs.upToDateWhen { false }
}

sourceSets {
	main {
		resources {
			srcDir(generateVersionFile)
		}
	}
}

dependencies {
	implementation(platform(org.springframework.boot.gradle.plugin.SpringBootPlugin.BOM_COORDINATES))

	implementation("org.springframework.boot:spring-boot-starter-data-jpa")
	implementation("org.springframework.boot:spring-boot-starter-oauth2-client")
	implementation("org.springframework.boot:spring-boot-starter-oauth2-resource-server")
	implementation("org.springframework.boot:spring-boot-starter-security")
	implementation("org.springframework.boot:spring-boot-starter-web")
	implementation("org.springframework.session:spring-session-jdbc")
	implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
	implementation("org.flywaydb:flyway-core")
	implementation("org.flywaydb:flyway-database-postgresql")
	implementation("org.jetbrains.kotlin:kotlin-reflect")
	developmentOnly("org.springframework.boot:spring-boot-devtools")
	runtimeOnly("org.postgresql:postgresql")
	testImplementation("org.springframework.boot:spring-boot-starter-test") {
		exclude(module = "mockito-core")
	}
	testImplementation(libs.springmockk)
	testImplementation("org.jetbrains.kotlin:kotlin-test-junit5")
	testImplementation("org.springframework.security:spring-security-test")

	implementation(projects.data)
	implementation(libs.kotlinx.serialization.json)

	implementation(libs.mapstruct)
	kapt(libs.mapstruct.processor)
}

allOpen {
	annotation("jakarta.persistence.Entity")
	annotation("jakarta.persistence.MappedSuperclass")
	annotation("jakarta.persistence.Embeddable")
}

jib {
	from {
		image = "eclipse-temurin:23-jre"
	}

	to {
		image = "ghcr.io/freya022/letsenroll-api"
	}

	container {
		mainClass = "dev.freya02.letsenroll.api.ApiApplicationKt"
	}
}
