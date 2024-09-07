import fs from 'fs';
import download from 'download';
import {extractPack} from '@foundryvtt/foundryvtt-cli';
let data = {'items': []};
let modules = [
    {
        folder: 'cpr',
        url: 'https://github.com/chrisk123999/chris-premades/releases/latest/download/module.zip',
        ignored: [
            'cpr-class-feature-items',
            'cpr-feat-features',
            'cpr-homebrew-feature-items',
            'cpr-item-features',
            'cpr-monster-features',
            'cpr-monster-feature-items',
            'cpr-race-feature-items',
            'cpr-spell-features',
            'cpr-summon-features',
            'cpr-summons'
        ]
    },
    {
        folder: 'gps',
        url: 'https://github.com/gambit07/gambits-premades/releases/latest/download/module.zip',
        ignored: [
            'gps-actors',
            'gps-monster-features'
        ]
    },
    {
        folder: 'misc',
        url: 'https://github.com/txm3278/midi-item-showcase-community/releases/latest/download/module.zip',
        ignored: [
            'misc-actors',
            'misc-class-features-items',
            'misc-macros',
            'misc-spell-items',
            'misc-monster-features'
        ]
    },
    {
        folder: 'cprBeta',
        url: 'https://github.com/chrisk123999/chris-premades/releases/download/0.12.61/module.zip',
        ignored: [
            'cpr-class-feature-items',
            'cpr-feat-features',
            'cpr-homebrew-feature-items',
            'cpr-item-features',
            'cpr-monster-features',
            'cpr-monster-feature-items',
            'cpr-race-feature-items',
            'cpr-spell-features',
            'cpr-summon-features',
            'cpr-summons'
        ]
    },
    {
        folder: 'midi',
        url: 'https://gitlab.com/tposney/midi-qol/raw/v11.6/package/midi-qol-v11.6.12.zip',
        ignored: [],
        extraPath: '/midi-qol'
    }
];
export async function updateItems() {
    console.log('Updating CPR, GPR, MISC, CPR, and Midi automations...');
    try {
        await Promise.all(modules.map(async module => {
            let folderName = './files/' + module.folder;
            await download(module.url, folderName, {extract: true});
            let packPath = module.extraPath ? folderName + module.extraPath + '/packs/' : folderName + '/packs/';
            let packFolders = fs.readdirSync(packPath).filter(i => !module.ignored.includes(i));
            await Promise.all(packFolders.map(async folder => await extractPack(packPath + folder, folderName + '/packItems/' + folder)));
            await Promise.all(packFolders.map(async folder => {
                let files = fs.readdirSync(folderName + '/packItems/' + folder);
                await Promise.all(files.map(file => {
                    let item = JSON.parse(fs.readFileSync(folderName + '/packItems/' + folder + '/' + file, 'utf8').toString());
                    if (item._key.substring(0,8) === '!folders') return;
                    let itemData = {
                        name: item.name,
                        source: module.folder
                    };
                    data.items.push(itemData);
                }));
            }));
        }));
        let json = JSON.stringify(data);
        fs.rmSync('items.json', {force: true});
        fs.writeFileSync('items.json', json, 'utf8');
        console.log('There are ' + data.items.length + ' CPR, GPR, MISC, CPR Beta, and Midi items!');
    } catch (error) {
        console.error(error);
    }
    console.log('Update Complete!');
}