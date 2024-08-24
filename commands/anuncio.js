const { EmbedBuilder } = require('discord.js');

// IDs e configurações
const ALLOWED_CHANNEL_ID = '1276309321822765096'; // ID do canal específico onde o comando pode ser executado

module.exports = {
    name: 'a',
    description: 'Envia uma mensagem para um canal específico com a opção de embed.',
    allowedChannelId: ALLOWED_CHANNEL_ID,

    async run(client, message, args) {
        if (!message.member.permissions.has('ADMINISTRATOR')) {
            return message.reply('Você não tem permissão para usar este comando.');
        }

        try {
            await message.reply('Qual o ID do canal');

            const filter = response => response.author.id === message.author.id;
            const collectedChannel = await message.channel.awaitMessages({ filter, max: 1, time: 60000, errors: ['time'] });
            const channelId = collectedChannel.first().content.trim();
            const channel = client.channels.cache.get(channelId) || message.mentions.channels.first();

            if (!channel) {
                return message.reply('Canal inválido. Por favor, forneça um ID de canal válido ou mencione um canal.');
            }

            await message.reply('Você deseja enviar a mensagem em um embed? "s" ou "n"');

            const collectedEmbed = await message.channel.awaitMessages({ filter, max: 1, time: 60000, errors: ['time'] });
            const embedResponse = collectedEmbed.first().content.trim().toLowerCase();
            const useEmbed = embedResponse === 's';

            let embedColor = '#6a0dad'; 

            if (useEmbed) {
                await message.reply('Você deseja personalizar a cor do embed? "s" ou "n" (cor padrao roxo)');

                const collectedColor = await message.channel.awaitMessages({ filter, max: 1, time: 60000, errors: ['time'] });
                const colorResponse = collectedColor.first().content.trim().toLowerCase();

                if (colorResponse === 's') {
                    await message.reply('Por favor, forneça o código hexadecimal da cor exemplo "#A020F0" para roxo.');

                    const collectedColorCode = await message.channel.awaitMessages({ filter, max: 1, time: 60000, errors: ['time'] });
                    const colorCode = collectedColorCode.first().content.trim();

                    if (/^#[0-9A-Fa-f]{6}$/.test(colorCode)) {
                        embedColor = colorCode;
                    } else {
                        await message.reply('Código de cor inválido. Usando a cor padrão.');
                    }
                }
            }

            await message.reply('Por favor, forneça o texto da mensagem que deseja enviar.');

            const collectedMessage = await message.channel.awaitMessages({ filter, max: 1, time: 60000, errors: ['time'] });
            const messageContent = collectedMessage.first().content.trim();

            const confirmation = await message.reply(`Você está prestes a enviar a seguinte mensagem para o canal ${channel}: ${useEmbed ? `\n**Mensagem em Embed**\n${messageContent}` : `\n**Mensagem Normal**\n${messageContent}`}\nDigite "y" para prosseguir ou "c" para cancelar.`);

            const collectedConfirmation = await message.channel.awaitMessages({ filter, max: 1, time: 60000, errors: ['time'] });
            const confirmationResponse = collectedConfirmation.first().content.trim().toLowerCase();

            if (confirmationResponse === 'y') {
               
                if (useEmbed) {
                    const embed = new EmbedBuilder()
                        .setDescription(messageContent)
                        .setColor(embedColor); 
                    await channel.send({ embeds: [embed] });
                } else {
                    await channel.send(messageContent);
                }

                message.reply('Mensagem enviada com sucesso!');
            } else {
                message.reply('Ação cancelada. Nenhuma mensagem foi enviada.');
            }

        } catch (error) {
            console.error('Erro ao executar o comando "a":', error);
            message.reply('Ocorreu um erro ao tentar executar o comando. Por favor, tente novamente.');
        }
    }
};
