let {SlashCommandBuilder, EmbedBuilder} = require('discord.js');
function createEmbed(data) {
    return new EmbedBuilder()
        .setColor('DarkGreen')
        .setTitle(data.title)
        .setDescription(data.description);
}
let embeds = {
    'customize': {
        'title': 'I want to customize an item/spell/feature/macro from this module:',
        'description': `Find the matching macro from here: <https://github.com/chrisk123999/chris-premades/tree/master/scripts/macros>, copy it into an item macro, and delete the imports and exports section at the top (if there is any).  Then replace \`chris\` with \`chrisPremades.helpers\`, \`queue\` with \`chrisPremades.queue\`, \`tashaSummon\` with \`chrisPremades.tashaSummon\`, \`tokenMove\` with \`chrisPremades.tokenMove\`, \`constants\` with \`chrisPremades.constants\`, \`translate\` with \`chrisPremades.translate\`, \`effectAuras\` with \`chrisPremades.effectAuras\`, and \`summons\` with \`chrisPremades.summons\`. This is not a conclusive list, some macros may need more adjusting.`
    },
    'mergecards': {
        'title': 'My chat cards don\'t match the damage dealt / hex does not display correctly:',
        'description': 'Turn on merged cards in your midi-qol settings.'
    },
    'modifiers': {
        'title': 'The Tasha summons have weird attack rolls modifiers:',
        'description': 'Foundry does not a way to handle flat attack rolls that aren\'t based on the actor abilities.  Instead the difference is added (or removed) to account for the difference between the computed attack roll and what your spell attack actually is.'
    },
    'scale': {
        'title': 'Bardic Inspiration/Battle Master maneuvers/Arcane Jolt etc. give errors about dice not being set:',
        'description': `This typically only comes up for non-DDBI users. Scales must be set, according to the feature descriptions, on an actor\'s sheet. Edit the specific class/subclass, on the Advancement tab, click to toggle Configuration Disabled to enable configuration, and manually set up the scale. This must be named exactly.
        **CPR version 0.9.32 added a feature to add these scales. Use the medkit on the relevant class or subclass item, not the feature. This will add the scale automatically.**`
    },
    'journal': {
        'title': 'The "CPR - Descriptions" journal is blank:',
        'description': 'This is intentional. Features do not come with descriptions in CPR due to copyright. You can manually fill these out and they will be added to warpgate mutations and items that are created in a macro. This includes features on summon creatures, and added features during a spell such as "Dragon\'s Breath."'
    },
    'vision': {
        'title': 'This spell doesn\'t block player vision but it should (Darkness, Fog cloud, etc.)',
        'description': `Any spells/features with vision restriction work RAW mechanically. These automations are not intended to restrict player's vision. **CPR automations are intended for RAW mechanics, not player visuals.**
        These spells now have compatibility with Limits and Walled Templates which provide player visuals as commonly expected.`
    },
    'animation': {
        'title': 'This feature/spell should have an animation, but I\'m not seeing it',
        'description': `Any animations be Eskiemoh typically require JB2A Patreon and Jack Kerouac's animated spell effects. The latter must be manually installed with the manifest URL;
        <https://github.com/jackkerouac/animated-spell-effects-cartoon/releases/download/latest/module.json>`
    },
    'bg3': {
        'title': 'How do the BG3 Weapon Actions work?',
        'description': 'Once you enable the setting in the **Homebrew** tab of CPR\'s settings, **Re-equip the relevant weapons**, the actions will be added to the features tab of the character sheet. The character must be proficient with the weapon.'
    },
    'colors': {
        'title': 'What do the icon colors on the item title bar mean?',
        'description': `**Medkit:**
        - Red: Out of date CPR automation.
        - Yellow: An automation is available from CPR, GPR, or MISC.
        - Green: Up to date CPR automation.
        - Blue: Up to date CPR automation and the item can be configured.
        - Orange: Out of date GPR or MISC automation.
        - Purple: Up to date GPR or MISC automation.
        - Pink: Item automation has been added from an additional compendium  (Not CPR, GRP, or MISC).
        **Automated Animations:**
        - Red: Disabled, Customized, and no automatic recognition was found.
        - Green: Enabled, Customized, and no automatic recognition was found.
        - Blue: Enabled, Customized, and an automatic recognition was found.
        - Purple: Enabled, Not Customized, and an automatic recognition was found.
        - Yellow: Disabled and an automatic recognition was found.
        - Orange: Enabled and no automatic recognition was found.
        **Build a Bonus:**
        - Green: A Build a Bonus is present on the item.
        - Blue: A Build a Bonus is present on an effect of the item.
        - Purple: A Build a Bonus is present on the item and on an effect of the item.
        **DAE:**
        - Blue: An effect is present on a passive effect.
        - Green: An effect is present on an active effect.
        - Purple: An effect is present on an active and passive effect.
        **Template Macro:**
        - Green: A script is present on the item.`
    },
    'item': {
        'title': 'Why did the Item medkit disappear? I didn\'t update the system.',
        'description': 'You may have updated Item Macro, the newest version is system version is 3.0+ only and is incompatible with 2.4.1 and CPR, and is not version locked. Either downgrade to the last 2.4.1 version, or delete it. You don\'t need it anyway now (use the DIME editor instead of ItemMacro).'
    },
    'actor': {
        'title': 'Why did the Actor medkit disappear? I didn\'t update the system.',
        'description': 'You may have updated D&DBeyond Importer, the newest version is system version is 3.0+ only and is incompatible with 2.4.1 and is not version locked. Downgrade your version.'
    },
    'enabled': {
        'title': 'I updated to 3.0.4 D&D and can\'t enable the module:',
        'description': `You have other dependencies that are out of date. Current minimum versions:
        **Midi-QOL**: 11.4.1
        **DFred's Convenient Effects**: 6.0.3
        **Warpgate**: 1.19.2
        **Effect Macro**: 11.2.1
        **Template Macro**: 11.0.1
        **Sequencer**: 3.1.4
        **Token Attacher**: v4.5.15
        **Build-A-Bonus**: 11.8.0
        **Socketlib**: 1.0.13
        **Dynamic Active Effects**: 11.3.0.5
        **Automated Animations**: 4.2.71
        **Times Up**: 11.3.1
        **NOTE**: JB2A modules are coded as optional because there are two options, however you need either the free or patreon version enabled for Automated Animations, and therefore this module, to function properly.`
    },
    '241': {
        'title': 'CPR updated to the 3.0 version, but I\'m still on 2.4.1. What version do I need of CPR?',
        'description': `<https://github.com/chrisk123999/chris-premades/releases/download/0.9.64/module.json>
        You can paste this link in the Install Module window in the Manifest URL text box at the bottom. You should then lock the module version.`
    },
    'video': {
        'title': 'I looked at the FAQ about editing the macros, but I could use more help, is there a more thorough guide?',
        'description': 'See: https://discord.com/channels/1089258451949064296/1219203650363068426'
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
                .setName('mergecards')
                .setDescription('Links to merge card FAQ.'))
        .addSubcommand(subCommand =>
            subCommand
                .setName('modifiers')
                .setDescription('Links to Tasha modifierse FAQ link'))
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
                .setName('colors')
                .setDescription('Links to colors FAQ.'))
        .addSubcommand(subCommand =>
            subCommand
                .setName('item')
                .setDescription('Links to item medkit FAQ.'))
        .addSubcommand(subCommand =>
            subCommand
                .setName('actor')
                .setDescription('Links to actor medkit FAQ.'))
        .addSubcommand(subCommand =>
            subCommand
                .setName('enabled')
                .setDescription('Links to module cannot be enabled FAQ.'))
        .addSubcommand(subCommand =>
            subCommand
                .setName('241')
                .setDescription('Links to D&D 2.4.1 FAQ.'))
        .addSubcommand(subCommand =>
            subCommand
                .setName('video')
                .setDescription('Links to macro video FAQ.')),
        async execute(interaction) {
            let subCommand = interaction.options.getSubcommand();
            let embed = createEmbed(embeds[subCommand]);
            await interaction.reply({'embeds': [embed]});
    }
}