const http = require('http');
const fs = require('fs');
const url = require('url');
const qs = require('querystring');

const style_css = fs.readFileSync('./style.css', 'utf8');
const page = fs.readFileSync('./index.html', 'utf8');
var msg = 'initial';
const server = http.createServer(gertFromClient).listen(3000);
console.log('Server Start!');


function gertFromClient(rq, rs) {
    console.log('access!');
    const url_parts = url.parse(rq.url, true);
    switch (url_parts.pathname) {
        case '/style.css':
            rs.writeHead(200, { 'Content-type': 'text/html' });
            rs.write(style_css);
            rs.end();
            break;

        default:
            fs.readFile('./index.html', 'UTF-8', function (error, data) {
                if (rq.method == 'POST') {
                    body = '';
                    rq.on('data', function (data) {
                        body += data;
                    });

                    rq.on('end', function () {
                        post_data = qs.parse(body);
                        msg += post_data.msg + '<br>';
                        content = page.replace('msg', msg);
                        setCookie('msg', post_data.msg, rs);
                        rs.writeHead(200, { 'Content-type': 'text/html' });
                        console.log(getCookie('msg', rq));
                        content = content.replace('dummy_cookie', getCookie('msg', rq));
                        rs.write(content.replace('dummy_title', 'くそやろう！'));
                        rs.end();
                    });
                } else {
                    const query = url_parts.query;
                    if (query.msg != undefined) {
                        data = data.replace('dummy_msg', 'くえり：' + query.msg + '<br>');
                    } else {
                        data = data.replace('dummy_msg', msg);
                    }
                    rs.writeHead(200, { 'Content-type': 'text/html' });
                    rs.write(data.replace('dummy_title', 'くそやろう！'));
                    data = data.replace('dummy_cookie', getCookie('msg', rq));
                    rs.end();
                }


            });
            break;
    }

}

function setCookie(key, value, responce) {
    const cookie = escape(value);
    responce.setHeader('Set-Cookie', [key + '=' + cookie]);
}

function getCookie(key, request) {
    const cookie_data = request.headers.cookie != undefined ? request.headers.cookie : '';
    const data = cookie_data.split(';');
    data.forEach(function (e) {
        const l = (key + '=').length
        if (e.trim().substring(0, l) == key + '=') {
            const result = e.trim().substring(key.length + 1);
            return unescape(result);
        }
    });
    return '';
}

/*
function writeToResponce(error, data) {
    rs.writeHead(200, { 'Content-type': 'text/html' });
    rs.write(data);
    rs.end();
}*/