import fs from 'fs';
import download from 'download';
import {extractPack} from '@foundryvtt/foundryvtt-cli';
let cprLink = 'https://github.com/chrisk123999/chris-premades/releases/latest/download/module.zip';
let miscLink = 'https://github.com/txm3278/midi-item-showcase-community/releases/latest/download/module.zip';
let gpsLink = 'https://github.com/gambit07/gambits-premades/releases/latest/download/module.zip';
let data = {'items': []};
let ignoredFolders = [
    'cpr-class-feature-items',
    'cpr-feat-features',
    'cpr-homebrew-feature-items',
    'cpr-item-features',
    'cpr-monster-features',
    'cpr-monster-feature-items',
    'cpr-race-feature-items',
    'cpr-spell-features',
    'cpr-summon-features',
    'cpr-summons',
    'gps-actors',
    'gps-monster-features',
    'misc-actors',
    'misc-class-features-items',
    'misc-macros',
    'misc-spell-items',
    'misc-monster-features'
];
export async function updateItems() {
    console.log('Updating CPR, GPR, and MISC automations...');
    try {
        fs.rmSync('./files', {'recursive': true, 'force': true});
        await Promise.all([cprLink, miscLink, gpsLink].map(url => download(url, './files', {'extract': true})));
        let packFolders = fs.readdirSync('./files/packs').filter(i => !ignoredFolders.includes(i));
        await Promise.all(packFolders.map(async folder => await extractPack('./files/packs/' + folder, './packItems/' + folder)));
        packFolders.forEach(folder => {
            let files = fs.readdirSync('./packItems/' + folder);
            files.forEach(file => {
                let item = JSON.parse(fs.readFileSync('./packItems/' + folder + '/' + file, 'utf8').toString());
                if (item._key.substring(0,8) === '!folders') return;
                let itemData = {
                    'name': item.name,
                    'source': folder
                };
                data.items.push(itemData);
            });
        });
        let json = JSON.stringify(data);
        fs.rmSync('items.json', {'force': true});
        fs.writeFileSync('items.json', json, 'utf8');
        console.log('There are ' + data.items.length + ' CPR, GPR, & MISC items!');
    } catch (error) {
        console.error(error);
    }
    console.log('Update Complete!')
}
updateItems();
