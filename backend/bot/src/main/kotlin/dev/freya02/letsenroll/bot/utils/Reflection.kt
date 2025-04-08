package dev.freya02.letsenroll.bot.utils

import io.github.freya022.botcommands.api.core.utils.simpleNestedName
import java.lang.reflect.Method
import java.lang.reflect.Proxy
import kotlin.reflect.KClass
import kotlin.reflect.KType
import kotlin.reflect.full.allSupertypes
import kotlin.reflect.jvm.jvmErasure

@Suppress("UNCHECKED_CAST")
fun <T : Any> KClass<T>.createProxy(handler: (proxy: T, method: Method, args: Array<Any?>?) -> Any?): T {
    return Proxy.newProxyInstance(this.java.classLoader, arrayOf(this.java)) { proxy, method: Method, methodArgs: Array<Any?>? ->
        handler(proxy as T, method, methodArgs)
    } as T
}

inline fun <reified T : Any> KClass<*>.superErasureAt(index: Int): KType = superErasureAt(index, T::class)

fun KClass<*>.superErasureAt(index: Int, targetType: KClass<*>): KType {
    val interfaceType = allSupertypes.firstOrNull { it.jvmErasure == targetType }
        ?: error("Unable to find the supertype '${targetType.simpleNestedName}' in '${this.simpleNestedName}'")
    return interfaceType.arguments[index].type
        ?: error("Star projections are not allowed on argument #$index of ${targetType.simpleNestedName}")
}