const DATA = {
  beginning:{
    title:"This is where the road starts.",
    image:"assets/original.svg",
    fact:"In-N-Out began in 1948 in Baldwin Park, California. Harry and Esther Snyder built a tiny drive-thru around a simple idea: fresh food, made to order, without making customers leave their cars.",
    prompt:"What's the earliest In-N-Out memory you can picture?",
    narrator:"Okay, now we're time-traveling. 1948 looks good on you.",
    item:"The Beginning",
    kind:"history"
  },
  arrow:{
    title:"The arrow has been pointing the way since 1954.",
    image:"assets/arrow.svg",
    fact:"The familiar yellow arrow became part of In-N-Out's identity in 1954. It turned a roadside sign into a little promise: something good is this way.",
    prompt:"What does seeing an In-N-Out sign on the road make you think of?",
    narrator:"Told you to follow the arrow.",
    item:"The Arrow",
    kind:"history"
  },
  animal:{
    title:"Made to order became fan language.",
    image:"assets/burger.svg",
    fact:"Animal Style dates to 1961, when customers began asking for a particular customized burger preparation. The culture of knowing how to make an order your own grew from there.",
    prompt:"What's the part of your order that makes it unmistakably yours?",
    narrator:"Now we're talking. What's YOUR move?",
    item:"Made to Order",
    kind:"food"
  },
  dragstrip:{
    title:"Yes, the burger place really does have drag-racing history.",
    image:"assets/dragster.svg",
    fact:"Harry Snyder invested in Irwindale Drag Strip in the 1960s, and In-N-Out burgers were sold there. Cars, California, and the brand have been tangled together ever since.",
    prompt:"What belongs in your perfect In-N-Out road-trip scene?",
    narrator:"Burger joint. Drag strip. Of course California did this.",
    item:"Drag-Strip California",
    kind:"culture"
  },
  palms:{
    title:"The crossed palms are supposed to mark treasure.",
    image:"assets/palms.svg",
    fact:"In 1972, Harry Snyder began planting crossed palm trees at In-N-Out restaurants. He loved the crossed-palms treasure clue in It's a Mad, Mad, Mad, Mad World and thought of each restaurant as his own treasure.",
    prompt:"What's the little detail that instantly says 'In-N-Out' to you?",
    narrator:"Those palms had a secret. Nice catch.",
    item:"Crossed Palms",
    kind:"history"
  },
  fresh:{
    title:"Fresh potatoes become fries right here.",
    image:"assets/fries.svg",
    fact:"In-N-Out prepares fries from whole potatoes in its restaurants and cooks them in sunflower oil. It's one of the clearest examples of the company's stubborn commitment to doing things its own way.",
    prompt:"Okay, fry diplomacy: how do YOU like yours?",
    narrator:"Potato sighting. This road trip is getting serious.",
    item:"Fresh-Cut Fries",
    kind:"food"
  },
  ritual:{
    title:"Before phone maps, fans kept the route in the glove box.",
    image:"assets/map.svg",
    fact:"In-N-Out once printed restaurant-location maps on lap mats. Customers often kept them in their glove boxes, turning finding the next In-N-Out into part of the road trip.",
    prompt:"Who or what would be riding with you on your ideal In-N-Out run?",
    narrator:"Old-school navigation unlocked. Your move, cartographer.",
    item:"Glove-Box Map",
    kind:"ritual"
  }
};

