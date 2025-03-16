package dev.freya02.commandinator.api.mapper

import org.mapstruct.factory.Mappers

annotation class Default

typealias MapStructConstructor = Default

inline fun <reified T : Any> mapper(): T {
    return Mappers.getMapper(T::class.java)
}