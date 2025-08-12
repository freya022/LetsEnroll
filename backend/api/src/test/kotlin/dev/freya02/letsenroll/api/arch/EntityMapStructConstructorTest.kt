package dev.freya02.letsenroll.api.arch

import com.lemonappdev.konsist.api.Konsist
import com.lemonappdev.konsist.api.ext.list.modifierprovider.withoutAbstractModifier
import com.lemonappdev.konsist.api.ext.list.withAllAnnotationsNamed
import com.lemonappdev.konsist.api.verify.assertTrue
import kotlin.test.Test

class EntityMapStructConstructorTest {

    @Test
    fun `Test MapStruct constructor of entities don't accept an ID`() {
        // The API users (such as the frontend) does not decide which entities they are going to affect

        Konsist.scopeFromProduction(moduleName = "api")
            .classes()
            .withoutAbstractModifier()
            .withAllAnnotationsNamed("Entity") // Doesn't work with fully qualified name, seemingly because Entity is from an external dependency
            .assertTrue(strict = true) { clazz ->
                val mapStructConstructor = clazz.constructors.single { it.hasAnnotationWithName("MapStructConstructor") } // Doesn't work with typealiases either
                // Don't accept an id
                !mapStructConstructor.hasParameterWithName("id")
            }
    }
}
