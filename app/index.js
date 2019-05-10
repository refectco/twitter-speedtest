const fs = require('fs');
const { execSync } = require('child_process');

// optional
// speedtest-cli --list: list the available servers
// grep -i: search ignore lower-case
// Toronto: the keyword you want to search for
// -m 1: only take the first line
const a = execSync('speedtest-cli --list | grep -i Toronto -m 1');
const server = a.toString();
const id = server.substring(0, server.indexOf(')'));

// --server ${id} is optional
const b = execSync(`speedtest-cli --json --secure --server ${id}`);  
const result = b.toString();

const json = JSON.parse(result);
    
const download = json.download;
const upload = json.upload;

console.log(`download ${download / 1048576} MiB/s`);
console.log(`upload ${upload / 1048576} MiB/s`);

// optional 
fs.writeFileSync(`${__dirname}/speedtest/results/${json.timestamp}`, result);