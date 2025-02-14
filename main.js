document.getElementById('processImage').addEventListener('click', function () {
    const input = document.getElementById('imageUpload');
    const blurAmount = document.getElementById('blurSlider').value;
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    
    if (input.files.length === 0) {
        alert("Please upload an image first.");
        return;
    }
    
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
        const img = new Image();
        img.onload = function () {
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');
            tempCanvas.width = img.height;
            tempCanvas.height = img.width;
            
            tempCtx.translate(tempCanvas.width / 2, tempCanvas.height / 2);
            tempCtx.rotate(-Math.PI / 2);
            tempCtx.drawImage(img, -img.width / 2, -img.height / 2);
            
            const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
            const data = imageData.data;
            for (let i = 0; i < data.length; i += 4) {
                const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                data[i] = data[i + 1] = data[i + 2] = avg;
            }
            tempCtx.putImageData(imageData, 0, 0);
            
            const aspectRatio = tempCanvas.width / tempCanvas.height;
            let bgWidth = canvas.width;
            let bgHeight = canvas.width / aspectRatio;
            if (bgHeight < canvas.height) {
                bgHeight = canvas.height;
                bgWidth = bgHeight * aspectRatio;
            }
            const bgX = (canvas.width - bgWidth) / 2;
            ctx.filter = `blur(${blurAmount}px)`;
            ctx.drawImage(tempCanvas, bgX, 0, bgWidth, bgHeight);
            ctx.filter = 'none';
            
            const newWidth = canvas.width;
            const scaleFactor = newWidth / img.width;
            const newHeight = img.height * scaleFactor;
            const centerY = (canvas.height - newHeight) / 2;
            ctx.drawImage(img, 0, centerY, newWidth, newHeight);
            
            const downloadLink = document.getElementById('download');
            downloadLink.href = canvas.toDataURL('image/png');
            downloadLink.style.display = 'block';
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
});