'use strict';
const menu=document.querySelector('.menu-toggle'),nav=document.querySelector('nav');
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open);});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');}});
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
if('IntersectionObserver' in window&&!reduced.matches){document.body.classList.add('enhanced');const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}),{threshold:.08});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));}
const photos=[{"src": "paris-pareja.webp", "alt": "Pareja frente a la torre Eiffel bajo el cielo azul", "title": "Un instante en París"}, {"src": "paris-retrato.webp", "alt": "Retrato frente al Arco del Triunfo al atardecer", "title": "La ciudad, otra luz"}, {"src": "portrait.webp", "alt": "Retrato editorial de muestra generado con IA", "title": "Retrato · Muestra IA"}, {"src": "product.webp", "alt": "Fotografía comercial de muestra generada con IA", "title": "Fotografía comercial · Muestra IA"}, {"src": "interior.webp", "alt": "Interior de muestra generado con IA", "title": "Espacios · Muestra IA"}];
const dialog=document.querySelector('.lightbox'),view=document.querySelector('#photo-view');let current=0;
function displayPhoto(index){current=(index+photos.length)%photos.length;const photo=photos[current];view.src=photo.src;view.alt=photo.alt;document.querySelector('#photo-title').textContent=photo.title;document.querySelector('#photo-count').textContent=(current+1)+' / '+photos.length;view.classList.remove('photo-enter');void view.offsetWidth;view.classList.add('photo-enter');}
document.querySelectorAll('.photo').forEach(button=>button.addEventListener('click',()=>{displayPhoto(Number(button.dataset.index));dialog.showModal();document.body.classList.add('locked');}));
document.querySelector('#close-photo').addEventListener('click',()=>dialog.close());
document.querySelector('#previous').addEventListener('click',()=>displayPhoto(current-1));document.querySelector('#next').addEventListener('click',()=>displayPhoto(current+1));
dialog.addEventListener('close',()=>document.body.classList.remove('locked'));
dialog.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();displayPhoto(current+1);}if(e.key==='ArrowLeft'){e.preventDefault();displayPhoto(current-1);}});
let touchStart=0;view.addEventListener('touchstart',e=>{touchStart=e.changedTouches[0].clientX;},{passive:true});view.addEventListener('touchend',e=>{const distance=e.changedTouches[0].clientX-touchStart;if(Math.abs(distance)>50)displayPhoto(current+(distance<0?1:-1));},{passive:true});
document.querySelectorAll('a[href$=".html"]').forEach(link=>link.addEventListener('click',e=>{if(reduced.matches||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey||e.button!==0)return;e.preventDefault();document.body.classList.add('page-leave');setTimeout(()=>{location.href=link.href;},180);}));
window.addEventListener('pageshow',()=>document.body.classList.remove('page-leave'));
const form=document.querySelector('#contact-form');
if(form){const date=form.elements.date;const now=new Date();date.min=[now.getFullYear(),String(now.getMonth()+1).padStart(2,'0'),String(now.getDate()).padStart(2,'0')].join('-');form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;const data=new FormData(form);const text=['Hola Andrés,','',`Soy ${String(data.get('name')).trim()}.`,`Me gustaría hablar sobre: ${data.get('project')}.`,`Mi correo: ${data.get('email')}`,data.get('date')?`Fecha preferida: ${data.get('date')} (pendiente de disponibilidad).`:'', '',String(data.get('message')||'').trim()].filter((line,index,array)=>line!==''||array[index-1]!=='').join('\n');document.querySelector('#request-text').textContent=text;document.querySelector('#send-request').href='mailto:amoncadstudio@gmail.com?subject='+encodeURIComponent('Consulta · '+data.get('project'))+'&body='+encodeURIComponent(text);document.querySelector('#request-preview').hidden=false;document.querySelector('#request-preview').scrollIntoView({behavior:reduced.matches?'instant':'smooth',block:'nearest'});});document.querySelector('#copy-request').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(document.querySelector('#request-text').textContent);document.querySelector('#copy-status').textContent='Solicitud copiada.';}catch{document.querySelector('#copy-status').textContent='Puedes seleccionar y copiar el texto de arriba.';}});}

// Native horizontal scrolling preserves touch momentum and vertical page gestures.
document.querySelectorAll('.gallery-shell').forEach(shell=>{
 const track=shell.querySelector('.gallery'),back=shell.querySelector('.gallery-back'),forward=shell.querySelector('.gallery-forward');
 const step=()=>track.querySelector('figure').getBoundingClientRect().width+24;
 const move=direction=>track.scrollBy({left:direction*step(),behavior:reduced.matches?'instant':'smooth'});
 const update=()=>{back.disabled=track.scrollLeft<2;forward.disabled=track.scrollLeft>=track.scrollWidth-track.clientWidth-2;};
 back.addEventListener('click',()=>move(-1));forward.addEventListener('click',()=>move(1));
 track.addEventListener('scroll',update,{passive:true});window.addEventListener('resize',update);update();
 track.addEventListener('keydown',e=>{if(e.target!==track)return;if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();move(e.key==='ArrowRight'?1:-1);}});
 let startX=0,startY=0,moved=false;
 track.addEventListener('pointerdown',e=>{startX=e.clientX;startY=e.clientY;moved=false;});
 track.addEventListener('pointermove',e=>{if(Math.hypot(e.clientX-startX,e.clientY-startY)>10)moved=true;});
 track.addEventListener('click',e=>{if(moved){e.preventDefault();e.stopImmediatePropagation();}},true);
});
