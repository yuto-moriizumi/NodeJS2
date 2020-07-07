const http = require('http');
const fs = require('fs');
const ejs = require('ejs');
const url = require('url');
const qs = require('querystring');

const index_page = fs.readFileSync('./index.ejs', 'utf8');
const login_page = fs.readFileSync('./login.ejs', 'utf8');

const max_retain = 10;
const filename = 'mydata.txt';
let message_data;
readFromFile(filename);

const server = http.createServer(getFromClient);
server.listen(3000);
console.log('server start');

function getFromClient(request, responce) {
    const url_parts = url.parse(request.url, true);
    switch (url_parts.pathname) {
        case '/':
            responce_index(request, responce);
            break;
        case '/login':
            responce_login(request, responce);
            break;
        default:
            responce.writeHead(200, { 'Content-Type': 'text/html' });
            responce.end('no page...');
            break;
    }
}

function responce_login(request, responce) {
    const content = ejs.render(login_page, {});
    responce.writeHead(200, { 'Content-Type': 'text/html' });
    responce.write(content);
    responce.end();
}

function responce_index(request, responce) {
    if (request.method == 'POST') {
        let body = '';
        request.on('data', (data) => {
            body += data;
        });
        request.on('end', () => {
            data = qs.parse(body);
            addToData(data.id, data.msg, filename, request);
            write_index(request, responce);
        });
    } else {
        write_index(request, responce);
    }
}

function write_index(request, responce) {
    let msg = "※何かメッセージを書いてください。";
    const content = ejs.render(index_page, {
        title: 'Index',
        content: msg,
        data: message_data,
        filename: 'data_item',
    });
    responce.writeHead(200, { 'Content-Type': 'text/html' });
    responce.write(content);
    responce.end();
}

function readFromFile(fname) {
    fs.readFile(fname, 'utf8', (err, data) => {
        message_data = data.split('\n');
    });
}

//データを更新
function addToData(id, msg, fname, request) {
    const obj = {
        'id': id,
        'msg': msg,
    };
    const obj_str = JSON.stringify(obj);
    console.log('add_data' + obj_str);
    message_data.unshift(obj_str);
    if (message_data.length > max_retain) {
        message_data.pop();
    }
    saveToFile(fname);
}

function saveToFile(fname) {
    const data_str = message_data.join('\n');
    fs.writeFile(fname, data_str, (err) => {
        if (err) { throw err; }
    });
}
