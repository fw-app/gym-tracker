// Storage-Wrapper für LocalStorage mit JSON-Serialisierung

const Storage = {
  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  },

  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },

  remove(key) {
    localStorage.removeItem(key);
  },

  // Profil
  getProfile() {
    return this.get('profile', { name: '', age: '', height: '', weight: '', goal: 'recomp' });
  },

  saveProfile(profile) {
    this.set('profile', profile);
  },

  // --- Trainingstag-Rotation ---
  // Speichert den aktuellen Index in der 6er-Rotation (0-5)
  getCurrentTrainingDay() {
    return this.get('current-training-day', 0);
  },

  setCurrentTrainingDay(index) {
    this.set('current-training-day', index);
  },

  // Nächsten Trainingstag vorrücken (nach Abschluss)
  advanceTrainingDay() {
    const current = this.getCurrentTrainingDay();
    const next = (current + 1) % TRAINING_PLAN.rotation.length;
    this.setCurrentTrainingDay(next);
    return next;
  },

  // --- Trainings-History ---
  // Jedes abgeschlossene Training wird mit Datum und Typ gespeichert
  getTrainingHistory() {
    return this.get('training-history', []);
  },

  addTrainingToHistory(date, type, dayIndex) {
    const history = this.getTrainingHistory();
    history.push({ date, type, dayIndex, completedAt: new Date().toISOString() });
    this.set('training-history', history);
  },

  // Prüft ob heute bereits ein Training abgeschlossen wurde
  getTodayTraining() {
    const today = new Date().toISOString().slice(0, 10);
    const history = this.getTrainingHistory();
    return history.find(h => h.date === today) || null;
  },

  // --- Workout-Log ---
  // Key: workout-log-YYYY-MM-DD
  getWorkoutLog(date) {
    const key = `workout-log-${date}`;
    return this.get(key, {});
  },

  saveWorkoutLog(date, log) {
    const key = `workout-log-${date}`;
    this.set(key, log);
  },

  // Gewichts-Verlauf
  getWeightHistory() {
    return this.get('weight-history', []);
  },

  addWeightEntry(weight) {
    const history = this.getWeightHistory();
    const today = new Date().toISOString().slice(0, 10);
    const existing = history.findIndex(e => e.date === today);
    if (existing >= 0) {
      history[existing].weight = weight;
    } else {
      history.push({ date: today, weight });
    }
    this.set('weight-history', history);
  },

  // Laufband-Log
  getTreadmillLog() {
    return this.get('treadmill-log', []);
  },

  addTreadmillEntry(steps, minutes) {
    const log = this.getTreadmillLog();
    const today = new Date().toISOString().slice(0, 10);
    const existing = log.findIndex(e => e.date === today);
    if (existing >= 0) {
      log[existing] = { date: today, steps, minutes };
    } else {
      log.push({ date: today, steps, minutes });
    }
    this.set('treadmill-log', log);
  },

  // Export aller Daten als JSON
  exportAll() {
    const data = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      data[key] = localStorage.getItem(key);
    }
    return JSON.stringify(data, null, 2);
  },

  // Import aus JSON
  importAll(jsonString) {
    const data = JSON.parse(jsonString);
    Object.entries(data).forEach(([key, value]) => {
      localStorage.setItem(key, value);
    });
  }
};
