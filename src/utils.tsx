const audioCtx = new window.AudioContext();

export function shortHighBeep() {
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  gainNode.gain.value = 0.1;
  oscillator.frequency.value = 1300;
  oscillator.type = 'sine';

  oscillator.start(audioCtx.currentTime);
  oscillator.stop(audioCtx.currentTime + 180 / 1000);
}

export function longHighBeep() {
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  gainNode.gain.value = 0.1;
  oscillator.frequency.value = 1500;
  oscillator.type = 'sine';

  oscillator.start(audioCtx.currentTime);
  oscillator.stop(audioCtx.currentTime + 540 / 1000);
}
