(function(){
  'use strict';
  var buttons=[].slice.call(document.querySelectorAll('.app'));
  var index=0,toastTimer,returnTimer,externalLaunchUntil=0;
  var timeNode=document.getElementById('time');
  var dateNode=document.getElementById('date');
  var greetingNode=document.getElementById('greeting');
  var statusNode=document.getElementById('status');
  var toastNode=document.getElementById('toast');
  var DAYS=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  var MONTHS=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var KEY={LEFT:37,UP:38,RIGHT:39,DOWN:40,OK:13,BACK:10009,RED:403,GREEN:404};
  var protectedHomeCodes={};
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
    externalLaunchUntil=Date.now()+15000;
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
  function protectHomeKey(){
    var input,keys,i,key,name;
    try{
      input=window.tizen&&tizen.tvinputdevice;
      if(!input){return}
      keys=input.getSupportedKeys()||[];
      for(i=0;i<keys.length;i+=1){
        key=keys[i];
        name=String(key.name||'');
        if(/home|smart\s*hub/i.test(name)){
          try{
            input.registerKey(name);
            protectedHomeCodes[key.code]=true;
          }catch(ignore){}
        }
      }
    }catch(ignore){}
  }
  function recoverFromPlatformOverlay(){
    clearTimeout(returnTimer);
    returnTimer=setTimeout(function(){
      var app;
      if(Date.now()<externalLaunchUntil||document.visibilityState==='hidden'){return}
      try{
        app=tizen.application.getCurrentApplication();
        tizen.application.launch(app.appInfo.id);
      }catch(ignore){}
    },900);
  }
  document.addEventListener('keydown',function(e){
    if(protectedHomeCodes[e.keyCode]){
      say('Eli Home');
      focus(index);
      e.preventDefault();
      e.stopPropagation();
      if(e.stopImmediatePropagation){e.stopImmediatePropagation()}
    }
    else if(e.keyCode===KEY.LEFT){focus(index-1);e.preventDefault()}
    else if(e.keyCode===KEY.RIGHT){focus(index+1);e.preventDefault()}
    else if(e.keyCode===KEY.UP||e.keyCode===KEY.DOWN){focus(index);e.preventDefault()}
    else if(e.keyCode===KEY.OK){activate();e.preventDefault()}
    else if(e.keyCode===KEY.RED){say('Prime · Plex · Netflix · Spotify · SiriusXM pending');e.preventDefault()}
    else if(e.keyCode===KEY.GREEN){location.reload();e.preventDefault()}
    else if(e.keyCode===KEY.BACK){say('Eli Home stays ready for you');e.preventDefault()}
  });
  window.addEventListener('blur',recoverFromPlatformOverlay);
  document.addEventListener('visibilitychange',function(){
    if(document.visibilityState==='visible'&&!document.hasFocus()){
      recoverFromPlatformOverlay();
    }
  });
  protectHomeKey();
  clock();
  setInterval(clock,60000);
  focus(0);
}());
