(function(){
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
        var reqs = {};
        reqs[area] = {skills: {}, quests: []};
        var lookingForQuestname = false;
        fourthCell.children().each((i, x) => {
            x = $(x);
            if(x.is("span.scp")){
                var skill = x.data('skill');
                if(skill == "Skills"){
                    skill = fourthCell.children()[1].innerHTML == 'Every skill'
                        ? "Base"
                        : "Any";
                }
                if(skill == "Total level"){skill = "Total"}
                if(skill == "Combat level"){skill = "Combat"}
                var level = +x.data('level');
                reqs[area]["skills"][skill] = level;
            }
            if(x.is("span")){
                var child = x.children('a');
                if(child.attr('title') == 'Quest points'){
                    lookingForQuestname = true;
                }
            }
            if(x.is('a') && lookingForQuestname){
                lookingForQuestname = false;
                reqs[area]["quests"].push(x.attr('title'));
            }
        })
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