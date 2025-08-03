package dev.freya02.letsenroll.emoji.generator

import io.ktor.client.*
import io.ktor.client.engine.okhttp.*
import io.ktor.client.request.*
import io.ktor.client.statement.*
import kotlinx.coroutines.runBlocking
import kotlinx.serialization.json.Json
import java.nio.file.Path
import kotlin.io.path.*
import kotlin.system.exitProcess

fun main(args: Array<String>) = runBlocking {
    if (args.size != 1) {
        System.err.println("Expected a single argument for the output directory")
        exitProcess(2)
    }

    val outputDir = Path(args[0])
        .also {
            check(it.parent.exists()) { "Parent directory ${it.parent.absolutePathString()} does not exist" }
        }
        .createDirectories()

    HttpClient(OkHttp).use { client ->
        val js = client.get("https://github.com/Discord-Datamining/Discord-Datamining/raw/refs/heads/master/current.js").bodyAsText()

        outputDir.resolve("emojis.json").writeText(Json.encodeToString(generateEmojiList(js)))
        copySpriteSheets(js, client, outputDir)

        client.close()
    }
}

private val json = Json {
    ignoreUnknownKeys = true
}

private val emojiJsonRegex = Regex("""e\.exports = JSON\.parse\('((?=\{"emojis").+?)'\)""")
private val hexEscapeSequenceRegex = Regex("""\\x[a-fA-F0-9]{1,5}""")

private fun generateEmojiList(js: String): List<UnicodeEmojiDTO> = buildList {
    val emojiJson = run {
        val escapedEmojiJson = emojiJsonRegex.find(js)!!.groupValues[1]
        hexEscapeSequenceRegex.replace(escapedEmojiJson) { match ->
            val codepoint = match.groupValues[0].drop(2).hexToInt()
            Character.toChars(codepoint).joinToString("")
        }
    }
    val emojis = json.decodeFromString<DiscordEmojis>(emojiJson)

    emojis.emojis.filterNot { it.spriteIndex <= -1 }.forEach { emoji ->
        val effectiveDiversity = emoji.diversityChildren.map { emojis.emojis[it] }
            // Don't take multi-diversity as Discord's picker doesn't support it
            .filter { it.diversity.size == 1 }
            .onEach {
                require(it.spriteIndex <= -1) { "The current logic assumes emojis with fitzpatrick share the same index as their parent" }
            }
            .map { it.surrogates }

        this += UnicodeEmojiDTO(
            names = emoji.names,
            unicode = emoji.surrogates,
            variants = effectiveDiversity,
            spriteIndex = emoji.spriteIndex,
        )
    }
}

private val spriteSheetRegex = Regex(""""(./spritesheet-.*.png)": "(\d+)"""")

private suspend fun copySpriteSheets(js: String, client: HttpClient, outputDir: Path) {
    val packIdToFileName: Map<Int, String> = buildMap {
        spriteSheetRegex.findAll(js).forEach { match ->
            val (_, fileName, packId) = match.groupValues
            put(packId.toInt(), fileName)
        }
    }

    packIdToFileName.forEach { (packId, fileName) ->
        // 63215: function(e) {
        //     "use strict";
        //     e.exports = "/assets/424ae39aa04a8d84.png"
        // }
        val assetPath = js.substringAfter("${packId}: function")
            //     "use strict";...
            .substringAfter("e.exports = \"")
            // "/assets/424ae39aa04a8d84.png"...
            .substringBefore("\"\n") // "/assets/424ae39aa04a8d84.png"
        println("$fileName => <https://discord.com$assetPath>")

        if (fileName.endsWith("-40.png") && "picker" !in assetPath) {
            val spritesheet = client.get("https://discord.com$assetPath").bodyAsBytes()
            outputDir.resolve(fileName).writeBytes(spritesheet)
        }
    }
}
