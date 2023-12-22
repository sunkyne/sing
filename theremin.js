var context = new AudioContext(),
    mousedown = false,
    oscillator = null,
    gainNode = context.createGain();

async function loadAudioFile() {
    const response = await fetch('./note.mp3');
    const arrayBuffer = await response.arrayBuffer();
    audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
}

var calculateFrequency = function (mouseYPosition) {
    var minFrequency = 80,
        maxFrequency = 392;

    return (((window.innerHeight-mouseYPosition) / window.innerHeight) * maxFrequency) + minFrequency;
};

var calculateGain = function (mouseXPosition) {
    var minGain = 0,
        maxGain = 1;

    return (((mouseXPosition) / window.innerWidth) * maxGain) + minGain;
};

document.body.addEventListener('mousedown', function (e) {
    // Mouse has been pressed
    mousedown = true;
    oscillator = context.createOscillator();
    oscillator.type = "saw"
    oscillator.frequency.setTargetAtTime(calculateFrequency(e.clientY), context.currentTime, 0.01);
    gainNode.gain.setTargetAtTime(calculateGain(e.clientX), context.currentTime, 0.01);
    oscillator.connect(gainNode);
    gainNode.connect(context.destination)
    oscillator.start(context.currentTime);
});
  
document.body.addEventListener('mouseup', function () {
    // Mouse has been released
    mousedown = false;
    if (oscillator) {
        oscillator.stop(context.currentTime);
        oscillator.disconnect();
    }
});

document.body.addEventListener('mousemove', function (e) {
    if (mousedown) {
        oscillator.frequency.setTargetAtTime(calculateFrequency(e.clientY), context.currentTime, 0.01);
        gainNode.gain.setTargetAtTime(calculateGain(e.clientX), context.currentTime, 0.01);
    }
});