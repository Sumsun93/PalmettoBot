const fs = require("fs");
const express = require("express");
const app = express();
const Discord = require('discord.js');
const config = require('./config.json');

const client = new Discord.Client({
  fetchAllMembers: true,
});

client.on('ready', async () => {
  console.log('Connecté au Discord!');
});

// 671507172705960004
// 712258479544598560

client.on('message', async msg => {
  if (msg.content[0] !== "/" || !msg.member.roles.cache.some(elmt => elmt.id === config.adminId)) {
    return;
  }

  let commands = JSON.parse(fs.readFileSync("commands.json"));

  if(msg.content.includes('/create')) {
    const args = msg.content.split('"');

    if (args.length <= 1) {
      msg.reply('Arguments manquants -> /create "test" "ceci est une commande de test"');
      return;
    }

    const commandName = args[1].trim();
    const commandContent = args[3].trim();

    if (!commandName || ! commandContent) {
      msg.reply('Arguments manquants -> /create "test" "ceci est une commande de test"');
      return;
    }

    msg.delete();

    if (commands.find(elmt => elmt.name.toLowerCase() === commandName.toLowerCase())) {
      msg.reply(`La commande /${commandName} existe déjà`);
      return;
    }

    commands.push({ name: commandName, content: commandContent });

    fs.writeFileSync("commands.json", JSON.stringify(commands));
    msg.reply("Commande ajoutée.");
  }
  else if(msg.content.includes('/delete')) {
    const args = msg.content.split('"');

    if (args.length <= 1) {
      msg.reply('Arguments manquants -> /create "test" "ceci est une commande de test"');
      return;
    }

    const commandName = args[1].trim();

    msg.delete();

    if (!commands.find(elmt => elmt.name.toLowerCase() === commandName.toLowerCase())) {
      msg.reply("Cette commande n'existe pas.");
      return;
    }

    commands = commands.filter(elmt => elmt.name.toLowerCase() !== commandName.toLocaleLowerCase());
    fs.writeFileSync("commands.json", JSON.stringify(commands));
    msg.reply("Commande supprimée.");
  }
  else if(commands.some(elmt => msg.content.includes(`/${elmt.name}`))) {
    const command = commands.find(elmt => msg.content.includes(`/${elmt.name}`));

    const channel = client.channels.cache.find(elmt => elmt.name === msg.channel.name);
    channel.send(command.content);
  }
});

client.login(config.botDiscordToken);

app.listen(80);