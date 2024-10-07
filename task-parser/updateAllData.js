// open browser with puppeteer
// load parse script
// read out json object output
// write to files
// run manual updates
(async function(){
const puppeteer = require('puppeteer');
const fs = require('fs');
const textMatcherText = fs.readFileSync('./textMatcher.js', {encoding: 'utf8'});
const browser = await puppeteer.launch({headless: true});
const page = await browser.newPage();
// load the wiki page
await page.goto("https://oldschool.runescape.wiki/w/Trailblazer_Reloaded_League/Tasks");

// run the javascript to build up task list, raw and panics
await page.evaluate(textMatcherText);

// get those out of the window object
const plainTextOutput = await page.evaluate(() => {
    return window.plainTextOutput;
})
const jsonOutput = await page.evaluate(() => {
    return window.jsonOutput;
})
const panics = await page.evaluate(() => {
    return window.panics;
})

// close down the browser
await browser.close();

// write the parsed and raw data
fs.writeFileSync('../data/parsedTasks.json', JSON.stringify(jsonOutput, null, 2));
fs.writeFileSync('../data/detailsRaw.json', JSON.stringify(plainTextOutput, null, 2));

// Load parsed and manual data
var fileJson = JSON.parse(fs.readFileSync('../data/parsedTasks.json'));
var manualJson = JSON.parse(fs.readFileSync('../data/manualTasks.json'));

// perform manual replacement
for(var task of fileJson){
    var replacementReqs = manualJson[task.id.toString()];
    if(replacementReqs){
        task.reqs = replacementReqs;
        var matchingPanic = panics.find(x => x.id == task.id);
        if(matchingPanic){
            matchingPanic.manualReqs = replacementReqs;
        }
    }
}

// write out panics
fs.writeFileSync('../data/panicList.json', JSON.stringify(panics, null, 2));

// write the combined task list;
fs.writeFileSync("../data/tasks.json", JSON.stringify(fileJson, null, 2));

}());