let sample=document.querySelector('.sample');
sample.addEventListener('input',(e)=>{
    removeallrow();
    if(e.inputType=="deleteContentBackward"){
        removeallrow();
    }
    if(sample.value==""){
        removeallrow();
    }
    for(let i=1;i<=sample.value;i++){
        createrow(i)
    }
})
function createrow(n){
    let tr=document.createElement('tr');
    let td1=document.createElement('td');
    let td2=document.createElement('td');
    let p=document.createElement('p');
    p.innerHTML=n;
    let pin=document.createElement('input');
    pin.className="pinput";
    pin.type="number";
    pin.placeholder="Enter The Value";
    td1.appendChild(p);
    td2.appendChild(pin)
    tr.appendChild(td1);
    tr.appendChild(td2);
    document.querySelector('.tbody').appendChild(tr);
}
function removeallrow(){
    let tbody=document.querySelector('tbody');
    while(tbody.firstChild){
        tbody.removeChild(tbody.firstChild)
    }
}
let arr1=[];
let arr2=[]
let sum=0;
function Calculate(){
    let k=document.querySelector('.sample').value;
    let n=document.querySelector('.total').value;
    if(k&&n){
        let tb=document.querySelector('.tbody');
        let tbchild=tb.childNodes
        let length=0;
        let tempsum=0;
        while(length<tbchild.length){
            if(tbchild[length].childNodes[1].childNodes[0].value){
                let val=parseFloat(tbchild[length].childNodes[1].childNodes[0].value)
                sum+=val
                arr1[length]=val;
                arr2[length]=length+1
                tempsum++;
            }
            length++;
        }
        if(tempsum!=length){
            alert("Enter all Values");
        }
        else if(tempsum==length){
            graph()
        }
    }
    else{
        alert("Enter all the values")
    }
}
let grpurl;
async function graph(){
    let k=document.querySelector('.sample').value;
    let p=(1/k)*sum;
    let p1=p.toFixed(2);
    let n=document.querySelector('.total').value;
    let lcl=p-3*Math.sqrt((p1*(1-p1))/n);
    lcl=lcl.toFixed(2);
    let ucl=p+3*Math.sqrt((p1*(1-p1))/n);
    ucl=ucl.toFixed(2);
    document.querySelector('.pval').innerHTML=p1;
    document.querySelector(".lclval").innerHTML=lcl;
    document.querySelector(".uclval").innerHTML=ucl;
    console.log(arr1);
    console.log(arr2);
    var url="https://quickchart.io/chart?c="
    var q=`{
        type: 'bar',
        data: {
          labels: [
            ${arr2}
          ],
          datasets: [
            {
              type: 'line',
              label: 'Proportion Defect',
              borderColor: 'rgb(54, 162, 235)',
              borderWidth: 1.5,
              fill: false,
              data: [
                ${arr1}
              ],
              
            }
          ],
          
        },
        options: {
          annotation: {
            annotations: [
              {
                type: 'line',
                mode: 'horizontal',
                scaleID: 'y-axis-0',
                value: ${ucl},
                borderColor: 'red',
                borderWidth: 1.5,
                label: {
                  enabled: true,
                  content: 'UCL'
                }
              },
              {
                type: 'line',
                mode: 'horizontal',
                scaleID: 'y-axis-0',
                value: ${lcl},
                borderColor: 'red',
                borderWidth: 1.5,
                label: {
                  enabled: true,
                  content: 'LCL'
                }
              }
            ]
          },
          plugins: {
            datalabels: {
              display: true,
              align: 'bottom',
              borderRadius: 0
            },
            
          },
          title: {
            display: true,
            text: 'P Chart',
            
          },
          
        },
        
      }&width=650`
    await fetch(url+q)
    .then((data)=> data.blob())
    .then((final)=>{
        document.querySelector(".graphshowbutton").removeAttribute("disabled")
        let url=URL.createObjectURL(final);
        grpurl=url;
        document.querySelector(".graph").src=url;
        document.querySelector(".loading").classList.toggle("active");
    })
}
document.querySelector(".close").addEventListener("click",()=>{
    document.querySelector(".graphpage").classList.toggle("active");
})
function showgraph(){
    document.querySelector(".graphpage").classList.toggle("active");
}
async function graphdownload(){
    document.querySelector(".loading").classList.toggle("active");
    let a=document.createElement("a");
    a.href=grpurl;
    a.download="P_Chart";
    setTimeout(()=>{
        a.click();
        document.querySelector(".loading").classList.toggle("active");
    },2000)
}

