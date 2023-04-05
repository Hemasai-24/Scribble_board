const canvas=document.querySelector("canvas"),
toolBtns=document.querySelectorAll(".tool"),
fillColor=document.querySelector("#fill-color"),
sizeSlider=document.querySelector("#size-slider"),
colorBtns=document.querySelectorAll(".colors .option"),
colorPicker=document.querySelector("#color-picker");
clearCanvas=document.querySelector(".clear-canvas");
savImg=document.querySelector(".save-img");
ctx=canvas.getContext("2d",{willReadFrequently:true});
//ctx.canvas.willReadFrequently=true;
brushWidth=5;
selectedColor="#000";

const setCanvasBackground=()=>{
    ctx.fillStyle="#fff";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle=selectedColor;
}

//moksha
let PrevMouseX,PrevMouseY ,snapshot,
isDRawing=false;
selectedTool="brush";
window.addEventListener("load",()=>{
    canvas.width=810;
    canvas.height=564;
    setCanvasBackground();
});

const startDraw=(e)=>{
    isDRawing=true;
    PrevMouseX=e.offsetX;
    PrevMouseY=e.offsetY;
    ctx.beginPath();
    ctx.lineWidth=brushWidth;
    snapshot=ctx.getImageData(0,0,canvas.width,canvas.height);
    ctx.strokeStyle=selectedColor;
    ctx.fillStyle=selectedColor;
}

const drawRect=(e)=>{
    if(!fillColor.checked){
   return ctx.strokeRect(e.offsetX,e.offsetY,PrevMouseX-e.offsetX,PrevMouseY-e.offsetY);
}

ctx.fillRect(e.offsetX,e.offsetY,PrevMouseX-e.offsetX,PrevMouseY-e.offsetY);
}

const drawCircle=(e)=>{
    
    ctx.beginPath();
    let radius=Math.sqrt(Math.pow((PrevMouseX-e.offsetX),2)+Math.pow((PrevMouseY-e.offsetY),2))
    ctx.arc(PrevMouseX,PrevMouseY,radius,0,2*Math.PI);
    ctx.stroke();
    fillColor.checked?ctx.fill():ctx.stroke();
}
const drawLine=(e)=>{
    ctx.beginPath();
    ctx.moveTo(PrevMouseX,PrevMouseY);
    ctx.lineTo(e.offsetX,e.offsetY);
    ctx.stroke();
}
const drawTriangle=(e)=>{
    ctx.beginPath();
    ctx.moveTo(PrevMouseX,PrevMouseY);
    ctx.lineTo(e.offsetX,e.offsetY);
    ctx.lineTo(PrevMouseX*2-e.offsetX,e.offsetY);
    ctx.closePath();
   // ctx.stroke();
    fillColor.checked?ctx.fill():ctx.stroke();
}
const drawing=(e)=>{
    if(!isDRawing) return;
    ctx.putImageData(snapshot,0,0);
    if(selectedTool==="fill"){
       // ctx.fillStyle="#fff";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle=selectedColor;
    }
    else if(selectedTool==="brush"||selectedTool==="eraser"){
    ctx.strokeStyle=selectedTool==="eraser"?"#fff":selectedColor;
    ctx.lineTo(e.offsetX,e.offsetY);
    ctx.stroke();}
    else if(selectedTool==="rectangle"){
        //console.log(moksha);
        drawRect(e);
    }
    else if(selectedTool==="circle"){
        drawCircle(e);
    }
    else if(selectedTool==="line"){
        drawLine(e);
    }
    else if(selectedTool==="triangle"){
        drawTriangle(e);
    }
}

toolBtns.forEach(btn=>{
    btn.addEventListener("click",()=>{
        document.querySelector(".options .active").classList.remove("active");
        btn.classList.add("active");
        selectedTool=btn.id;
        console.log(selectedTool);
    })
})
sizeSlider.addEventListener("change",()=>brushWidth=sizeSlider.value);

colorBtns.forEach(btn=>{
btn.addEventListener("click",()=>{
    document.querySelector(".options .selected").classList.remove("selected");
    btn.classList.add("selected");
    selectedColor=window.getComputedStyle(btn).getPropertyValue("background-color");
});
});

colorPicker.addEventListener("change",()=>{
    colorPicker.parentElement.style.background=colorPicker.value;
    colorPicker.parentElement.click();
});

clearCanvas.addEventListener("click",()=>{
    ctx.clearRect(0,0,canvas.width,canvas.height);
    setCanvasBackground();
});

savImg.addEventListener("click",()=>{
   const link= document.createElement("a");
   link.download=`${Date.now()}.jpg`;
   link.href=canvas.toDataURL();
   link.click();
});

canvas.addEventListener("mousedown",startDraw);
canvas.addEventListener("mousemove",drawing);
canvas.addEventListener("mouseup",()=>isDRawing=false);