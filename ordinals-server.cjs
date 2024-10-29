// server/server.js
const express = require('express');
const axios = require('axios');
const cryptoJS = require('crypto-js');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// // Function to create the pre-hash string for signature
// function preHash(timestamp, method, path, body) {
//   return timestamp + method + path + (body ? JSON.stringify(body) : '');
// }

// // Function to generate the HMAC-SHA256 signature
// function sign(message, secret) {
//   return cryptoJS.enc.Base64.stringify(cryptoJS.HmacSHA256(message, secret));
// }

// New endpoint for fetching inscriptions

function preHash(timestamp, method, path, body) {
  // Make sure body is properly stringified when it exists
  const bodyStr = body ? JSON.stringify(body) : '';
  const message = `${timestamp}${method}${path}${bodyStr}`;
  console.log('Pre-hash message:', message); // Debug log
  return message;
}

function sign(message, secret) {
  console.log('Signing message:', message); // Debug log
  console.log('Using secret:', secret.slice(0, 5) + '...'); // Show first 5 chars of secret
  return cryptoJS.enc.Base64.stringify(
    cryptoJS.HmacSHA256(message, secret)
  );
}

// Fetch valid Ordinals collections from the OKX API
app.get('/api/ordinals', async (req, res) => {
  try {
    const method = 'GET';
    const timestamp = new Date().toISOString().slice(0, -5) + 'Z';
    const apiBaseUrl = 'https://www.okx.com';
    const requestUrl = '/api/v5/mktplace/nft/fractal-ordinals/collections';
    const queryString = `?limit=${20}&slug=${req.query.slug || ''}&isBrc20=false`;
    const apiRequestUrl = apiBaseUrl + requestUrl + queryString;

    // Create the pre-hash message and generate the signature
    const preHashMessage = preHash(timestamp, method, requestUrl + queryString, null);
    const signature = sign(preHashMessage, process.env.OKX_API_SECRET);

    // Set the required headers
    const headers = {
      'Content-Type': 'application/json',
      'OK-ACCESS-KEY': process.env.OKX_API_KEY,
      'OK-ACCESS-SIGN': signature,
      'OK-ACCESS-TIMESTAMP': timestamp,
      'OK-ACCESS-PASSPHRASE': process.env.OKX_API_PASSPHRASE,
    };

    console.log('Making request to OKX with headers:', headers);

    const response = await axios.get(apiRequestUrl, { headers });
    console.log('OKX API Response:', response.data);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching ordinals data:', error.message);
    res.status(500).json({ error: 'Failed to fetch ordinals data' });
  }
});

app.post('/api/inscriptions', async (req, res) => {
  try {
    const method = 'POST';
    const timestamp = new Date().toISOString().slice(0, -5) + 'Z';
    const apiBaseUrl = 'https://www.okx.com';
    const requestUrl = '/api/v5/mktplace/nft/fractal-ordinals/get-valid-inscriptions';

    // Create request body
    const requestBody = {
      slug: req.body.slug,
      walletAddress: req.body.walletAddress,
      limit: req.body.limit || "10",
      isBrc20: req.body.isBrc20 ?? false,
      ...(req.body.cursor && { cursor: req.body.cursor }),
      ...(req.body.sort && { sort: req.body.sort })
    };

    // Generate signature with exact order of parameters
    const preHashMessage = preHash(timestamp, method, requestUrl, requestBody);
    const signature = sign(preHashMessage, process.env.OKX_API_SECRET);

    const headers = {
      'Content-Type': 'application/json',
      'OK-ACCESS-KEY': process.env.OKX_API_KEY,
      'OK-ACCESS-SIGN': signature,
      'OK-ACCESS-TIMESTAMP': timestamp,
      'OK-ACCESS-PASSPHRASE': process.env.OKX_API_PASSPHRASE,
    };

    console.log('Debug Info:', {
      timestamp,
      method,
      path: requestUrl,
      body: requestBody,
      preHashMessage,
      signature: signature.slice(0, 10) + '...',
      headers: {
        ...headers,
        'OK-ACCESS-SIGN': '***hidden***'
      }
    });

    const response = await axios.post(
      `${apiBaseUrl}${requestUrl}`,
      requestBody,
      { headers }
    );

    console.log('OKX Response:', response.data);
    res.json(response.data);
  } catch (error) {
    console.error('Error details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.response?.headers
    });

    res.status(error.response?.status || 500).json({
      code: error.response?.data?.code || '50026',
      msg: error.response?.data?.msg || error.message,
      data: null
    });
  }
});

app.post('/api/trade-history', async (req, res) => {
  try {
    const method = 'POST';
    const timestamp = new Date().toISOString().slice(0, -5) + 'Z';
    const apiBaseUrl = 'https://www.okx.com';
    const requestUrl = '/api/v5/mktplace/nft/fractal-ordinals/trade-history';

    const requestBody = {
      slug: req.body.slug,
      limit: req.body.limit || "10",
      sort: req.body.sort || "desc",
      isBrc20: req.body.isBrc20 ?? true,
      ...(req.body.cursor && { cursor: req.body.cursor }),
      ...(req.body.tradeWalletAddress && { tradeWalletAddress: req.body.tradeWalletAddress }),
      ...(req.body.type && { type: req.body.type }),
      ...(req.body.orderSource && { orderSource: req.body.orderSource })
    };

    const preHashMessage = preHash(timestamp, method, requestUrl, requestBody);
    const signature = sign(preHashMessage, process.env.OKX_API_SECRET);

    const headers = {
      'Content-Type': 'application/json',
      'OK-ACCESS-KEY': process.env.OKX_API_KEY,
      'OK-ACCESS-SIGN': signature,
      'OK-ACCESS-TIMESTAMP': timestamp,
      'OK-ACCESS-PASSPHRASE': process.env.OKX_API_PASSPHRASE,
    };

    const response = await axios.post(`${apiBaseUrl}${requestUrl}`, requestBody, { headers });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching trade history:', error.message);
    res.status(500).json({
      code: error.response?.data?.code || 50026,
      msg: error.response?.data?.msg || 'Failed to fetch trade history',
      data: null
    });
  }
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});