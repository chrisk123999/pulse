let {SlashCommandBuilder, EmbedBuilder} = require('discord.js');
function createEmbed(data) {
    return new EmbedBuilder()
        .setColor('DarkGreen')
        .setTitle(data.title)
        .setDescription(data.description)
        .setURL(data.link);
}
let embeds = {
    enable: {
        title: 'I can\'t enable the module due to issues in required dependencies!',
        description: 'CPR 1.0.x supports a maximum version of the D&D system of 3.3.1. Some required modules for CPR may no longer support 3.3.1 in their newest versions:\n- D&D System 3.3.1: <https://github.com/foundryvtt/dnd5e/releases/download/release-3.3.1/system.json>\n- Build-A-Bonus 12.1.4: <https://github.com/krbz999/babonus/releases/download/v12.1.4/module.json>\nNot dependencies, but other modules with the same situation:\n- DDB-Importer 5.2.36: <https://github.com/MrPrimate/ddb-importer/releases/download/5.2.36/module.json>\n- Rest Recovery 1.17.1: <https://github.com/roth-michael/FoundryVTT-RestRecovery/releases/download/1.17.1/module.json>\n- Tidy 5e Sheets 5.7.5: <https://github.com/kgar/foundry-vtt-tidy-5e-sheets/releases/download/v5.7.5/module.json>',
        link: 'https://github.com/chrisk123999/chris-premades/wiki/FAQ#i-cant-enable-the-module-due-to-issues-in-required-dependencies'
    },
    journal: {
        title: 'The "CPR - Descriptions" journal is blank!',
        description: 'This is intentional. Features do not come with descriptions in CPR due to copyright. You can manually fill these out and they will be added to items that are created in a macro. This includes features on summon creatures, added features during a spell such as dragon\'s breath, among others.',
        link: 'https://github.com/chrisk123999/chris-premades/wiki/FAQ#the-cpr---descriptions-journal-is-blank'
    },
    vision: {
        title: 'This spell doesn\'t block player vision but it should (Darkness, Fog cloud, etc.)!',
        description: 'Any spells/features with vision restriction work RAW mechanically. These automations are not intended to restrict player\'s vision. CPR automations are intended for RAW mechanics, not player visuals. These spells do have a configuration option to "Use Real Darkness" which will use darkness source light source, which will block vision.',
        link: 'https://github.com/chrisk123999/chris-premades/wiki/FAQ#this-spell-doesnt-block-player-vision-but-it-should-darkness-fog-cloud-etc'
    },
    animation: {
        title: 'This feature/spell should have an animation, but I\'m not seeing it!',
        description: 'Any animations be Eskiemoh typically require JB2A Patreon and Jack Kerouac\'s animated spell effects. The latter must be manually installed with the manifest URL from Chris\'s fork, which is updated for v12: <https://github.com/chrisk123999/animated-spell-effects-cartoon/releases/download/0.4.6/module.json>',
        link: 'https://github.com/chrisk123999/chris-premades/wiki/FAQ#this-featurespell-should-have-an-animation-but-im-not-seeing-it'
    },
    scale: {
        title: 'Bardic Inspiration/Battle Master maneuvers/Arcane Jolt etc. tell me I need to set a scale!',
        description: 'This typically only comes up for non-DDBI users. Scales must be set, according to the feature descriptions, on an actor\'s sheet. Edit the specific class/subclass, on the Advancement tab, click to toggle Configuration Disabled to enable configuration, and manually set up the scale. This must be named exactly.',
        link: 'https://github.com/chrisk123999/chris-premades/wiki/FAQ#bardic-inspirationbattle-master-maneuversarcane-jolt-etc-tell-me-i-need-to-set-a-scale'
    },
    bg3: {
        title: 'How do the BG3 Weapon Actions work?',
        description: 'Once you enable the setting in the Homebrew tab of CPR\'s settings, Re-equip the relevant weapons, the actions will be added to the features tab of the character sheet. The character must be proficient with the weapon.',
        link: 'https://github.com/chrisk123999/chris-premades/wiki/FAQ#how-do-the-bg3-weapon-actions-work'
    },
    summons: {
        title: 'How to use the CPR summons?',
        description: 'Make sure the item on the actor is up to date via the Medkit.\nHave your actor\'s token on the scene and use the feature, it will spawn the token.\nYou can use the "configure" option on the Medkit on the individual item in the actor\'s inventory to set the name/avatar/token for the summon.',
        link: 'https://github.com/chrisk123999/chris-premades/wiki/FAQ#how-to-use-the-cpr-summons'
    },
    customize: {
        title: 'I want to customize a CPR macro!',
        description: 'See <https://discord.com/channels/1089258451949064296/1280039612781432873>',
        link: 'https://github.com/chrisk123999/chris-premades'
    }
}
module.exports = {
    'data': new SlashCommandBuilder()
        .setName('faq')
        .setDescription('Displays FAQ posts.')
        .addSubcommand(subCommand =>
            subCommand
                .setName('customize')
                .setDescription('Links to macro customization FAQ.'))
        .addSubcommand(subCommand =>
            subCommand
                .setName('scale')
                .setDescription('Links to scales FAQ.'))
        .addSubcommand(subCommand =>
            subCommand
                .setName('journal')
                .setDescription('Links to blank journal FAQ.'))
        .addSubcommand(subCommand =>
            subCommand
                .setName('vision')
                .setDescription('Links to player vision FAQ.'))
        .addSubcommand(subCommand =>
            subCommand
                .setName('animation')
                .setDescription('Links to anmation FAQ.'))
        .addSubcommand(subCommand =>
            subCommand
                .setName('bg3')
                .setDescription('Links to Baldur\'s Gate 3 FAQ.'))
        .addSubcommand(subCommand =>
            subCommand
                .setName('enable')
                .setDescription('Links to module cannot be enabled FAQ.')),
    async execute(interaction) {
        let subCommand = interaction.options.getSubcommand();
        let embed = createEmbed(embeds[subCommand]);
        await interaction.reply({'embeds': [embed]});
    },
    'guild': 'cpr'
}