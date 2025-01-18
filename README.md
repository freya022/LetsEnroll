# Commandinator
This is a bot for the [BotCommands](https://github.com/freya022/BotCommands) support server.

As this bot is made with this framework, you can take it as an example.

## Features used
- Application emojis
- Slash commands
- Components (and database)
- Localization
  - Custom YAML reader
  - Auto-generated implementation of interfaces containing localized message getters

## Running the dev bot
1. Copy `config-template` as `config`
2. Fill the values in `config/.env`
3. (Optional) Delete `logback.xml`
4. Run the `Main` class in your editor

## Running in docker
1. Copy `config-template` as `config`
2. Fill the values in `config/.env`
3. Generate the latest image with `./gradlew jibDockerBuild`
4. Start up the stack with `docker compose up -d`