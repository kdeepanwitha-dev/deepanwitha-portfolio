// The opening animation always releases the page, with an immediate skip option.
const intro=document.querySelector('#portfolio-intro');
if(intro){
  const content=[document.querySelector('.header'),document.querySelector('main')].filter(Boolean);
  content.forEach(el=>el.inert=true);
  document.documentElement.classList.add('intro-active');
  let introClosed=false;
  const dismissIntro=(moveFocus=false)=>{
    if(introClosed)return;
    introClosed=true;
    intro.hidden=true;
    content.forEach(el=>el.inert=false);
    document.documentElement.classList.remove('intro-active');
    if(moveFocus)document.querySelector('.header .brand')?.focus({preventScroll:true});
  };
  const introTimer=setTimeout(()=>dismissIntro(),window.matchMedia('(prefers-reduced-motion: reduce)').matches?100:2600);
  intro.querySelector('button')?.addEventListener('click',()=>{clearTimeout(introTimer);dismissIntro(true);});
  intro.addEventListener('keydown',event=>{if(event.key==='Escape'){clearTimeout(introTimer);dismissIntro(true);}});
}
const menu=document.querySelector(".menu"),nav=document.querySelector("#nav");
menu?.addEventListener("click",()=>{const open=nav.classList.toggle("open");menu.setAttribute("aria-expanded",String(open));menu.querySelector("b").textContent=open?"×":"+";});
nav?.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{nav.classList.remove("open");menu?.setAttribute("aria-expanded","false");menu?.querySelector("b")&&(menu.querySelector("b").textContent="+");}));
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("visible");observer.unobserve(e.target);}}),{threshold:.12});
document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));
const form=document.querySelector("#contact-form"),status=document.querySelector("#form-status");
form?.addEventListener("submit",async e=>{e.preventDefault();status.textContent="Sending your message…";const data=Object.fromEntries(new FormData(form).entries());try{const base=window.PORTFOLIO_CONFIG?.API_BASE_URL||"";const response=await fetch(`${base}/api/contact`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});const result=await response.json();if(!response.ok)throw new Error(result.detail||"Could not send your message.");status.textContent=result.message||"Thanks — your message has been received.";form.reset();}catch(err){status.textContent=err.message==="Failed to fetch"?"The contact service is not connected yet. Please try again later.":err.message;}});

// Gentle depth on artwork; pointer tracking is optional and respects motion preferences.
const motionPreference=window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer=window.matchMedia('(hover: hover) and (pointer: fine)');
document.querySelectorAll('.project-art, .feature-art, .pharmacy-visual').forEach(art=>{
  art.addEventListener('pointermove',event=>{
    if(motionPreference.matches||!finePointer.matches)return;
    const rect=art.getBoundingClientRect();
    art.style.setProperty('--tilt-x',`${(0.5-(event.clientY-rect.top)/rect.height)*7}deg`);
    art.style.setProperty('--tilt-y',`${((event.clientX-rect.left)/rect.width-0.5)*9}deg`);
  });
  art.addEventListener('pointerleave',()=>{
    art.style.removeProperty('--tilt-x');
    art.style.removeProperty('--tilt-y');
  });
});
