let IP = "";
let token="523f6f3ad81687";

var ConatinerIP = document.getElementById('contIP');
var ipData="";
var map = document.getElementById("map");
var lat = "";
var long = "";
var postalData=""

var postalElement=document.querySelector(".postal-data");

async function getIp() {
  IP = await fetch("https://api.ipify.org?format=json")
    .then(response => response.json())
    .then(data =>data.ip);
}

getIp().then(() => {ConatinerIP.innerText += IP;})

async function getData(){
    ipData=await fetch(`https://ipinfo.io/${IP}?token=${token}`).then((response)=>response.json()).then((data)=>ipData=data);
    lat=ipData.loc.split(",")[0];
    long=ipData.loc.split(",")[1];
}

function getCurrentTime(timeZone){
  let x = new Date();
  var dateAndTime = "Date: "+ x.getDate() +"-"+ x.getMonth() +"-"+x.getFullYear() +"  Time: " + x.getHours()+":"+x.getMinutes()+":"+x.getSeconds() ;
  return dateAndTime;
}

function getPostalData(pin){
 return fetch(`https://api.postalpincode.in/pincode/${pin}`).then((response)=>response.json());
}

document.getElementById("getData").addEventListener("click", (e) => {
  var button = e.target;
  button.style.display = "none";
  document.querySelector(".main_body").style.display="block"
  getData().then(()=>{console.log(ipData);
    document.getElementById("lat").innerHTML+=lat;
    document.getElementById("long").innerHTML+=long;
    document.getElementById("city").innerHTML+=ipData.city;
    document.getElementById("org").innerHTML+=ipData.org;
    document.getElementById("region").innerHTML+=ipData.region;
    document.getElementById("host").innerHTML+=ipData.hostname;
    document.getElementById("time").innerHTML+=ipData.timezone;
    document.getElementById("pin").innerHTML+=ipData.postal;
    document.getElementById("date").innerHTML+=getCurrentTime(ipData.timezone);

    getPostalData(ipData.postal).then((data)=>{
        postalData=data[0];
        document.getElementById("message").innerHTML+=postalData.Message;
        console.log(postalData);
        renderItems(postalData.PostOffice)
    })

    map.src=`https://maps.google.com/maps?q=${lat},${long}&z=15&output=embed`;
    });

    
});

function displayCards(data){
    var innerHtml="";
    postalElement.innerHTML=""
    data.forEach((i)=>{
       innerHtml+=`<div class="item">
        <p>Name: ${i.Name}</p>
        <p>Branch Type: ${i.BranchType}</p>
        <p>Delivery Status: ${i.DeliveryStatus}</p>
        <p>District: ${i.District}</p>
        <p>Division: ${i.Division}</p>
    </div>`
    })
    postalElement.innerHTML+=innerHtml
}

document.getElementById("search").addEventListener("input",(event)=>{
    var input = event.target.value.trim();
    displayCards(postalData.PostOffice.filter((i)=>i.Name.toLowerCase().includes(input) || i.BranchType.toLowerCase().includes(input)))
})
