package dev.freya02.letsenroll.data

import kotlinx.serialization.Serializable
import kotlinx.serialization.builtins.LongAsStringSerializer

typealias Snowflake = @Serializable(LongAsStringSerializer::class) Long