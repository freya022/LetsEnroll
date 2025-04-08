<img align="right" src="frontend/public/logo.svg" height="90" alt="Let's Enroll logo">

# Let's Enroll
A simple Discord bot to set up self-assigned roles on your server!

## Overview

This uses a website which allows you to fully customize the controls sent by the bot, such as:
- Buttons for single-role toggles
- Select menus with multiple selectable choices
- Select menus with a single selectable from a list

## Details

This bot uses the [BotCommands](https://github.com/freya022/BotCommands) framework (and is primarily used for its support server),
as such, you can take this bot as an example.

You can find many more details in the different modules:
- [Backend](backend) - Contains the API, the Discord bot and other shared modules
- [Frontend](frontend) - Contains the frontend, it can only connect to the API