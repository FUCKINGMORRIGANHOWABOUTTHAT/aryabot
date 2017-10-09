var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');

var reports = [];
var tempChannelId;
var sayChannelId = "323838418758926336";
var prefix = "arya!";

var admin = ["252779503976316928"];

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
var bot = new Discord.Client({
    token: auth.token,
    autorun: true,
    autoReconnect:true
});

bot.on('ready', function () {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
    bot.setPresence({ status: 'online', game: { name: 'try '+prefix+'help'} });
});
bot.on('disconnect', function () {
    logger.info('WARNING | Disconnected');
});


// bot.on("messageDelete", function(msg) {
//     console.log(msg);
// });

bot.on('messageDelete', function(message) {
    console.log("this message was deleted: " + message.content);
});

//"323838418758926336"

bot.on('guildMemberAdd', function(member) {
    bot.sendMessage({
    to: tempChannelId,
    message: ':heart: | Welcome to the server, <@' + member.id + ">"
});
});

bot.on('guildMemberRemove', function(member) {
    bot.sendMessage({
    to: tempChannelId,
    message: ':broken_heart: | Sad to see you go, <@' + member.id + ">"
});
});

function getGetOrdinal(n) {
    var s=["th","st","nd","rd"],
        v=n%100;
    return n+(s[(v-20)%10]||s[v]||s[0]);
}

var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'Augustus', 'September', 'October', 'November', 'December'];