const EGGS = {
  speaker:{
    title:"Can you hear me now? 1948 edition.",
    image:"assets/speaker.svg",
    fact:"Harry Snyder introduced a two-way speaker box so customers could order without leaving their cars.",
    item:"Speaker Box"
  },
  shirt:{
    title:"In-N-Out fandom became wearable.",
    image:"assets/shirt.svg",
    fact:"Harry Snyder designed the first In-N-Out T-shirt in 1975, beginning the collector-shirt tradition that still feeds fan culture today.",
    item:"1975 Collector Tee"
  },
  shake:{
    title:"The shake joins the story.",
    image:"assets/shake.svg",
    fact:"Real ice cream milkshakes officially joined the In-N-Out menu in 1975.",
    item:"Classic Shake"
  },
  route:{
    title:"Road-trip mythology found you.",
    image:"assets/route66.svg",
    fact:"In-N-Out grew up inside Southern California car culture, so road maps, roadside signs, cruising, and long drives are part of how many fans remember the brand.",
    item:"Road-Trip Shield"
  },
  potato:{
    title:"You found the potato before it became famous.",
    image:"assets/fries.svg",
    fact:"The fries begin as whole potatoes prepared in the restaurant. Whether fans love the fries or argue about them, nobody seems neutral.",
    item:"Fry Lore"
  }
};

const ROAD_FACTS = [
  "Roadside fact: the original 1948 drive-thru was tiny. Your road bag may now have more storage.",
  "Fan fact: Animal Style has been around since 1961. Customization was a personality trait before apps existed.",
  "Roadside fact: Harry Snyder's two-way speaker let Californians order without leaving the car. Civilization peaked early.",
  "Fan fact: the first In-N-Out collector T-shirt arrived in 1975. Burgers disappear. Merch knows better.",
  "Roadside fact: crossed palms mark In-N-Out 'treasure.' Pirates had maps. Burger fans have parking lots."
];

const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];

let state={
  x:8,y:82,vx:0,vy:0,angle:0,
  keys:new Set(),
  visited:new Set(),
  collected:[],
  log:[],
  foundEggs:new Set(),
  nearby:null,
  currentDiscovery:null,
  currentEgg:null,
  postcardItems:[],
  lastNarratorAt:0,
  roamHintShown:false
};

const car=$("#car"), world=$("#world"), narrator=$("#narrator"), nearPrompt=$("#nearPrompt");

function isTypingTarget(target){
  if(!target) return false;
  const tag=(target.tagName||"").toLowerCase();
  return tag==="input" || tag==="textarea" || tag==="select" || target.isContentEditable;
}
function pauseDrivingForTyping(){
  state.keys.clear();
  state.vx=0;
  state.vy=0;
  car.classList.remove("moving");
}
document.addEventListener("focusin",e=>{
  if(isTypingTarget(e.target)) pauseDrivingForTyping();
});


function setNarrator(text){
  narrator.textContent=text;
  state.lastNarratorAt=performance.now();
}
function log(text){
  state.log.unshift(text);
  $("#roadLog").innerHTML=state.log.slice(0,12).map(x=>`<p>${x}</p>`).join("");
}
function updateCounts(){
  $("#momentCount").textContent=state.collected.length;
  $("#postcardCount").textContent=state.collected.length;
  $("#findCount").textContent=`${state.foundEggs.size} / 5`;
}
function renderCollection(){
  const grid=$("#collectionGrid");
  if(!state.collected.length){grid.innerHTML='<div class="empty-state">Your road bag is empty. Go find something.</div>';return;}
  grid.innerHTML=state.collected.map((c,i)=>`<div class="collect-card"><img src="${c.image}" alt=""><strong>${c.item}</strong><em>${c.type==="egg"?"Fan Find":"Road Find"}</em></div>`).join("");
}
function addCollected(obj){
  if(state.collected.some(x=>x.uid===obj.uid))return;
  state.collected.push(obj);renderCollection();updateCounts();
}

