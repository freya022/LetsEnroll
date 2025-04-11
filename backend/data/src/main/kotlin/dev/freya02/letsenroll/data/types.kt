package dev.freya02.letsenroll.data

import dev.freya02.letsenroll.data.serializer.NullableStringSerializer
import kotlinx.serialization.Serializable
import kotlinx.serialization.builtins.LongAsStringSerializer

typealias Snowflake = @Serializable(LongAsStringSerializer::class) Long

/**
 * These strings are nullable and will be replaced to `null` if they are blank
 */
typealias NullableString = @Serializable(NullableStringSerializer::class) String?