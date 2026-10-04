/* ===== Seleção de plataforma -> abre o jogo ===== */
const plataformas = document.querySelectorAll('input[name="plataforma"]');
const seletorPlataforma = document.getElementById('seletor-plataforma');
const jogoVP = document.getElementById('vp');
let plataforma = null;
const joy = {x:0, y:0}; // analógico virtual (-1..1) // "computador" ou "celular"

plataformas.forEach((radio) => {
  radio.addEventListener('change', () => {
    if (!radio.checked) return;
    plataforma = radio.value;
    seletorPlataforma.classList.add('hidden');
    jogoVP.classList.remove('hidden');
    if (plataforma === 'celular') document.getElementById('touch').classList.remove('hidden');
    fit();   // recalcula a escala agora que o jogo está visível
    menu();  // mostra o menu do jogo (NOVO JOGO, CONTINUAR...)
  });
});

"use strict";
const $=s=>document.querySelector(s),cv=$("#c"),cx=cv.getContext("2d"),W=640,H=360;
const fmt=n=>"Cr$ "+n.toLocaleString("pt-BR",{minimumFractionDigits:2});
const rnd=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const OPT={rain:true,snd:true};
let ac=null;
function beep(f=440,d=.08,t="square"){if(!OPT.snd)return;try{ac=ac||new (window.AudioContext||window.webkitAudioContext)();const o=ac.createOscillator(),g=ac.createGain();o.type=t;o.frequency.value=f;g.gain.value=.04;o.connect(g);g.connect(ac.destination);o.start();o.stop(ac.currentTime+d)}catch(e){}}
const ITEMS=[
{id:"arroz",n:"Arroz 5kg",p:1800,req:1},{id:"feijao",n:"Feijão 1kg",p:1200,req:1},{id:"leite",n:"Leite 1L",p:900,req:1},
{id:"refri",n:"Refrigerante",p:700},{id:"doce",n:"Doce",p:300},{id:"revista",n:"Revista",p:600},{id:"brinq",n:"Brinquedo pequeno",p:500}];
const SAVE="eds_demo_v1";
let S,mode="menu",keys={},glitch=0,t=0,fonteT=0;
const NPC=[
{id:"mae",n:"Mãe",x:92,y:196,c:"#c0508a"},{id:"avo",n:"Avô",x:250,y:290,c:"#9aa"},
{id:"joao",n:"João",x:395,y:300,c:"#e8a33d"},{id:"maria",n:"Dona Maria",x:448,y:196,c:"#e05a3a"}];
function fresh(){return{x:110,y:230,money:0,budget:0,inv:[],stage:0,visits:0,prices:{},hp:100,notes:{}}}
function save(){try{localStorage.setItem(SAVE,JSON.stringify(S))}catch(e){}}
function load(){try{const s=localStorage.getItem(SAVE);return s?JSON.parse(s):null}catch(e){return null}}
const price=i=>S.prices[i.id]||i.p, has=id=>S.inv.includes(id);

/* ---------- UI helpers ---------- */
function overlay(title,text,btns){const o=$("#ov");o.style.display="flex";
 o.innerHTML=(title?"<h1>"+title+"</h1>":"")+(text?"<p>"+text+"</p>":"");
 btns.forEach(([l,f])=>{const b=document.createElement("button");b.textContent=l;b.onclick=()=>{beep(660,.05);f()};o.appendChild(b)});}
function closeOv(){$("#ov").style.display="none"}
function obj(){return["Falar com a mãe","Comprar os itens para casa (Dona Maria)","Comprar os itens para casa","Enfrentar o Consumista","Algo está errado..."][S.stage]||""}
function hud(){const h=$("#hud");h.style.display=(mode==="play"||mode==="dialog"||mode==="shop")?"block":"none";
 const sp=S.budget-S.money;
 h.innerHTML="<b>Lucas</b> HP: "+S.hp+"/100<br>DINHEIRO: "+fmt(S.budget)+"<br>GASTOS: "+fmt(sp)+"<br>SALDO: <b>"+fmt(S.money)+"</b><br><span class='small'>Objetivo:</span> "+obj();}

