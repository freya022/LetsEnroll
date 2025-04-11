package dev.freya02.letsenroll.bot.roles.checker

import dev.freya02.letsenroll.bot.EXAMPLE_GUILD_ID
import dev.freya02.letsenroll.bot.NullJDAService
import dev.freya02.letsenroll.data.RolesConfigDTO
import io.github.freya022.botcommands.api.core.BotCommands
import io.github.freya022.botcommands.api.core.service.getService
import io.mockk.every
import io.mockk.mockk
import kotlinx.coroutines.runBlocking
import net.dv8tion.jda.api.JDA
import net.dv8tion.jda.api.entities.Message
import net.dv8tion.jda.api.entities.emoji.RichCustomEmoji
import net.dv8tion.jda.api.interactions.components.buttons.Button
import net.dv8tion.jda.api.interactions.components.selections.SelectMenu
import net.dv8tion.jda.api.interactions.components.selections.SelectOption
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.params.ParameterizedTest
import org.junit.jupiter.params.provider.Arguments
import org.junit.jupiter.params.provider.MethodSource
import java.util.concurrent.CompletableFuture
import kotlin.test.Test
import kotlin.test.assertTrue

object RolesConfigCheckerTest {

    private const val EXAMPLE_CONTENT = "Content"
    private const val EXAMPLE_ROLE_NAME = "Role name"
    private const val EXAMPLE_PLACEHOLDER = "Role name"
    private val EXAMPLE_STYLE = RolesConfigDTO.Message.Button.Style.PRIMARY
    private const val EXAMPLE_LABEL = "Role name"
    private val EXAMPLE_UNICODE_EMOJI = RolesConfigDTO.Message.UnicodeEmoji("joy")
    private val EXAMPLE_CUSTOM_EMOJI = RolesConfigDTO.Message.CustomEmoji(false, "name", 12861616961281)
    private val EXAMPLE_BUTTON =
        RolesConfigDTO.Message.Button(EXAMPLE_ROLE_NAME, EXAMPLE_STYLE, EXAMPLE_LABEL, EXAMPLE_UNICODE_EMOJI)
    private const val EXAMPLE_DESCRIPTION = "Description"
    private val EXAMPLE_CHOICE =
        RolesConfigDTO.Message.SelectMenu.Choice(
            EXAMPLE_ROLE_NAME,
            EXAMPLE_LABEL,
            EXAMPLE_DESCRIPTION,
            EXAMPLE_UNICODE_EMOJI
        )
    private val EXAMPLE_ROW = RolesConfigDTO.Message.Row(EXAMPLE_BUTTON)
    private val EXAMPLE_MESSAGE = RolesConfigDTO.Message(EXAMPLE_CONTENT, EXAMPLE_ROW)

    private fun blankString() = " "

    private lateinit var checker: RolesConfigChecker
    private lateinit var jda: JDA

    @JvmStatic
    @BeforeAll
    fun setup() {
        val context = BotCommands.create {
            addClass<NullJDAService>()
            addClass<RolesConfigChecker>()

            textCommands { enable = false }
            applicationCommands { enable = false }
            components { enable = false }
            modals { enable = false }
            appEmojis { enable = false }
        }

        checker = context.getService<RolesConfigChecker>()
        jda = mockk {
            every { getGuildById(any<Long>())!!.retrieveEmojis().submit() } returns CompletableFuture.completedFuture(
                listOf(mockk<RichCustomEmoji> {
                    every { idLong } returns EXAMPLE_CUSTOM_EMOJI.discordId
                })
            )
        }
    }

    @MethodSource("configWithLongValues")
    @ParameterizedTest
    fun `Check returns errors (Long values)`(config: RolesConfigDTO, errorPaths: List<String>) {
        val errors = runBlocking {
            checker.check(jda, EXAMPLE_GUILD_ID, config)
        }

        if (errorPaths.isNotEmpty()) {
            errorPaths.forEach { errors.assertHasPath(it) }
        } else {
            assertTrue(errors.isEmpty(), "Expected no errors but got:\n${errors.joinToString("\n")}")
        }
    }

