document.addEventListener('DOMContentLoaded', (event) => {
    const canvas = document.getElementById('signatureCanvas');
    const ctx = canvas.getContext('2d');
    const colorPicker = document.getElementById('colorPicker');
    const penThickness = document.getElementById('penThickness');
    const downloadBtn = document.getElementById('downloadBtn');
    const clearBtn = document.getElementById('clearBtn');
    
    let drawing = false;
    let currentX = 0;
    let currentY = 0;
    let penColor = '#000000';
    let penWidth = 2;

    // Set canvas size based on window size
    function resizeCanvas() {
        const canvasRect = canvas.getBoundingClientRect();
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        canvas.width = window.innerWidth * 0.8;
        canvas.height = window.innerHeight * 0.6;
        ctx.putImageData(imageData, 0, 0);
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Disable touch scrolling while drawing on canvas
    canvas.addEventListener('touchstart', (event) => {
        if (event.target === canvas) {
            event.preventDefault();
        }
    }, { passive: false });

    canvas.addEventListener('touchmove', (event) => {
        if (event.target === canvas) {
            event.preventDefault();
        }
    }, { passive: false });

    // Event Listeners
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('touchstart', startDrawingTouch, { passive: false });
    canvas.addEventListener('touchend', stopDrawingTouch, { passive: true });
    canvas.addEventListener('touchmove', drawTouch, { passive: false });
    colorPicker.addEventListener('input', changeColor);
    penThickness.addEventListener('input', changeThickness);
    downloadBtn.addEventListener('click', downloadSignature);
    downloadTransparentBtn.addEventListener('click', downloadTransparentSignature);
    clearBtn.addEventListener('click', clearCanvas);

    function startDrawing(event) {
        drawing = true;
        currentX = event.offsetX;
        currentY = event.offsetY;
    }

    function stopDrawing() {
        drawing = false;
    }

    function draw(event) {
        if (!drawing) return;

        ctx.strokeStyle = penColor;
        ctx.lineWidth = penWidth;
        ctx.lineCap = 'round';

        ctx.beginPath();
        ctx.moveTo(currentX, currentY);
        ctx.lineTo(event.offsetX, event.offsetY);
        ctx.stroke();
        ctx.closePath();

        currentX = event.offsetX;
        currentY = event.offsetY;
    }

    function startDrawingTouch(event) {
        const touch = event.touches[0];
        const rect = canvas.getBoundingClientRect();
        drawing = true;
        currentX = touch.clientX - rect.left;
        currentY = touch.clientY - rect.top;
    }

    function stopDrawingTouch() {
        drawing = false;
    }

    function drawTouch(event) {
        if (!drawing) return;

        const touch = event.touches[0];
        const rect = canvas.getBoundingClientRect();
        const offsetX = touch.clientX - rect.left;
        const offsetY = touch.clientY - rect.top;

        ctx.strokeStyle = penColor;
        ctx.lineWidth = penWidth;
        ctx.lineCap = 'round';

        ctx.beginPath();
        ctx.moveTo(currentX, currentY);
        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();
        ctx.closePath();

        currentX = offsetX;
        currentY = offsetY;
    }

    function changeColor(event) {
        penColor = event.target.value;
    }

    function changeThickness(event) {
        penWidth = event.target.value;
    }

    function downloadSignature() {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'signature.png';
        link.click();
    }

    function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
});

