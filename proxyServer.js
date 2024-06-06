const { createProxyMiddleware } = require('http-proxy-middleware');
const express = require('express');
const cors = require('cors');
const app = express();

// Enable CORS for all routes
app.use(cors());

app.use('/query', createProxyMiddleware({
    target: 'https://identity-api.dimo.zone',
    changeOrigin: true,
    pathRewrite: {
        '^/query': '/query',
    },
    onProxyReq: (proxyReq, req, res) => {
        proxyReq.setHeader('Access-Control-Allow-Origin', '*');
        proxyReq.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        proxyReq.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    },
    onProxyRes: (proxyRes, req, res) => {
        let body = [];
        proxyRes.on('data', (chunk) => {
            body.push(chunk);
        });
        proxyRes.on('end', () => {
            body = Buffer.concat(body).toString();
            console.log('Response from target:', body);
        });
    },
    logLevel: 'debug'
}));

app.listen(3000, () => {
    console.log('Proxy server is running on http://localhost:3000');
});
