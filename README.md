# easyBot

<p align="center">
  <img src="assets/images/easyBot-Alpha.png" alt="easyBot Logo" width="200" height="200" style="border-radius: 20px;">
</p>

## Overview

**easyBot** is a general-purpose bot built using [Revolt.js](https://github.com/revoltchat/revolt.js). It is designed to enhance your server with various features and commands.
The only thing you need to configure is the .env!
This project is developed for fun and is licensed under the MIT License.

## Features

- **🛠️ Utils**
  - `Logger`: A better Console Logger used for the bot.
  - `Message Logger`: A Message Logger that logs every message sent in the server.

- **👤 User Commands**
  - `!help`: Displays a list of available commands.
  - `!hallo`: Sends a welcome message.
  - `!level`: Displays your current level and experience.
  - `!top`: Displays the top users by level and experience.
  - `userCountChannel`: Creates a voice channel that displays the current member count of the server.

- **🔧 Admin/Moderator Commands**
  - `!ban <username>`: Bans a user from the server.
  - `!mute <username> <time>`: Mutes a user in the server.
  - `!kick <username>` Kicks a user from the server.
  - `!unmute <username>`: Unmutes a user in the server.
  - `!eventStart <event>`: Starts a specified event.
  - `!standartRole`: Assigns a standard role to all online members.
  - `!ping`: Checks the bot's latency.
  - `!teamHelp`: Displays a list of team commands.
  - `!botMSG <message>`: Sends a message as the bot.
  - `!botEmbed <title> <description>`: Sends an embed message as the bot.

- **📅 Events**
  - `joinrole`: Automatically assigns a role to new members when they join the server.
  - `welcomeMSG`: Sends a welcome message when new users join the server.
  - `userLeave`: Deletes user data from the database when they leave, get kicked, or get banned.

## Database Tutorial

### Setting Up the Database

1. **📥 Install MongoDB**: Make sure you have MongoDB installed and running. You can download it from [here](https://www.mongodb.com/try/download/community).

2. **⚙️ Configure the .env File**: Add your MongoDB URI to the `.env` file.
    ```env
    MONGODB_URI = "your_mongodb_uri"
    ```

### Using the Database

- **💾 Saving User Data**: To save user data, use the `saveUserData` function from `src/database/utils/user.ts`.
    ```typescript
    import { saveUserData } from '../database/utils/user';

    const user = {
        userId: '123456',
        username: 'exampleUser',
        discriminator: '0001',
        avatar: 'avatar_url',
        createdAt: new Date(),
        experience: 0,
        level: 1
    };

    await saveUserData(user);
    ```

- **🔍 Fetching User Data**: To fetch user data, use the `getUserData` function from `src/database/utils/user.ts`.
    ```typescript
    import { getUserData } from '../database/utils/user';

    const userData = await getUserData({ userId: '123456' });
    console.log(userData);
    ```

- **🗑️ Deleting User Data**: To delete user data, use the `deleteUserData` function from `src/database/utils/user.ts`.
    ```typescript
    import { deleteUserData } from '../database/utils/user';

    await deleteUserData('123456');
    ```

- **📈 Adding Experience**: To add experience to a user, use the `addExperience` function from `src/database/utils/levelSystem.ts`.
    ```typescript
    import { addExperience } from '../database/utils/levelSystem';

    await addExperience('123456', 50);
    ```

- **🏅 Fetching User Level**: To fetch a user's level, use the `getUserLevel` function from `src/database/utils/levelSystem.ts`.
    ```typescript
    import { getUserLevel } from '../database/utils/levelSystem';

    const userLevel = await getUserLevel('123456');
    console.log(userLevel);
    ```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 14 or higher)
- [npm](https://www.npmjs.com/) (Node Package Manager)

### Installation

1. **📥 Clone the repository**:
    ```sh
    git clone https://github.com/yourusername/easyBot.git
    cd easyBot
    ```

    _(you also could download the release and use that **BUT** the releases are in **Javascript** not **Typescript**)_


2. **📦 Install the dependencies**:
    ```sh
    npm install
    ```

3. **⚙️ Create a [.env](http://_vscodecontentref_/0) file** by copying the [.env.template](http://_vscodecontentref_/1):
    ```sh
    cp .env.template .env
    ```

4. **✏️ Fill in the required values** in the [.env](http://_vscodecontentref_/2) file:
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

    #MONGO DB
    MONGODB_URI = ""
    ```

### 🚀 Running the Bot



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
