// this is a utility to help match string sets like our task details
// this should be given patterns which are expected, and instructions about how to turn them into a final object
// sets of tokens will be registered, which are evaluated in order. When matched, said tokens are removed
// e.g. for 15 Ranged 20 Hunter Sins of the Father Kourend Morytania 50% Kourend Favour
// should be turned into:
// {
//    skills: {Ranged: 15, Hunter: 20},
//    quests: ["Sins of the Father"],
//    favour: {Kourend: 50},
//    areas: ["Kourend", "Morytania"]   
//}
const numRegex = /^[0-9]+$/;
const perRegex = /^[0-9]+%$/;
const panicList = [];
let panicItem = {
    id: undefined,
}
function panic(reason){
    panicItem.reason = reason;
}
function getText($elm){
    // needs to be a smarter replacement for .text() which includes several helper tags and groups data.
    // [Q]{} quest name
    // [A]{} area name
    // [S]{} skill name
    // [C]{} coin amount
    // [I]{} item name
    // [D]{} diary
    // [K]{} kourend favour

    var output = "";
    var contents = $elm.contents();
    //console.log(contents);
    var nextIsDiary = false;
    var nextIsQuest = false;
    var nextIsKourend = false;
    contents.each((i, e) => {
        var contentElm = e;
        var $contentElm = $(contentElm);
        //console.log(contentElm, $contentElm);
        if(contentElm.nodeType == 3){
            //console.log("Is plaintext");
            output += contentElm.textContent.replace(/\s/g, " ");
        } else if($contentElm.attr('data-skill')){
            //console.log("Is skill");
            output += ` SKILL ${$contentElm.text()} `; 
        } else if($contentElm.attr('title')=== "Skills"){
            output += $contentElm.text();
        } else if($contentElm.is('span.coins')){
            //console.log("Is coins");
            output += ` COINS ${$contentElm.text()} `;
        } else if($contentElm.is('span.tbz-region')){
            //console.log("Is area");
            var areaName = $contentElm.find('.tbz-name').text();
            output += ` AREA ${areaName} `;
        } /*else if($contentElm.) item is HARD */
        else if($contentElm.find('a[title="Achievement Diary"]').length){
            //console.log("Is Diary icon");
            nextIsDiary = true;
        } else if(nextIsDiary){
            //console.log("Is Diary");
            nextIsDiary = false;
            output += ` DIARY ${$contentElm.text()} `;
        } else if($contentElm.find('a[title="Quest points"]').length){
            //console.log("Is Quest icon");
            nextIsQuest = true;
        } else if(nextIsQuest){
            //console.log("Is Quest");
            nextIsQuest = false;
            output += ` QUEST ${$contentElm.text()} `;
        } else if($contentElm.find('a[title="Kourend Favour"]').length){
            //console.log("Is Kourend icon");
            nextIsKourend = true;
        } else if(nextIsKourend){
            //console.log("Is Kourend");
            nextIsKourend = false;
            output += ` KOUREND ${$contentElm.text()} `;
        } else if($contentElm.is('a')){
            if($contentElm.attr('title') === "Combat level" 
                || $contentElm.attr('title') === "Total level"){
                output += ` ${$contentElm.text()} `;
            }else {
            output += ` LINK ${$contentElm.attr('href')} ${$contentElm.text().replace(/ /g, "_")} `;
            }
        }
    });
    return output;
}
class TextMatcher{
    constructor(rules){
        this.rules = rules;
    }
    rules = [];
    exec(str){
        var strParts = str.split(/\s/).filter(x => x && x.trim().length).map(x => x.replace(/\s/g, "").replace('✓', '').trim());
        //console.log(strParts);
        var output = {};
        for(var i = 0; i < strParts.length; i++){
            for(var j = 0; j < this.rules.length; j++){
                var rule = this.rules[j];
                //console.log("testing rule", rule);
                var tokens = rule.tokens;
                // check all the tokens against the next tokencount parts
                var tokenValues = [];
                for(var k = 0; k < tokens.length; k++){
                    var token = tokens[k];
                    //console.log("evaluating token", token);
                    var part = strParts[i + k];
                    //console.log("against part", part);
                    switch(token.token){
                        case "$number":
                            if(numRegex.exec(part)){
                                tokenValues.push(+part);
                            }
                            break;
                        case "$fromArr":
                            if(token.multiArr){
                                // handle arrays where each data set is an array
                                for(var x = 0; x < token.arr.length; x++){
                                    var arrItem = token.arr[x];
                                    for(var y = 0; y < arrItem.length; y++){
                                        part = strParts[i + k + y];
                                        var subArrItem = arrItem[y];
                                        //console.log("testing multiitem", subArrItem, part)
                                        if(subArrItem != part){
                                            y = arrItem.length;
                                        }
                                        if(y == arrItem.length - 1){
                                            // we matched the last item, this arr matches
                                            var outputStr = [];
                                            for(var z = 0; z < arrItem.length; z++){
                                                outputStr.push(strParts[i+k+z]);
                                            }
                                            //console.log("all items matched", outputStr);
                                            tokenValues.push(outputStr.join(" "));
                                        }
                                    }
                                }
                            } else {
                                if(token.arr.indexOf(part) > -1){
                                    tokenValues.push(part);
                                }
                            }
                            break;
                        case "$percent":
                            if(perRegex.exec(part)){
                                tokenValues.push(part);
                            }
                            break;
                        case "$string":
                            tokenValues.push(part);
                            break;
                        default:
                            if(part == token.token){
                                tokenValues.push(part);
                            }
                    }
                    if(tokenValues.length - 1 !== k){
                        //console.log("token didnt match part, ending rule evaluation");
                        k = tokens.length;
                    }
                }
                if(tokenValues.length == tokens.length){
                    // our rule has matched, and we have the values
                    // progress the part index because we have used those parts
                    //console.log("rule matched, compiling output");
                    i += (tokenValues.length - 1);
                    rule.compile(output, tokenValues);
                    // stop trying to match rules
                    j = this.rules.length;
                }
            }
        }
        return output;
    }
}