/* ---------- Diálogo ---------- */
let dq=[],dcb=null,prevMode="play";
function say(lines,cb){dq=lines.slice();dcb=cb||null;prevMode=mode==="dialog"?prevMode:mode;mode="dialog";$("#dlg").style.display="block";nextLine()}
function nextLine(){if(!dq.length){$("#dlg").style.display="none";mode=(mode==="dialog")?"play":mode;const f=dcb;dcb=null;if(f)f();hud();return}
 const [n,x]=dq.shift();$("#dlg .n").textContent=n;$("#dlg .t").textContent=x;beep(300,.03);}
$("#dlg").onclick=()=>{if(mode==="dialog")nextLine()};

/* ---------- Interações ---------- */
function interact(n){
 if(n.id==="mae"){
  if(S.stage===0){say([["Mãe","Lucas, precisamos comprar algumas coisas para casa."],["Lucas","Quanto temos?"],["Mãe","Pouco. Aqui estão Cr$ 5.000,00. Então escolha com cuidado."],["Mãe","Preciso de arroz, feijão e leite. O resto é por sua conta."],["Lucas","Entendi. O rádio está só chiando, né?"],["Mãe","Ele anda estranho. Vá ao mercadinho da Dona Maria."]],()=>{S.stage=1;S.money=5000;S.budget=5000;beep(880,.12);save()})}
  else say([["Mãe",S.stage===1?"O mercado fica ali na rua. Cuidado com o troco!":"Vá com calma, filho. Um dia de cada vez."]]);
 }else if(n.id==="avo"){
  const l=["Meu filho, o preço de hoje não é o de amanhã. Quem planeja, dorme melhor.","Anotar o que se gasta é como acender uma lanterna.","Seu pai era bom de conversa... mas não de contas."];
  say([["Avô",l[rnd(0,2)]]]);
 }else if(n.id==="joao"){
  const l=[["João","Estou juntando para uma bicicleta! Já guardei Cr$ 800."],["Lucas","Quanto falta?"],["João","Muito. Mas ontem gastei tudo em figurinhas... agora guardo primeiro e gasto depois."]];
  say(l);
 }else if(n.id==="maria"){
  if(S.stage===0)say([["Dona Maria","Bom dia! Hoje os preços mudam de manhã e de tarde, viu?"]]);
  else if(S.stage===1){say([["Dona Maria","Olá, Lucas! Dê uma olhada nas prateleiras."]],openShop)}
  else say([["Dona Maria","Volte sempre, Lucas!"]]);
 }
}

/* ---------- Mercado ---------- */
let notice="";
function openShop(){
 if(S.visits>=1&&!S.notes.infl){const it=ITEMS.find(i=>!has(i.id)&&i.id!=="arroz"&&i.id!=="doce")||ITEMS.find(i=>!has(i.id));
  if(it){S.prices[it.id]=Math.round(price(it)*1.15/10)*10;S.notes.infl=1;notice="Preço atualizado! "+it.n+" ficou mais caro.";beep(200,.2,"sawtooth");glitch=.5}}
 S.visits++;mode="shop";renderShop();hud();save()}
function renderShop(){const s=$("#shop");s.style.display="block";
 let h="<h2>MERCADINHO DA DONA MARIA</h2>";
 ITEMS.forEach(i=>{const own=has(i.id),p=price(i),ok=S.money>=p;
  h+="<div class='row'><span>"+i.n+"</span><i>"+(i.req?"NECESSÁRIO":"opcional")+"</i><em>"+fmt(p)+"</em><button "+(own||!ok?"disabled":"")+" onclick='buy(\""+i.id+"\")'>"+(own?"Comprado":"Comprar")+"</button></div>"});
 h+="<div id='notice'>"+notice+"</div><div class='row'><span>DINHEIRO "+fmt(S.budget)+" | GASTOS "+fmt(S.budget-S.money)+" | SALDO <b style='color:#c8f542'>"+fmt(S.money)+"</b></span><button style='width:70px' onclick='leaveShop()'>Sair</button></div>";
 s.innerHTML=h}
function buy(id){const i=ITEMS.find(x=>x.id===id),p=price(i);if(has(id))return;if(S.money<p){notice="Dinheiro insuficiente!";beep(150,.2);return renderShop()}
 S.money-=p;S.inv.push(id);notice="";beep(900,.08);hud();renderShop();save()}
