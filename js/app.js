// Haupt-App-Logik & Navigation

const App = {
  currentView: 'training',
  selectedDate: null,
  activeTrainingDay: null, // manuell gewählter Tag (null = aktueller)

  init() {
    this.selectedDate = new Date().toISOString().slice(0, 10);

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js').catch(() => {});
    }

    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.navigate(btn.dataset.view);
      });
    });

    this.navigate('training');
  },

  navigate(view) {
    this.currentView = view;
    switch (view) {
      case 'training': this.showTraining(); break;
      case 'plan': this.showPlan(); break;
      case 'profile': Profile.show(); break;
    }
  },

  // --- TRAINING: Aktuelles/gewähltes Training ---
  showTraining(overrideDayIndex) {
    const content = document.getElementById('content');
    const dayIndex = overrideDayIndex !== undefined ? overrideDayIndex : Storage.getCurrentTrainingDay();
    this.activeTrainingDay = dayIndex;
    const dayInfo = TRAINING_PLAN.rotation[dayIndex];
    const workout = getWorkoutByType(dayInfo.type);
    const dateStr = new Date().toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' });

    const log = Storage.getWorkoutLog(this.selectedDate + '-' + dayInfo.type);

    content.innerHTML = `
      <div class="workout-header">
        <div class="workout-date">${dateStr}</div>
        <div class="training-day-selector">
          <button class="day-nav-btn" id="prev-day">&#9664;</button>
          <div class="training-day-badge" id="day-badge">Tag ${dayIndex + 1} von 6</div>
          <button class="day-nav-btn" id="next-day">&#9654;</button>
        </div>
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
    this.attachExerciseListeners(workout, dayInfo.type);

    // Tag-Navigation (Links/Rechts)
    document.getElementById('prev-day').addEventListener('click', () => {
      const prev = (dayIndex - 1 + 6) % 6;
      this.showTraining(prev);
    });
    document.getElementById('next-day').addEventListener('click', () => {
      const next = (dayIndex + 1) % 6;
      this.showTraining(next);
    });

    // Training abschließen
    document.getElementById('finish-workout-btn').addEventListener('click', () => {
      const logKey = this.selectedDate + '-' + dayInfo.type;
      const log = Storage.getWorkoutLog(logKey);
      const done = Object.values(log).filter(s => s.done).length;
      if (done === 0) {
        this.showToast('Mach mindestens einen Satz!');
        return;
      }
      Storage.addTrainingToHistory(this.selectedDate, dayInfo.type, dayIndex);
      // Nächsten Tag setzen
      Storage.setCurrentTrainingDay((dayIndex + 1) % 6);
      this.showToast('Training gespeichert!');
      this.showTrainingDone(dayInfo, dayIndex);
    });

    // Ruhetag
    document.getElementById('skip-day-btn').addEventListener('click', () => {
      this.showToast('Ruhetag. Vergiss das Laufband nicht!');
      this.showTrainingDone(dayInfo, dayIndex, true);
    });
  },

  showTrainingDone(dayInfo, dayIndex, isRest) {
    const content = document.getElementById('content');
    const nextIndex = Storage.getCurrentTrainingDay();
    const nextInfo = TRAINING_PLAN.rotation[nextIndex];
    const dateStr = new Date().toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' });

    content.innerHTML = `
      <div class="rest-day">
        <div class="completed-badge">${isRest ? '🚶' : '&#10003;'}</div>
        <h2>${isRest ? 'Ruhetag' : 'Training erledigt!'}</h2>
        <p class="completed-workout">${dayInfo.icon} ${dayInfo.label}</p>
        <p>${dateStr}</p>
        <p class="text-muted" style="margin-top:16px">Vergiss das Laufband nicht! ~60 Min / 8000 Schritte</p>
        <button class="btn btn-primary" id="start-next-btn" style="margin-top:24px">
          ${nextInfo.icon} ${nextInfo.label} starten
        </button>
        <button class="btn btn-outline" id="back-to-plan-btn" style="margin-top:8px">
          Zum Trainingsplan
        </button>
      </div>
    `;

    document.getElementById('start-next-btn').addEventListener('click', () => {
      this.showTraining(nextIndex);
    });
    document.getElementById('back-to-plan-btn').addEventListener('click', () => {
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      document.querySelector('[data-view="plan"]').classList.add('active');
      this.navigate('plan');
    });
  },

  // --- NEUES SET-UI: Ein Gewicht/Reps-Feld + Satz-Buttons ---
  renderExercise(exercise, exerciseIndex, log) {
    const lastWeights = Storage.getLastWeights(exercise.id);
    const pr = Storage.getPR(exercise.id);

    // Standardwerte: letztes Training oder leer
    const defaultWeight = lastWeights?.sets?.[0]?.weight || '';
    const defaultReps = lastWeights?.sets?.[0]?.reps || '';

    // Satz-Buttons
    const setButtons = [];
    let allDone = true;
    for (let s = 0; s < exercise.sets; s++) {
      const setKey = `${exercise.id}-${s}`;
      const setData = log[setKey] || {};
      const done = setData.done || false;
      if (!done) allDone = false;
      const label = done ? `${setData.weight || '?'}kg×${setData.reps || '?'}` : '';
      setButtons.push(`
        <button class="set-btn ${done ? 'set-btn-done' : ''}" data-key="${setKey}" data-set="${s}" data-rest="${exercise.rest}" data-exercise-id="${exercise.id}">
          <span class="set-btn-number">${s + 1}</span>
          ${done ? `<span class="set-btn-detail">${label}</span>` : ''}
        </button>
      `);
    }

    const lastInfo = lastWeights
      ? `<span class="last-info">Letztes Mal: ${lastWeights.sets.filter(s => s.weight).map(s => `${s.weight}kg×${s.reps}`).slice(0, 3).join(', ') || '–'}</span>`
      : '';
    const prInfo = pr
      ? `<span class="pr-info">PR: ${pr.weight}kg×${pr.reps}</span>`
      : '';

    return `
      <div class="exercise-card ${allDone ? 'exercise-done' : ''}">
        <div class="exercise-header" data-toggle="ex-${exerciseIndex}">
          <div class="exercise-info">
            <h3>${exercise.name}</h3>
            <span class="exercise-meta">${exercise.muscles || exercise.equipment} · ${exercise.sets}×${exercise.repsMin}-${exercise.repsMax}</span>
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
          <div class="set-input-area" data-exercise-id="${exercise.id}">
            <div class="set-input-row">
              <div class="input-group">
                <input type="number" class="shared-weight" placeholder="${defaultWeight || 'kg'}" step="0.5" min="0"
                  value="${defaultWeight}" data-exercise-id="${exercise.id}">
                <span class="input-label">kg</span>
              </div>
              <div class="input-group">
                <input type="number" class="shared-reps" placeholder="${defaultReps || exercise.repsMin + '-' + exercise.repsMax}" step="1" min="0"
                  value="${defaultReps}" data-exercise-id="${exercise.id}">
                <span class="input-label">Wdh</span>
              </div>
            </div>
            <div class="set-buttons-row">
              ${setButtons.join('')}
            </div>
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

  attachExerciseListeners(workout, workoutType) {
    const logKey = this.selectedDate + '-' + workoutType;

    // Übung auf-/zuklappen
    document.querySelectorAll('.exercise-header').forEach(header => {
      header.addEventListener('click', () => {
        const body = document.getElementById(header.dataset.toggle);
        body.classList.toggle('collapsed');
        header.querySelector('.exercise-chevron').classList.toggle('rotated');
      });
    });

    // Satz-Buttons: Klick markiert Satz als erledigt mit den Werten aus dem shared Input
    document.querySelectorAll('.set-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.key;
        const setIndex = parseInt(btn.dataset.set);
        const restTime = parseInt(btn.dataset.rest) || 90;
        const exerciseId = btn.dataset.exerciseId;

        // Shared Inputs für diese Übung finden
        const area = btn.closest('.set-input-area');
        const weightInput = area.querySelector('.shared-weight');
        const repsInput = area.querySelector('.shared-reps');
        const weight = weightInput.value;
        const reps = repsInput.value;

        if (!weight || !reps) {
          this.showToast('Gewicht und Wdh eingeben!');
          return;
        }

        const log = Storage.getWorkoutLog(logKey);
        if (!log[key]) log[key] = {};

        // Toggle: Wenn schon erledigt, rückgängig machen
        if (log[key].done) {
          log[key].done = false;
          btn.classList.remove('set-btn-done');
          btn.querySelector('.set-btn-detail')?.remove();
          Storage.saveWorkoutLog(logKey, log);
          this.updateProgress(workout, log);
          return;
        }

        // Satz als erledigt markieren
        log[key].done = true;
        log[key].weight = weight;
        log[key].reps = reps;
        Storage.saveWorkoutLog(logKey, log);

        // UI Update
        btn.classList.add('set-btn-done');
        const existingDetail = btn.querySelector('.set-btn-detail');
        if (existingDetail) {
          existingDetail.textContent = `${weight}kg×${reps}`;
        } else {
          const detail = document.createElement('span');
          detail.className = 'set-btn-detail';
          detail.textContent = `${weight}kg×${reps}`;
          btn.appendChild(detail);
        }

        this.updateProgress(workout, log);

        // PR prüfen
        const newPR = Storage.checkAndUpdatePR(exerciseId, weight, reps);
        if (newPR) {
          this.showToast(`Neuer PR! ${newPR.weight}kg×${newPR.reps}`);
        }

        // Prüfe ob alle Sätze der Übung erledigt
        const card = btn.closest('.exercise-card');
        const allBtns = card.querySelectorAll('.set-btn');
        const allDone = Array.from(allBtns).every(b => b.classList.contains('set-btn-done'));
        if (allDone) card.classList.add('exercise-done');

        // Timer starten
        if (restTime > 0) {
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

  // --- PLAN: Interaktive Übersicht ---
  showPlan() {
    const content = document.getElementById('content');
    const currentDay = Storage.getCurrentTrainingDay();
    const history = Storage.getTrainingHistory();

    const lastByType = {};
    history.forEach(h => {
      if (h.type !== 'rest') {
        lastByType[h.type] = h.date;
      }
    });

    const completedCycles = Math.floor(history.filter(h => h.type !== 'rest').length / 6);
    const totalWorkouts = history.filter(h => h.type !== 'rest').length;
    const last7 = history.filter(h => {
      const d = new Date(h.date);
      const week = new Date();
      week.setDate(week.getDate() - 7);
      return d >= week && h.type !== 'rest';
    }).length;

    const days = TRAINING_PLAN.rotation.map((day, i) => {
      const isCurrent = i === currentDay;
      const lastDate = lastByType[day.type];
      const lastStr = lastDate
        ? new Date(lastDate).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })
        : 'Noch nie';

      return `
        <div class="plan-day ${isCurrent ? 'plan-day-current' : ''}" data-day-index="${i}">
          <div class="plan-day-top">
            <div class="plan-day-number">Tag ${i + 1}</div>
            ${isCurrent ? '<div class="plan-day-badge">Aktuell</div>' : ''}
          </div>
          <div class="plan-day-main">
            <span class="plan-day-icon">${day.icon}</span>
            <div class="plan-day-info">
              <div class="plan-day-label">${day.label}</div>
              <div class="plan-day-subtitle">${day.subtitle}</div>
            </div>
          </div>
          <div class="plan-day-bottom">
            <span class="plan-day-last">Zuletzt: ${lastStr}</span>
            <button class="btn-start-day" data-day="${i}">Starten</button>
          </div>
        </div>
      `;
    }).join('');

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
            <div class="stat-label">Zyklen</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">${last7}</div>
            <div class="stat-label">Diese Woche</div>
          </div>
        </div>
        <h3 class="plan-section-title">Trainingstage</h3>
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

    // Klick auf "Starten" Button
    document.querySelectorAll('.btn-start-day').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const dayIdx = parseInt(btn.dataset.day);
        Storage.setCurrentTrainingDay(dayIdx);
        // Zum Training-Tab wechseln
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        document.querySelector('[data-view="training"]').classList.add('active');
        this.showTraining(dayIdx);
      });
    });
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
