# Commandinator - Bot module

Module for the main Discord bot.

## Features used

- Application emojis
- Slash commands
- Components (and database)
- Localization
    - Custom YAML reader
    - Auto-generated implementation of interfaces containing localized message getters

## Other notable libraries

- [JMH](https://github.com/openjdk/jmh) - Harness for building, running and analysing benchmarks written in JVM languages
- [Ktor](https://ktor.io/) - Framework for building asynchronous web servers and clients
- [Flyway](https://github.com/flyway/flyway) - Database migration
- [Mockk](https://mockk.io/) - Mocking library for Kotlin

## Running the dev bot
1. Start from the root directory (where `config-template` is)
2. Copy `config-template` as `config`
3. Fill the values in `config/.env`
4. (Optional) Delete `logback.xml`
5. Run the `Main` class in your editor