function leaveShop(){
 const miss=ITEMS.filter(i=>i.req&&!has(i.id));
 $("#shop").style.display="none";mode="play";notice="";
 if(miss.length){say([["Dona Maria","Ainda faltam: "+miss.map(m=>m.n).join(", ")+"."],["Lucas","Verdade! Vou olhar de novo."]]);return}
 const good=S.money>=500,extras=S.inv.filter(i=>!ITEMS.find(x=>x.id===i).req).length;
 S.notes.good=good;
 say([["Dona Maria","Lista completa! "+(good?"Você conseguiu cumprir sua lista e ainda guardou dinheiro.":"Você gastou quase todo o dinheiro. Talvez seja melhor planejar antes da próxima compra.")],
  ["Lucas",extras?"Foi bom escolher com calma.":"Só o necessário. Sobrou para o mês."],["","As luzes da rua piscam. Algo se mexe entre os cartazes..."],["Consumista","PROMOÇÃO IMPERDÍVEL! COMPRE AGORA! SÓ HOJE!!!"]],
  ()=>{S.stage=3;save();startCombat()});
}

/* ---------- Combate ---------- */
const Cb={on:false,eh:60,ehMax:60,skill:3,busy:false,miss:false,turn:0,
 log(m){$("#log").textContent=m},
 act(k){if(!Cb.on||Cb.busy)return;beep(500,.06);let m="";
  if(k===1){const d=rnd(8,12);Cb.eh-=d;m="Lucas ataca! Dano: "+d+".";}
  else if(k===2){if(!Cb.skill)return Cb.log("Sem usos da habilidade! (acabou o fôlego)");Cb.skill--;const d=rnd(20,26);Cb.eh-=d;m="PENSAR ANTES DE COMPRAR! Dano: "+d+" ("+Cb.skill+" usos)";glitch=.3}
  else if(k===3){const o=["refri","doce","brinq"].find(has);if(!o)return Cb.log("Você não tem itens úteis. Quem sabe na próxima compra...");
   S.inv.splice(S.inv.indexOf(o),1);
   if(o==="refri"){S.hp=Math.min(100,S.hp+25);m="Refrigerante: +25 HP."}else if(o==="doce"){S.hp=Math.min(100,S.hp+12);m="Doce: +12 HP."}else{Cb.miss=true;m="Brinquedo distrai o Consumista!"}}
  else if(k===4){if(Math.random()<.35){Cb.log("Lucas escapou do impulso!");Cb.on=false;return setTimeout(winCombat,900)}m="Não deu para fugir!"}
  Cb.log(m);Cb.sync();
  if(Cb.eh<=0){Cb.eh=0;Cb.on=false;Cb.log("O Consumista se desfez em cupons!");return setTimeout(winCombat,1100)}
  Cb.busy=true;setTimeout(Cb.enemy,900)},
 enemy(){Cb.turn++;let m;
  if(Cb.miss){Cb.miss=false;m="Consumista olha o brinquedo e erra o golpe."}
  else if(Cb.turn%3===0){const d=rnd(12,15);S.hp-=d;m="OFERTA IMPERDÍVEL! Lucas perde "+d+" HP.";glitch=.3}
  else{const d=rnd(5,10);S.hp-=d;m="Consumista joga cupons! Lucas perde "+d+" HP."}
  if(S.hp<=0){S.hp=40;m+=" Lucas respira fundo e se recompõe (HP 40)."}
  Cb.log(m);beep(180,.15,"sawtooth");Cb.busy=false;Cb.sync()},
 sync(){hud()}};
function startCombat(){mode="combat";Cb.on=true;Cb.eh=60;Cb.skill=3;Cb.busy=false;Cb.turn=0;Cb.miss=false;$("#cmd").style.display="block";hud();Cb.log("Um CONSUMISTA aparece! Escolha: 1 Ataque 2 Habilidade 3 Item 4 Corrida")}
function winCombat(){$("#cmd").style.display="none";mode="fonte";fonteT=0;S.stage=4;save();hud()}

