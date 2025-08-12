import org.gradle.api.DefaultTask
import org.gradle.api.tasks.Input
import org.gradle.api.tasks.OutputDirectory
import org.gradle.api.tasks.TaskAction
import org.gradle.work.DisableCachingByDefault
import java.io.File
import java.io.IOException

@DisableCachingByDefault
abstract class GenerateVersionFileTask : DefaultTask() {

    @get:OutputDirectory
    val outputDir = project.layout.buildDirectory.dir("generated/sources/letsenroll/main/resources")

    @get:Input
    val workingDirectory: String = project.layout.projectDirectory.asFile.absolutePath

    @TaskAction
    fun generate() {
        val jitpackHash = System.getenv("GIT_COMMIT")
        val hash = jitpackHash ?: run {
            ProcessBuilder()
                .directory(File(workingDirectory))
                .redirectError(ProcessBuilder.Redirect.INHERIT)
                .command("git", "rev-parse", "--verify", "HEAD")
                .start()
                .also {
                    if (it.waitFor() != 0) {
                        throw IOException("Unable to get commit hash via Git")
                    }
                }
                .inputReader()
                .use { it.readLine() }
        }

        val outFile = outputDir.get().file("version.txt").asFile
        outFile.parentFile.mkdirs()
        outFile.writeText(hash)
    }
}
