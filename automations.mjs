import fs from 'fs';
import download from 'download';
import {extractPack} from '@foundryvtt/foundryvtt-cli';
let modules = [
    {
        folder: 'cpr',
        url: 'https://github.com/chrisk123999/chris-premades/releases/download/1.1.17/module.zip',
        ignored: [
            'cpr-class-feature-items',
            'cpr-feat-features',
            'cpr-homebrew-feature-items',
            'cpr-item-features',
            'cpr-monster-feature-items',
            'cpr-race-feature-items',
            'cpr-spell-features',
            'cpr-summon-features',
            'cpr-summons'
        ],
        monster: [
            'cpr-monster-features'
        ]
    },
    {
        folder: 'gps',
        url: 'https://github.com/gambit07/gambits-premades/releases/latest/download/module.zip',
        ignored: [
            'gps-actors'
        ],
        monster: [
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
            'misc-spell-items'
        ],
        monster: [
            'misc-monster-features'
        ]
    },
    {
        folder: 'midi',
        url: 'https://gitlab.com/tposney/midi-qol/raw/v12dnd4/package/midi-qol-v12.4.23.zip',
        ignored: [],
        monster: [],
        extraPath: '/midi-qol'
    }
];
export async function updateItems() {
    let data = {items: [
        {
            name: 'Arcane Recovery',
            source: 'rr'
        },
        {
            name: 'Natural Recovery',
            source: 'rr'
        },
        {
            name: 'Song of Rest',
            source: 'rr'
        },
        {
            name: 'Chef',
            source: 'rr'
        },
        {
            name: 'Durable',
            source: 'rr'
        },
        {
            name: 'Periapt of Wound Closure',
            source: 'rr'
        },
        {
            name: 'Blessing of Wound Closure',
            source: 'rr'
        },
        {
            name: 'Black Blood Healing',
            source: 'rr'
        }
    ]};
    let monsterData = {items: []};
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
                if (!module.monster.includes(folder)) {
                    await Promise.all(files.map(file => {
                        let item = JSON.parse(fs.readFileSync(folderName + '/packItems/' + folder + '/' + file, 'utf8').toString());
                        if (item._key.substring(0,8) === '!folders') return;
                        let itemData = {
                            name: item.name,
                            source: module.folder,
                            rules: item.system?.source?.rules === '2024' ? 'Modern' : 'Legacy'
                        };
                        data.items.push(itemData);
                    }));
                } else {
                    let monsterNames = {};
                    await Promise.all(files.map(file => {
                        let item = JSON.parse(fs.readFileSync(folderName + '/packItems/' + folder + '/' + file, 'utf8').toString());
                        if (!item._key.substring(0,8) === '!folders') return;
                        monsterNames[item._id] = item.name;
                    }));
                    await Promise.all(files.map(file => {
                        let item = JSON.parse(fs.readFileSync(folderName + '/packItems/' + folder + '/' + file, 'utf8').toString());
                        if (item._key.substring(0,8) === '!folders') return;
                        let monster = monsterNames[item.folder];
                        if (!monster) return;
                        let itemData = {
                            name: item.name,
                            source: module.folder,
                            monster: monster
                        };
                        monsterData.items.push(itemData);
                    }));
                }
            }));
        }));
        let json = JSON.stringify(data);
        fs.rmSync('items.json', {force: true});
        fs.writeFileSync('items.json', json, 'utf8');
        console.log('There are ' + data.items.length + ' automations!');
        let monsterJSON = JSON.stringify(monsterData);
        fs.rmSync('monsterItems.json', {force: true});
        fs.writeFileSync('monsterItems.json', monsterJSON, 'utf8');
        console.log('There are ' + monsterData.items.length + ' monster automations!');
    } catch (error) {
        console.error(error);
    }
    console.log('Update Complete!');
}