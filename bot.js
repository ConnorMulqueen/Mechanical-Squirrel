const Discord = require('discord.js');
var fs = require('fs');
var schedule = require('node-schedule');
const client = new Discord.Client();

dailyMemeCount = 0
client.on('ready', () => {
    console.log('Ready!');
    client.channels.forEach
});

client.login('');

client.on('message', message => {
  message.content = message.content.toLowerCase();
  switch(message.content) {

    /* Send meme to channel */
    case '#nochanges':
    case '#vanillawowmeme':
    case '#classicwowmeme':
      dailyMemeCount+=1
      console.log()
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
    case '#info':
      message.channel.send(getBotInfo());
      break;

  }
});

function getBotStats() {
  totalMembers = 0;
  client.guilds.forEach(function (guild) {
    if(guild.name != 'Discord Bot List') {
      totalMembers += guild.memberCount;
    }
  });
  return 'Bot is currently deployed to ' + client.guilds.size + ' servers! Totaling ~' + totalMembers + ' Users!';
}

function getRandomLine(filename,callback){
  fs.readFile(filename, function(err, data){
    if(err) throw err;
    data = data + ''; //converting to string because 'data' is a Location object
    var lines = data.split('\n');

    randomLine = lines[Math.floor(Math.random()*lines.length)];
    callback(randomLine);
 });
}

function getBotInfo() {
  return 'DiscordBot page for me can be found here https://discordbots.org/bot/507317733382160424. Made opensource by @ConnorMulqueen on GitHub with ❤️ https://github.com/ConnorMulqueen/DiscordBot-ClassicWoWMemes'
}

/* Message me at 8 o'clock everyday telling me how many memes have been requested */
schedule.scheduleJob({hour: 20, minute: 00}, function(){
  client.channels.get('').send('@Moldy#2075 This bot has been asked for a meme ' + dailyMemeCount + ' times today.')
  dailyMemeCount = 0;
})
