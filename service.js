// Local-only app-launch service for TizenBrew (Node 4 / ES5 compatible).
var http=require('http'),url=require('url');
var PORT=8093,HOSTS=['127.0.0.1:'+PORT,'localhost:'+PORT],ORIGINS=['http://127.0.0.1:8081','http://localhost:8081'];
var ALLOWED={
  'evKhCgZelL.AmazonIgnitionLauncher2':1,
  'kIciSQlYEM.plex':1,
  'org.tizen.netflix-app':1,
  'rJeHak5zRg.Spotify':1
};
function send(res,code,text){try{res.writeHead(code,{'Content-Type':'text/plain; charset=utf-8'});res.end(text||'')}catch(e){}}
function handler(req,res){try{var q=url.parse(req.url,true),origin=req.headers.origin;if(HOSTS.indexOf(req.headers.host)<0||ORIGINS.indexOf(origin)<0)return send(res,403,'');res.setHeader('Access-Control-Allow-Origin',origin);if(q.pathname!=='/launch'||!ALLOWED[String(q.query.id||'')])return send(res,404,'');if(typeof tizen==='undefined')return send(res,500,'Tizen API unavailable');tizen.application.launch(String(q.query.id),function(){send(res,200,'ok')},function(e){send(res,500,(e&&e.message)||'launch failed')})}catch(e){send(res,500,'error')}}
try{var server=process.__eliHomeServer;if(server){server.removeAllListeners('request');server.on('request',handler)}else{server=http.createServer(handler);server.on('error',function(){});server.listen(PORT,'127.0.0.1');process.__eliHomeServer=server}}catch(e){}
