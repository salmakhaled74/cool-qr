const express = require('express');
const jsQR = require("jsqr");
const path = require('path');
const qrcode = require('qrcode');
const bodyParser = require('body-parser');
const { createCanvas } = require('canvas');
const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/scan', (req, res) => {
    console.log('post succeeded');
    const { width, height, data } = req.body;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    const imageData = ctx.createImageData(width, height);
    imageData.data.set(data);
    ctx.putImageData(imageData, 0, 0);
    const code = jsQR(imageData.data, imageData.width, imageData.height);
    if (code) {
        console.log("Found QR code");
        const shortLink = code.data.substring(0, 5);
        res.send({ codeData: code.data });
        if (shortLink === 'https') {
            console.log(code.data);
        } else {
            console.log(shortLink);
            console.log('The link is not safe');
        }
    } else {
        console.log('Please enter a valid Qr code image');
        res.sendStatus(400);
    }
});

app.post('/generate', (req, res) => {
    const { url } = req.body;
    const options = {
        width: 160,
        height: 160
    };
    qrcode.toDataURL(url, options, (err, qrCodeUrl) => {
        if (err) {
            return res.status(500).send('Error generating QR code');
        }
        res.json({ qrCodeUrl });
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
