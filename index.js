const { Client, GatewayIntentBits } = require('discord.js');
const Gamedig = require('gamedig');

const TOKEN = process.env.TOKEN;

const CHANNEL_ID = '1380702918415745097';
const SERVER_IP = '148.251.79.19';
const SERVER_PORT = 2001;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
let lastStatus = null;

async function checkServer() {
  try {
    const state = await Gamedig.query({
      type: 'arma-reforger',
      host: SERVER_IP,
      port: SERVER_PORT,
      socketTimeout: 5000,
    });

    if (lastStatus !== 'online') {
      lastStatus = 'online';
      const channel = await client.channels.fetch(CHANNEL_ID);
      channel.send(
        `🟢 **سيرفر Arma Reforger شغال**\n` +
        `👥 اللاعبين: ${state.players?.length ?? 0}\n` +
        `🗺️ الخريطة: ${state.map || 'غير معروف'}`
      );
    }
  } catch {
    if (lastStatus !== 'offline') {
      lastStatus = 'offline';
      const channel = await client.channels.fetch(CHANNEL_ID);
      channel.send('🔴 **سيرفر Arma Reforger طافي**');
    }
  }
}

client.once('ready', () => {
  console.log(`Bot logged in as ${client.user.tag}`);
  checkServer();
  setInterval(checkServer, 60 * 1000);
});

client.login(TOKEN);
