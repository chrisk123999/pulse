import fs from 'fs';
import download from 'download';
import {extractPack} from '@foundryvtt/foundryvtt-cli';
let modules = [
    {
        folder: 'cpr',
        url: 'https://github.com/chrisk123999/chris-premades/releases/latest/download/module.zip',
        ignored: [
            'cpr-class-feature-items',
            'cpr-feat-features',
            'cpr-homebrew-feature-items',
            'cpr-item-features',
            'cpr-monster-feature-items',
            'cpr-race-feature-items',
            'cpr-spell-features',
            'cpr-summon-features',
            'cpr-summon-features-2024',
            'cpr-summons',
            'cpr-summons-2024',
            'cpr-feat-features-2024'
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
        url: 'https://gitlab.com/tposney/midi-qol/raw/v12dnd4/package/midi-qol-v12.4.27.1.zip',
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
            //await download(module.url, folderName, {extract: true});
            let packPath = module.extraPath ? folderName + module.extraPath + '/packs/' : folderName + '/packs/';
            let packFolders = fs.readdirSync(packPath).filter(i => !module.ignored.includes(i));
            await Promise.all(packFolders.map(async folder => {
                try {
                    await extractPack(packPath + folder, folderName + '/packItems/' + folder);
                } catch (error2) {
                    console.error(error2);
                }
            }));
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
        let generics = [
            'Ability Drain',
            'Activity on Effect Expiry',
            'Activity on Rest',
            'Advantage Damage Bonus',
            'Damaging Aura',
            'Auto Grapple',
            'Auto Push',
            'Berserk',
            'Blood Frenzy',
            'Bloodied Frenzy',
            'Choose Damage',
            'Contextual Bonus',
            'Damage on Turn Start',
            'Death Burst',
            'Effect Immunity',
            'Enlarge',
            'Escape',
            'Failed By Amount',
            'Gaze',
            'Keen Senses',
            'Lifesteal',
            'Martial Advantage',
            'Movement Bonus Activity',
            'Pack Tactics',
            'Parry',
            'Reduce',
            'Reduce Maximum HP',
            'Regeneration',
            'Reroll Save On Damage',
            'Roll for Activity',
            'Special Item Use',
            'Spell Turning',
            'Suffocate',
            'Sunlight Sensitivity',
            'Surprise Attack',
            'Swarm Damage',
            'Teleport',
            'Touch Damage',
            'Undead Fortitude'
        ];
        monsterData.items.push(...generics.map(name => ({
            name,
            source: 'cpr',
            monster: 'Generic Monster Feature'
        })));
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
await updateItems();