    @JvmStatic
    fun configWithLongValues(): Iterable<Arguments> = listOf(
        args(
            RolesConfigDTO(
                List(RolesConfigDTO.MAX_MESSAGES + 1) { EXAMPLE_MESSAGE }
            ),
            "messages",
        ),

        args(
            RolesConfigDTO(
                RolesConfigDTO.Message(
                    "a".repeat(Message.MAX_CONTENT_LENGTH + 1),
                    EXAMPLE_ROW
                )
            ),
            "messages.0.content",
        ),

        args(
            RolesConfigDTO(
                RolesConfigDTO.Message(
                    EXAMPLE_CONTENT,
                    List(Message.MAX_COMPONENT_COUNT + 1) { EXAMPLE_ROW }
                )
            ),
            "messages.0.components",
        ),

        args(
            RolesConfigDTO(
                RolesConfigDTO.Message(
                    EXAMPLE_CONTENT,
                    RolesConfigDTO.Message.Row(
                        RolesConfigDTO.Message.Button(
                            "a".repeat(100 + 1),
                            EXAMPLE_STYLE,
                            EXAMPLE_LABEL,
                            EXAMPLE_UNICODE_EMOJI
                        )
                    )
                )
            ),
            "messages.0.components.0.components.0.roleName",
        ),

        args(
            RolesConfigDTO(
                RolesConfigDTO.Message(
                    EXAMPLE_CONTENT,
                    RolesConfigDTO.Message.Row(
                        RolesConfigDTO.Message.Button(
                            EXAMPLE_ROLE_NAME,
                            EXAMPLE_STYLE,
                            label = "a".repeat(Button.LABEL_MAX_LENGTH + 1),
                            EXAMPLE_UNICODE_EMOJI
                        )
                    )
                )
            ),
            "messages.0.components.0.components.0.label",
        ),

        args(
            RolesConfigDTO(
                RolesConfigDTO.Message(
                    EXAMPLE_CONTENT,
                    RolesConfigDTO.Message.Row(
                        RolesConfigDTO.Message.SelectMenu(
                            "a".repeat(SelectMenu.PLACEHOLDER_MAX_LENGTH + 1),
                            listOf(EXAMPLE_CHOICE)
                        )
                    )
                )
            ),
            "messages.0.components.0.components.0.placeholder",
        ),

        args(
            RolesConfigDTO(
                RolesConfigDTO.Message(
                    EXAMPLE_CONTENT,
                    RolesConfigDTO.Message.Row(
                        RolesConfigDTO.Message.SelectMenu(
                            EXAMPLE_PLACEHOLDER,
                            List(SelectMenu.OPTIONS_MAX_AMOUNT + 1) { EXAMPLE_CHOICE }
                        )
                    )
                )
            ),
            "messages.0.components.0.components.0",
        ),

        args(
            RolesConfigDTO(
                RolesConfigDTO.Message(
                    EXAMPLE_CONTENT,
                    RolesConfigDTO.Message.Row(
                        RolesConfigDTO.Message.SelectMenu(
                            EXAMPLE_PLACEHOLDER,
                            RolesConfigDTO.Message.SelectMenu.Choice(
                                "a".repeat(100 + 1),
                                EXAMPLE_LABEL,
                                EXAMPLE_DESCRIPTION,
                                EXAMPLE_UNICODE_EMOJI
                            )
                        )
                    )
                )
            ),
            "messages.0.components.0.components.0.choices.0.roleName",
        ),

        args(
            RolesConfigDTO(
                RolesConfigDTO.Message(
                    EXAMPLE_CONTENT,
                    RolesConfigDTO.Message.Row(
                        RolesConfigDTO.Message.SelectMenu(
                            EXAMPLE_PLACEHOLDER,
                            RolesConfigDTO.Message.SelectMenu.Choice(
                                EXAMPLE_ROLE_NAME,
                                "a".repeat(SelectOption.LABEL_MAX_LENGTH + 1),
                                EXAMPLE_DESCRIPTION,
                                EXAMPLE_UNICODE_EMOJI
                            )
                        )
                    )
                )
            ),
            "messages.0.components.0.components.0.choices.0.label",
        ),

        args(
            RolesConfigDTO(
                RolesConfigDTO.Message(
                    EXAMPLE_CONTENT,
                    RolesConfigDTO.Message.Row(
                        RolesConfigDTO.Message.SelectMenu(
                            EXAMPLE_PLACEHOLDER,
                            RolesConfigDTO.Message.SelectMenu.Choice(
                                EXAMPLE_ROLE_NAME,
                                EXAMPLE_LABEL,
                                description = "a".repeat(SelectOption.DESCRIPTION_MAX_LENGTH + 1),
                                EXAMPLE_UNICODE_EMOJI
                            )
                        )
                    )
                )
            ),
            "messages.0.components.0.components.0.choices.0.description",
        ),
    )

