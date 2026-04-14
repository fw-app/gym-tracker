// Rest-Timer mit Countdown, Vibration und Sound

const Timer = {
  interval: null,
  remaining: 0,
  total: 0,
  callback: null,

  start(seconds, onTick, onDone) {
    this.stop();
    this.remaining = seconds;
    this.total = seconds;
    this.callback = onDone;

    onTick(this.remaining, this.total);

    this.interval = setInterval(() => {
      this.remaining--;
      onTick(this.remaining, this.total);

      if (this.remaining <= 0) {
        this.stop();
        this.notify();
        if (this.callback) this.callback();
      }
    }, 1000);
  },

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.remaining = 0;
  },

  isRunning() {
    return this.interval !== null;
  },

  notify() {
    // Vibration (falls unterstützt)
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200, 100, 200]);
    }
    // Audio-Feedback
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880;
      gain.gain.value = 0.3;
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch {
      // Audio nicht verfügbar - kein Problem
    }
  },

  formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }
};
