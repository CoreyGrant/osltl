var fs = require('fs');

// Load parsedTasks.json
var fileJson = JSON.parse(fs.readFileSync('../data/parsedTasks.json'));

// update the json

// Craft a leather body
var task = fileJson.find(x => x.id === 641);
task.reqs = {
    "Asgarnia": {
        "skills":{Crafting: 40}
    },
    "Kandarin": {
        "skills": {Ranged: 40, Crafting: 14}
    },
    "Desert": {skills: {Crafting: 14}},
    "Kourend": {skills: {Crafting: 14}},
    "Morytania": {skills: {Crafting: 14}},
    "Fremennik": {skills: {Crafting: 14, Magic: 78}} 
};

// Catch a butterfly
task = fileJson.find(x => x.id === 691);
task.reqs = {
    "Kandarin": {skills: {Hunter: 15}},
    "Kourend": {skills: {Hunter: 15}},
    "Fremennik": {skills: {Hunter: 25}},
}

// Have a conversation with a cat
task = fileJson.find(x => x.id == 1695);
task.reqs = {
    "Desert": {quests: ["Icthlarin's Little Helper"]},
    "Fremennik": {}
};

// Kill a Necromancer
task = fileJson.find(x => x.id == 1633);
task.reqs = {
    "Kandarin": {},
    Kourend: {}
}
// Plant seeds in an allotment
task = fileJson.find(x => x.id == 587);
task.reqs = {
    Asgarnia: {},
    Morytania: {},
    Kandarin: {},
    Kourend: {},
    Tirannwn: {},
}
// Steal a chocolate cake
task = fileJson.find(x => x.id == 581);
task.reqs = {
    Fremennik: {skills: {Thieving: 5}},
    Kandarin: {skills: {Thieving: 5}},
    Kourend: {skills: {Thieving: 5}},
}
//write back out to tasks.json;
fs.writeFileSync("../data/tasks.json", JSON.stringify(fileJson, null, 2));

