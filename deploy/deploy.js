var http = require('http');
var spawn = require('child_process').spawn;
var createHandler = require('github-webhook-handler');
// 下面填写的myscrect跟github webhooks配置一样，下一步会说；path是我们访问的路径
var handler = createHandler({
    path: '/api/push',
    secret: 'paperlessDeploy@'
});
http.createServer(function (req, res) {
    handler(req, res, function (err) {
        res.statusCode = 404;
        res.end('no such location');
    })
}).listen(30001);
handler.on('error', function (err) {
    console.error('Error:', err.message)
});

const master_ref = 'refs/heads/master';

let removeUser = 'userName'

// 监听到push事件的时候执行我们的自动化脚本
handler.on('push', function (event) {
    let ref =  event.payload.ref;
    let pushName = event.payload.pusher.name;
    console.log('Received a push event for %s to %s,pushName %s',
        event.payload.repository.name,
        ref,pushName);
    if (pushName == removeUser){
    	return;
    }
    //只有收到master更新才部署 其他忽略掉
    if (ref == master_ref) {
        runCommand('sh', ['/home/paperless/app/package.sh']);
    }
});

function runCommand(cmd, args, callback) {
    console.log("start deploy");
    let child = spawn(cmd, args);
    child.stdout.on('data', function (data) {
        console.log('child output:\n' + data);
    });

    // 捕获标准错误输出并将其打印到控制台
    child.stderr.on('data', function (data) {
        console.log('child error output:\n' + data);
    });

    // 注册子进程关闭事件
    child.on('exit', function (code, signal) {
        console.log('child process eixt ,exit:' + code);
    });
}
