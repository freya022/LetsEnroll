package dev.freya02.commandinator.bot.annotations

import io.github.freya022.botcommands.api.core.service.CustomConditionChecker
import io.github.freya022.botcommands.api.core.service.ServiceContainer
import io.github.freya022.botcommands.api.core.service.annotations.Condition

@Condition(Disabled.Companion::class)
annotation class Disabled(val reason: String) {

    companion object : CustomConditionChecker<Disabled> {
        override val annotationType = Disabled::class.java

        override fun checkServiceAvailability(
            serviceContainer: ServiceContainer,
            checkedClass: Class<*>,
            annotation: Disabled
        ) = annotation.reason
    }
}