const textMatcherToken = [
    "$number", // will match a number
    "$fromArr", // will match an item in an array
    "$percent", // will match a percent XX%
    "$string", // will match and single word
//    "$any" // will match any amount of words until the next item matches
]; // any string literal will be matched exactly
class TextMatcherToken{
    constructor(token, arr, multiArr){
        this.token = token;
        this.arr = arr;
        this.multiArr = multiArr;
    }
    token;
    arr;
    multiArr;
}
class TextMatcherRule{
    constructor(tokens, compile){
        this.tokens = tokens;
        this.compile = compile;
    }
    tokens;
    compile;
}
const questNames = [
    "Cook's Assistant",
    "Demon Slayer",
    "Restless Ghost",
    "Romeo & Juliet",
    "Sheep Shearer",
    "Shield of Arrav",
    "Ernest the Chicken",
    "Vampyre Slayer",
    "Imp Catcher",
    "Prince Ali Rescue",
    "Doric's Quest",
    "Black Knights' Fortress",
    "Witch's Potion",
    "Knight's Sword",
    "Goblin Diplomacy",
    "Pirate's Treasure",
    "Dragon Slayer I",
    "Rune Mysteries",
    "Misthalin Mystery",
    "Corsair Curse",
    "X Marks the Spot",
    "Below Ice Mountain",
    "Druidic Ritual",
    "Lost City",
    "Witch's House",
    "Merlin's Crystal",
    "Heroes' Quest",
    "Scorpion Catcher",
    "Family Crest",
    "Tribal Totem",
    "Fishing Contest",
    "Monk's Friend",
    "Temple of Ikov",
    "Clock Tower",
    "Holy Grail",
    "Tree Gnome Village",
    "Fight Arena",
    "Hazeel Cult",
    "Sheep Herder",
    "Plague City",
    "Sea Slug",
    "Waterfall Quest",
    "Biohazard",
    "Jungle Potion",
    "Grand Tree",
    "Shilo Village",
    "Underground Pass",
    "Observatory Quest",
    "Tourist Trap",
    "Watchtower",
    "Dwarf Cannon",
    "Murder Mystery",
    "Dig Site",
    "Gertrude's Cat",
    "Legends' Quest",
    "Big Chompy Bird Hunting",
    "Elemental Workshop I",
    "Priest in Peril",
    "Nature Spirit",
    "Death Plateau",
    "Troll Stronghold",
    "Tai Bwo Wannai Trio",
    "Regicide",
    "Eadgar's Ruse",
    "Shades of Mort'ton",
    "Fremennik Trials",
    "Horror from the Deep",
    "Throne of Miscellania",
    "Monkey Madness I",
    "Haunted Mine",
    "Troll Romance",
    "In Search of the Myreque",
    "Creature of Fenkenstrain",
    "Roving Elves",
    "Ghosts Ahoy",
    "One Small Favour",
    "Mountain Daughter",
    "Between a Rock...",
    "Feud",
    "Golem",
    "Desert Treasure I",
    "Icthlarin's Little Helper",
    "Tears of Guthix",
    "Zogre Flesh Eaters",
    "Lost Tribe",
    "Giant Dwarf",
    "Recruitment Drive",
    "Mourning's End Part I",
    "Forgettable Tale...",
    "Garden of Tranquillity",
    "Tail of Two Cats",
    "Wanted!",
    "Mourning's End Part II",
    "Rum Deal",
    "Shadow of the Storm",
    "Making History",
    "Ratcatchers",
    "Spirits of the Elid",
    "Devious Minds",
    "Hand in the Sand",
    "Enakhra's Lament",
    "Cabin Fever",
    "Fairytale I - Growing Pains",
    "Recipe for Disaster",
    "Recipe for Disaster/Another Cook's Quest",
    "Recipe for Disaster/Freeing the Mountain Dwarf",
    "Recipe for Disaster/Freeing the Goblin generals",
    "Recipe for Disaster/Freeing Pirate Pete",
    "Recipe for Disaster/Freeing the Lumbridge Guide",
    "Recipe for Disaster/Freeing Evil Dave",
    "Recipe for Disaster/Freeing King Awowogei",
    "Recipe for Disaster/Freeing Sir Amik Varze",
    "Recipe for Disaster/Freeing Skrach Uglogwee",
    "Recipe for Disaster/Defeating the Culinaromancer",
    "In Aid of the Myreque",
    "Soul's Bane",
    "Rag and Bone Man I",
    "Swan Song",
    "Royal Trouble",
    "Death to the Dorgeshuun",
    "Fairytale II - Cure a Queen",
    "Lunar Diplomacy",
    "Eyes of Glouphrie",
    "Darkness of Hallowvale",
    "Slug Menace",
    "Elemental Workshop II",
    "My Arm's Big Adventure",
    "Enlightened Journey",
    "Eagles' Peak",
    "Animal Magnetism",
    "Contact!",
    "Cold War",
    "Fremennik Isles",
    "Tower of Life",
    "Great Brain Robbery",
    "What Lies Below",
    "Olaf's Quest",
    "Another Slice of H.A.M.",
    "Dream Mentor",
    "Grim Tales",
    "King's Ransom",
    "Monkey Madness II",
    "Client of Kourend",
    "Rag and Bone Man II",
    "Bone Voyage",
    "Queen of Thieves",
    "Depths of Despair",
    "Dragon Slayer II",
    "Tale of the Righteous",
    "Taste of Hope",
    "Making Friends with My Arm",
    "Forsaken Tower",
    "Ascent of Arceuus",
    "Song of the Elves",
    "Fremennik Exiles",
    "Sins of the Father",
    "Porcine of Interest",
    "Getting Ahead",
    "Night at the Theatre",
    "Kingdom Divided",
    "Land of the Goblins",
    "Temple of the Eye",
    "Beneath Cursed Sands",
    "Sleeping Giants",
    "Garden of Death",
    "Secrets of the North",
    "Desert Treasure II - Fallen Empire",
    "Path of Glouphrie",
    "Children of the Sun",
    "Defender of Varrock",
    "Twilight's Promise",
    "At First Light",
    "Perilous Moons",
    "Ribbiting Tale of a Lily Pad Labour Dispute",
    "While Guthix Sleeps"
];
const areaNames = ["Asgarnia", "Desert", "Fremennik", "Kandarin", "Karamja", "Kourend", "Misthalin", "Morytania", "Tirannwn", "Wilderness", "Varlamore"];
const skillNames = ["Attack", "Hitpoints", "Mining", "Strength", "Agility", "Smithing", "Defence", "Herblore", "Fishing", "Ranged", "Thieving", "Cooking", "Prayer", "Crafting", "Firemaking", "Magic", "Fletching", "Woodcutting", "Runecraft", "Slayer", "Farming", "Construction", "Hunter"];
    