    @MethodSource("configWithEmptyValues")
    @ParameterizedTest
    fun `Check with empty values`(config: RolesConfigDTO, errorPaths: List<String>) {
        val errors = runBlocking {
            checker.check(jda, EXAMPLE_GUILD_ID, config)
        }

        if (errorPaths.isNotEmpty()) {
            errorPaths.forEach { errors.assertHasPath(it) }
        } else {
            assertTrue(errors.isEmpty(), "Expected no errors but got:\n${errors.joinToString("\n")}")
        }
    }

    @JvmStatic
    fun configWithEmptyValues(): Iterable<Arguments> = listOf(
        args(
            RolesConfigDTO(messages = emptyList()),
            "messages",
        ),

        args(
            RolesConfigDTO(
                RolesConfigDTO.Message(
                    content = blankString(),
                    EXAMPLE_ROW
                )
            ),
            "messages.0.content",
        ),

        args(
            RolesConfigDTO(
                RolesConfigDTO.Message(
                    EXAMPLE_CONTENT,
                    components = emptyList()
                )
            ),
            "messages.0.components",
        ),

        args(
            RolesConfigDTO(
                RolesConfigDTO.Message(
                    EXAMPLE_CONTENT,
                    components = listOf(RolesConfigDTO.Message.Row(emptyList()))
                )
            ),
            "messages.0.components.0",
        ),

        args(
            RolesConfigDTO(
                RolesConfigDTO.Message(
                    EXAMPLE_CONTENT,
                    RolesConfigDTO.Message.Row(
                        RolesConfigDTO.Message.Button(
                            roleName = blankString(),
                            EXAMPLE_STYLE,
                            EXAMPLE_LABEL,
                            EXAMPLE_UNICODE_EMOJI
                        )
                    )
                )
            ),
            "messages.0.components.0.components.0.roleName",
        ),

        args(
            RolesConfigDTO(
                RolesConfigDTO.Message(
                    EXAMPLE_CONTENT,
                    RolesConfigDTO.Message.Row(
                        RolesConfigDTO.Message.Button(
                            EXAMPLE_ROLE_NAME,
                            EXAMPLE_STYLE,
                            label = blankString(),
                            emoji = null
                        )
                    )
                )
            ),
            "messages.0.components.0.components.0",
        ),

        args(
            RolesConfigDTO(
                RolesConfigDTO.Message(
                    EXAMPLE_CONTENT,
                    RolesConfigDTO.Message.Row(
                        RolesConfigDTO.Message.Button(
                            EXAMPLE_ROLE_NAME,
                            EXAMPLE_STYLE,
                            label = blankString(),
                            EXAMPLE_UNICODE_EMOJI
                        )
                    )
                )
            ),
            // No label is allowed if there is an emoji
        ),

        args(
            RolesConfigDTO(
                RolesConfigDTO.Message(
                    EXAMPLE_CONTENT,
                    RolesConfigDTO.Message.Row(
                        RolesConfigDTO.Message.Button(EXAMPLE_ROLE_NAME, EXAMPLE_STYLE, EXAMPLE_LABEL, emoji = null)
                    )
                )
            ),
            // No emoji is allowed if there is a label
        ),

        args(
            RolesConfigDTO(
                RolesConfigDTO.Message(
                    EXAMPLE_CONTENT,
                    RolesConfigDTO.Message.Row(
                        RolesConfigDTO.Message.SelectMenu(placeholder = blankString(), listOf(EXAMPLE_CHOICE))
                    )
                )
            ),
            // Empty placeholders are allowed
        ),

        args(
            RolesConfigDTO(
                RolesConfigDTO.Message(
                    EXAMPLE_CONTENT,
                    RolesConfigDTO.Message.Row(
                        RolesConfigDTO.Message.SelectMenu(EXAMPLE_PLACEHOLDER, choices = emptyList())
                    )
                )
            ),
            "messages.0.components.0.components.0",
        ),

        args(
            RolesConfigDTO(
                RolesConfigDTO.Message(
                    EXAMPLE_CONTENT,
                    RolesConfigDTO.Message.Row(
                        RolesConfigDTO.Message.SelectMenu(
                            EXAMPLE_PLACEHOLDER,
                            RolesConfigDTO.Message.SelectMenu.Choice(
                                roleName = blankString(),
                                EXAMPLE_LABEL,
                                EXAMPLE_DESCRIPTION,
                                EXAMPLE_UNICODE_EMOJI
                            )
                        )
                    )
                )
            ),
            "messages.0.components.0.components.0.choices.0.roleName",
        ),

        args(
            RolesConfigDTO(
                RolesConfigDTO.Message(
                    EXAMPLE_CONTENT,
                    RolesConfigDTO.Message.Row(
                        RolesConfigDTO.Message.SelectMenu(
                            EXAMPLE_PLACEHOLDER,
                            RolesConfigDTO.Message.SelectMenu.Choice(
                                EXAMPLE_ROLE_NAME,
                                label = blankString(),
                                EXAMPLE_DESCRIPTION,
                                EXAMPLE_UNICODE_EMOJI
                            )
                        )
                    )
                )
            ),
            "messages.0.components.0.components.0.choices.0.label",
        ),

        args(
            RolesConfigDTO(
                RolesConfigDTO.Message(
                    EXAMPLE_CONTENT,
                    RolesConfigDTO.Message.Row(
                        RolesConfigDTO.Message.SelectMenu(
                            EXAMPLE_PLACEHOLDER,
                            RolesConfigDTO.Message.SelectMenu.Choice(
                                EXAMPLE_ROLE_NAME,
                                EXAMPLE_LABEL,
                                description = blankString(),
                                EXAMPLE_UNICODE_EMOJI
                            )
                        )
                    )
                )
            ),
            // Empty description is valid
        ),

        args(
            RolesConfigDTO(
                RolesConfigDTO.Message(
                    EXAMPLE_CONTENT,
                    RolesConfigDTO.Message.Row(
                        RolesConfigDTO.Message.SelectMenu(
                            EXAMPLE_PLACEHOLDER,
                            RolesConfigDTO.Message.SelectMenu.Choice(
                                EXAMPLE_ROLE_NAME,
                                EXAMPLE_LABEL,
                                EXAMPLE_DESCRIPTION,
                                emoji = null
                            )
                        )
                    )
                )
            ),
            // No emoji is valid
        ),
    )

