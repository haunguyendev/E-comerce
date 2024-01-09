'use strict';

const { Client, GatewayIntentBits } = require('discord.js')

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent
    ]
})

client.on('ready', () => {
    console.log(`Logged is as ${client.user.tag}`)
})
const token = 'MTE5NDMwNDYyNTU1ODQzNzkwOA.Gy3zMx.rAO8Ky5zE_8CKSpqXanW-sNgxsIUFO8d8XCFss'
client.login(token)

client.on('messageCreate', msg => {
    if (msg.author.bot) return;
    if (msg.content === 'hello')
        msg.reply(`Hello! How can i assists you to day!`)
})
