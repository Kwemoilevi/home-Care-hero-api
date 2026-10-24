const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

let caregivers = [];

app.get('/', (req,res)=>res.send('API OK'));

app.get('/api/caregivers', (req,res)=>{
  res.json({caregivers});
});

app.post('/api/caregivers', (req,res)=>{
  const c = {...req.body, id: Date.now().toString(), verified: false};
  caregivers.push(c);
  res.json(c);
});

app.post('/api/caregivers/:id/verify', (req,res)=>{
  const c = caregivers.find(x=>x.id===req.params.id);
  if(c) c.verified=true;
  res.json({ok:true});
});

app.delete('/api/caregivers/:id', (req,res)=>{
  caregivers = caregivers.filter(x=>x.id!==req.params.id);
  res.json({ok:true});
});

const port = process.env.PORT || 10000;
app.listen(port, ()=>console.log('Running'));
