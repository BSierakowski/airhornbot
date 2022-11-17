import {DiscordCommand} from "../DiscordCommand";
import {Client} from "discord.js-light";
import {config} from "../../utils/Configuration";
import {configSecrets} from "../../utils/ConfigurationSecrets";
import {
  CommandInteraction,
  convertButtonsIntoButtonGrid,
  DiscordCommandResponder, DiscordComponent,
  InteractionCommandOption
} from "../DiscordInteraction";
import {soundVariants} from "../../utils/AirhornAudio";

export class MegaSoundboardCommand extends DiscordCommand {

  constructor() {
    super("megasoundboard");
  }

  async executeInteraction(client: Client, interaction: CommandInteraction, discordCommandResponder: DiscordCommandResponder): Promise<void> {
    // Make sure they are in a guild
    if (!interaction.member || !interaction.guild_id) {
      return discordCommandResponder.sendBackMessage("You can't trigger the bot in a direct message.", false);
    }
    if (!client.guilds.cache.has(interaction.guild_id)) {
      return discordCommandResponder.sendBackMessage("The bot must be in the guild too.", false);
    }
    // Get the guild for the command
    const guild = await client.guilds.fetch(interaction.guild_id);
    // Get the member from the command
    const guildMember = await guild.members.fetch(interaction.member.user.id);
    if (!guildMember) {
      return discordCommandResponder.sendBackMessage("You were not found in the guild.", false);
    }
    const botGuildMember = await guild.members.fetch(configSecrets.discord.botId);
    if (!botGuildMember) {
      return discordCommandResponder.sendBackMessage("The bot was not found in the guild.", false);
    }
    // Run the command
    // let sound: "string | undefined;"
    // if (interaction.data.options) {
    //   interaction.data.options.forEach((option: InteractionCommandOption) => {
    //     if (option.name === "sound") {
    //       sound = String(option.value).toLowerCase();
    //     }
    //   });
    // }
    // if (!sound || !soundVariants.has(sound)) {
    //   return discordCommandResponder.sendBackMessage("The sound specified was not found.", false);
    // }

    var sound = "aussie"
    const buttons: DiscordComponent[] = [];
    const soundVariantNames = soundVariants.get(sound) || [];
    const soundEntries = config.sounds.keys;
    // Object.entries(config.sounds).map((sound: [string, {
    //   name: string,
    //   description: string,
    //   emoji: string | undefined,
    //   variants: {
    //     [key: string]: string
    //   }
    // }]) => {
    //   return {
    //     name: sound[0],
    //     description: sound[1].name + ": " + sound[1].description,
    //     options: [
    //       {
    //         name: "variant",
    //         description: "Spice it up with some different sounds!",
    //         required: false,
    //         type: 3,
    //         choices: Object.entries(sound[1].variants).map((soundVariant: [string, string]) => {
    //           return {
    //             name: soundVariant[0],
    //             value: soundVariant[0].toLowerCase()
    //           };
    //         })
    //       }
    //     ]
    //   };
    // });


    console.log(`soundVariantNames: ${soundVariantNames},  ${soundVariantNames.length}`);
    console.log(`soundEntries: ${soundEntries}`);
    for (let i = 0; i < soundVariantNames.length; i++) {
      console.log(soundVariantNames[i]);
      buttons.push({
        type: 2,
        style: 1,
        label: soundVariantNames[i],
        custom_id: JSON.stringify({
          name: "play",
          soundName: sound,
          soundVariant: soundVariantNames[i].toLowerCase()
        })
      });
    }
    buttons.push({
      type: 2,
      style: 3,
      label: "Random",
      custom_id: JSON.stringify({
        name: "play",
        soundName: sound
      })
    });
    const fullComponents = convertButtonsIntoButtonGrid(buttons);
    return discordCommandResponder.sendBackMessage("Here's the menu for that sound.", true, fullComponents);
  }
}
