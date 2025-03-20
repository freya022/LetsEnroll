package dev.freya02.commandinator.api.mapper

import org.mapstruct.factory.Mappers

inline fun <reified T : Any> mapper(): T {
    return Mappers.getMapper(T::class.java)
}