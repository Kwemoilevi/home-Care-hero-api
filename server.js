const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ 
    message: 'Home Care Hero API LIVE Uganda 0772101875',
    status: 'ok' 
  });
});

app.get('/api/health', (req,res)=> res.json({ok:true}));

app.post('/api/booking', (req,res)=>{
  console.log(req.body);
  res.json({success:true, msg:'Booking received, call 0772101875'});
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', ()=>console.log('Running '+PORT));
