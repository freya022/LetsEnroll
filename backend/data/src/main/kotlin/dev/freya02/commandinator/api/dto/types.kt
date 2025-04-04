package dev.freya02.commandinator.api.dto

import kotlinx.serialization.Serializable
import kotlinx.serialization.builtins.LongAsStringSerializer

typealias Snowflake = @Serializable(LongAsStringSerializer::class) Long