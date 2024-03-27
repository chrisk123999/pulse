import fs from 'fs';
import download from 'download';
import {createMarkdownArrayTable} from 'parse-markdown-table';
let urls = [
    'https://raw.githubusercontent.com/wiki/MotoMoto1234/Midi-Wiki/Premades-List-%E2%80%90-Feats.md',
    'https://raw.githubusercontent.com/wiki/MotoMoto1234/Midi-Wiki/Premades-List-%E2%80%90-(WIP)Class-Features.md',
    'https://raw.githubusercontent.com/wiki/MotoMoto1234/Midi-Wiki/Premades-List-%E2%80%90-Magic-Items-(WIP).md',
    'https://raw.githubusercontent.com/wiki/MotoMoto1234/Midi-Wiki/Premades-List-%E2%80%90-Spells.md',
    'https://raw.githubusercontent.com/wiki/MotoMoto1234/Midi-Wiki/Premades-List-%E2%80%90-Races.md'
];
let keyWords = {
    'Premades-List-%E2%80%90-Feats.md': '| Feat',
    'Premades-List-%E2%80%90-(WIP)Class-Features.md': '|           | Subclass',
    'Premades-List-%E2%80%90-Magic-Items-(WIP).md': '| Item Name',
    'Premades-List-%E2%80%90-Spells.md': '|	Feature',
    'Premades-List-%E2%80%90-Races.md': '| Race'
};
let namePositions = {
    'Premades-List-%E2%80%90-(WIP)Class-Features.md': 2
}
let ddbiPositions = {
    'Premades-List-%E2%80%90-(WIP)Class-Features.md': 6
}
let pissPositions = {
    'Premades-List-%E2%80%90-(WIP)Class-Features.md': 8
}
let skipRaceFeatures = [
    'Darkvision',
    'Languages',
    'Tool Proficiency'
];
let noSkipFirsts = [
    'Premades-List-%E2%80%90-(WIP)Class-Features.md'
];
let skipNames = [
    '',
    '---',
    'SPELLS'
];
let data = {'items': []};
export async function updateMotoItems() {
    console.log('Updating Moto\'s Automation List...');
    try {
        fs.rmSync('./motoFiles', {'recursive': true, 'force': true});
        await Promise.all(urls.map(url => download(url, './motoFiles')));
        let mds = fs.readdirSync('./motoFiles');
        await Promise.all(mds.map(async file => {
            if (!keyWords[file]) return;
            let fileString = fs.readFileSync('./motoFiles/' + file, 'utf8');
            let stringIndex = fileString.indexOf(keyWords[file]);
            if (!stringIndex) return;
            let tableString = fileString.substring(stringIndex);
            let table = await createMarkdownArrayTable(tableString);
            let skip = !noSkipFirsts.includes(file);
            for await (let row of table.rows) {
                if (skip) {
                    skip = false;
                    continue;
                }
                let namePosition = namePositions[file] ?? 0;
                let name = row[namePosition];
                if (skipNames.includes(name)) continue;
                if (file === 'Premades-List-%E2%80%90-Races.md') {
                    if (name.substring(0, 2) != '\\-') continue;
                    name = name.replaceAll('-', '').replaceAll('\\', '');
                    if (skipRaceFeatures.includes(name)) continue;
                }
                let ddbiPosition = ddbiPositions[file] ?? 4;
                let pissPosition = pissPositions[file] ?? 6;
                if (ddbiPosition != '') data.items.push({'name': name, 'source': 'ddbi'});
                if (pissPosition != '') data.items.push({'name': name, 'source': 'piss'});
            }
        }));
        let json = JSON.stringify(data);
        fs.rmSync('motoItems.json', {'force': true});
        fs.writeFileSync('motoItems.json', json, 'utf8');
        console.log('There are ' + data.items.length + ' DDBI & PISS items!');
    } catch (error) {
        console.error(error);
    }
    console.log('Update Complete!');
}