package dev.freya02.letsenroll.data

import kotlinx.serialization.Serializable

@Serializable
data class PublishSelectorsDTO(
    val channelId: Snowflake,
    val config: RolesConfigDTO,
)