/* ---------- Fonte / Fim ---------- */
function endScreen(){mode="end";$("#hud").style.display="none";
 const sp=S.budget-S.money,mom=S.notes.good?"Muito bem, Lucas! Cada centavo guardado ajuda.":"Lucas... acho que vamos ter que deixar algumas coisas para depois.";
 overlay("FIM DA DEMO","Mas esta história está apenas começando...<br><br><span class='small'>Você gastou "+fmt(sp)+" e guardou "+fmt(S.money)+".<br>Mãe: \""+mom+"\"</span>",[["Menu principal",menu]])}

/* ---------- Menu ---------- */
function menu(){mode="menu";$("#hud").style.display="none";$("#cmd").style.display="none";$("#shop").style.display="none";$("#dlg").style.display="none";
 overlay("ENTRE DÍVIDAS<br>E SONHOS","",[["NOVO JOGO",()=>{S=fresh();save();closeOv();intro()}],["CONTINUAR",()=>{const s=load();if(!s)return alert("Nenhum jogo salvo.");S=s;closeOv();resume()}],["OPÇÕES",opts],["CRÉDITOS",cred],["SAIR",()=>overlay("","Obrigado por jogar! Pode fechar esta aba.",[["Voltar",menu]])]])}
function opts(){overlay("OPÇÕES","",[["Chuva: "+(OPT.rain?"SIM":"NÃO"),()=>{OPT.rain=!OPT.rain;opts()}],["Som: "+(OPT.snd?"SIM":"NÃO"),()=>{OPT.snd=!OPT.snd;opts()}],["Voltar",()=>mode==="paused"?pause():menu()]])}
function cred(){overlay("CRÉDITOS","Protótipo web da fase 1 de “Entre Dívidas e Sonhos”, projeto acadêmico de educação financeira com RPG. Nova Esperança, Lucas, a Fonte e o Consumista são criações ficcionais do jogo, não fatos históricos. Versão final planejada para GameMaker. Produzido pelo estudante do curso técnico em informática.",[["Voltar",menu]])}
function pause(){mode="paused";overlay("PAUSA","",[["Continuar",()=>{closeOv();mode="play"}],["Salvar",()=>{save();alert("Jogo salvo!")}],["Opções",opts],["Menu principal",()=>{save();menu()}]])}
function intro(){mode="dialog";S.x=110;S.y=230;
 say([["","Nova Esperança, fim dos anos 80. Os preços mudam toda semana."],["","Lucas acorda cedo. A mãe já está na porta, contando moedas."],["","Hoje ele vai aprender o que o dinheiro realmente pode fazer."]],()=>{mode="play";hud()})}
function resume(){hud();if(S.stage===3)startCombat();else if(S.stage>=4){mode="fonte";fonteT=0}else mode="play"}

