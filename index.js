require('dotenv').config();
const { Client, GatewayIntentBits, Collection, ActivityType } = require('discord.js');
const fs = require('fs');
const path = require('path');
const colors = require('colors');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

client.commands = new Collection();
client.aliases = new Collection();
client.slashCommands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(path.join(commandsPath, file));
    client.commands.set(command.name, command);
}

client.once('ready', () => {
    console.log(colors.yellow('[') + colors.brightWhite('Star') + colors.yellow(']') + colors.brightWhite(' Bot Status:') + colors.yellow(' Online.'));
    console.log(colors.yellow('▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬'));

    commandFiles.forEach(file => {
        const cmd = require(path.join(commandsPath, file));
        console.log(colors.yellow('[') + colors.brightWhite('Star') + colors.yellow(']') + colors.brightWhite(' Carregando:') + colors.yellow(` ${file}`));
        client.commands.set(cmd.name, cmd);
        if (cmd.aliases) cmd.aliases.forEach(alias => client.aliases.set(alias, cmd.name));
        if (cmd.data) client.slashCommands.set(cmd.data.name, cmd);
    });

    console.log(colors.yellow('▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬'));

    // Configurar atividades e presença
    const activities = [
        'star',
        'made by star'
    ];
    let i = 0;

    setInterval(() => {
        client.user.setActivity({
            name: activities[i],
            type: ActivityType.Listening
        });
        i = (i + 1) % activities.length;
    }, 20000);

    client.user.setPresence({
        activities: [{
            name: 'star', 
            type: ActivityType.Streaming, 
            url: 'https://www.twitch.tv/dreamerr5' 
        }],
        status: 'online' 
    });
});

client.on('messageCreate', message => {
    if (!message.content.startsWith('!') || message.author.bot) return;

    const args = message.content.slice(1).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName);
    if (!command) return;

    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('Houve um erro ao executar esse comando.');
    }
});

client.login(process.env.TOKEN);
