let sourceNames = {
    cpr: 'Cauldron of Plentiful Resources',
    rr: 'Rest Recovery',
    gps: 'Gambit\'s Premades',
    misc: 'Midi Item Showcase',
    ddbi: 'D&D Beyond Importer',
    piss: 'Items & Scripts Showcase',
    midi: 'Midi-Qol Sample Items'
};
let versionLabels = {
    cpr: 'v13',
    cpr14: 'v14 Beta',
    gps: 'v13',
    gps14: 'v14',
    misc: 'v13',
    misc14: 'v14'
};
let rulesSources = ['cpr', 'gps', 'misc'];
function groupVersions(results) {
    let groups = new Map();
    for (let {item} of results) {
        let source = item.source.replace(/14$/, '');
        let key = [source, item.name, item.rules, item.monster].join('|');
        if (!groups.has(key)) groups.set(key, {item: {...item, source}, versions: []});
        let label = versionLabels[item.source];
        if (label) groups.get(key).versions.push(label);
    }
    return [...groups.values()].map(({item, versions}) => ({
        item,
        tag: versions.length ? ' [' + versions.sort().join(', ') + ']' : ''
    }));
}
function formatResults(results, showMonster) {
    return groupVersions(results).map(({item, tag}) => {
        let details = [rulesSources.includes(item.source) && item.rules, showMonster && item.monster].filter(Boolean);
        let detailText = details.length ? ' (' + details.join(' | ') + ')' : '';
        return '\n' + (sourceNames[item.source] ?? 'Unknown') + ': ' + item.name + detailText + tag;
    }).join('');
}
module.exports = {formatResults};
