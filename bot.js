// Copyright 2020 Danilo Dabović

// Licensed under the Apache License, Version 2.0 (the "License"); 
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

// http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

const Discord = require("discord.js")
const config = require("./botconfig.json")

const bot = new Discord.Client({disableEveryone: true});

let fs = require("fs");

let offensiveWords = fs.readFileSync("./offensive_words.txt").toString().split("\n");
let offensiveWordsFiltered = offensiveWords.map(str => str.replace(/\s/g, ''));

let jokes = fs.readFileSync("./jokes.txt").toString().split("\n");

let botInfoEmbed = new Discord.MessageEmbed();
let authorInfoEmbed = new Discord.MessageEmbed();

botInfoEmbed.setTitle("ServerEssentials Bot Info")
.addField(name = "Automatic chat filtering",value =  "Automatically deletes messages containing swear words and warns the user about it in the DMs.")
.addField(name = "se!clear command",value =  "Deletes the amount of messages you specify (deafult amount is 50 and the specified amount cannot be more than 100).")
.addField(name = "se!rockpaperscissors / se!rps command",value = "Allows users to play rock paper scissors. Example usage: se!rps paper")
.addField(name = "se!8ball / se!8b command",value =  "Allows users to play 8ball. Example usage: se!8ball Will it rain today?")
.addField(name = "se!joke command",value =  "Tells user a joke.")
.addField(name = "se!warn command",value =  "Sends a warning to the user, both in channel and DM. This command requires kick or ban permission from the member executing it. Example usage: se!warn @Bill Spamming.")
.addField(name = "se!kick command",value =  "Used to kick users from the server. Example usage: se!kick @Bill Swearing.")
.addField(name = "se!ban command",value =  "Used to ban users from the server. Example usage: se!ban @Bill Self Promoting.")
.addField(name = "se!unban command",value =  "Used to unban users from the server. You have to provide a user id for the command to work. Example usage: se!unban USER_ID_HERE")
.addField(name = "se!info command",value =  "Displays information about the ServerEssentials bot.")
.addField(name = "se!authorinfo command",value =  "Displays information about the author of the bot as well as bot development contributors.");

authorInfoEmbed.setTitle("Author Information")
.addField(name = "Copyright",value =  "Copyright © 2020 Danilo Dabović, All rights reserved.") // You are not allowed to alter this notice.
.addField(name = "About The Author",value =  "The ServerEssentials Bot was created by Danilo Dabović. Besides making bots, the author also makes video games! For more information visit: https://skullriongames.com") // You are not allowed to alter this notice.
.addField(name = "Contributors",value =  "Special thanks to Im.Lee for contributing to the development of this bot."); // Feel free to add your name here if you contributed in the development of the bot, but do not remove names of other people.

function wait(ms){
    var start = new Date().getTime();
    var end = start;
    while(end < start + ms) {
      end = new Date().getTime();
   }
 }

 console.log("Bot" + " is activating...")

bot.on("ready", async () => {
    console.log(bot.user.username + " is online.")
    bot.user.setActivity("se!info")
  });  

