package dev.freya02.letsenroll.api.dto

import dev.freya02.letsenroll.data.Snowflake
import kotlinx.serialization.Serializable

@Serializable
class PublishRoleSelectorsDTO(val channelId: Snowflake)