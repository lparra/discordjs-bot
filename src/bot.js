// https://discord.js.org/#/
const discord = require('discord.js');
const { get } = require('http');
const client = new discord.Client();
const path = require('path');
const filePath = path.join(__dirname, '../config.json');
const config = require(filePath);
const fetch = require('node-fetch');


client.on('ready', () => {
  console.log(`Bot has started, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds.`);
  client.user.setActivity(`Serving ${client.guilds.cache.size} servers`);
});

client.on('message', async message => {
  if(message.author.bot) return;
  if(!message.content.startsWith(config.prefix)) return;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  
  
  if(command === 'ping') {
    const m = await message.channel.send("Ping?");
    m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`);
  }
  

  if(command === 'purge') {
    const deleteCount = parseInt(args[0], 10);
    
    if(!deleteCount || deleteCount < 2 || deleteCount > 100)
      return message.reply('Please provide a number between 2 and 100 for the number of messages to delete');
    
    const fetched = await message.channel.messages.fetch({limit: deleteCount});
    message.channel.bulkDelete(fetched)
      .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
  }

  if(command === 'joke') {
    const getJoke = async () => {
      const result = await fetch('https://official-joke-api.appspot.com/random_joke')
      const json = await result.json()
      return json
    }
    const joke = await getJoke()
    message.channel.send(`${joke.setup}... ${joke.punchline}`)
  }
});

client.login(config.token);