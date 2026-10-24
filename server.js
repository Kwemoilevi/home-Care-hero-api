const express = require('express');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());

const PRIMARY_KEY = process.env.PRIMARY_KEY || 'YOUR_KEY';
const API_USER_ID = process.env.API_USER_ID || 'YOUR_USER_ID';
const API_KEY = process.env.API_KEY || 'YOUR_API_KEY';
let accessToken = null;
let tokenExpiry = 0;

async function getToken() {
  if (accessToken && Date.now() < tokenExpiry) return accessToken;
  const credentials = Buffer.from(`${API_USER_ID}:${API_KEY}`).toString('base64');
  const res = await axios.post('https://sandbox.momodeveloper.mtn.com/collection/token/', {}, {
    headers: { 'Ocp-Apim-Subscription-Key': PRIMARY_KEY, 'Authorization': `Basic ${credentials}` }
  });
  accessToken = res.data.access_token;
  tokenExpiry = Date.now() + (res.data.expires_in * 1000) - 60000;
  return accessToken;
}

app.post('/api/pay/mtn', async (req, res) => {
  try {
    const { amount, phone, externalId } = req.body;
    const token = await getToken();
    const referenceId = uuidv4();
    await axios.post('https://sandbox.momodeveloper.mtn.com/collection/v1_0/requesttopay', {
      amount: amount.toString(), currency: 'UGX', externalId,
      payer: { partyIdType: 'MSISDN', partyId: phone },
      payerMessage: 'Home Care Hero Uganda', payeeNote: 'Home Care Hero'
    }, {
      headers: { 'Authorization': `Bearer ${token}`, 'X-Reference-Id': referenceId, 'X-Target-Environment': 'sandbox', 'Ocp-Apim-Subscription-Key': PRIMARY_KEY, 'Content-Type': 'application/json' }
    });
    res.json({ success: true, referenceId, breakdown: { total: amount, youKeep: amount*0.25, nurseGets: amount*0.75 } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.response?.data || err.message });
  }
});

app.get('/', (req, res) => res.send('Home Care Hero Uganda API Live! 0772101875 - Kwemoi Levi'));
app.listen(process.env.PORT || 3000, () => console.log('Server running'));
