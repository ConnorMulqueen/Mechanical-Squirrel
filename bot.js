const Discord = require('discord.js');
const client = new Discord.Client();
const credentials = require('./credentials.js');
const fs = require('fs');
const schedule = require('node-schedule');
const DBL = require("dblapi.js");
const dbl = new DBL(credentials.discordbots_api_token, client);

var dailyMemeCount = 0;

client.on('ready', () => {
    console.log('Ready!');
    client.user.setActivity('Type \'#help\' for info');

    //Post stats to discordbots.org api
    dbl.postStats(client.guilds.size, null, null);
});

client.login(credentials.bot_token);

client.on('message', message => {
  message.content = message.content.toLowerCase();
  switch(message.content) {

    /* Send meme to channel */
    case '#nochanges':
    case '#meme':
      dailyMemeCount+=1
      getRandomLine('imageLinks.csv', function(returnValue){
        message.channel.send(returnValue);
        return;
      });
      break;

    /* Send stats to channel */
    case '#stats':
      message.channel.send(getBotStats());
      break;

    /* Send bot info to channel */
    case '#help':
      message.channel.send(getBotHelp());
      break;
  }
});

/**
  * Gets bot statistics (amount of servers added to, and total users)
  * @path - '#stats'
  * @return {String}
  */
function getBotStats() {
  totalMembers = 0;
  client.guilds.forEach(function (guild) {
    if(guild.name != 'Discord Bot List') {
      totalMembers += guild.memberCount;
    }
  });
  return 'Bot is currently deployed to ' + client.guilds.size + ' servers! Totaling ~' + totalMembers + ' Users!';
}

/**
  * Grabs random line from imageLinks.csv to
  * display a meme
  * @path - '#nochanges or #meme'
  * @return {String}
  */
function getRandomLine(filename,callback){
  fs.readFile(filename, function(err, data){
    if(err) throw err;
    data = data + ''; //converting to string because 'data' is a Location object
    let lines = data.split('\n');

    randomLine = lines[Math.floor(Math.random()*lines.length)];
    callback(randomLine);
 });
}

/**
  * Returns Bot Information String
  * @path - '#help'
  * @return {String}
  */
function getBotHelp() {
  return `
  \`\`\`css
  # Mechanical Squirrel (World of Warcraft: Classic Memes)
  ## COMMANDS
  --------
  #nochanges or #meme : Sends back a wow classic meme from /r/classicwow
  #stats : Gives bot statistics
  #help : Gives bot information

  ## INFORMATION
  --------
  DiscordBots page for me can be found - https://discordbots.org/bot/507317733382160424
  Made open source on GitHub with ❤️ - https://github.com/ConnorMulqueen/DiscordBot-ClassicWoWMemes
  Request new features here - https://github.com/ConnorMulqueen/DiscordBot-ClassicWoWMemes/issues
  Donations appreciated! - https://donatebot.io/checkout/582638321378000897\`\`\``
}

/**
  * Write to the stats.csv file in the format
  * 'DATE, Meme Count, Server count'
  */
function writeToStatsCsv() {
  fs.appendFile('stats.csv', new Date().toString() +','+ dailyMemeCount.toString() +','+ client.guilds.size + '\n', (err) => {
    if(err) throw err;
  });
}

/**
  * Message me at 8PM everyday with a dailyMemeCount
  */
schedule.scheduleJob({hour: 20, minute: 00}, function(){
  writeToStatsCsv();
  dbl.postStats(client.guilds.size, client.shards.Id, client.shards.total);
  client.channels.get(credentials.my_private_channel_id).send('<@'+credentials.my_private_user_id+ '> This bot has been asked for a meme ' + dailyMemeCount + ' times today.');
  dailyMemeCount = 0;
})
