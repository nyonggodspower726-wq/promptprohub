// PromptPro Hub Premium PromptPro

// Smooth reveal animatiSmoothhnst observer = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
        if(entry.isIntersecting){
            entry.target.classList.add("show");
        }
    });
});

document.querySelectorAll(".card,.hero-text,.hero-image").forEach((el)=>{
    observer.observe(el);
});

// Floating animation
const mockup = document.querySelector(".mockup");

if(mockup){
setInterval(()=>{
mockup.style.transform="translateY(-10px)";
setTimeout(()=>{
mockup.style.transform="translateY(0px)";
},1000);
},2000);
}

// Counter animation
function animateValue(id,start,end,duration){

const obj=document.getElementById(id);

if(!obj) return;

let range=end-start;

let current=start;

let increment=end>start?1:-1;

let step=Math.abs(Math.floor(duration/range));

let timer=setInterval(()=>{

current+=increment;

obj.innerHTML=current;

if(current==end){

clearInterval(timer);

}

},step);

}

window.onload=function(){

animateValue("users",0,1200,2000);

animateValue("downloads",0,8500,2500);

animateValue("prompts",0,34,1500);

  }
