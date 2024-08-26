

(function(){
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
    
    const splitQuests = questNames.map(x => {
        const split = x.split(/\s/);
        //const reversed = [...split].reverse();
        //console.log(split, reversed);
        return split;
    });
    var output = [];
    var rows = $('tr[data-taskid]');
    rows.each((i, basicRow) => {
        var row = $(basicRow);
        var id = row.data('taskid');
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
        var reqs = alternateParse(fourthCell, area, splitQuests);
        // var reqs = {};
        // reqs[area] = {skills: {}, quests: [], kourend: {}, diary: []};
        // var lookingForQuestname = false;
        // var lookingForDiary = false;
        // var lookingForKourendFavour = false;
        // console.log(fourthCell.text());
        // fourthCell.children().each((i, x) => {
        //     x = $(x);
        //     if(x.is("span.scp")){
        //         var skill = x.data('skill');
        //         if(skill == "Skills"){
        //             skill = fourthCell.children()[1].innerHTML == 'Every skill'
        //                 ? "Base"
        //                 : "Any";
        //         }
        //         if(skill == "Total level"){skill = "Total"}
        //         if(skill == "Combat level"){skill = "Combat"}
        //         var level = +x.data('level');
        //         reqs[area]["skills"][skill] = level;
        //     }
        //     if(x.is("span")){
        //         var child = x.children('a');
        //         if(child.attr('title') == 'Quest points'){
        //             lookingForQuestname = true;
        //         }
        //         if(child.attr('title') == 'Achievement Diary'){
        //             lookingForDiary = true;
        //         }
        //         if(child.attr('title') == 'Kourend Favour'){
        //             lookingForKourendFavour = true;
        //         }
        //     }
        //     if(x.is('a') && lookingForQuestname){
        //         lookingForQuestname = false;
        //         reqs[area]["quests"].push(x.attr('title'));
        //     }
        //     if(x.is('a') && lookingForDiary){
        //         lookingForDiary = false;
        //         reqs[area]["diary"].push(x[0].innerHTML);
        //     }
        //     if(x.is('a') && lookingForKourendFavour){
        //         lookingForKourendFavour = false;
        //         reqs[area]["kourend"][x.attr('title')] 
        //             = fourthCell.children()[i-2].innerHTML;
        //     }
        // })
        //console.log("req", reqs);
        // fifth cell - difficulty
        var fifthCell = row.find("td:nth(4)");
        var fifthCellPointValue = fifthCell.data().sortValue;
        var diff = "";
        switch(fifthCellPointValue){
            case 10: diff = "Easy"; break;
            case 40: diff = "Medium"; break;
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
    })
        
    

    function trimTags(val){
        return val.replace(/<[\w\d\n\r\t\s_\-="\/%'\(\)#?:;\.&]{0,}>/g, "")
            .replace("&nbsp;", " ")
            .replace("&amp;", "&")
            .replace(/\.\n$/g, "");
    }

    window.jsonOutput = output;
}());

// we will get an array and an index, which may match a quest name in reverse
// returns the updated index if it matches
function questNamesMatch(wordArr, startingIndex, splitQuests){
    var possibleQuests = [...splitQuests];
    var index = 0;
    while(possibleQuests.length){
        var testWord = wordArr[startingIndex + index];
        // if(testWord == "Father"){
        //     console.log("looking for quest: " + testWord, index);
        // }
        possibleQuests = possibleQuests.filter(x => {
            var reversedIndex = x.length - index - 1;
            // if(testWord == "Father" && index == 0){
            //     console.log(x, x[reversedIndex]);
            // }
            return testWord.toLowerCase() == x[reversedIndex].toLowerCase()
        });
        // we have filtered possible quests down. If there is one possible quest, and the length is the same as the index, it matches
        if(possibleQuests.length == 1 && possibleQuests[0].length === index + 1){
            //console.log("found quest", possibleQuests[0]);
            return [index, [...possibleQuests[0]].join(" ")];
        }
        index++;
    }
}
function alternateParse($detailCell, baseArea, splitQuests){
    var textContent = $detailCell.text();
    //console.log(textContent);
    
    // many things can be in this
    // <number> <skillname>
    // <questname>
    // <percent> <X> Favour
    // split string by spaces, removing empty
    // then run through pulling out relevant terms
    // go through backwards as that is more useful?
    const percentAmountRegex = /([0-9]{1,3})%/;

    const areaNames = ["Asgarnia", "Desert", "Fremennik", "Kandarin", "Karamja", "Kourend", "Misthalin", "Morytania", "Tirannwn", "Wilderness"];
    const skillNames = ["Attack", "Hitpoints", "Mining", "Strength", "Agility", "Smithing", "Defence", "Herblore", "Fishing", "Ranged", "Thieving", "Cooking", "Prayer", "Crafting", "Firemaking", "Magic", "Fletching", "Woodcutting", "Runecraft", "Slayer", "Farming", "Construction", "Hunter"];
    var textContentArr = textContent.split(/\s/g)
        .map(x => x.replace(/[✓,]+/g, '').trim())
        .filter(x => x.length);
    var textContentArrReverse = [...textContentArr].reverse();
    const reqs = {skills: {}, quests: [], diary: [], kourend: {}};
    const areas = [baseArea];
    for(var i = 0; i < textContentArrReverse.length; i++){
        const item = textContentArrReverse[i];
        if(item == 'favour'){
            // some kind of kourend favour, take the next value
            i++;
            var nameItem = textContentArrReverse[i];
            // find the amount, running backwards until we get a #%
            var amount = 0;
            var notFound = true;
            while(notFound){
                i++;
                var indexItem = textContentArrReverse[i];
                var match = percentAmountRegex.exec(indexItem) 
                if(match) {
                    amount = +match[1];
                    notFound = false;
                }
            }
            reqs.kourend[nameItem] = amount;
        }
        if(skillNames.indexOf(item) > -1){
            i++;
            var amount = +textContentArrReverse[i];
            reqs.skills[item] = amount;
        }
        if(item == "level"){
            i++;
            var nextItem = textContentArrReverse[i];
            if(nextItem == "Combat"){
                i++;
                var amount = +textContentArrReverse[i];
                reqs.skills["Combat"] = amount; 
            }
            if(nextItem == "Total"){
                i++;
                var amount = +textContentArrReverse[i];
                reqs.skills["Total"] = amount;
            }
        }
        if(item == "skill"){
            i++;
            var nextItem = textContentArrReverse[i];
            if(nextItem == "Every"){
                i++;
                var amount = +textContentArrReverse[i];
                reqs.skills["Base"] = amount;
            }
        }
        if(item == "Diary"){
            i++;
            var locItem = textContentArrReverse[i];
            i++;
            var diffItem = textContentArrReverse[i];
            reqs.diary.push(diffItem + " " + locItem);
        }
        if(areaNames.indexOf(item) > -1){
            areas.push(item);
        }
        var questMatch = questNamesMatch(textContentArrReverse, i, splitQuests);
        if(questMatch){
            i += questMatch[0];
            reqs.quests.push(questMatch[1]);
        }
    }
    return areas.reduce((p, c) => {
        return {...p, [c]: reqs}
    }, {});
}
// get quest names
// (function(){
//     var output = [];
//     $('table.sortable tr').find('td:nth-child(2)').each((i, x) =>{
//         output.push($(x).data('sortValue'))
//     })
//     window.output = output;
// }())
