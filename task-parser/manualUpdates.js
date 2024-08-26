var fs = require('fs');

// Load parsedTasks.json
var fileJson = JSON.parse(fs.readFileSync('../data/parsedTasks.json'));
var manualJson = JSON.parse(fs.readFileSync('../data/manualTasks.json'));

for(var task of fileJson){
    var replacementReqs = manualJson[task.id.toString()];
    if(replacementReqs){
        task.reqs = replacementReqs;
    }
}

//write back out to tasks.json;
fs.writeFileSync("../data/tasks.json", JSON.stringify(fileJson, null, 2));
