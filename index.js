const { Client, GatewayIntentBits, SlashCommandBuilder, REST, Routes } = require('discord.js');
const Gamedig = require('gamedig');

const TOKEN = process.env.TOKEN;
const CHANNEL_ID = "1380702918415745097";
const SERVER_IP = "148.251.79.19";
const SERVER_PORT = 2001;
const CLIENT_ID = process.env.CLIENT_ID;

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

// تسجيل أمر /status
const commands = [
  new SlashCommandBuilder()
    .setName('status')
    .setDescription('يعرض حالة سيرفر Arma Reforger')
    .toJSON()
];

const rest = new REST({ version: '10' }).setToken(TOKEN);

client.once('ready', async () => {
  console.log(`Bot logged in as ${client.user.tag}`);

  try {
    await rest.put(
      Routes.applicationCommands(CLIENT_ID),
      { body: commands }
    );
    console.log('Slash command /status registered');
  } catch (err) {
    console.error(err);
  }
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'status') {
    await interaction.deferReply();

    try {
      const state = await Gamedig.query({
        type: 'arma-reforger',
        host: SERVER_IP,
        port: SERVER_PORT,
        socketTimeout: 5000
      });

      await interaction.editReply(
        `🟢 **Arma Reforger شغال**\n` +
        `👥 اللاعبين: ${state.players.length}\n` +
        `🗺️ الخريطة: ${state.map || 'غير معروف'}`
      );
    } catch (err) {
      await interaction.editReply('🔴 **السيرفر طافي أو غير متصل**');
    }
  }
});

client.login(TOKEN);
