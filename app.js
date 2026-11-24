'use strict';
const nav=document.querySelector('#main-navigation');
const menu=document.querySelector('.menu-toggle');
function closeMenu(){menu.setAttribute('aria-expanded','false');delete nav.dataset.open;}
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.dataset.open=String(open);});
nav.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.getAttribute('aria-expanded')==='true'){closeMenu();menu.focus();}});
document.addEventListener('click',e=>{if(!e.target.closest('.header'))closeMenu();});
const visit=document.querySelector('#visit'),form=document.querySelector('#request'),done=document.querySelector('#done');
const nameInput=form.elements.name,phoneInput=form.elements.phone,topic=form.elements.topic;
function error(input,message){input.setAttribute('aria-invalid',String(Boolean(message)));document.getElementById(input.name+'-error').textContent=message;}
function validName(value){return value.trim().length>=2&&/[\p{L}]/u.test(value);}
function normalPhone(value){const text=value.trim();if(!/^\+?[\d\s()\-]+$/.test(text))return null;let digits=text.replace(/\D/g,'');if(digits.length===10)digits='7'+digits;if(digits.length!==11||!/[78]/.test(digits[0]))return null;return '+7'+digits.slice(1);}
function showForm(){form.hidden=false;done.hidden=true;}
document.querySelectorAll('[data-visit]').forEach(button=>button.addEventListener('click',()=>{
 closeMenu();const requested=button.dataset.visit;
 if(requested){let option=[...topic.options].find(o=>o.value===requested);if(!option){option=new Option(requested,requested);topic.add(option);}topic.value=requested;}
 showForm();visit.showModal();requestAnimationFrame(()=>nameInput.focus({preventScroll:true}));
}));
nameInput.addEventListener('input',()=>error(nameInput,''));phoneInput.addEventListener('input',()=>error(phoneInput,''));
form.addEventListener('submit',event=>{event.preventDefault();const nameOK=validName(nameInput.value),phone=normalPhone(phoneInput.value);error(nameInput,nameOK?'':'Введите имя: не менее двух символов и хотя бы одна буква.');error(phoneInput,phone?'':'Введите номер РФ: +7 или 8 и ещё 10 цифр.');if(!nameOK||!phone){(nameOK?phoneInput:nameInput).focus();return;}nameInput.value=nameInput.value.trim();phoneInput.value=phone;form.hidden=true;done.hidden=false;done.focus();});
document.querySelector('#edit-request').addEventListener('click',()=>{showForm();nameInput.focus();});
const lightbox=document.querySelector('#lightbox'),image=document.querySelector('#lightbox-image'),caption=document.querySelector('#lightbox-caption');
const photos=[...document.querySelectorAll('.photo a')].filter(a=>a.querySelector('img'));let photoIndex=0;
function showPhoto(index){photoIndex=(index+photos.length)%photos.length;const a=photos[photoIndex];image.src=a.href;image.alt=a.querySelector('img').alt;caption.textContent=`${photoIndex+1} / ${photos.length} · ${image.alt}`;}
photos.forEach((a,index)=>a.addEventListener('click',e=>{e.preventDefault();showPhoto(index);lightbox.showModal();}));
document.querySelector('#previous-photo').addEventListener('click',()=>showPhoto(photoIndex-1));document.querySelector('#next-photo').addEventListener('click',()=>showPhoto(photoIndex+1));
lightbox.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();showPhoto(photoIndex-1);}if(e.key==='ArrowRight'){e.preventDefault();showPhoto(photoIndex+1);}});
let touchStart=null;image.addEventListener('touchstart',e=>{touchStart=e.changedTouches[0].clientX;},{passive:true});image.addEventListener('touchend',e=>{if(touchStart===null)return;const delta=e.changedTouches[0].clientX-touchStart;if(Math.abs(delta)>60)showPhoto(photoIndex+(delta<0?1:-1));touchStart=null;},{passive:true});
document.querySelectorAll('dialog').forEach(dialog=>{dialog.querySelectorAll('[data-close]').forEach(button=>button.addEventListener('click',()=>dialog.close()));dialog.addEventListener('click',e=>{if(e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();});dialog.addEventListener('close',()=>{if(!document.querySelector('dialog[open]'))document.documentElement.style.overflow='';});dialog.addEventListener('cancel',()=>{document.documentElement.style.overflow='';});});
new MutationObserver(()=>{document.documentElement.style.overflow=document.querySelector('dialog[open]')?'hidden':'';}).observe(document.body,{subtree:true,attributes:true,attributeFilter:['open']});
