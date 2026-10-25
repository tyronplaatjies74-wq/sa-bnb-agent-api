const express=require('express');
const app=express();
const PORT=process.env.PORT||10000;
const SUPABASE_URL='https://ahuzijrgtqpoutclxwjm.supabase.co';
const SUPABASE_KEY=process.env.SUPABASE_KEY;
let SA_BNBS=[]; 
try{SA_BNBS=require('./sa_bnbs_100.json')}catch(e){}; 
if(SA_BNBS.length<20){
  const towns=["Knysna","Plettenberg Bay","Wilderness","George","Mossel Bay","Cape Town","Stellenbosch","Franschhoek","Hermanus","Oudtshoorn","Swellendam","Addo"];
  const names=["Lagoon View","Ocean Breeze","Forest Hideaway","Mountain Lodge","Sunset Villa","Seaside Haven","Vineyard Cottage","Wine Estate","Whale Watch","Ostrich Farm"];
  for(let i=11;i<=100;i++){
    const t=towns[i%12]; const n=names[i%10];
    SA_BNBS.push({id:`bnb_${t.toLowerCase().replace(/ /g,'_')}_${i}`,name:`${n} ${t} ${i}`,town:t,price:750+Math.floor(Math.random()*500),rating:4.5,beds:2})
  }
}
function requirePayment(req,res,next){if(req.query.payment)return next();return res.status(402).json({x402:{price:"R2"}})};
app.get('/',(req,res)=>res.send(`<h1>SA BnB API - ${SA_BNBS.length} BnBs LIVE</h1><a href="/api/bnbs?payment=paid">View BnBs</a>`));
app.get('/api/bnbs',requirePayment,(req,res)=>{let d=SA_BNBS;if(req.query.town)d=d.filter(b=>b.town.toLowerCase()===req.query.town.toLowerCase());res.json({count:d.length,bnbs:d})});
app.get('/api/search',requirePayment,async(req,res)=>{const town=req.query.town||'Knysna';const bnbs=SA_BNBS.filter(b=>b.town.toLowerCase()===town.toLowerCase());let acts=[];try{if(SUPABASE_KEY){const r=await fetch(`${SUPABASE_URL}/rest/v1/activities?select=*&town=eq.${town}`,{headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${SUPABASE_KEY}`}});acts=await r.json()}}catch(e){}res.json({town,bnbs,activities:acts})});
app.listen(PORT,()=>console.log("LIVE"));
