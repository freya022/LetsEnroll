rootProject.name = "LetsEnroll-backend"

@Suppress("UnstableApiUsage")
dependencyResolutionManagement {
    repositoriesMode = RepositoriesMode.FAIL_ON_PROJECT_REPOS
    repositories {
        mavenCentral()

        exclusiveContent {
            forRepository {
                maven("https://repo.freya02.dev/snapshots") {
                    mavenContent { snapshotsOnly() }
                }
            }

            filter {
                includeVersionByRegex("""\Qio.github.freya022\E""", ".+", "[a-f0-9]{40}-SNAPSHOT")
            }
        }
    }
}

enableFeaturePreview("TYPESAFE_PROJECT_ACCESSORS")

include("bot")
include("api")
include("data")
include("emoji-generator")
