const urlInput = document.querySelector('input');
const clicking = document.querySelector('.btn1');
let qrCodeImage;
clicking.addEventListener('click', function() {
  const data = { url: urlInput.value }; // Define data object here
  fetch('', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  .then(response => {
    return response.json();
  })
  .then(data => {
    qrCodeImage = document.createElement('img');
    qrCodeImage.src = data.qrCodeUrl;
    document.body.appendChild(qrCodeImage);
    cart = document.querySelector('.qrcode');
    cart.append(qrCodeImage);
    clicking.disabled = true;
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
  });
});
const another = document.querySelector('.btn2');
another.addEventListener('click', function(){
  qrCodeImage.src="";
  urlInput.value="";
  clicking.disabled = false;
});
