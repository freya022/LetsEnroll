package dev.freya02.commandinator.bot.config

import com.zaxxer.hikari.HikariConfig
import com.zaxxer.hikari.HikariDataSource
import io.github.freya022.botcommands.api.core.db.HikariSourceSupplier
import io.github.freya022.botcommands.api.core.service.annotations.BService
import org.flywaydb.core.Flyway

@BService
class DatabaseSource(
    config: Config.Database,
) : HikariSourceSupplier {

    override val source = HikariDataSource(HikariConfig().apply {
        jdbcUrl = "jdbc:postgresql://${config.host}:${config.port}/${config.database}"
        username = config.username
        password = config.password
    })

    init {
        migrateSchema("bc", "bc_database_scripts")
        migrateSchema("bot", "bot_database_scripts")
    }

    private fun migrateSchema(schema: String, scriptLocation: String) {
        Flyway.configure()
            .dataSource(source)
            .schemas(schema)
            .locations(scriptLocation)
            .validateMigrationNaming(true)
            .loggers("slf4j")
            .load()
            .migrate()
    }
}