bot.on('message', function (user, userID, channelID, message, evt) {
    if (message.substring(0, prefix.length) == prefix) {
        var args = message.substring(prefix.length).split(' ');
        var cmd = args[0];

        args = args.splice(1);
        switch(cmd) {
            case 'ping':
                var d = new Date();
                bot.sendMessage({
                    to: channelID,
                    message: ':ping_pong: | Pong!' // Your ping is `' + ` ${evt.d.timestamp.substring(20, 23) - d.getMilliseconds()}` + ' ms`'//
                });
                break;
                //region Date related stuff
            case 'date':
                var d = new Date();
                bot.sendMessage({
                    to: channelID,
                    message: ":calendar_spiral: | **The date of today is the " + getGetOrdinal(d.getDate()) + " of " + months[d.getMonth()] + "!**"
                });
                break;
            case 'time':
                var d = new Date();
                if(d.getMinutes() < 10){
                    var string = ":clock12: | **The current time is " + d.getHours() + ":0" + d.getMinutes() + ""
                } else {
                    var string = "" +
                        ":clock12: | **The current time is " + d.getHours() + ":" + d.getMinutes() + ""
                }

                if(d.getHours()<12){
                    if(d.getMinutes() < 10)
                        var string2 = " \`" + d.getHours() + ":0" + d.getMinutes() + "AM\`";
                    else
                        var string2 = " \`" + d.getHours() + ":" + d.getMinutes() + "AM\`";
                } else {
                    if(d.getMinutes() < 10)
                        var string2 = " \`" + (d.getHours() - 12) + ":0" + d.getMinutes() + "PM\`";
                    else
                        var string2 = " \`" + (d.getHours() - 12) + ":" + d.getMinutes() + "PM\`";
                }
                bot.sendMessage({
                    to: channelID,
                    message: string + "**" + string2
                });
                break;
                //endregion
            case 'help':
                bot.sendMessage({
                    to: channelID,
                    message:
                        "```arya!time:    Displays time \n" +
                        "arya!date:    Displays date \n" +
                        "arya!ping:    Pong!\n" +
                        "arya!avatar:  Gets your avatar, or the one of the people you mentioned\n" +
                        "arya!report:  arya!report [name]#[hash] reason: [reason] \n" +
                        "arya!rollDie: Rolls a specified dice, such as the D20\n" +
                        "arya!embed:   Embeds a message, if sufficient rights to do so\n```"
            //embed{color: 3447003,description:}
                });
                break;
                //region user utilities
            case 'rollDie':
                var dice = message.substring(8 + prefix.length).toLowerCase();
                var patt = new RegExp('[d][0-9]{1,}');
                if(patt.test(dice)) {
                    bot.sendMessage({
                        to: channelID,
                        message: "<@" + evt.d.author.id + "> rolled a " + (Math.floor(Math.random() * (dice.substring(1) - 1 + 1)) + 1)
                    });
                } else {
                    bot.sendMessage({
                        to: channelID,
                        message: ":game_die: | Usage is command + D[number]"
                    });
                }
                break;
            case 'avatar':
                logger.info(user + " used arya!avatar");
                if(evt.d.mentions == "") {
                    bot.sendMessage({
                        to: channelID,
                        message: "https://cdn.discordapp.com/avatars/" + userID + "/" + evt.d.author.avatar + "?size=2048"
                    })
                } else {
                    if (evt.d.mentions.length > 1) {
                        for (i = 0; i < evt.d.mentions.length; i++) {
                            bot.sendMessage({
                                to: channelID,
                                message: "https://cdn.discordapp.com/avatars/" + evt.d.mentions[i].id + "/" + evt.d.mentions[i].avatar + "?size=2048"
                            });
                        }
                    } else if (evt.d.mentions.length == 1){
                        bot.sendMessage({
                            to: channelID,
                            message: "https://cdn.discordapp.com/avatars/" + evt.d.mentions[0].id + "/" + evt.d.mentions[0].avatar + "?size=2048"
                        })
                    }
                }
                break;
            case 'embed':
                bot.sendMessage({
                    to: channelID,
                    embed: {
                        color: 3447003,
                        description: message.substring(6 + prefix.length)
                    }
                });
                break;
            case 'boot':
                // var bootToBoot = (Math.floor(Math.random() * (5 - 1 + 1)) + 1);
                // switch (bootToBoot) {
                //     case 1:
                //         var string = ""//Artemis: Hey, I don't want no boot to the head.
                //     //Artemis: to dear Artemis, who has never worked a day in his drunken life --
                //     //Artemis: I'm covering up my head!
                //     //Artemis: -- I leave my wine cellar and three crates of my finest whiskey.
                //         //Artemis: Really?
                //         //Artemis: And a boot on the head
                //     //Artemis threw a :boot: at Artemis's head
                // }
                bot.sendMessage({
                    to: channelID,
                    message: evt.d.author.username + " threw a :boot: at " + evt.d.mentions[0].username + "'s head!"
                });
                break;
                //endregion
                //region reporting
            case 'report':
                for(i = 0; i < admin.length; i++) {
                    bot.sendMessage({
                        to: admin[i],
                        message: "User " + evt.d.author.username + "#" + evt.d.author.discriminator + " reported " + message.substring(7+prefix.length, (message.search("#") + 5)) + ", for reason: " + message.substring((message.search("reason:") + 7))
                    });
                }
                break;

                //endregion
                //region administration
            case 'registerAdmin':
                for(i = 0; i < admin.length; i++) {
                    if (evt.d.author.id == admin[i]) {
                        admin[admin.length] = message.substring(14 + prefix.length);
                        bot.sendMessage({
                            to: channelID,
                            message: "Registered <@" + message.substring(14 + prefix.length) + "> as admin"
                        });
                    }
                }
                break;
            case "registerWelcomeChannel":
                for(i = 0; i < admin.length; i++) {
                    if (evt.d.author.id == admin[i]) {
                        tempChannelId = message.substring(23 + prefix.length);
                        bot.sendMessage({
                            to: channelID,
                            message: "<#" + tempChannelId + "> is now the welcome channel"
                        });
                    }
                }
                break;
                //endregion

            case "nyaxi":
                bot.sendMessage({
                    to: channelID,
                    message: "One very large :coffee: for <@275894789206048768>!"
                });
                break;
            case "debug":

                bot.sendMessage({
                    to: channelID,
                    message: "'event': \n" + JSON.stringify(evt)
                });

                break;

            case "say":
                bot.sendMessage({
                    to: sayChannelId,
                    message: message.substring(3 + prefix.length)
                });
                break;
        }
    }
});
//#bot-spam = 326628660369162240