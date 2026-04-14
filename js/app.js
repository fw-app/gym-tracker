// Haupt-App-Logik & Navigation

const App = {
  currentView: 'today',
  selectedDate: null,

  init() {
    this.selectedDate = new Date().toISOString().slice(0, 10);

    // Service Worker registrieren
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js').catch(() => {});
    }

    // Navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.navigate(btn.dataset.view);
      });
    });

    this.navigate('today');
  },

  navigate(view) {
    this.currentView = view;
    switch (view) {
      case 'today': this.showToday(); break;
      case 'plan': this.showPlan(); break;
      case 'profile': Profile.show(); break;
    }
  },

  // --- HEUTE: Aktueller Trainingstag ---
  showToday() {
    const content = document.getElementById('content');
    const dayIndex = Storage.getCurrentTrainingDay();
    const dayInfo = TRAINING_PLAN.rotation[dayIndex];
    const workout = getWorkoutByType(dayInfo.type);
    const dateStr = new Date().toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' });
    const todayTraining = Storage.getTodayTraining();

    // Falls heute schon ein Training abgeschlossen wurde
    if (todayTraining) {
      const completedWorkout = getWorkoutByType(todayTraining.type);
      const completedInfo = TRAINING_PLAN.rotation[todayTraining.dayIndex];
      content.innerHTML = `
        <div class="rest-day">
          <div class="completed-badge">&#10003;</div>
          <h2>Training erledigt!</h2>
          <p class="completed-workout">${completedInfo.icon} ${completedInfo.label}</p>
          <p>${dateStr}</p>
          <p class="text-muted" style="margin-top:16px">Nächstes Training: <strong>${dayInfo.icon} ${dayInfo.label}</strong></p>
          <p class="text-muted">Vergiss das Laufband nicht! ~60 Min / 8000 Schritte</p>
        </div>
      `;
      return;
    }

    const log = Storage.getWorkoutLog(this.selectedDate);

    content.innerHTML = `
      <div class="workout-header">
        <div class="workout-date">${dateStr}</div>
        <div class="training-day-badge">Tag ${dayIndex + 1} von 6</div>
        <h2>${dayInfo.icon} ${workout.name}</h2>
        <div class="workout-progress">
          <div class="progress-bar">
            <div class="progress-fill" id="progress-fill"></div>
          </div>
          <span id="progress-text">0/${this.countTotalSets(workout)} Sätze</span>
        </div>
      </div>
      <div class="exercise-list" id="exercise-list">
        ${workout.exercises.map((ex, ei) => this.renderExercise(ex, ei, log)).join('')}
      </div>
      <div class="workout-actions">
        <button class="btn btn-primary" id="finish-workout-btn">Training abschließen</button>
        <button class="btn btn-outline" id="skip-day-btn">Ruhetag (überspringen)</button>
      </div>
      ${this.renderTimerOverlay()}
    `;

    this.updateProgress(workout, log);
    this.attachExerciseListeners(workout);

    // Training abschließen
    document.getElementById('finish-workout-btn').addEventListener('click', () => {
      const log = Storage.getWorkoutLog(this.selectedDate);
      const done = Object.values(log).filter(s => s.done).length;
      if (done === 0) {
        this.showToast('Mach mindestens einen Satz!');
        return;
      }
      Storage.addTrainingToHistory(this.selectedDate, dayInfo.type, dayIndex);
      Storage.advanceTrainingDay();
      this.showToast('Training gespeichert! Weiter geht\'s.');
      this.showToday();
    });

    // Ruhetag / überspringen (Tag bleibt gleich)
    document.getElementById('skip-day-btn').addEventListener('click', () => {
      Storage.addTrainingToHistory(this.selectedDate, 'rest', dayIndex);
      this.showToast('Ruhetag eingetragen. Morgen geht\'s weiter!');
      this.showToday();
    });
  },

  renderExercise(exercise, exerciseIndex, log) {
    // Letzte Gewichte und PR holen
    const lastWeights = Storage.getLastWeights(exercise.id);
    const pr = Storage.getPR(exercise.id);

    const sets = [];
    for (let s = 0; s < exercise.sets; s++) {
      const setKey = `${exercise.id}-${s}`;
      const setData = log[setKey] || {};
      const done = setData.done || false;
      const lastSet = lastWeights?.sets?.[s];
      const placeholder = lastSet?.weight ? lastSet.weight : 'kg';
      const repsPlaceholder = lastSet?.reps ? lastSet.reps : `${exercise.repsMin}-${exercise.repsMax}`;

      sets.push(`
        <div class="set-row ${done ? 'set-done' : ''}" data-exercise="${exercise.id}" data-set="${s}">
          <span class="set-number">Satz ${s + 1}</span>
          <div class="set-inputs">
            <div class="input-group">
              <input type="number" class="set-weight" placeholder="${placeholder}" step="0.5" min="0"
                value="${setData.weight || ''}" data-key="${setKey}" data-field="weight">
              <span class="input-label">kg</span>
            </div>
            <div class="input-group">
              <input type="number" class="set-reps" placeholder="${repsPlaceholder}" step="1" min="0"
                value="${setData.reps || ''}" data-key="${setKey}" data-field="reps">
              <span class="input-label">Wdh</span>
            </div>
          </div>
          <button class="btn-check ${done ? 'checked' : ''}" data-key="${setKey}" data-rest="${exercise.rest}">
            ${done ? '&#10003;' : ''}
          </button>
        </div>
      `);
    }

    // Last-time und PR Info
    const lastInfo = lastWeights
      ? `<span class="last-info">Letztes Mal: ${lastWeights.sets.filter(s => s.weight).map(s => `${s.weight}kg x${s.reps}`).join(', ') || '–'}</span>`
      : '';
    const prInfo = pr
      ? `<span class="pr-info">PR: ${pr.weight}kg x${pr.reps}</span>`
      : '';

    return `
      <div class="exercise-card">
        <div class="exercise-header" data-toggle="ex-${exerciseIndex}">
          <div class="exercise-info">
            <h3>${exercise.name}</h3>
            <span class="exercise-meta">${exercise.muscles || exercise.equipment} &middot; ${exercise.sets}x${exercise.repsMin}-${exercise.repsMax}</span>
          </div>
          <span class="exercise-chevron">&#9660;</span>
        </div>
        <div class="exercise-body" id="ex-${exerciseIndex}">
          ${lastInfo || prInfo ? `<div class="exercise-history">${lastInfo}${prInfo}</div>` : ''}
          ${exercise.notes ? `<p class="exercise-notes">${exercise.notes}</p>` : ''}
          ${exercise.description ? `
            <details class="exercise-details">
              <summary>Anleitung anzeigen</summary>
              <p class="exercise-description">${exercise.description}</p>
            </details>
          ` : ''}
          <div class="sets-container">
            ${sets.join('')}
          </div>
        </div>
      </div>
    `;
  },

  renderTimerOverlay() {
    return `
      <div class="timer-overlay" id="timer-overlay" style="display:none;">
        <div class="timer-content">
          <div class="timer-circle">
            <svg viewBox="0 0 100 100">
              <circle class="timer-bg" cx="50" cy="50" r="45"/>
              <circle class="timer-progress" cx="50" cy="50" r="45" id="timer-circle"/>
            </svg>
            <span class="timer-text" id="timer-text">0:00</span>
          </div>
          <p class="timer-label">Pause</p>
          <div class="timer-buttons">
            <button class="btn btn-secondary" id="timer-skip">Überspringen</button>
            <button class="btn btn-secondary" id="timer-add30">+30s</button>
          </div>
        </div>
      </div>
    `;
  },

  attachExerciseListeners(workout) {
    // Übung auf-/zuklappen
    document.querySelectorAll('.exercise-header').forEach(header => {
      header.addEventListener('click', () => {
        const body = document.getElementById(header.dataset.toggle);
        body.classList.toggle('collapsed');
        header.querySelector('.exercise-chevron').classList.toggle('rotated');
      });
    });

    // Gewicht/Reps speichern
    document.querySelectorAll('.set-weight, .set-reps').forEach(input => {
      input.addEventListener('change', () => {
        const log = Storage.getWorkoutLog(this.selectedDate);
        const key = input.dataset.key;
        if (!log[key]) log[key] = {};
        log[key][input.dataset.field] = input.value;
        Storage.saveWorkoutLog(this.selectedDate, log);
      });
    });

    // Satz abhaken
    document.querySelectorAll('.btn-check').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.key;
        const restTime = parseInt(btn.dataset.rest) || 90;
        const log = Storage.getWorkoutLog(this.selectedDate);
        if (!log[key]) log[key] = {};
        log[key].done = !log[key].done;

        const row = btn.closest('.set-row');
        const weightInput = row.querySelector('.set-weight');
        const repsInput = row.querySelector('.set-reps');
        if (weightInput.value) log[key].weight = weightInput.value;
        if (repsInput.value) log[key].reps = repsInput.value;

        Storage.saveWorkoutLog(this.selectedDate, log);

        btn.classList.toggle('checked');
        btn.innerHTML = log[key].done ? '&#10003;' : '';
        row.classList.toggle('set-done');

        this.updateProgress(workout, log);

        // PR prüfen wenn Satz erledigt
        if (log[key].done && log[key].weight && log[key].reps) {
          const exerciseId = key.replace(/-\d+$/, '');
          const newPR = Storage.checkAndUpdatePR(exerciseId, log[key].weight, log[key].reps);
          if (newPR) {
            this.showToast(`Neuer PR! ${newPR.weight}kg x${newPR.reps}`);
          }
        }

        if (log[key].done && restTime > 0) {
          this.startTimer(restTime);
        }
      });
    });

    // Timer-Buttons
    document.getElementById('timer-skip')?.addEventListener('click', () => {
      Timer.stop();
      document.getElementById('timer-overlay').style.display = 'none';
    });

    document.getElementById('timer-add30')?.addEventListener('click', () => {
      if (Timer.isRunning()) {
        Timer.remaining += 30;
        Timer.total += 30;
      }
    });
  },

  startTimer(seconds) {
    const overlay = document.getElementById('timer-overlay');
    const circle = document.getElementById('timer-circle');
    const text = document.getElementById('timer-text');
    const circumference = 2 * Math.PI * 45;

    overlay.style.display = 'flex';
    circle.style.strokeDasharray = circumference;

    Timer.start(seconds,
      (remaining, total) => {
        text.textContent = Timer.formatTime(remaining);
        const progress = remaining / total;
        circle.style.strokeDashoffset = circumference * (1 - progress);
      },
      () => {
        setTimeout(() => { overlay.style.display = 'none'; }, 1500);
      }
    );
  },

  countTotalSets(workout) {
    return workout.exercises.reduce((sum, ex) => sum + ex.sets, 0);
  },

  updateProgress(workout, log) {
    const total = this.countTotalSets(workout);
    const done = Object.values(log).filter(s => s.done).length;
    const fill = document.getElementById('progress-fill');
    const text = document.getElementById('progress-text');
    if (fill) fill.style.width = `${(done / total) * 100}%`;
    if (text) text.textContent = `${done}/${total} Sätze`;
  },

  // --- PLAN: Übersicht der 6 Trainingstage ---
  showPlan() {
    const content = document.getElementById('content');
    const currentDay = Storage.getCurrentTrainingDay();
    const history = Storage.getTrainingHistory();

    // Letzte Trainings pro Typ finden
    const lastByType = {};
    history.forEach(h => {
      if (h.type !== 'rest') {
        lastByType[h.type] = h.date;
      }
    });

    // Aktuelle Zyklusnummer berechnen
    const completedCycles = Math.floor(history.filter(h => h.type !== 'rest').length / 6);
    const inCycle = history.filter(h => h.type !== 'rest').length % 6;

    const days = TRAINING_PLAN.rotation.map((day, i) => {
      const isCurrent = i === currentDay;
      const isDone = i < currentDay || (inCycle > i);
      const lastDate = lastByType[day.type];
      const lastStr = lastDate
        ? new Date(lastDate).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })
        : 'Noch nie';

      return `
        <div class="plan-day ${isCurrent ? 'plan-day-current' : ''} ${isDone && !isCurrent ? 'plan-day-done' : ''}">
          <div class="plan-day-number">Tag ${i + 1}</div>
          <div class="plan-day-main">
            <span class="plan-day-icon">${day.icon}</span>
            <div class="plan-day-info">
              <div class="plan-day-label">${day.label}</div>
              <div class="plan-day-subtitle">${day.subtitle}</div>
            </div>
          </div>
          <div class="plan-day-last">Zuletzt: ${lastStr}</div>
          ${isCurrent ? '<div class="plan-day-badge">Nächstes Training</div>' : ''}
        </div>
      `;
    }).join('');

    // Trainings-Statistiken
    const totalWorkouts = history.filter(h => h.type !== 'rest').length;
    const restDays = history.filter(h => h.type === 'rest').length;
    const last7 = history.filter(h => {
      const d = new Date(h.date);
      const week = new Date();
      week.setDate(week.getDate() - 7);
      return d >= week && h.type !== 'rest';
    }).length;

    content.innerHTML = `
      <div class="plan-view">
        <h2>Trainingsplan</h2>
        <div class="plan-stats">
          <div class="stat-card">
            <div class="stat-number">${totalWorkouts}</div>
            <div class="stat-label">Trainings gesamt</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">${completedCycles}</div>
            <div class="stat-label">Zyklen abgeschlossen</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">${last7}</div>
            <div class="stat-label">Diese Woche</div>
          </div>
        </div>
        <h3 class="plan-section-title">Aktueller Zyklus</h3>
        <div class="plan-grid">${days}</div>
        <div class="week-legend">
          <h3>Trainings-Tipps</h3>
          <ul class="tips-list">
            <li><strong>Progressive Overload:</strong> Steigere Reps von 8 auf 12-15, dann Gewicht erhöhen</li>
            <li><strong>Tempo:</strong> 2 Sek. hoch, 3 Sek. runter bei begrenztem Gewicht</li>
            <li><strong>Laufband:</strong> Jeden Tag ~60 Min nach dem Training</li>
            <li><strong>Protein:</strong> 1.6-2.2g pro kg Körpergewicht täglich</li>
            <li><strong>Ruhetage:</strong> Nach 6 Trainingstagen 1 Tag Pause empfohlen</li>
          </ul>
        </div>
      </div>
    `;
  },

  showToast(message) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  }
};

document.addEventListener('DOMContentLoaded', () => App.init());
