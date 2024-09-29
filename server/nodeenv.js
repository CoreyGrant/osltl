const fs = require('fs');
const path = require('path');
const filename = path.join(__dirname, '../.env');

if(fs.existsSync(filename)){
    const file = fs.readFileSync(filename, {encoding: 'utf8'});
    const lines = file.split('\n').map(x => x.trim().split('='));
    for(const line of lines){
        process.env[line[0]] = line[1];
    }
}