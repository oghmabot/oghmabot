# Contributing

- [Getting Started](#getting-started)
- [Guidelines & Recommendations](#guidelines--recommendations)
  - [Project Structure](#project-structure)
- [Relevant Documentation](#relevant-documentation)

## Getting Started

1. Install [Node.js](https://nodejs.org/).
2. Clone the repo.
3. Run `npm install` from the root folder, where `package.json` is located.

All necessary dependencies should then be installed. To run the project locally it must first be built with `npm run build`, then enter `npm start`. The effects of both `build` and `start` are defined in `package.json`.

Running the project immediately will fail, however, until you've added a file `.env` which will contain necessary environment variables. It should look more or less like the following.

```env
BOT_TOKEN=<secret bot token granted by Discord -- REQUIRED>
BOT_OWNER=<id of the Discord user that owns the chatbot -- NOT required>
BOT_STATUS_CHANNEL=<id of a Discord channel where the bot will notify when it has logged in -- NOT required>
ARELITH_WIKI_URL=http://wiki.nwnarelith.com
BEAMDOG_NWN_API=https://api.nwn.beamdog.net/v1/servers/
```

For the required `BOT_TOKEN`, either set up your own bot in [Discord's Developer Portal](https://discord.com/developers/) or reach out to other contributors of this project.

## Guidelines & Recommendations

- Some understanding of `discord.js` is recommended when making code contributions. See the [relevant docs](#relevant-documentation).
- [Visual Studio Code](https://code.visualstudio.com/) is the recommended editor (largely due to native TypeScript support).
- Project structure is quite object-oriented and new modules should follow the same general ideas.

### Project Structure
- `src/client/` contains bot-related stuff, mostly custom extensions of `discord.js` classes.
- `src/commands/` contains the bot commands in categorical subfolders.
- `src/data/` contains everything related to data that the bot uses.
  - `mappers/` handles mapping/shaping data from an external model to an internal one.
  - `models/` handles the logic of all internal data models, often interacting with db.
  - `proxies/` handles all logic against external resources.

## Relevant Documentation

- [TypeScript](https://www.typescriptlang.org/docs)
- [discord.js](https://discord.js.org/#/docs/main/stable/general/welcome)
- [discord.js-commando](https://discord.js.org/#/docs/commando/master/general/welcome)
- [Sequelize](https://sequelize.org/master/)
