// get quest names
(function(){
    var output = [];
    $('table.sortable tr').find('td:nth-child(2)').each((i, x) =>{
        output.push($(x).data('sortValue'))
    })
    window.output = output;
}())

// get details text
(function(){
    var detailsOutput = [];
    $('tr[data-taskid]').each((i, basicRow) => {
        var row = $(basicRow);
        var id = row.data('taskid');
        var detailsCell = row.find("td:nth(3)");
        detailsOutput.push({id, details: detailsCell.text()});
    })
    window.detailsOutput = detailsOutput;
}())