    @MethodSource("configWithInvalidValues")
    @ParameterizedTest
    fun `Check returns errors (Invalid values)`(config: RolesConfigDTO, errorPaths: List<String>) {
        val errors = runBlocking {
            checker.check(jda, EXAMPLE_GUILD_ID, config)
        }

        if (errorPaths.isNotEmpty()) {
            errorPaths.forEach { errors.assertHasPath(it) }
        } else {
            assertTrue(errors.isEmpty(), "Expected no errors but got:\n${errors.joinToString("\n")}")
        }
    }

    @JvmStatic
    fun configWithInvalidValues(): Iterable<Arguments> = listOf(
        args(
            RolesConfigDTO(
                RolesConfigDTO.Message(
                    EXAMPLE_CONTENT,
                    RolesConfigDTO.Message.Row(
                        RolesConfigDTO.Message.Button(
                            EXAMPLE_ROLE_NAME,
                            EXAMPLE_STYLE,
                            EXAMPLE_LABEL,
                            emoji = RolesConfigDTO.Message.UnicodeEmoji("invalid")
                        )
                    )
                )
            ),
            "messages.0.components.0.components.0.emoji.unicode",
        ),

        args(
            RolesConfigDTO(
                RolesConfigDTO.Message(
                    EXAMPLE_CONTENT,
                    RolesConfigDTO.Message.Row(
                        RolesConfigDTO.Message.SelectMenu(
                            EXAMPLE_PLACEHOLDER,
                            RolesConfigDTO.Message.SelectMenu.Choice(
                                EXAMPLE_ROLE_NAME,
                                EXAMPLE_LABEL,
                                emoji = RolesConfigDTO.Message.UnicodeEmoji("invalid")
                            )
                        )
                    )
                )
            ),
            "messages.0.components.0.components.0.choices.0.emoji.unicode",
        ),

        args(
            RolesConfigDTO(
                RolesConfigDTO.Message(
                    EXAMPLE_CONTENT,
                    RolesConfigDTO.Message.Row(
                        RolesConfigDTO.Message.Button(
                            EXAMPLE_ROLE_NAME,
                            EXAMPLE_STYLE,
                            EXAMPLE_LABEL,
                            emoji = RolesConfigDTO.Message.CustomEmoji(false, "name", 15315)
                        )
                    )
                )
            ),
            "messages.0.components.0.components.0.emoji.discordId",
        ),

        args(
            RolesConfigDTO(
                RolesConfigDTO.Message(
                    EXAMPLE_CONTENT,
                    RolesConfigDTO.Message.Row(
                        RolesConfigDTO.Message.SelectMenu(
                            EXAMPLE_PLACEHOLDER,
                            RolesConfigDTO.Message.SelectMenu.Choice(
                                EXAMPLE_ROLE_NAME,
                                EXAMPLE_LABEL,
                                emoji = RolesConfigDTO.Message.CustomEmoji(false, "name", 15315)
                            )
                        )
                    )
                )
            ),
            "messages.0.components.0.components.0.choices.0.emoji.discordId",
        ),
    )