function getLandmarkPos(el){
  const wr=world.getBoundingClientRect(), r=el.getBoundingClientRect();
  return {x:(r.left+r.width/2-wr.left)/wr.width*100,y:(r.top+r.height/2-wr.top)/wr.height*100};
}
function updateNear(){
  let best=null,bestD=999;
  $$(".landmark").forEach(el=>{
    const p=getLandmarkPos(el), d=Math.hypot(state.x-p.x,state.y-p.y);
    el.classList.remove("near");
    if(d<bestD){bestD=d;best=el}
    if(d<7.2 && !state.visited.has(el.dataset.id) && !document.querySelector("dialog[open]")){
      state.vx*=.2; state.vy*=.2; openDiscovery(el.dataset.id);
    }
  });
  if(best && bestD<11){best.classList.add("near");state.nearby=best.dataset.id;nearPrompt.hidden=true}
  else{state.nearby=null;nearPrompt.hidden=true}

  $$(".roadstop:not(.done)").forEach(el=>{
    const p=getLandmarkPos(el), d=Math.hypot(state.x-p.x,state.y-p.y);
    if(d<5.2){el.classList.add("done");const i=+el.dataset.stop;setNarrator(ROAD_FACTS[i]);log(`Roadside stop: ${ROAD_FACTS[i]}`)}
  });

  $$(".egg:not(.found)").forEach(el=>{
    const p=getLandmarkPos(el), d=Math.hypot(state.x-p.x,state.y-p.y);
    if(d<4.8 && !document.querySelector("dialog[open]"))openEgg(el.dataset.egg);
  });
}

