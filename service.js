// Local-only app-launch service for TizenBrew (Node 4 / ES5 compatible).
var http=require('http'),url=require('url'),fs=require('fs');
var PORT=8093,HOSTS=['127.0.0.1:'+PORT,'localhost:'+PORT],LOCAL_ORIGIN=/^http:\/\/(127\.0\.0\.1|localhost)(:\d+)?$/;
var ALLOWED={
  'evKhCgZelL.AmazonIgnitionLauncher2':1,
  'kIciSQlYEM.plex':1,
  'org.tizen.netflix-app':1,
  'rJeHak5zRg.Spotify':1
};
function send(res,code,text){try{res.writeHead(code,{'Content-Type':'text/plain; charset=utf-8'});res.end(text||'')}catch(e){}}
function read(path,max){try{var value=fs.readFileSync(path,'utf8');return value.slice(0,max||262144)}catch(e){return null}}
function list(path,max){try{return fs.readdirSync(path).slice(0,max||2048)}catch(e){return null}}
function diag(){return {
  capturedAt:new Date().toISOString(),
  process:{version:process.version,pid:process.pid,uid:process.getuid?process.getuid():null,gid:process.getgid?process.getgid():null},
  files:{
    version:read('/proc/version',8192),cmdline:read('/proc/cmdline',8192),cpuinfo:read('/proc/cpuinfo',131072),
    selfStatus:read('/proc/self/status',65536),mounts:read('/proc/mounts',262144),partitions:read('/proc/partitions',131072),
    devices:read('/proc/devices',131072),modules:read('/proc/modules',262144),filesystems:read('/proc/filesystems',65536),
    netTcp:read('/proc/net/tcp',262144),netTcp6:read('/proc/net/tcp6',262144),lsm:read('/sys/kernel/security/lsm',8192)
  },
  directories:{dev:list('/dev'),devI2c:list('/dev',4096),apps:list('/opt/usr/apps'),usrBin:list('/usr/bin',4096),procSysKernel:list('/proc/sys/kernel')}
}}
function handler(req,res){try{var q=url.parse(req.url,true),origin=req.headers.origin,remote=(req.connection&&req.connection.remoteAddress)||'';
  if(q.pathname==='/diag'){
    if(remote.indexOf('192.168.10.62')<0)return send(res,403,'');
    res.writeHead(200,{'Content-Type':'application/json','Cache-Control':'no-store'});return res.end(JSON.stringify(diag()));
  }
  if(HOSTS.indexOf(req.headers.host)<0||!LOCAL_ORIGIN.test(origin||''))return send(res,403,'');res.setHeader('Access-Control-Allow-Origin',origin);if(q.pathname!=='/launch'||!ALLOWED[String(q.query.id||'')])return send(res,404,'');if(typeof tizen==='undefined')return send(res,500,'Tizen API unavailable');tizen.application.launch(String(q.query.id),function(){send(res,200,'ok')},function(e){send(res,500,(e&&e.message)||'launch failed')})}catch(e){send(res,500,'error')}}
try{var server=process.__eliHomeServer;if(server){server.removeAllListeners('request');server.on('request',handler)}else{server=http.createServer(handler);server.on('error',function(){});server.listen(PORT,'0.0.0.0');process.__eliHomeServer=server}}catch(e){}
