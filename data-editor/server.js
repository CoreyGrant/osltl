const express = require('express');
const fs = require('fs');
const path = require('path');
const updateAllData = require('../task-parser/updateAllDataModule');
const app = express();
app.use(express.json());

const panicsPath = '../data/panicList.json';
const parsedPath = '../data/parsedTasks.json';
const manualPath = '../data/manualTasks.json';
const rawPath = '../data/detailsRaw.json';

function loadData(){
    const raw = JSON.parse(fs.readFileSync(rawPath, {encoding: 'utf8'}));
    const parsed = JSON.parse(fs.readFileSync(parsedPath, {encoding: 'utf8'}));
    const manual = JSON.parse(fs.readFileSync(manualPath, {encoding: 'utf8'}));
    const panics = JSON.parse(fs.readFileSync(panicsPath, {encoding: 'utf8'}));
    return parsed.map(x => ({
        id: x.id,
        name: x.name,
        parsed: x.reqs,
        panic: panics.find(y => y.id === x.id)?.reason,
        raw: raw.find(y => y.id === x.id)?.details,
        manual: manual[x.id.toString()]
    }));
}
const staticFolder = path.join(__dirname, './dist');

app.use(express.static(staticFolder));

app.put('/refresh', async (req, res) => {
    updateAllData(() => res.status(200).send())
})

app.get('/data', function(req, res){
    const data = loadData();
    res.status(200).send(data);
})

app.put('/data', function(req, res){
    const item = req.body;
    console.log(item);
    const manual = JSON.parse(fs.readFileSync(manualPath, {encoding: 'utf8'}));
    Object.assign(manual, item);
    const newManualString = JSON.stringify(manual, null, 2);
    fs.writeFileSync(manualPath, newManualString);
    res.status(200).send({success: true});
})

app.listen(8008, function(){
    console.log("data editor loaded");
});