function getMatcher(){
    var rules = [
        new TextMatcherRule([ // kourend favour
            new TextMatcherToken("$percent"),
            new TextMatcherToken("KOUREND"),
            new TextMatcherToken("$string"),
            new TextMatcherToken("favour")
        ], 
        (obj, tvs) => {
            if(!obj.kourend){obj.kourend = {}}
            obj.kourend[tvs[2]] = tvs[0].replace('%', '');
        }),
        new TextMatcherRule([ // specific kourend favour
            new TextMatcherToken("$percent"),
            new TextMatcherToken("of"),
            new TextMatcherToken("each"),
            new TextMatcherToken("type"),
            new TextMatcherToken("of"),
            new TextMatcherToken("KOUREND"),
            new TextMatcherToken("$string"),
            new TextMatcherToken("favour")
        ], 
        (obj, tvs) => {
            if(!obj.kourend){obj.kourend = {}}
            obj.kourend[tvs[6]] = tvs[0].replace('%', '');
        }),
        new TextMatcherRule([ // quests
            new TextMatcherToken("QUEST"),
            new TextMatcherToken("$fromArr", questNames.map(x => x.split(" ")), true)
        ],
        (obj, tvs) => {
            if(!obj.quests){obj.quests = []}
            obj.quests.push(tvs[1]);
        }),
        // diaries can have multiple parts to a name, look for them specifically
        new TextMatcherRule([ // diaries
            new TextMatcherToken("DIARY"),
            new TextMatcherToken("$string"),
            new TextMatcherToken("$string"),
            new TextMatcherToken("Diary"),
        ],
        (obj, tvs) => {
            if(!obj.diary){obj.diary = []}
            obj.diary.push(tvs[1] + " " + tvs[2]);
        }),
        new TextMatcherRule([ // kourend & kerbos diary
            new TextMatcherToken("DIARY"),
            new TextMatcherToken("$string"),
            new TextMatcherToken("Kourend"),
            new TextMatcherToken("&"),
            new TextMatcherToken("Kerbos"),
            new TextMatcherToken("Diary"),
        ],
        (obj, tvs) => {
            if(!obj.diary){obj.diary = []}
            obj.diary.push("Kourend & Kerbos " + tvs[1]);
        }),
        new TextMatcherRule([ // Lumbridge & Draynor diary
            new TextMatcherToken("DIARY"),
            new TextMatcherToken("$string"),
            new TextMatcherToken("Lumbridge"),
            new TextMatcherToken("&"),
            new TextMatcherToken("Draynor"),
            new TextMatcherToken("Diary"),
        ],
        (obj, tvs) => {
            if(!obj.diary){obj.diary = []}
            obj.diary.push("Lumbridge and Draynor " + tvs[1]);
        }),
        new TextMatcherRule([ // Western Provinces 
            new TextMatcherToken("DIARY"),
            new TextMatcherToken("$string"),
            new TextMatcherToken("Western"),
            new TextMatcherToken("Provinces"),
            new TextMatcherToken("Diary"),
        ],
        (obj, tvs) => {
            if(!obj.diary){obj.diary = []}
            obj.diary.push("Western Provinces " + tvs[1]);
        }),
        new TextMatcherRule([ // skill number
            new TextMatcherToken("SKILL"),
            new TextMatcherToken("$number"),
            new TextMatcherToken("$fromArr", skillNames)
        ],
        (obj, tvs) => {
            if(!obj.skills){obj.skills = {}}
            if(obj.skills[tvs[2]]){
                panic("setting skill twice");
            }
            obj.skills[tvs[2]] = tvs[1];
        }),
        new TextMatcherRule([ // area
            new TextMatcherToken("AREA"),
            new TextMatcherToken("fromArr", areaNames)
        ],
        (obj, tvs) => {
            if(!obj.areas){obj.areas = []}
            obj.areas.push(tvs[1]);
        }),
        new TextMatcherRule([ // 15 Combat level
            new TextMatcherToken("SKILL"),
            new TextMatcherToken("$number"),
            new TextMatcherToken("Combat"),
            new TextMatcherToken("level")
        ],
        (obj, tvs) => {
            if(!obj.skills){obj.skills = {}}
            obj.skills.Combat = tvs[1];
        }),
        new TextMatcherRule([ // 1500 Total level
            new TextMatcherToken("SKILL"),
            new TextMatcherToken("$number"),
            new TextMatcherToken("Total"),
            new TextMatcherToken("level")
        ],
        (obj, tvs) => {
            if(!obj.skills){obj.skills = {}}
            obj.skills.Total = tvs[1];
        }),
        new TextMatcherRule([ // 50 Any skill
            new TextMatcherToken("SKILL"),
            new TextMatcherToken("$number"),
            new TextMatcherToken("Any"),
            new TextMatcherToken("skill")
        ],
        (obj, tvs) => {
            if(!obj.skills){obj.skills = {}}
            obj.skills.Any = tvs[1];
        }),
        new TextMatcherRule([ // 50 Every skill
            new TextMatcherToken("SKILL"),
            new TextMatcherToken("$number"),
            new TextMatcherToken("Every"),
            new TextMatcherToken("skill")
        ],
        (obj, tvs) => {
            if(!obj.skills){obj.skills = {}}
            obj.skills.Base = tvs[1];
        }),
        new TextMatcherRule([ // links
            new TextMatcherToken("LINK"),
            new TextMatcherToken("$string"),
            new TextMatcherToken("$string")
        ],
        (obj, tvs) => {
            if(!obj.links){obj.links = []}
            obj.links.push({text: tvs[2], href: tvs[1]})
        }),
        new TextMatcherRule([
            new TextMatcherToken("COINS"),
            new TextMatcherToken("$string"),
        ],
    (obj, tvs) => {
        if(obj.coins){
            panic("settings coins twice");
        }
        obj.coins = +tvs[1].replace(/,/g, "");
    })
    ]

    return new TextMatcher(rules);
}