bot.on("message", async message => {
    if(message.author.bot) return;
    if(message.channel.type === "dm") return;

    const commandPrefix = config.prefix;
    let msgArray = message.content.split(" ");
    let cmdArgs = msgArray.slice(1, 2);
    let cmdArgs2 = msgArray.slice(2);
    let cmdArgsNum = parseInt(cmdArgs);
    let command = msgArray[0];
    let msgFiltered = msgArray.map(str => str.replace(/\s/g, ''));
    let words = msgFiltered.length;
    let reasonFor;

    for(i = 0; i <= cmdArgs2.length; i++){
        if(cmdArgs2[i] != undefined){
            if(i > 0){
                reasonFor += cmdArgs2[i] + " ";
            }
            else{
                reasonFor = cmdArgs2[i] + " ";
            }
        }
    }

    if(command === commandPrefix.toString() + "hello"){
        return message.channel.send("Hello" + " " + message.author.toString());
    }

    if(command === commandPrefix.toString() + "info"){
        return message.channel.send(botInfoEmbed);
    }

    if(command === commandPrefix.toString() + "authorinfo"){
        return message.channel.send(authorInfoEmbed);
    }

    if(command === commandPrefix.toString() + "joke"){
        let randJokeIndex = 0;
        randJokeIndex =  Math.floor(Math.random() * 121);
        
        message.channel.send(jokes[randJokeIndex]);
    }

    if (message.content.toLowerCase().startsWith(commandPrefix + "clear")) {
        if(message.member.hasPermission("MANAGE_MESSAGES")){
        async function clearMsg() {    
            if(Number.isInteger(cmdArgsNum) == true && cmdArgsNum <= 100){
                deleteMsgAmount = cmdArgsNum;
            }
            else{    
                deleteMsgAmount = 100;
            }
            message.delete();
            const fetchedMsg = await message.channel.messages.fetch({limit: deleteMsgAmount});
            message.channel.bulkDelete(fetchedMsg);
        }
        clearMsg();
        }
        else{
            message.author.send(message.author.toString() + ", sorry, you do not have the permission to preform this command. Please contact an admin on the server if you think this is a mistake.");
            message.delete();
        }
    }

    if (message.content.toLowerCase().startsWith(commandPrefix + "rockpaperscissors") || message.content.toLowerCase().startsWith(commandPrefix + "rps")) {
        const playOptions = ["rock", "paper", "scissors"];
        let playerMove = cmdArgs;
        let randBotMove = 0;
        let botMove = undefined;
        
        randBotMove =  Math.floor(Math.random() * 4);

        botMove = playOptions[randBotMove];

        if(playerMove == "rock" && botMove == "rock"){
            message.channel.send("Bot chooses rock!");
            message.channel.send("It is a tie! " + message.author.toString());
        }
        else if(playerMove == "rock" && botMove == "paper"){
            message.channel.send("Bot chooses paper!");
            message.channel.send("Bot wins! " + message.author.toString());
        }
        else if(playerMove == "rock" && botMove == "scissors"){
            message.channel.send("Bot chooses scissors!");
            message.channel.send(message.author.toString() + " wins!");
        }

        if(playerMove == "paper" && botMove == "rock"){
            message.channel.send("Bot chooses rock!");
            message.channel.send(message.author.toString() + " wins!");
        }
        else if(playerMove == "paper" && botMove == "paper"){
            message.channel.send("Bot chooses paper!");
            message.channel.send("It is a tie! " + message.author.toString());
        }
        else if(playerMove == "paper" && botMove == "scissors"){
            message.channel.send("Bot chooses scissors!");
            message.channel.send("Bot wins! " + message.author.toString());
        }

        if(playerMove == "scissors" && botMove == "rock"){
            message.channel.send("Bot chooses rock!");
            message.channel.send("Bot wins! " + message.author.toString());
        }
        else if(playerMove == "scissors" && botMove == "paper"){
            message.channel.send("Bot chooses paper!");
            message.channel.send(message.author.toString() + " wins!");
        }
        else if(playerMove == "scissors" && botMove == "scissors"){
            message.channel.send("Bot chooses scissors!");
            message.channel.send("It is a tie! " + message.author.toString());
        }
    }

    if (message.content.toLowerCase().startsWith(commandPrefix + "warn")) {  
        if(message.member.hasPermission("BAN_MEMBERS") || message.member.hasPermission("KICK_MEMBERS")){
            let memberToWarn = message.mentions.members.first();
            let memberWarning = message.author.toString();
            let serverOnWhichWarned = message.guild.toString();

            const warnInfoEmbed = new Discord.MessageEmbed()
            .setTitle("Warning Info")
            .addField(name = "Warned user:",value =  memberToWarn)
            .addField(name = "Warned by:",value =  memberWarning)
            .addField(name = "Warned for:",value = reasonFor);

            memberToWarn.send("You have been warned by staff member " + memberWarning + " on server " + serverOnWhichWarned + "." + " Reason for warning: " + reasonFor);
            message.channel.send(warnInfoEmbed);
        }
        else{
            message.author.send(message.author.toString() + ", sorry, you do not have the permission to preform this command. Please contact an admin on the server if you think this is a mistake.");
            message.delete();
        }
    }

    if (message.content.toLowerCase().startsWith(commandPrefix + "kick")) {  
        if(message.member.hasPermission("KICK_MEMBERS")){
            let memberToKick = message.mentions.members.first();
            let memberKicking = message.author.toString();
            let serverOnWhichKicked = message.guild.toString();

            memberToKick.send("You have been kicked by staff member " + memberKicking + " on server " + serverOnWhichKicked + "." + " Reason for kick: " + reasonFor);

            
            const kickInfoEmbed = new Discord.MessageEmbed()
            .setTitle("Kick Info")
            .addField(name = "Kicked user:",value =  memberToKick)
            .addField(name = "Kicked by:",value =  memberKicking)
            .addField(name = "Kicked for:",value = reasonFor);

            message.channel.send(kickInfoEmbed);

            wait(1500);

            memberToKick.kick(reasonFor);
        }
        else{
            message.author.send(message.author.toString() + ", sorry, you do not have the permission to preform this command. Please contact an admin on the server if you think this is a mistake.");
            message.delete();
        }
    }

    if (message.content.toLowerCase().startsWith(commandPrefix + "ban")) {  
        if(message.member.hasPermission("BAN_MEMBERS")){
            let memberToBan = message.mentions.members.first();
            let memberBanning = message.author.toString();
            let serverOnWhichBanned = message.guild.toString();

            memberToBan.send("You have been banned by staff member " + memberBanning + " on server " + serverOnWhichBanned + "." + " Reason for ban: " + reasonFor);

            
            const banInfoEmbed = new Discord.MessageEmbed()
            .setTitle("Ban Info")
            .addField(name = "Banned user:",value =  memberToBan)
            .addField(name = "Banned by:",value =  memberBanning)
            .addField(name = "Banned for:",value = reasonFor);

            message.channel.send(banInfoEmbed);

            wait(1500);

            memberToBan.ban(reasonFor);
        }
        else{
            message.author.send(message.author.toString() + ", sorry, you do not have the permission to preform this command. Please contact an admin on the server if you think this is a mistake.");
            message.delete();
        }
    }

    if (message.content.toLowerCase().startsWith(commandPrefix + "unban")) {  
        if(message.member.hasPermission("BAN_MEMBERS")){
            let memberToUnBan = cmdArgs[0];
            let memberUnBanning = message.author.toString();

            message.guild.fetchBans();

            const unBanInfoEmbed = new Discord.MessageEmbed()
            .setTitle("Unban Info")
            .addField(name = "Unbanned user id:",value =  memberToUnBan)
            .addField(name = "Unbanned by:",value =  memberUnBanning)

            try{
                message.guild.members.unban(memberToUnBan);
                message.channel.send(unBanInfoEmbed);
            } catch(errorName) {
                console.log(errorName);
            }

        }
        else{
            message.author.send(message.author.toString() + ", sorry, you do not have the permission to preform this command. Please contact an admin on the server if you think this is a mistake.");
            message.delete();
        }
    }

    for(i = 0; i <= words; i++){
        if(offensiveWordsFiltered.indexOf(msgFiltered[i]) != -1){
            message.delete();
            message.author.send(message.author.toString()+", please do not swear.");
        }
    }

 });  
 
bot.login(config.token)
