var http = require('http');
const {
    stringify
} = require('querystring');
var spawn = require('child_process').spawn;
let server = http.createServer();

server.on('request', function (request, response) {
    response.writeHead(200, {
        'Content-Type': 'text/html;  charset=utf-8'
    });
    let url = request.url.toString();
    console.log(typeof url);
    console.log(url);
    if (url == "/swagger") {
        runCommand('sh', ['-c', 'curl --insecure www.baidu.com/api/v3/api-docs'], response);
    } else if (url.startsWith("/ofd")) {
        runCommand('sh', ['-c', 'curl --insecure www.baidu.com/api/preview/html/b943113a8fcc483780b3097052d305c1.ofd'], response);
    } else if (url.startsWith("/package")) {
        package(url, response);
    } else if (url.startsWith("/start")) {
        start(url, response);
    } else {
        response.write("hello world <br/>");
        response.end();
    }
})

function package(url, response) {
    let urls = url.split("/", -1);
    console.log(urls);
    if (urls.length != 3) {
        response.write("NO!");
        response.end();
    }
    if (urls[2] == 'all') {
        let path = '/xxx/app/';
        let shell = 'packageAll.sh';
        runCommandWithPath('sh', [shell], path, response);
    } else {
        let path = '/xxx/app/' + urls[2] + '/';
        let shell = 'package.sh';
        runCommandWithPath('sh', [shell], path, response);
    }
}

function start(url, response) {
    let urls = url.split("/", -1);
    console.log(urls);
    if (urls.length != 3) {
        response.write("NO!");
        response.end();
    }
    if (urls[2] == 'all') {
        let path = '/xxx/app/';
        let shell = 'startAll.sh';
        runCommandWithPath('sh', [shell], path, response);
    } else {
        let path = '/xxx/app/' + urls[2] + '/';
        let shell = 'start.sh';
        runCommandWithPath('sh', [shell], path, response);
    }
}

server.listen(30002, function () {
    console.log("服务启动");
})

function runCommandWithPath(cmd, args, path, response) {
    let child = spawn(cmd, args, {
        cwd: path
    });
    child.stdout.on('data', function (data) {
        //console.log('child output:\n' + data);
        response.write(data + "<br/>");
    });

    // 捕获标准错误输出并将其打印到控制台
    child.stderr.on('data', function (data) {
        //console.log('child error output:\n' + data);
        response.write(data + "<br/>");
    });

    // 注册子进程关闭事件
    child.on('exit', function (code, signal) {
        console.log('child process eixt ,exit:' + code);
        response.end();
    });
}

function runCommand(cmd, args, response) {
    let child = spawn(cmd, args);
    child.stdout.on('data', function (data) {
        //console.log('child output:\n' + data);
        response.write(data + "\n");
    });

    // 捕获标准错误输出并将其打印到控制台
    child.stderr.on('data', function (data) {
        //console.log('child error output:\n' + data);
        response.write(data + "\n");
    });

    // 注册子进程关闭事件
    child.on('exit', function (code, signal) {
        console.log('child process eixt ,exit:' + code);
        response.end();
    });
}
