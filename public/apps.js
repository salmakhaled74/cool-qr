const urlInput = document.querySelector('#inputVal');
const clicking = document.querySelector('.btn1');
const Generate = document.querySelector('.Generate');
const Scann = document.querySelector('.Scann');
const div1 = document.querySelector('.div1');
const div2 = document.querySelector('.div2');
Generate.addEventListener('click', () => {
  div1.style.display = 'block';
  div2.style.display = 'none';
})
Scann.addEventListener('click', () => {
  div2.style.display = 'block';
  div1.style.display = 'none';
})
let qrCodeImage;
clicking.addEventListener('click', function () {
  const data = { url: urlInput.value }; // Define data object here
  fetch('/generate', {
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
another.addEventListener('click', function () {
  qrCodeImage.src = "";
  urlInput.value = "";
  clicking.disabled = false;
});


const inputFile = document.querySelector('.inputFile');
const button = document.querySelector('.upload');
const UrlOutput = document.querySelector('.URLoutput');
const unsafeMessage = document.createElement('div');

inputFile.addEventListener('change', (event) => {
  event.preventDefault();
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = (event) => {
    const contents = event.target.result;
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      button.addEventListener('click', (event) => {
        event.preventDefault();
        fetch('/scan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            width: imageData.width,
            height: imageData.height,
            data: Array.from(imageData.data),
          }),
        })
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            unsafeMessage.innerText = '';
            UrlOutput.innerHTML = '';
            if (data.codeData.startsWith('https')) {
              UrlOutput.style.border = '2px solid green';
              UrlOutput.style.boxShadow = ' 10px 5px 5px green';
              if (UrlOutput.parentNode != '') {
                button.disabled = true;
              }
              setTimeout(function () {
                window.open(data.codeData, '_blank') ;
              }, 2000);
              UrlOutput.append(data.codeData);
            } else {
              unsafeMessage.innerText = 'The link is not safe';
              unsafeMessage.classList.add('link-not-safe');
              button.style.marginBottom = '10px';
              UrlOutput.parentNode.insertBefore(unsafeMessage, UrlOutput);
              UrlOutput.style.marginTop = '0';
              UrlOutput.style.border = '2px solid red';
              UrlOutput.style.boxShadow = ' 10px 5px 5px red';
              UrlOutput.innerHTML = '';
              if (UrlOutput.parentNode != '') {
                button.disabled = true;
              }
              UrlOutput.append(data.codeData);
            }
          })
          .catch((error) => {
            console.log('Please enter a valid Qr code image', error);
          });
      });
    };
    img.src = contents;
  };
  reader.readAsDataURL(file);
});

const over = document.querySelector('.btn3');
over.addEventListener('click', function () {
  
  UrlOutput.style.border = '';
  UrlOutput.style.boxShadow = '';
  unsafeMessage.innerText = '';
  UrlOutput.innerHTML = '';
  UrlOutput.style.marginTop = '';
  inputFile.value = '';
  const styling = document.querySelector('.link-not-safe');
  if (styling) {
    styling.remove();
  }
  button.disabled = false;
});
