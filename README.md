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
1. Go in the `bot` folder
2. Copy `config-template` as `config`
3. Fill the values in `config/.env`
4. (Optional) Delete `logback.xml`
5. Run the `Main` class in your editor

## Running in docker
1. Go in the `bot` folder
2. Copy `config-template` as `config`
3. Fill the values in `config/.env`
4. Generate the latest image with `./gradlew jibDockerBuild`
5. Move `config` to same folder as `compose.yaml`
6. Go back to the root folder
7. Start up the stack with `docker compose up -d`