(function(){
    var output = [];
    var plainTextOutput = [];
    var rows = $('tr[data-taskid]');
    var matcher = getMatcher();
    rows.each((i, basicRow) => {
        //if(i !== 1338){return;}
        var row = $(basicRow);
        var id = row.data('taskid');
        panicItem.id = id;
        //console.log("id", id);
        // first cell - area
        var firstCell = row.find('td:nth(0)');
        var firstCellImg = firstCell.find('img');
        var firstCellHref = firstCellImg.attr('src');
        var area = firstCellHref.split(/\/[Ii]?mages\//)[1].split(/[_-]{1}/)[0];
        if(area == 'Globe'){area = 'Any';}
        //console.log("area", area);
        // second cell - name
        var secondCell = row.find('td:nth(1)');
        var secondCellName = secondCell[0].innerHTML;
        var name = trimTags(secondCellName);
        //console.log("name", name);
        // third cell - desc
        var thirdCell = row.find("td:nth(2)");
        var thirdCellDesc = thirdCell[0].innerHTML;
        var desc = trimTags(thirdCellDesc);
        //console.log("desc", desc);
        // fourth cell - details
        // this gets seriously complicated
        // parse through chunk by chunk
        // skill elements have the level as a data attribute
        // quests have the quest icon followed by the quest name text
        // acievement diaries have the icon followed by the name of the diary
        // can also pull out other areas
        var fourthCell = row.find("td:nth(3)");
        var fourthCellText = " AREA " + area + " " + getText(fourthCell);
        var normalizedFourthCellText = fourthCellText.toLowerCase();
        if(normalizedFourthCellText.indexOf(" or ") > -1 || normalizedFourthCellText.indexOf(" either ") > -1){
            panic("Found either/or in text");
        }
        plainTextOutput.push({id, details: fourthCellText})
        var reqs = matcher.exec(fourthCellText);
        if(!reqs.areas){reqs.areas = []}
        reqs.areas.push(area);
        reqs.areas = reqs.areas.filter((x, i) => {
            return reqs.areas.indexOf(x) == i
        });
        reqs = [reqs];
        var fifthCell = row.find("td:nth(4)");
        var fifthCellPointValue = fifthCell.data().sortValue;
        var diff = "";
        switch(fifthCellPointValue){
            case 10: diff = "Easy"; break;
            case 30: diff = "Medium"; break;
            case 80: diff = "Hard"; break;
            case 200: diff = "Elite"; break;
            case 400: diff = "Master"; break;
        }
        //console.log("diff", diff);

        output.push({
            id: id,
            name: name.trim(),
            desc: desc.trim(),
            diff: diff,
            reqs: reqs
        });
        if(panicItem.reason){
            panicList.push({
                id: id,
                reason: panicItem.reason,
                reqs: reqs,
                raw: fourthCellText
            });
            panicItem = {};
        }
    })
    function trimTags(val){
        return val.replace(/<[\w\d\n\r\t\s_\-="\/%'\(\)#?:;\.&]{0,}>/g, "")
            .replace("&nbsp;", " ")
            .replace("&amp;", "&")
            .replace(/\.\n$/g, "");
    }
    window.plainTextOutput = plainTextOutput;
    window.jsonOutput = output;
    window.panics = panicList;
}())