const fs = require('fs');
const path = require('path');
const filename = path.join(__dirname, '../.env');
if(fs.existsSync(filename)){
    const file = fs.readFileSync(filename, {encoding: 'utf8'});
    const lines = file.split('\n').map(x => x.trim().split('=').map(x => x.trim()));
    for(const line of lines){
        process.env[line[0]] = line[1];
    }
}