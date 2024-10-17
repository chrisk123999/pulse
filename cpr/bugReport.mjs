import {EmbedBuilder} from 'discord.js';
export let cprBugReportEmbed = new EmbedBuilder()
    .setColor('DarkGreen')
    .setTitle('Required Information Needed')
    .setDescription(`This is **not** a troubleshooting thread, please seek assistance in #support before making a bug report. 
    > - Provide** exact steps** to reproduce the bug, describe what behavior you expect, and what behavior you're getting.
    > - Include your **CPR troubleshooter log**, from the module settings under the Help button.
    > - Include full screenshots of any errors (red text) in console (f12).

    If you do not follow these post guidelines, you will likely be redirected to #support and your post will be closed.`);
