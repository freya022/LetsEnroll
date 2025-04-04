package dev.freya02.commandinator.api.dto

import kotlinx.serialization.Serializable

@Serializable
data class PublishSelectorsDTO(
    val channelId: Snowflake,
    val config: RolesConfigDTO,
)