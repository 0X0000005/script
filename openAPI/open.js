var http = require('http');
var spawn = require('child_process').spawn;
let server = http.createServer();

server.on('request', function (request, response) {
    response.writeHead(200,  {'Content-Type':  'text/html;  charset=utf-8'});  
    let url = request.url.toString();
    console.log(typeof url);
    if (url == "/swagger"){
        runCommand('sh',['-c','curl --insecure www.baidu.com'],response);
    } else if (url.startsWith( "/ofd")){
    	 runCommand('sh',['-c','curl --insecure www.baidu.com'],response);
    } else {
        response.write("hello world");
        response.end();
    }
})

server.listen(30002,function(){
    console.log("服务启动");
})



function runCommand(cmd,args,response) {
    let child = spawn(cmd,args);
    child.stdout.on('data', function (data) {
        //console.log('child output:\n' + data);
        response.write(data);
    });

    // 捕获标准错误输出并将其打印到控制台
    child.stderr.on('data', function (data) {
        //console.log('child error output:\n' + data);
        //response.write(data);
    });

    // 注册子进程关闭事件
    child.on('exit', function (code, signal) {
        console.log('child process eixt ,exit:' + code);
        response.end();
    });
}
