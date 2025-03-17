package dev.freya02.commandinator.api

import dev.freya02.commandinator.api.dto.RolesConfigDTO
import dev.freya02.commandinator.api.exceptions.RolesConfigAlreadyExistsException
import dev.freya02.commandinator.api.exceptions.RolesConfigEmptyException
import dev.freya02.commandinator.api.repository.RolesConfigRepository
import dev.freya02.commandinator.api.service.RolesConfigService
import io.mockk.every
import io.mockk.mockk
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertDoesNotThrow
import org.junit.jupiter.api.assertThrows

private const val EXAMPLE_GUILD_ID = 18198613161618

class RolesConfigServiceTests {

    @Test
    fun `Inserting must have at least one message`() {
        val rolesConfigRepository = mockk<RolesConfigRepository> {
            every { existsByGuildId(EXAMPLE_GUILD_ID) } returns false
            every { save(any()) } answers { mockk() }
        }
        val rolesConfigService = RolesConfigService(rolesConfigRepository)

        assertThrows<RolesConfigEmptyException> { rolesConfigService.createConfig(EXAMPLE_GUILD_ID, RolesConfigDTO(emptyList())) }
    }

    @Test
    fun `Cannot create more than one config per guild`() {
        val rolesConfigRepository = mockk<RolesConfigRepository> {
            every { existsByGuildId(EXAMPLE_GUILD_ID) } returns true
            every { save(any()) } answers { mockk() }
        }
        val rolesConfigService = RolesConfigService(rolesConfigRepository)

        val config = RolesConfigDTO(
            listOf(
                RolesConfigDTO.Message("content", emptyList())
            )
        )
        assertThrows<RolesConfigAlreadyExistsException> { rolesConfigService.createConfig(EXAMPLE_GUILD_ID, config) }

        every { rolesConfigRepository.existsByGuildId(1234) } returns false
        assertDoesNotThrow { rolesConfigService.createConfig(1234, config) }
    }
}