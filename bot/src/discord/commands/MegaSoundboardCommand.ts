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

    const buttons: DiscordComponent[] = [];
    const includedSounds = ["aussie", "clogg"];
    var soundVariantNames = [];

    for (let i = 0; i < includedSounds.length; i++) {
      var soundVariantNames = soundVariants.get(includedSounds[i]);

      for (let i = 0; i < soundVariantNames.length; i++) {
        console.log(`sound added: ${includedSounds[i]}, ${soundVariantNames[i].toLowerCase()}`);
        buttons.push({
          type: 2,
          style: 1,
          label: soundVariantNames[i],
          custom_id: JSON.stringify({
            name: "play",
            soundName: includedSounds[i],
            soundVariant: soundVariantNames[i].toLowerCase()
          })
        });
      }
    }

    // Object.entries(config.sounds).map((sound: [string, {
    //   name: string,
    //   description: string,
    //   emoji: string | undefined,
    //   variants: {
    //     [key: string]: string
    //   }
    // }]) => {
    //   var soundVariantNames = soundVariants.get(sound[0]) || [];
    //   console.log(`soundVariantNames: ${soundVariantNames}`);
    //
    //   for (let i = 0; i < soundVariantNames.length; i++) {
    //     console.log(`soundVariantNames[i]: ${soundVariantNames[i]}`);
    //     buttons.push({
    //       type: 2,
    //       style: 1,
    //       label: soundVariantNames[i],
    //       custom_id: JSON.stringify({
    //         name: "play",
    //         soundName: sound,
    //         soundVariant: soundVariantNames[i].toLowerCase()
    //       })
    //     });
    //
    //     console.log(`buttons: ${buttons}`);
    //   }
    // }

    // buttons.push({
    //   type: 2,
    //   style: 3,
    //   label: "Random",
    //   custom_id: JSON.stringify({
    //     name: "play",
    //     soundName: sound
    //   })
    // });

    const fullComponents = convertButtonsIntoButtonGrid(buttons);
    return discordCommandResponder.sendBackMessage("Here's the menu for that sound.", true, fullComponents);
  }
}