    @Test
    fun `Check returns no errors`() {
        val config = RolesConfigDTO(
            RolesConfigDTO.Message(
                "a".repeat(Message.MAX_CONTENT_LENGTH),
                RolesConfigDTO.Message.Row(
                    RolesConfigDTO.Message.Button(EXAMPLE_ROLE_NAME, EXAMPLE_STYLE, EXAMPLE_LABEL, emoji = null),
                    RolesConfigDTO.Message.Button(
                        EXAMPLE_ROLE_NAME,
                        EXAMPLE_STYLE,
                        label = null,
                        EXAMPLE_UNICODE_EMOJI
                    ),
                    RolesConfigDTO.Message.Button(
                        EXAMPLE_ROLE_NAME,
                        EXAMPLE_STYLE,
                        EXAMPLE_LABEL,
                        EXAMPLE_UNICODE_EMOJI
                    ),
                    RolesConfigDTO.Message.Button(
                        EXAMPLE_ROLE_NAME,
                        EXAMPLE_STYLE,
                        EXAMPLE_LABEL,
                        EXAMPLE_CUSTOM_EMOJI
                    ),
                    // Fill
                    *Array(5 - 4) { EXAMPLE_BUTTON }
                ),
                RolesConfigDTO.Message.Row(
                    RolesConfigDTO.Message.SelectMenu(
                        placeholder = null,
                        // Fill
                        *Array(SelectMenu.OPTIONS_MAX_AMOUNT) { EXAMPLE_CHOICE }
                    ),
                ),
                RolesConfigDTO.Message.Row(
                    RolesConfigDTO.Message.SelectMenu(
                        EXAMPLE_PLACEHOLDER,
                        RolesConfigDTO.Message.SelectMenu.Choice(
                            EXAMPLE_ROLE_NAME,
                            EXAMPLE_LABEL,
                            description = null,
                            emoji = null,
                        ),
                        RolesConfigDTO.Message.SelectMenu.Choice(
                            EXAMPLE_ROLE_NAME,
                            EXAMPLE_LABEL,
                            EXAMPLE_DESCRIPTION,
                            emoji = null,
                        ),
                        RolesConfigDTO.Message.SelectMenu.Choice(
                            EXAMPLE_ROLE_NAME,
                            EXAMPLE_LABEL,
                            description = null,
                            EXAMPLE_UNICODE_EMOJI,
                        ),
                        RolesConfigDTO.Message.SelectMenu.Choice(
                            EXAMPLE_ROLE_NAME,
                            EXAMPLE_LABEL,
                            EXAMPLE_DESCRIPTION,
                            EXAMPLE_UNICODE_EMOJI,
                        ),
                        RolesConfigDTO.Message.SelectMenu.Choice(
                            EXAMPLE_ROLE_NAME,
                            EXAMPLE_LABEL,
                            EXAMPLE_DESCRIPTION,
                            EXAMPLE_CUSTOM_EMOJI,
                        ),
                        // Fill
                        *Array(SelectMenu.OPTIONS_MAX_AMOUNT - 5) { EXAMPLE_CHOICE }
                    ),
                ),
                // Fill
                *Array(Message.MAX_COMPONENT_COUNT - 3) { EXAMPLE_ROW }
            ),
            // Fill
            *Array(RolesConfigDTO.MAX_MESSAGES - 1) { EXAMPLE_MESSAGE }
        )

        val errors = runBlocking {
            checker.check(jda, EXAMPLE_GUILD_ID, config)
        }

        assertTrue(errors.isEmpty(), "Expected no errors but got:\n${errors.joinToString("\n")}")
    }

    private fun args(config: RolesConfigDTO, vararg errorPaths: String) = Arguments.of(config, errorPaths.asList())

    private fun List<RolesConfigError>.assertHasPath(path: String) {
        assertTrue(any { it.path == path }, "$path should have an error, current errors:\n${this.joinToString("\n")}")
    }
}