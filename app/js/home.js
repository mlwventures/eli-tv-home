(function(){
  'use strict';
  var buttons=[].slice.call(document.querySelectorAll('.app')),index=0,toastTimer;
  var KEY={LEFT:37,UP:38,RIGHT:39,DOWN:40,OK:13,BACK:10009,RED:403,GREEN:404};
  function pad(n){return n<10?'0'+n:String(n)}
  function clock(){var d=new Date(),h=d.getHours();document.getElementById('time').textContent=pad(h)+':'+pad(d.getMinutes());document.getElementById('date').textContent=d.toLocaleDateString('en-CA',{weekday:'short',month:'short',day:'numeric'});document.getElementById('greeting').textContent=(h<12?'Good morning':h<18?'Good afternoon':'Good evening')+', Eli.'}
  function say(s){var t=document.getElementById('toast');t.textContent=s;t.className='toast show';clearTimeout(toastTimer);toastTimer=setTimeout(function(){t.className='toast'},2600)}
  function focus(n){index=(n+buttons.length)%buttons.length;buttons[index].focus()}
  function launch(id){document.getElementById('status').textContent='Opening…';var x=new XMLHttpRequest();x.open('GET','http://127.0.0.1:8093/launch?id='+encodeURIComponent(id),true);x.timeout=6000;x.onload=function(){if(x.status!==200){say('Could not open this app');document.getElementById('status').textContent='Ready'}};x.onerror=x.ontimeout=function(){say('Launcher service is unavailable');document.getElementById('status').textContent='Ready'};x.send()}
  function activate(){var b=buttons[index],msg=b.getAttribute('data-unavailable');if(msg)return say(msg);launch(b.getAttribute('data-app'))}
  document.addEventListener('keydown',function(e){if(e.keyCode===KEY.LEFT){focus(index-1);e.preventDefault()}else if(e.keyCode===KEY.RIGHT){focus(index+1);e.preventDefault()}else if(e.keyCode===KEY.UP||e.keyCode===KEY.DOWN){focus(index);e.preventDefault()}else if(e.keyCode===KEY.OK){activate();e.preventDefault()}else if(e.keyCode===KEY.RED){say('Prime · Plex · Netflix · Spotify · SiriusXM pending');e.preventDefault()}else if(e.keyCode===KEY.GREEN){location.reload();e.preventDefault()}else if(e.keyCode===KEY.BACK){say('Eli Home stays ready for you');e.preventDefault()}});
  focus(0);clock();setInterval(clock,15000);
}());
