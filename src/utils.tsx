const audioCtx = new window.AudioContext();

export function shortHighBeep() {
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  gainNode.gain.value = 1;
  oscillator.frequency.value = 3000;
  oscillator.type = "sine";

  oscillator.start(audioCtx.currentTime);
  oscillator.stop(audioCtx.currentTime + 200 / 1000);
}