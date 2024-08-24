const {
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
    ComponentType,
    PermissionsBitField,
    EmbedBuilder,
} = require("discord.js");

// IDs
const CATEGORY_ID = '1273037140418367562'; //categoria

module.exports = {
    name: "ticket",
    aliases: [""],
    run: async (client, message, args) => {
        try {
            if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                return message.reply({ content: 'Você não tem permissão para usar este comando.', ephemeral: true });
            }

            const AbrirTicket = new ButtonBuilder()
                .setLabel('Abrir Ticket')
                .setStyle(ButtonStyle.Primary)
                .setCustomId('abrir-ticket');

            const embed1 = new EmbedBuilder()
                .setTitle('Abrir Ticket')
                .setColor('#5865F2')
                .setDescription('E ae!\nTalvez você tenha conhecido meu servidor através das lives na Twitch, ou recomendação/divulgação de meus acompanhamentos/coach, caso tenha interesse em falar sobre aulas de LoL, só reagir abaixo! 📩');

            const ButtonRowAbrirTicket = new ActionRowBuilder().addComponents(AbrirTicket);
            const ReplyAbrirTicket = await message.channel.send({ embeds: [embed1], components: [ButtonRowAbrirTicket] });
            const CollectorAbrirTicket = ReplyAbrirTicket.createMessageComponentCollector({
                componentType: ComponentType.Button,
            });

            CollectorAbrirTicket.on('collect', async (interaction) => {
                if (interaction.customId === 'abrir-ticket') {
                    try {
                        const member = interaction.member;
                        const guild = client.guilds.cache.get(interaction.guild.id);
                        
                        if (!guild) {
                            return interaction.reply({ content: 'Servidor não encontrado.', ephemeral: true });
                        }

                        const channel = await guild.channels.create({
                            name: `ticket-${member.user.username}`,
                            type: 0, 
                            parent: CATEGORY_ID, 
                            permissionOverwrites: [
                                {
                                    id: guild.roles.everyone,
                                    deny: [PermissionsBitField.Flags.ViewChannel],
                                },
                                {
                                    id: member.id,
                                    allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
                                },
                                {
                                    id: client.user.id,
                                    allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.AttachFiles],
                                }
                            ]
                        });

                        await interaction.reply({ content: `Ticket aberto em ${channel}!`, ephemeral: true });

                        const FecharTicket = new ButtonBuilder()
                            .setLabel('Fechar Ticket')
                            .setStyle(ButtonStyle.Primary)
                            .setCustomId('fechar-ticket');

                        const embed2 = new EmbedBuilder()
                            .setTitle('Ticket')
                            .setColor("#5865F2")
                            .setDescription('Irei lhe atender o mais breve possível, por favor, aguarde.');

                        const ButtonRowTicket = new ActionRowBuilder().addComponents(FecharTicket);
                        const ReplyTicket = await channel.send({ embeds: [embed2], components: [ButtonRowTicket] });
                        const CollectorTicket = ReplyTicket.createMessageComponentCollector({
                            componentType: ComponentType.Button,
                        });

                        CollectorTicket.on('collect', async (interaction) => {
                            if (interaction.customId === 'fechar-ticket') {
                                await channel.delete();
                            }
                        });
                    } catch (error) {
                        console.error(error);
                        await interaction.reply({ content: 'Ocorreu um erro ao abrir o ticket.', ephemeral: true });
                    }
                }
            });
        } catch (error) {
            console.error(error);
            await message.reply({ content: 'Ocorreu um erro ao iniciar o comando.', ephemeral: true });
        }
    }
}



// nate helped me with this