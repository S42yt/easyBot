// import { Client, User } from 'revolt.js';
// import { ClientEvent } from '../types/easyClientEvent';
// import EmbedBuilder from '../types/easyEmbed';
// import Logger from '../utils/logger';
// import dotenv from 'dotenv';
// import path from 'path';
// import axios from 'axios';
// import { memberCount } from '../types/easyMemberCounter';
// import { createCanvas, loadImage, registerFont } from 'canvas';

// dotenv.config();
// const logger = new Logger();

// registerFont(path.join(path.resolve('./'), 'assets', 'fonts', 'minecraft_font.ttf'), { family: 'Minecraft' });

// class welcomeMSG implements ClientEvent {
//     name = 'welcomeMSG';
//     description = 'Welcome message for new users.';

//     async createWelcomeBanner(client: Client, avatarURL: string, username: string) {
//         const canvas = createCanvas(800, 360);
//         const ctx = canvas.getContext('2d');

//         try {
//             const background = await loadImage(path.join(path.resolve('./'), 'assets', 'images', 'welcome_bg.jpg'));
//             ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
//         } catch (error: any) {
//             logger.error('Error loading Background: ' + error.message);
//             ctx.fillStyle = '#36393f';
//             ctx.fillRect(0, 0, canvas.width, canvas.height);
//         }

//         ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
//         ctx.fillRect(0, 0, canvas.width, canvas.height);

//         ctx.strokeStyle = '#ffffff';
//         ctx.lineWidth = 10;
//         ctx.strokeRect(0, 0, canvas.width, canvas.height);

//         ctx.font = '40px Minecraft';
//         ctx.fillStyle = '#ffffff';
//         ctx.textAlign = 'center';
//         ctx.fillText(`Welcome to Desto,`, canvas.width / 2, 230);

//         ctx.font = '55px Minecraft';
//         ctx.fillText(username, canvas.width / 2, 310);

//         ctx.font = '20px Minecraft';
//         ctx.textAlign = 'left';
//         const server = await client.servers.fetch(process.env.SERVER_ID!);
//         const memberCountValue = await memberCount(client);
//         ctx.fillText(`Member #${memberCountValue}`, 20, canvas.height - 14);
//         ctx.fillText(`Total Members: ${memberCountValue}`, 20, canvas.height - 40);
//         try {
//             const avatarBufferRes = await axios.get(avatarURL, {
//                 validateStatus: () => true,
//                 responseType: 'arraybuffer',
//                 timeout: 2000,
//             });

//             if (avatarBufferRes.status !== 200) {
//                 throw new Error('Request failed');
//             }

//             const avatar = await loadImage(avatarBufferRes.data);

//             ctx.save();
//             ctx.beginPath();
//             ctx.arc(canvas.width / 2, 100, 80, 0, Math.PI * 2, true);
//             ctx.closePath();
//             ctx.clip();

//             ctx.drawImage(avatar, canvas.width / 2 - 80, 20, 160, 160);
//             ctx.restore();
//         } catch (error: any) {
//             logger.error('Error loading Profilepic: ' + error.message);
//             ctx.fillStyle = '#7289da';
//             ctx.beginPath();
//             ctx.arc(canvas.width / 2, 100, 80, 0, Math.PI * 2, true);
//             ctx.closePath();
//             ctx.fill();
//         }

//         return canvas.toBuffer();
//     }

//     async run(client: Client, user: User) {
//         const logger = new Logger();
//         logger.info('Running welcomeMSG event', true);
//         try {
//             const welcomeChannelId = process.env.WELCOME_CHANNEL_ID!;
//             logger.log(`Fetched welcome channel ID: ${welcomeChannelId}`, true);

//             const avatarURL = user.avatarURL || 'default_avatar_url';
//             const welcomeBannerBuffer = await this.createWelcomeBanner(client, avatarURL, user.username);

//             const embed = new EmbedBuilder()
//                 .setColour('#5A09C1')
//                 .setTitle(`Welcome, ${user.username}!`)
//                 .setDescription('Glad to have you here!')
//                 .setMedia('attachment://welcome-image.png');
//             logger.log('Created welcome embed', true);

//             logger.log('Attempting to send welcome message...', true);
//             const channel = await client.channels.fetch(welcomeChannelId);

//             const attachment = await client.uploadFile({
//                 file: welcomeBannerBuffer,
//                 name: 'welcome-image.png',
//                 contentType: 'image/png'
//             });
                            
//             const message = await channel?.sendMessage({
//                 content: '',
//                 embeds: [embed.toJSON()],
//                 attachments: [attachment.id]
//             });
//             logger.log(`Sent welcome message to channel ID: ${welcomeChannelId}`, true);

//             logger.info(`Sent welcome message to ${user.username}`, true);
//         } catch (error) {
//             logger.error(`Error sending welcome message: ${(error as any).message}`, true);
//             logger.error(`Failed to send welcome message to channel ID: ${process.env.WELCOME_CHANNEL_ID}`, true);
//         }
//     }
// }

// export default new welcomeMSG();