/* ---------- Desenho ---------- */
const r=(x,y,w,h,c)=>{cx.fillStyle=c;cx.fillRect(Math.round(x),Math.round(y),w,h)};
const rain=Array.from({length:70},()=>({x:rnd(0,W),y:rnd(0,H),s:rnd(160,260)}));
function person(x,y,c,hair="#222"){r(x-5,y-18,10,6,"#e0ac80");r(x-5,y-20,10,3,hair);r(x-6,y-12,12,10,c);r(x-5,y-2,4,6,"#334");r(x+1,y-2,4,6,"#334")}
function building(x,y,w,h,c,label){r(x,y,w,h,c);r(x,y,w,6,"#222");for(let i=0;i<w-20;i+=26){r(x+10+i,y+22,14,16,Math.sin(t*2+i)>-.9?"#e8d870":"#443")}r(x+w/2-8,y+h-26,16,26,"#2a1a10");if(label){r(x+4,y+8,w-8,11,"#04140a");cx.fillStyle="#c8f542";cx.font="bold 9px monospace";cx.fillText(label,x+8,y+17)}}
function drawMap(){
 r(0,0,W,H,"#0a1a22");r(0,0,W,40,"#0b1230");
 for(let i=0;i<30;i++)r((i*97)%W,(i*53)%34,1,1,"#889");
 r(0,175,W,95,"#2c2f33");r(0,170,W,8,"#555a60");for(let i=0;i<W;i+=50)r(i,222,26,3,"#bba");
 r(0,270,W,90,"#143a22");r(200,276,250,70,"#1f5a33");
 building(30,50,130,125,"#6a4a3a","CASA");building(190,40,150,135,"#7a7f88","ESCOLA");building(370,60,150,115,"#8a3a3a","MERCADINHO");
 r(570,110,6,65,"#777");r(556,100,34,12,"#2ecc71");cx.fillStyle="#000";cx.font="bold 7px monospace";cx.fillText("ÔNIBUS",558,109);
 r(380,100,110,14,"#04140a");cx.fillStyle=(Math.sin(t*5)>.97)?"#f33":"#c8f542";cx.font="bold 9px monospace";cx.fillText("ARROZ Cr$ "+(S.prices.arroz||1800),385,111);
 r(230,298,36,6,"#5a3a1a");
 NPC.forEach(n=>person(n.x,n.y,n.c,n.id==="avo"?"#ccc":"#222"));
 person(S.x,S.y,"#2ecc71","#3a2410");
 if(mode==="play"){const n=near();if(n){cx.fillStyle="#c8f542";cx.font="bold 9px monospace";cx.fillText("[E] "+n.n,n.x-20,n.y-26)}}
 r(0,0,W,H,"rgba(0,10,30,.25)");
}
function near(){return NPC.find(n=>Math.hypot(n.x-S.x,n.y-S.y)<34)}
function drawRain(dt){if(!OPT.rain)return;cx.fillStyle="rgba(180,200,220,.5)";rain.forEach(d=>{d.y+=d.s*dt;d.x-=20*dt;if(d.y>H){d.y=-5;d.x=rnd(0,W+40)}cx.fillRect(Math.round(d.x),Math.round(d.y),1,5)})}
function drawFonte(a=1,s=1){cx.globalAlpha=a;const x=320,y=90;r(x-40*s,y-60*s,80*s,120*s,"#0b6b2e");r(x-60*s,y,120*s,150*s,"#0a4f22");r(x-22*s,y-30*s,12*s,8*s,"#c8f542");r(x+10*s,y-30*s,12*s,8*s,"#c8f542");r(x-20*s,y-8*s,40*s,4*s,"#031a0b");cx.globalAlpha=1}
function drawCombat(){r(0,0,W,H,"#06150c");for(let i=0;i<9;i++)r(0,i*40+((t*30)%40),W,1,"#0d3a1d");
 person(150,230,"#2ecc71","#3a2410");cx.save();cx.translate(150,230);cx.restore();
 const k=Cb.eh/60,x=430,y=130,j=Math.sin(t*6)*3;
 if(Cb.eh>0){r(x,y+j,90,110,"#1a1a1a");for(let i=0;i<9;i++){const c=["#c8f542","#f5d742","#e05a3a","#f4f4ee"][i%4];r(x+(i*37)%80,y+j+(i*23)%100,22,12,c)}r(x+18,y+j+30,14,10,"#f33");r(x+56,y+j+30,14,10,"#f33");r(x+25,y+j+66,40,6,"#f4f4ee");cx.fillStyle="#04140a";cx.font="bold 8px monospace";cx.fillText("$$ -50%",x+4,y+j+16)}
 r(380,100,150,8,"#222");r(380,100,150*k,8,"#e05a3a");cx.fillStyle="#fff";cx.font="bold 10px monospace";cx.fillText("CONSUMISTA",380,95)}
