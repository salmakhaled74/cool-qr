const express = require('express');
const qrcode = require('qrcode');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/', (req, res) => {
  const { url, size } = req.body;
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



// start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