const MAX=.72, ACC=.045, FRICTION=.90;
let last=performance.now();
function frame(t){
  const dt=Math.min(2,(t-last)/16.667);last=t;
  let ax=0,ay=0;
  if(state.keys.has("w")||state.keys.has("arrowup"))ay-=ACC;
  if(state.keys.has("s")||state.keys.has("arrowdown"))ay+=ACC;
  if(state.keys.has("a")||state.keys.has("arrowleft"))ax-=ACC;
  if(state.keys.has("d")||state.keys.has("arrowright"))ax+=ACC;
  state.vx=(state.vx+ax*dt)*Math.pow(FRICTION,dt);
  state.vy=(state.vy+ay*dt)*Math.pow(FRICTION,dt);
  const speed=Math.hypot(state.vx,state.vy);
  if(speed>MAX){state.vx=state.vx/speed*MAX;state.vy=state.vy/speed*MAX}
  state.x=Math.max(3,Math.min(97,state.x+state.vx*dt));
  state.y=Math.max(4,Math.min(96,state.y+state.vy*dt));
  if(speed>.05)state.angle=Math.atan2(state.vy,state.vx)*180/Math.PI+90;
  car.style.left=state.x+"%";car.style.top=state.y+"%";
  car.style.transform=`translate(-50%,-50%) rotate(${state.angle}deg)`;
  car.classList.toggle("moving",speed>.08);
  updateNear();
  if(!state.roamHintShown && state.x>21 && state.y<76){
    state.roamHintShown=true;setNarrator("No itinerary. Good. Curiosity looks better on you.");
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

function keyName(e){return e.key.toLowerCase()}
addEventListener("keydown",e=>{
  if(isTypingTarget(e.target) || isTypingTarget(document.activeElement)){
    return;
  }
  const k=keyName(e);
  if(["w","a","s","d","arrowup","arrowdown","arrowleft","arrowright"].includes(k)){
    state.keys.add(k);
    e.preventDefault();
  }
  if(e.code==="Space" && state.nearby && !document.querySelector("dialog[open]")){
    e.preventDefault();
    openDiscovery(state.nearby);
  }
});
addEventListener("keyup",e=>{
  if(isTypingTarget(e.target) || isTypingTarget(document.activeElement)) return;
  state.keys.delete(keyName(e));
});

$$(".touch-controls button").forEach(btn=>{
  const k={up:"arrowup",down:"arrowdown",left:"arrowleft",right:"arrowright"}[btn.dataset.dir];
  ["pointerdown","touchstart"].forEach(ev=>btn.addEventListener(ev,e=>{e.preventDefault();state.keys.add(k)}));
  ["pointerup","pointercancel","pointerleave","touchend"].forEach(ev=>btn.addEventListener(ev,e=>{e.preventDefault();state.keys.delete(k)}));
});
$$(".landmark").forEach(btn=>btn.addEventListener("click",()=>openDiscovery(btn.dataset.id)));

function openDiscovery(id){
  const d=DATA[id]; state.currentDiscovery=id;
  $("#discoverTitle").textContent=d.title;$("#discoverImg").src=d.image;$("#discoverImg").alt=d.item;
  $("#discoverFact").textContent=d.fact;$("#discoverPrompt").textContent=d.prompt;$("#memoryInput").value="";
  pauseDrivingForTyping();$("#discoveryDialog").showModal();setNarrator(d.narrator);
}
function saveDiscovery(withNote=true){
  const id=state.currentDiscovery,d=DATA[id];if(!d)return;
  const note=withNote?$("#memoryInput").value.trim():"";
  addCollected({uid:"land-"+id,item:d.item,image:d.image,note,type:"landmark"});
  state.visited.add(id);
  const el=$(`.landmark[data-id="${id}"]`); if(el)el.classList.add("visited");
  log(`${d.item}${note?` — “${note}”`:""} added to the road bag.`);
  $("#discoveryDialog").close();
  if(note)setNarrator("That's yours now. Keep driving.");
  else setNarrator("Find kept. Story still yours.");
  state.currentDiscovery=null;
}
$("#saveDiscovery").onclick=()=>saveDiscovery(true);
$("#skipMemory").onclick=()=>saveDiscovery(false);

$$(".egg").forEach(el=>el.addEventListener("click",()=>openEgg(el.dataset.egg)));
function openEgg(id){
  if(state.foundEggs.has(id))return;
  state.currentEgg=id;const e=EGGS[id];
  $("#eggTitle").textContent=e.title;$("#eggImg").src=e.image;$("#eggImg").alt=e.item;
  $("#eggFact").textContent=e.fact;$("#eggUnlock").textContent=`UNLOCKED: ${e.item}`;
  pauseDrivingForTyping();$("#eggDialog").showModal();setNarrator("Hang on. Did you SEE that?");
}
$("#claimEgg").onclick=()=>{
  const id=state.currentEgg,e=EGGS[id];if(!e)return;
  state.foundEggs.add(id);addCollected({uid:"egg-"+id,item:e.item,image:e.image,note:"",type:"egg"});
  $(`.egg[data-egg="${id}"]`)?.classList.add("found");
  log(`Fan Find: ${e.item}.`);
  $("#eggDialog").close();updateCounts();state.currentEgg=null;
  setNarrator(state.foundEggs.size===5?"Okay. You found ALL of them. Suspiciously impressive.":"Well, that's going on the postcard.");
};

$$("[data-close]").forEach(b=>b.addEventListener("click",()=>document.getElementById(b.dataset.close).close()));
$("#helpBtn").onclick=()=>$("#helpDialog").showModal();

$("#openPostcard").onclick=()=>openPostcard();
function openPostcard(){
  buildEditorTray();
  $("#pcTitlePreview").textContent=$("#postcardTitle").value || "The Long Way Back";
  if(!state.postcardItems.length)scatterCard();
  renderPostcardItems();
  pauseDrivingForTyping();$("#postcardDialog").showModal();
  setNarrator("Pit stop. Let's see what this trip is becoming.");
}
$("#postcardTitle").addEventListener("input",()=>$("#pcTitlePreview").textContent=$("#postcardTitle").value||"Untitled Road Trip");

function buildEditorTray(){
  const tray=$("#editorTray");
  if(!state.collected.length){tray.innerHTML='<div class="empty-state">Nothing collected yet.</div>';return;}
  tray.innerHTML=state.collected.map((c,i)=>`<button class="edit-card" data-add="${i}"><img src="${c.image}" alt=""><span>${c.item}</span></button>`).join("");
  tray.querySelectorAll("[data-add]").forEach(b=>b.onclick=()=>addToCard(+b.dataset.add));
}
function addToCard(index){
  const c=state.collected[index];
  state.postcardItems.push({uid:"pc-"+Date.now()+Math.random(),type:"image",src:c.image,label:c.item,x:20+Math.random()*60,y:28+Math.random()*55,w:18,r:Math.random()*10-5});
  if(c.note)state.postcardItems.push({uid:"note-"+Date.now()+Math.random(),type:"note",text:c.note,x:20+Math.random()*60,y:35+Math.random()*50,w:24,r:Math.random()*6-3});
  renderPostcardItems();
}
function scatterCard(){
  state.postcardItems=[];
  state.collected.slice(0,7).forEach((c,i)=>{
    state.postcardItems.push({uid:"pc-"+i+"-"+Math.random(),type:"image",src:c.image,label:c.item,x:16+(i%4)*22,y:34+Math.floor(i/4)*32,w:16,r:(i%2?4:-4)});
    if(c.note && i<4)state.postcardItems.push({uid:"n-"+i+"-"+Math.random(),type:"note",text:c.note,x:26+(i%3)*25,y:56+Math.floor(i/3)*19,w:24,r:(i%2?2:-2)});
  });
}
$("#shuffleCard").onclick=()=>{scatterCard();renderPostcardItems()};
$("#addFinalNote").onclick=()=>{
  const t=$("#finalNote").value.trim();if(!t)return;
  state.postcardItems.push({uid:"final-"+Date.now(),type:"note",text:t,x:54,y:78,w:28,r:-2});
  $("#finalNote").value="";renderPostcardItems();
};
function renderPostcardItems(){
  const layer=$("#pcItems");layer.innerHTML="";
  state.postcardItems.forEach(item=>{
    const d=document.createElement("div");d.className="pc-item"+(item.type==="note"?" pc-note":"");
    d.style.left=item.x+"%";d.style.top=item.y+"%";d.style.width=item.w+"%";d.style.setProperty("--r",item.r+"deg");
    if(item.type==="image")d.innerHTML=`<img src="${item.src}" alt="${item.label}">`;else d.textContent=item.text;
    enableDrag(d,item);layer.appendChild(d);
  });
}
function enableDrag(el,obj){
  let active=false;
  el.addEventListener("pointerdown",e=>{active=true;el.setPointerCapture(e.pointerId)});
  el.addEventListener("pointermove",e=>{
    if(!active)return;const r=$("#postcardCanvas").getBoundingClientRect();
    obj.x=Math.max(4,Math.min(96,(e.clientX-r.left)/r.width*100));
    obj.y=Math.max(4,Math.min(96,(e.clientY-r.top)/r.height*100));
    el.style.left=obj.x+"%";el.style.top=obj.y+"%";
  });
  el.addEventListener("pointerup",()=>active=false);
}

$("#downloadPng").onclick=downloadPNG;
async function downloadPNG(){
  const canvas=document.createElement("canvas");canvas.width=1600;canvas.height=1000;const ctx=canvas.getContext("2d");
  try{
    const bg=await loadImg("assets/polished-postcard-base.jpg");
    ctx.drawImage(bg,0,0,1600,1000);
  }catch(e){
    const g=ctx.createLinearGradient(0,0,0,1000);
    g.addColorStop(0,"#8fc8d1");g.addColorStop(.42,"#d7d0a9");g.addColorStop(1,"#c98a59");
    ctx.fillStyle=g;ctx.fillRect(0,0,1600,1000);
  }
  ctx.fillStyle="#896a5c";ctx.beginPath();ctx.moveTo(0,720);[[0,650],[160,450],[310,630],[495,355],[690,620],[890,465],[1100,660],[1320,440],[1600,610]].forEach(p=>ctx.lineTo(...p));ctx.lineTo(1600,1000);ctx.lineTo(0,1000);ctx.fill();
  ctx.fillStyle="#66574d";ctx.beginPath();ctx.moveTo(700,520);ctx.lineTo(900,520);ctx.lineTo(1240,1000);ctx.lineTo(300,1000);ctx.fill();
  ctx.strokeStyle="#f1c84f";ctx.lineWidth=11;ctx.setLineDash([50,38]);ctx.beginPath();ctx.moveTo(800,540);ctx.lineTo(800,1000);ctx.stroke();ctx.setLineDash([]);
  ctx.fillStyle="#b81f2a";ctx.font="italic 68px Georgia";ctx.fillText("Wish you were here!",55,95);
  const title=$("#postcardTitle").value||"Untitled Road Trip";ctx.fillStyle="#fff0bd";ctx.fillRect(520,40,560,74);ctx.strokeStyle="#735035";ctx.lineWidth=3;ctx.strokeRect(520,40,560,74);ctx.fillStyle="#3b3027";ctx.font="bold 34px Georgia";ctx.textAlign="center";ctx.fillText(title,800,88);ctx.textAlign="left";
  for(const item of state.postcardItems){
    if(item.type==="image"){
      try{const img=await loadImg(item.src);const w=item.w/100*1600,h=w*.75,x=item.x/100*1600,y=item.y/100*1000;ctx.save();ctx.translate(x,y);ctx.rotate(item.r*Math.PI/180);ctx.drawImage(img,-w/2,-h/2,w,h);ctx.restore()}catch(e){}
    }else{
      const x=item.x/100*1600,y=item.y/100*1000,w=item.w/100*1600;
      ctx.fillStyle="#fff0bd";ctx.fillRect(x-w/2,y-28,w,70);ctx.strokeStyle="#765333";ctx.strokeRect(x-w/2,y-28,w,70);ctx.fillStyle="#3b3027";ctx.font="italic 20px Georgia";wrapText(ctx,item.text,x-w/2+10,y-5,w-20,23);
    }
  }
  ctx.fillStyle="rgba(70,45,30,.7)";ctx.font="bold 17px Arial";ctx.fillText(`FAN FINDS ${state.foundEggs.size}/5`,1320,950);
  const a=document.createElement("a");a.download="my-in-n-out-story.png";a.href=canvas.toDataURL("image/png");a.click();
}
function loadImg(src){return new Promise((res,rej)=>{const i=new Image();i.onload=()=>res(i);i.onerror=rej;i.src=src})}
function wrapText(ctx,text,x,y,maxWidth,lineHeight){const words=text.split(" ");let line="";for(let n=0;n<words.length;n++){const test=line+words[n]+" ";if(ctx.measureText(test).width>maxWidth&&n>0){ctx.fillText(line,x,y);line=words[n]+" ";y+=lineHeight}else line=test}ctx.fillText(line,x,y)}
$("#shareCard").onclick=async()=>{
  const text=`${$("#postcardTitle").value||"My In-N-Out Story"} — I hit the road back to something good.`;
  if(navigator.share){try{await navigator.share({title:"What's Your IN-N-OUT Story?",text,url:location.href})}catch(e){}}
  else{try{await navigator.clipboard.writeText(text+" "+location.href);alert("Share text copied to your clipboard.")}catch(e){alert(text)}}
};

$("#resetBtn").onclick=()=>{
  if(!confirm("Start this road trip over?"))return;
  state.x=8;state.y=82;state.vx=0;state.vy=0;state.angle=0;state.visited.clear();state.collected=[];state.log=[];state.foundEggs.clear();state.postcardItems=[];state.nearby=null;state.roamHintShown=false;
  $$(".landmark").forEach(x=>x.classList.remove("visited","near"));$$(".egg").forEach(x=>x.classList.remove("found"));$$(".roadstop").forEach(x=>x.classList.remove("done"));
  renderCollection();updateCounts();$("#roadLog").innerHTML="<p>Car packed. Playlist on. No itinerary.</p>";setNarrator("Road trip! Yeah! Where to first?");
};
renderCollection();updateCounts();log("Car packed. Playlist on. No itinerary.");
setTimeout(()=>$("#helpDialog").showModal(),450);
