package dev.freya02.commandinator.api.entity

import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id

@Entity
data class Emoji(
    val discordId: Long?,
    val name: String,
    val animated: Boolean?,
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int = 0
) {

    companion object {

        fun ofUnicode(unicode: String) = Emoji(discordId = null, name = unicode, animated = null)
        fun ofCustom(id: Long, name: String, animated: Boolean) = Emoji(id, name, animated)
    }
}