function drawMenuBg(){r(0,0,W,H,"#020d06");for(let i=0;i<14;i++){r(0,i*28,W,1,"#0a3a1c")}drawFonte(.55+Math.sin(t*2)*.15,1.4+Math.sin(t)*.05)}
function render(dt){
 t+=dt;cx.imageSmoothingEnabled=false;
 if(mode==="menu"||mode==="end")drawMenuBg();
 else if(mode==="combat")drawCombat();
 else if(mode==="fonte"){fonteT+=dt;drawMap();drawRain(dt);
  const fl=fonteT<3?(Math.random()<.4?.7:0):.25;r(0,0,W,H,"rgba(0,0,0,"+fl+")");
  if(fonteT>2){r(0,0,W,H,"rgba(0,60,20,.25)");drawFonte(Math.min(1,(fonteT-2)/2),1.3);glitch=.2}
  if(fonteT>3.2&&!S.notes.voz){S.notes.voz=1;say([["A Fonte","Quanto vale um sonho?"],["Lucas","...O que foi isso?"]],()=>{fonteT=99;S.notes.fd=1;setTimeout(endScreen,1200)})}
  if(fonteT>=99&&S.notes.fd){} }
 else{drawMap();drawRain(dt)}
 if(glitch>0){glitch-=dt;for(let i=0;i<6;i++){const y=rnd(0,H-20),h=rnd(4,18);cx.drawImage(cv,0,y,W,h,rnd(-14,14),y,W,h)}cx.fillStyle="rgba(255,0,255,.06)";cx.fillRect(0,0,W,H)}
}
let last=0;
function loop(ts){const dt=Math.min(.05,(ts-last)/1000||0);last=ts;
 if(mode==="play"&&S){let dx=(keys.d?1:0)-(keys.a?1:0)+joy.x,dy=(keys.s?1:0)-(keys.w?1:0)+joy.y;
  if(dx||dy){const l=Math.hypot(dx,dy);S.x=Math.max(10,Math.min(630,S.x+dx/Math.max(1,l)*75*dt));S.y=Math.max(184,Math.min(345,S.y+dy/Math.max(1,l)*75*dt))}}
 if(S&&mode==="fonte"&&S.notes.fd&&fonteT<99)fonteT=99;
 render(dt);requestAnimationFrame(loop)}
/* ---------- Entrada ---------- */
addEventListener("keydown",e=>{const k=e.key.toLowerCase();
 if(["w","a","s","d"].includes(k))keys[k]=true;
 if(mode==="dialog"&&(k==="enter"||k==="e"||k===" ")){e.preventDefault();nextLine();return}
 if(mode==="play"){if(k==="e"){const n=near();if(n)interact(n)}if(k==="escape")pause()}
 else if(mode==="paused"&&k==="escape"){closeOv();mode="play"}
 else if(mode==="combat"&&"1234".includes(k))Cb.act(+k)});
addEventListener("keyup",e=>{keys[e.key.toLowerCase()]=false});
function fit(){const s=Math.min(innerWidth/W,innerHeight/H);$("#w").style.transform="scale("+s+")"}
addEventListener("resize",fit);fit();
S=fresh();requestAnimationFrame(loop); // menu() só é chamado após escolher a plataforma

/* ===== Controles de toque ===== */
(function(){
  const stick=document.getElementById('stick'),knob=document.getElementById('knob');
  const bE=document.getElementById('bE'),bEsc=document.getElementById('bEsc');
  const R=45; let pid=null;
  function move(e){
    const b=stick.getBoundingClientRect();
    let vx=e.clientX-(b.left+b.width/2), vy=e.clientY-(b.top+b.height/2);
    const m=Math.hypot(vx,vy); if(m>R){vx*=R/m;vy*=R/m}
    knob.style.transform='translate('+vx+'px,'+vy+'px)';
    const dz=0.2; joy.x=Math.abs(vx/R)<dz?0:vx/R; joy.y=Math.abs(vy/R)<dz?0:vy/R;
  }
  function stop(){pid=null;joy.x=joy.y=0;knob.style.transform='translate(0,0)'}
  stick.addEventListener('pointerdown',e=>{pid=e.pointerId;stick.setPointerCapture(pid);move(e);e.preventDefault()});
  stick.addEventListener('pointermove',e=>{if(e.pointerId===pid)move(e)});
  stick.addEventListener('pointerup',stop);stick.addEventListener('pointercancel',stop);
  const tap=k=>dispatchEvent(new KeyboardEvent('keydown',{key:k,bubbles:true}));
  bE.addEventListener('pointerdown',e=>{e.preventDefault();tap('e')});
  bEsc.addEventListener('pointerdown',e=>{e.preventDefault();tap('Escape')});
  document.addEventListener('contextmenu',e=>{if(plataforma==='celular')e.preventDefault()});
  // mostra só o que faz sentido em cada modo
  setInterval(()=>{
    stick.classList.toggle('off',mode!=='play'); bEsc.classList.toggle('off',mode!=='play'&&mode!=='paused');
    bE.classList.toggle('off',mode!=='play'&&mode!=='dialog'); if(mode!=='play')stop();
  },100);
})();