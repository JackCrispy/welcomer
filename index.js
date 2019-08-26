const Discord = require('discord.js');
const client = new Discord.Client;
const timers = require('timers')
const config = require('./data/config.json')
///////////////////////////////////////////////////
const welcome_channel = config.welcome_channel               
const emojiID = config.embed_emoji
const logc = config.logchannel
const activity1 = config.activity1
const type1 = config.type1
const activity2 = config.activity2
const type2 = config.type2
const time1 = config.activitytime
const ownerID = config.ownerID
const customtext = config.customtext
//const etitle = config.embed_title
const guildconfig = config.embed_guildname
const ecolor = config.embed_color
////////////////////////////////////////////////////

//Activites Const
let activities = [
  {
    name:`${activity1}`,
    options:{
      type:`${type1}`
    }
  },
  {
    name:`${activity2}`,
    options:{
      type:`${type2}`
    }
  }
]
let i = 0;
//On Ready
  client.on('ready', () => {
    console.log(`${client.user.username} has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
    timers.setInterval(() => {
      i = i == activities.length ? 0 : i
      client.user.setActivity(activities[i].name, activities[i].options)
      i++
    }, time1)
  });

  //On Message
  client.on("message", async message =>{
  if (message.content === "!add" && message.author.id === "532677204220444682")
  client.emit('guildMemberAdd', message.member);
  if (message.content === "!remove" && message.author.id === "532677204220444682")
  client.emit('guildMemberRemove', message.member);

  if (message.content === "!ping" && message.author.id === `${ownerID}`)
  message.channel.send(`Hoold on!`).then(m => {
    m.edit(
      `:ping_pong: Wew, made it over the ~waves~ ! **Pong!**\nMessage edit time is ` +
        (m.createdTimestamp - message.createdTimestamp) +
        `ms, Discord API heartbeat is ` +
        Math.round(client.ping) +
        `ms.`
       );
    });
 });

  //On MemberAdd
  client.on('guildMemberAdd', member => {
  let count = member.guild.memberCount.toString() 
  let end = count[count.length-1]
  let suffixed = end == 1 ? count + "st" : end == 2 ? count + "nd" : end == 3 ? count + "rd" : count + "th" 
  const channel = member.guild.channels.find(chnl => chnl.name === `${welcome_channel}`);
  const memberavatar = member.user.displayAvatarURL
      if (!channel) {
        console.log("Set channel name in config.");
        return;
      };
      const guildspot = guildconfig || member.guild
      const emojispot = ` ` || `${emojiID}`
 //   let title1 = `${etitle}` || member.guild
      let str = `Welcome to ${guildspot}! **${member.user.username}**! \nYou are the **${suffixed}** member!
      \n${customtext} ${emojispot}`
      const embed = new Discord.RichEmbed()
      .setAuthor(member.user.tag, memberavatar)
      .setColor(ecolor)
  //  .setTitle(`${title1}`)
      .setDescription(str)
      .setThumbnail(memberavatar)
      .setFooter(`📥 ${member.user.username} Joined!`)
      .setTimestamp();
      channel.send(embed);
  
  const logs = member.guild.channels.find(chnl => chnl.name === `${logc}`);
  logs.send(`> :inbox_tray: ${member} has Joined ${member.guild.name}.`)
});

//On MemerRemove
client.on('guildMemberRemove', member => {
  const logs = member.guild.channels.find(chnl => chnl.name === `${logc}`);
  logs.send(`> :outbox_tray: ${member} has left ${member.guild.name}.`)
});

//Log Client In
client.login(config.token)
