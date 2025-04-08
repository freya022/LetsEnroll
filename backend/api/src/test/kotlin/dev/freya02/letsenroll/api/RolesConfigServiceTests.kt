package dev.freya02.letsenroll.api

import dev.freya02.letsenroll.api.bot.BotClient
import dev.freya02.letsenroll.api.entity.RolesConfig
import dev.freya02.letsenroll.api.exceptions.NoSuchRolesConfigException
import dev.freya02.letsenroll.api.exceptions.RolesConfigEmptyException
import dev.freya02.letsenroll.api.repository.RolesConfigRepository
import dev.freya02.letsenroll.api.service.RolesConfigService
import dev.freya02.letsenroll.data.RolesConfigDTO
import io.mockk.every
import io.mockk.just
import io.mockk.mockk
import io.mockk.runs
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertDoesNotThrow
import org.junit.jupiter.api.assertThrows

class RolesConfigServiceTests {

    @Test
    fun `Inserting must have at least one message`() {
        val rolesConfigRepository = mockk<RolesConfigRepository> {
            every { existsByGuildId(EXAMPLE_GUILD_ID) } returns false
            every { save(any()) } answers { mockk() }
        }
        val rolesConfigService = RolesConfigService(rolesConfigRepository, mockk())

        assertThrows<RolesConfigEmptyException> { rolesConfigService.upsertConfig(EXAMPLE_GUILD_ID, RolesConfigDTO(emptyList())) }
    }

    @Test
    fun `Retrieve config`() {
        val rolesConfigRepository = mockk<RolesConfigRepository> {
            every { findByGuildId(EXAMPLE_GUILD_ID) } returns RolesConfig(EXAMPLE_GUILD_ID, arrayListOf())
        }
        val rolesConfigService = RolesConfigService(rolesConfigRepository, mockk())

        assertDoesNotThrow { rolesConfigService.retrieveConfig(EXAMPLE_GUILD_ID) }

        // Check we get the exception on an absent config
        every { rolesConfigRepository.findByGuildId(any()) } returns null
        assertThrows<NoSuchRolesConfigException> { rolesConfigService.retrieveConfig(-1) }
    }

    @Test
    fun `Publish selectors`() {
        val rolesConfigRepository = mockk<RolesConfigRepository> {
            every { findByGuildId(EXAMPLE_GUILD_ID) } returns RolesConfig(EXAMPLE_GUILD_ID, arrayListOf())
        }
        val botClient = mockk<BotClient> {
            every { publishRoleSelectors(EXAMPLE_GUILD_ID, any()) } just runs
        }
        val rolesConfigService = RolesConfigService(rolesConfigRepository, botClient)

        assertDoesNotThrow { rolesConfigService.publishSelectors(EXAMPLE_GUILD_ID, EXAMPLE_CHANNEL_ID) }

        // Check we get the exception on an absent config
        every { rolesConfigRepository.findByGuildId(any()) } returns null
        assertThrows<NoSuchRolesConfigException> { rolesConfigService.publishSelectors(-1, EXAMPLE_CHANNEL_ID) }
    }
}