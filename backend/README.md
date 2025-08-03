# Let's Enroll - Backend

## Modules
- [Bot](bot) - The main Discord bot
- [API](api) - The API for the frontend
- [Data](data) - Contains shared data objects
- [Emoji generator](emoji-generator) - Generates the JSON and spritesheets of Discord's Unicode emojis
- [Convention plugins](buildSrc) - Contains shared build logic

## Running in docker
1. Start from the root directory (where `config-template` is)
2. Copy `config-template` as `config`
3. Fill the values in `config/.env`
4. Fill the values in `config/application.yaml`, values are required unless commented
5. Start up the stack with `docker compose up -d`
