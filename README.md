# easyBot

![easyBot Logo](assets/images/easyBot-Alpha.png)

## Overview

**easyBot** is a general-purpose bot built using [Revolt.js](https://github.com/revoltchat/revolt.js). It is designed to enhance your server with various features and commands.
The only thing you need to configure is the .env!
This project is developed for fun and is licensed under the MIT License.

## Features

- **Utils**
 - `Logger`: A better Console Logger used for the bot.
 - `Message Logger`: A Message Logger that logs every message sent in the server. 


- **User Commands**
  - `!help`: Displays a list of available commands.
  - `!hallo`: Sends a welcome message.
  
- **Admin/Moderator Commands**
  - `!ban <username>`: Bans a user from the server.
  - `!mute <username> <time>`: Mutes a user in the server.
  - `!kick <username>`: Kicks a user from the server.
  - `!unmute <username>`: Unmutes a user in the server.
  - `!eventStart <event>`: Starts a specified event.
  - `!standartRole`: Assigns a standard role to all online members.
  - `!ping`: Checks the bot's latency.
  - `!teamHelp`: Displays a list of team commands.

- **Events**
  - `joinrole`: Automatically assigns a role to new members when they join the server.
  - `welcomeMSG`: Sends a welcome message when new users join the server.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 14 or higher)
- [npm](https://www.npmjs.com/) (Node Package Manager)

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/easyBot.git
    cd easyBot
    ```

2. Install the dependencies:
    ```sh
    npm install
    ```

3. Create a `.env` file by copying the `.env.template`:
    ```sh
    cp .env.template .env
    ```

4. Fill in the required values in the `.env` file:
```env
#BOT RELATED
BOT_TOKEN = ""


#SERVER RELATED
SERVER_ID = ""

#ROLES
JOIN_ROLE = ""
ADMIN_ROLE = ""
MODERATOR_ROLE = ""

#CHANNELS
WELCOME_CHANNEL_ID = ""
LOGGING_CHANNEL_ID = ""



#USER IDS
OWNER_USER_ID = ""
```

### Running the Bot

To start the bot in development mode:
```sh
npm run dev
```

To start the bot in production mode:
```sh
npm run prod
```

## Building the Project

To Build the Project:
```sh
npm run build
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request with your changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For any questions or suggestions, please open an issue on GitHub. 
Or Join the official EasyBot Revolt Server (_coming soon_)

---

**easyBot** - Enhancing your server experience with ease!
