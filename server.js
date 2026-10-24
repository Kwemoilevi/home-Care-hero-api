const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// In-memory storage (for now, until you add DB)
let caregivers = [];
let bookings = [];

app.get('/', (req, res) => {
  res.json({
    message: 'Home Care Hero API LIVE Uganda 0772101875',
    status: 'ok',
    caregivers: caregivers.length,
    bookings: bookings.length
  });
});

app.get('/api/health', (req,res)=> res.json({ok:true}));

// CLIENT BOOKING
app.post('/api/booking', (req,res)=>{
  console.log('BOOKING:', req.body);
  bookings.push({...req.body, date: new Date()});
  res.json({success:true, msg:'Booking received, call 0772101875'});
});

// CAREGIVER REGISTRATION - NEW!
app.post('/api/caregivers/register', (req,res)=>{
  console.log('CAREGIVER REGISTER:', req.body);
  const caregiver = {
    id: Date.now().toString(),
    ...req.body,
    verified: false,
    createdAt: new Date()
  };
  caregivers.push(caregiver);
  res.json({success:true, msg:'Caregiver registered! We will call you for verification. 0772101875', caregiverId: caregiver.id});
});

// LIST ALL CAREGIVERS (for you to see)
app.get('/api/caregivers', (req,res)=>{
  res.json({success:true, count: caregivers.length, caregivers});
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', ()=>console.log('Running '+PORT));
