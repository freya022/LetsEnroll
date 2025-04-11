package dev.freya02.letsenroll.data.serializer

import kotlinx.serialization.builtins.nullable
import kotlinx.serialization.builtins.serializer
import kotlinx.serialization.json.JsonElement
import kotlinx.serialization.json.JsonNull
import kotlinx.serialization.json.JsonPrimitive
import kotlinx.serialization.json.JsonTransformingSerializer

internal class NullableStringSerializer : JsonTransformingSerializer<String?>(String.serializer().nullable) {

    override fun transformSerialize(element: JsonElement): JsonElement {
        return when (element) {
            is JsonPrimitive if (element.isString && element.content.isBlank()) -> JsonNull
            else -> element
        }
    }

    override fun transformDeserialize(element: JsonElement): JsonElement {
        return when (element) {
            is JsonPrimitive if (element.isString && element.content.isBlank()) -> JsonNull
            else -> element
        }
    }
}