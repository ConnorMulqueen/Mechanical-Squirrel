const Discord = require('discord.js');
var fs = require('fs');
const client = new Discord.Client();

client.on('ready', () => {
    console.log('Ready!');
});

client.login('');

client.on('message', message => {

  if(message.content === '#nochanges') {
    getRandomLine('imageLinks.csv', function(returnValue){
      message.channel.send(returnValue);
      return;
    });
  }
});

function getRandomLine(filename,callback){
  fs.readFile(filename, function(err, data){
    if(err) throw err;
    data = data + ''; //converting to string because 'data' is a Location object
    var lines = data.split('\n');

    randomLine = lines[Math.floor(Math.random()*lines.length)];
    callback(randomLine);
 });

}
