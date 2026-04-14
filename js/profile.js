// Profil-Verwaltung mit Charts und Export/Import

const Profile = {
  show() {
    const profile = Storage.getProfile();
    const content = document.getElementById('content');

    content.innerHTML = `
      <div class="profile-page">
        <h2>Dein Profil</h2>
        <form id="profile-form" class="profile-form">
          <div class="form-group">
            <label for="p-name">Name</label>
            <input type="text" id="p-name" value="${profile.name || ''}" placeholder="Dein Name">
          </div>
          <div class="form-group">
            <label for="p-age">Alter</label>
            <input type="number" id="p-age" value="${profile.age || ''}" placeholder="Jahre" min="14" max="99">
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="p-height">Größe (cm)</label>
              <input type="number" id="p-height" value="${profile.height || ''}" placeholder="cm" min="100" max="250">
            </div>
            <div class="form-group">
              <label for="p-weight">Gewicht (kg)</label>
              <input type="number" id="p-weight" value="${profile.weight || ''}" placeholder="kg" min="30" max="300" step="0.1">
            </div>
          </div>
          <div class="form-group">
            <label for="p-goal">Trainingsziel</label>
            <select id="p-goal">
              <option value="recomp" ${profile.goal === 'recomp' ? 'selected' : ''}>Abnehmen + Muskelaufbau</option>
              <option value="muscle" ${profile.goal === 'muscle' ? 'selected' : ''}>Muskelaufbau</option>
              <option value="strength" ${profile.goal === 'strength' ? 'selected' : ''}>Kraft + Fitness</option>
            </select>
          </div>
          <button type="submit" class="btn btn-primary">Speichern</button>
        </form>

        <div class="weight-tracking">
          <h3>Gewicht tracken</h3>
          <div class="weight-input-row">
            <input type="number" id="weight-today" placeholder="Heutiges Gewicht (kg)" step="0.1" min="30" max="300">
            <button class="btn btn-secondary" id="save-weight-btn">Eintragen</button>
          </div>
          <canvas id="weight-chart" height="200" style="margin-top:16px;display:none;"></canvas>
          <div id="weight-history-list" class="weight-history"></div>
        </div>

        <div class="treadmill-section">
          <h3>Laufband-Log</h3>
          <div class="form-row">
            <div class="form-group">
              <label for="t-steps">Schritte</label>
              <input type="number" id="t-steps" placeholder="z.B. 8000" min="0">
            </div>
            <div class="form-group">
              <label for="t-minutes">Minuten</label>
              <input type="number" id="t-minutes" placeholder="z.B. 60" min="0">
            </div>
          </div>
          <button class="btn btn-secondary" id="save-treadmill-btn">Laufband speichern</button>
        </div>

        <div class="backup-section">
          <h3>Daten-Backup</h3>
          <p class="text-muted" style="margin-bottom:12px">Exportiere deine Daten als Backup oder importiere sie auf einem anderen Gerät.</p>
          <div class="backup-buttons">
            <button class="btn btn-secondary" id="export-btn">Daten exportieren</button>
            <button class="btn btn-secondary" id="import-btn">Daten importieren</button>
          </div>
          <input type="file" id="import-file" accept=".json" style="display:none">
        </div>

        <div class="danger-section">
          <button class="btn btn-danger" id="reset-btn">Alle Daten löschen</button>
        </div>
      </div>
    `;

    this.attachListeners();
    this.renderWeightHistory();
    this.renderWeightChart();
  },

  attachListeners() {
    // Profil speichern
    document.getElementById('profile-form').addEventListener('submit', (e) => {
      e.preventDefault();
      Storage.saveProfile({
        name: document.getElementById('p-name').value,
        age: document.getElementById('p-age').value,
        height: document.getElementById('p-height').value,
        weight: document.getElementById('p-weight').value,
        goal: document.getElementById('p-goal').value,
      });
      App.showToast('Profil gespeichert!');
    });

    // Gewicht eintragen
    document.getElementById('save-weight-btn').addEventListener('click', () => {
      const w = parseFloat(document.getElementById('weight-today').value);
      if (w) {
        Storage.addWeightEntry(w);
        document.getElementById('weight-today').value = '';
        App.showToast('Gewicht eingetragen!');
        this.renderWeightHistory();
        this.renderWeightChart();
      }
    });

    // Laufband
    document.getElementById('save-treadmill-btn').addEventListener('click', () => {
      const steps = parseInt(document.getElementById('t-steps').value) || 0;
      const minutes = parseInt(document.getElementById('t-minutes').value) || 0;
      if (steps || minutes) {
        Storage.addTreadmillEntry(steps, minutes);
        App.showToast('Laufband gespeichert!');
        document.getElementById('t-steps').value = '';
        document.getElementById('t-minutes').value = '';
      }
    });

    // Export
    document.getElementById('export-btn').addEventListener('click', () => {
      const data = Storage.exportAll();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `gym-tracker-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      App.showToast('Backup heruntergeladen!');
    });

    // Import
    document.getElementById('import-btn').addEventListener('click', () => {
      document.getElementById('import-file').click();
    });

    document.getElementById('import-file').addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          Storage.importAll(event.target.result);
          App.showToast('Daten importiert! Seite wird neu geladen...');
          setTimeout(() => location.reload(), 1500);
        } catch {
          App.showToast('Fehler beim Import!');
        }
      };
      reader.readAsText(file);
    });

    // Reset
    document.getElementById('reset-btn').addEventListener('click', () => {
      if (confirm('Wirklich ALLE Daten löschen? Das kann nicht rückgängig gemacht werden!')) {
        localStorage.clear();
        App.showToast('Alle Daten gelöscht.');
        setTimeout(() => location.reload(), 1000);
      }
    });
  },

  renderWeightHistory() {
    const container = document.getElementById('weight-history-list');
    if (!container) return;
    const history = Storage.getWeightHistory().slice(-7).reverse();
    if (history.length === 0) {
      container.innerHTML = '<p class="text-muted">Noch keine Einträge</p>';
      return;
    }
    container.innerHTML = history.map(e =>
      `<div class="weight-entry">
        <span>${new Date(e.date).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })}</span>
        <span class="weight-value">${e.weight} kg</span>
      </div>`
    ).join('');
  },

  renderWeightChart() {
    const canvas = document.getElementById('weight-chart');
    if (!canvas) return;
    const history = Storage.getWeightHistory().slice(-30);
    if (history.length < 2) {
      canvas.style.display = 'none';
      return;
    }
    canvas.style.display = 'block';

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    const pad = { top: 20, right: 16, bottom: 30, left: 40 };
    const chartW = w - pad.left - pad.right;
    const chartH = h - pad.top - pad.bottom;

    const weights = history.map(e => e.weight);
    const minW = Math.floor(Math.min(...weights) - 1);
    const maxW = Math.ceil(Math.max(...weights) + 1);
    const range = maxW - minW || 1;

    // Hintergrund
    ctx.clearRect(0, 0, w, h);

    // Gitterlinien
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 0.5;
    ctx.font = '10px -apple-system, sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.textAlign = 'right';

    const gridSteps = 4;
    for (let i = 0; i <= gridSteps; i++) {
      const val = minW + (range / gridSteps) * i;
      const y = pad.top + chartH - (chartH / gridSteps) * i;
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(w - pad.right, y);
      ctx.stroke();
      ctx.fillText(val.toFixed(1), pad.left - 4, y + 3);
    }

    // Datenpunkte
    const points = history.map((e, i) => ({
      x: pad.left + (chartW / (history.length - 1)) * i,
      y: pad.top + chartH - ((e.weight - minW) / range) * chartH,
    }));

    // Gradient-Fläche
    const gradient = ctx.createLinearGradient(0, pad.top, 0, pad.top + chartH);
    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.3)');
    gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');

    ctx.beginPath();
    ctx.moveTo(points[0].x, pad.top + chartH);
    points.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.lineTo(points[points.length - 1].x, pad.top + chartH);
    ctx.fillStyle = gradient;
    ctx.fill();

    // Linie
    ctx.beginPath();
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    points.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
    ctx.stroke();

    // Punkte
    points.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#3b82f6';
      ctx.fill();
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });

    // X-Achsen Labels (Daten)
    ctx.fillStyle = '#94a3b8';
    ctx.textAlign = 'center';
    ctx.font = '9px -apple-system, sans-serif';
    const labelEvery = Math.max(1, Math.floor(history.length / 6));
    history.forEach((e, i) => {
      if (i % labelEvery === 0 || i === history.length - 1) {
        const d = new Date(e.date);
        ctx.fillText(`${d.getDate()}.${d.getMonth() + 1}`, points[i].x, h - 4);
      }
    });
  }
};
