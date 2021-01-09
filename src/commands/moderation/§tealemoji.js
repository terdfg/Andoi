const { Util, MessageEmbed } = require("discord.js");
const { parse } = require("twemoji-parser");

module.exports = {
  name: "stealemoji",
  category: "admin",
  usage: "stealemoji <emoji> <custom name>",
  description: "Steal an emoji from a different server",
  botPermissions: ["MANAGE_EMOJIS"],
  memberPermissions: ["MANAGE_EMOJIS"],
  run: async (client, message, args) => {
    const emoji = args[0];
    const name = args.slice(1).join(" ");
    const lang = await message.guild.getLang();
    if (!emoji) {
      return message.channel.send(
        `${client.emotes.error} Please Give Me A Emoji!`
      );
    }

    try {
      if (emoji.startsWith("https://cdn.discordapp.com")) {
        await message.guild.emojis.create(emoji, name || "give_name");

        const embed = new MessageEmbed()
          .setTitle("Emoji Added")
          .setDescription(
            `${client.emotes.succes} Emoji Has Been Added! | Name: ${
              name || "give_name"
            } `
          );
        return message.channel.send(embed);
      }

      const customEmoji = Util.parseEmoji(emoji);

      if (customEmoji.id) {
        const link = `https://cdn.discordapp.com/emojis/${customEmoji.id}.${
          customEmoji.animated ? "gif" : "png"
        }`;

        await message.guild.emojis.create(
          `${link}`,
          `${name || `${customEmoji.name}`}`
        );
        const embed = new MessageEmbed()
          .setTitle("Emoji Added")
          .setDescription(
            `Emoji Has Been Added! | Name: ${
              name || `${customEmoji.name}`
            } | Preview: [Click me](${link})`
          );
        return message.channel.send(embed);
      } else {
        const foundEmoji = parse(emoji, { assetType: "png" });
        if (!foundEmoji[0]) {
          return message.channel.send("Please provide a valid emoji");
        }

        message.channel.send(
          "You Can Use Normal Emoji Without Adding In Server!"
        );
      }
    } catch (e) {
      if (
        String(e).includes(
          "DiscordAPIError: Maximum number of emojis reached (50)"
        )
      ) {
        return message.channel.send(
          "Maximum emoji count reached for this guild!"
        );
      } else {
        return message.channel.send(lang.ERROR);
      }
    }
  },
};
