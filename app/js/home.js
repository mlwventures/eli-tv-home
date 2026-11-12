(function(){
  'use strict';
  var buttons=[].slice.call(document.querySelectorAll('.app'));
  var index=0,toastTimer;
  var timeNode=document.getElementById('time');
  var dateNode=document.getElementById('date');
  var greetingNode=document.getElementById('greeting');
  var statusNode=document.getElementById('status');
  var toastNode=document.getElementById('toast');
  var DAYS=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  var MONTHS=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var KEY={LEFT:37,UP:38,RIGHT:39,DOWN:40,OK:13,BACK:10009,RED:403,GREEN:404};
  function pad(n){return n<10?'0'+n:String(n)}
  function clock(){
    var d=new Date(),h=d.getHours();
    timeNode.textContent=pad(h)+':'+pad(d.getMinutes());
    dateNode.textContent=DAYS[d.getDay()]+' · '+MONTHS[d.getMonth()]+' '+d.getDate();
    greetingNode.textContent=(h<12?'Good morning':h<18?'Good afternoon':'Good evening')+', Eli.';
  }
  function say(s){
    toastNode.textContent=s;
    toastNode.className='toast show';
    clearTimeout(toastTimer);
    toastTimer=setTimeout(function(){toastNode.className='toast'},2600);
  }
  function focus(n){
    if(!buttons.length){return}
    index=(n+buttons.length)%buttons.length;
    buttons[index].focus();
  }
  function launch(id){
    statusNode.textContent='Opening…';
    var x=new XMLHttpRequest();
    x.open('GET','http://127.0.0.1:8093/launch?id='+encodeURIComponent(id),true);
    x.timeout=6000;
    x.onload=function(){if(x.status!==200){say('Could not open this app');statusNode.textContent='Ready'}};
    x.onerror=x.ontimeout=function(){say('Launcher service is unavailable');statusNode.textContent='Ready'};
    x.send();
  }
  function activate(){
    var b=buttons[index],msg=b.getAttribute('data-unavailable');
    if(msg){say(msg);return}
    launch(b.getAttribute('data-app'));
  }
  document.addEventListener('keydown',function(e){
    if(e.keyCode===KEY.LEFT){focus(index-1);e.preventDefault()}
    else if(e.keyCode===KEY.RIGHT){focus(index+1);e.preventDefault()}
    else if(e.keyCode===KEY.UP||e.keyCode===KEY.DOWN){focus(index);e.preventDefault()}
    else if(e.keyCode===KEY.OK){activate();e.preventDefault()}
    else if(e.keyCode===KEY.RED){say('Prime · Plex · Netflix · Spotify · SiriusXM pending');e.preventDefault()}
    else if(e.keyCode===KEY.GREEN){location.reload();e.preventDefault()}
    else if(e.keyCode===KEY.BACK){say('Eli Home stays ready for you');e.preventDefault()}
  });
  clock();
  setInterval(clock,60000);
  focus(0);
}());
