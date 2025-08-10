// Single script for WIP page
(function(){
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const wordCycle = document.querySelector('.word-cycle');
  if (wordCycle) {
    const words = JSON.parse(wordCycle.getAttribute('data-words'));
    let idx = 0; const span = wordCycle.querySelector('.word');
    setInterval(()=>{
      span.animate({opacity:[1,0],transform:['translateY(0%)','translateY(-40%)']},{duration:320,easing:'ease',fill:'forwards'});
      setTimeout(()=>{ idx=(idx+1)%words.length; span.textContent=words[idx]; span.animate({opacity:[0,1],transform:['translateY(40%)','translateY(0%)']},{duration:420,easing:'cubic-bezier(.4,.8,.2,1)',fill:'forwards'}); },280);
    },2600);
  }

  const phaseEl = document.getElementById('phase');
  const phases=['Concept','Design','Build','Refine','Launch']; let phaseIdx=0;
  setInterval(()=>{ if(!phaseEl) return; phaseIdx=(phaseIdx+1)%phases.length; phaseEl.textContent=phases[phaseIdx]; },7000);

  const notifyBtn=document.getElementById('notifyBtn');
  if (notifyBtn) notifyBtn.addEventListener('click',()=>{ window.location.href='mailto:contact@picture-up.co?subject=Launch%20Notification&body=Hi%20Picture%20Up%20Team,%0D%0A%0D%0APlease%20notify%20me%20when%20the%20new%20site%20launches.%0D%0A%0D%0AThank%20you!'; });

  const canvas=document.getElementById('grain');
  if(canvas){
    const ctx=canvas.getContext('2d'); let w,h; const resize=()=>{ w=canvas.width=window.innerWidth; h=canvas.height=window.innerHeight; }; window.addEventListener('resize',resize); resize();
    const density=1400; const particles=new Array(density).fill().map(()=>({x:Math.random()*w,y:Math.random()*h,a:Math.random()*0.06}));
    (function frame(){ ctx.clearRect(0,0,w,h); particles.forEach(p=>{ ctx.fillStyle=`rgba(255,255,255,${p.a*(0.5+Math.random())})`; ctx.fillRect(p.x+(Math.random()-.5)*1.2,p.y+(Math.random()-.5)*1.2,1,1); }); requestAnimationFrame(frame); })();
  }

  if(window.gsap){
    gsap.from('.title .brand',{opacity:0,y:40,duration:1.2,ease:'power3.out'});
    gsap.from('.tagline',{opacity:0,y:30,delay:.2,duration:1.1,ease:'power3.out'});
    gsap.from('.progress-wrapper',{opacity:0,y:30,delay:.35,duration:1.1,ease:'power3.out'});
    gsap.from('.cta',{opacity:0,y:30,delay:.5,duration:1,ease:'power3.out',stagger:.08});
    gsap.from('.social-footer a',{opacity:0,y:10,delay:.8,duration:.8,ease:'power3.out',stagger:.06});
  }
})();
