const canvas = document.createElement("canvas");
canvas.style.position = "absolute";
canvas.style.top = 0;
canvas.style.left = 0;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);
const canvasCtx = canvas.getContext("2d");
canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

async function main() {
  const audioStream = await navigator.mediaDevices.getUserMedia({
    audio: true
  });
  const audioCtx = new AudioContext();
  const analyser = audioCtx.createAnalyser();
  const bufferLength = analyser.frequencyBinCount;
  analyser.fftSize = 256;
  const source = audioCtx.createMediaStreamSource(audioStream);
  source.connect(analyser);

  function process() {
    const dataArray = new Float32Array(analyser.frequencyBinCount);
    analyser.getFloatFrequencyData(dataArray);
    console.log(dataArray);

    //Draw black background
    canvasCtx.fillStyle = "rgb(0, 0, 0)";
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

    //Draw spectrum
    let posX = 0;
    for (let i = 0; i < bufferLength; i++) {
      const barWidth = (canvas.width / bufferLength) *100* (1 / (i+1));
      const barHeight = (dataArray[i] + 140) * 10;
      canvasCtx.fillStyle = "rgb(" + Math.floor(barHeight + 100) + ", 50, 50)";
      canvasCtx.fillRect(
        posX,
        canvas.height - barHeight / 2,
        barWidth,
        barHeight / 2
      );
      posX += barWidth + 1;
    }

    requestAnimationFrame(process);
  }
  process();
}

main();
