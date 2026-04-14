// Trainingsplan-Daten: Push/Pull/Legs Split (A/B Varianten)
// Trainingstage statt Wochentage - flexible Rotation

const TRAINING_PLAN = {
  // 6 Trainingstage in fester Reihenfolge (Rotation)
  rotation: [
    { type: 'push-a', label: 'Push A', subtitle: 'Brust, Schultern, Trizeps', icon: '🏋️' },
    { type: 'pull-a', label: 'Pull A', subtitle: 'Rücken, Bizeps', icon: '💪' },
    { type: 'legs-a', label: 'Legs A', subtitle: 'Beine, Core', icon: '🦵' },
    { type: 'push-b', label: 'Push B', subtitle: 'Brust, Schultern, Trizeps', icon: '🏋️' },
    { type: 'pull-b', label: 'Pull B', subtitle: 'Rücken, Bizeps', icon: '💪' },
    { type: 'legs-b', label: 'Legs B + Kettlebell', subtitle: 'Beine, Core, Conditioning', icon: '🦵' },
  ],

  workouts: {
    'push-a': {
      name: 'Push A – Brust, Schultern, Trizeps',
      exercises: [
        { id: 'bench-press', name: 'Bankdrücken', equipment: 'Langhantel', sets: 4, repsMin: 8, repsMax: 12, rest: 150, notes: 'Kontrollierte Bewegung, Schulterblätter zusammen' },
        { id: 'incline-db-press', name: 'Schrägbankdrücken', equipment: 'Kurzhanteln', sets: 3, repsMin: 10, repsMax: 15, rest: 120, notes: 'Bank auf ~30° Schräge' },
        { id: 'pullover', name: 'Überzüge', equipment: 'Kurzhantel', sets: 3, repsMin: 12, repsMax: 15, rest: 90, notes: 'Arme leicht gebeugt, Stretch spüren' },
        { id: 'shoulder-press', name: 'Schulterdrücken', equipment: 'Kurzhanteln', sets: 3, repsMin: 10, repsMax: 12, rest: 120, notes: 'Stehend oder sitzend' },
        { id: 'lateral-raise', name: 'Seitheben', equipment: 'Kurzhanteln', sets: 3, repsMin: 15, repsMax: 20, rest: 60, notes: 'Leichtes Gewicht, kontrolliert' },
        { id: 'tricep-dips', name: 'Dips an der Bank', equipment: 'Bank', sets: 3, repsMin: 12, repsMax: 15, rest: 60, notes: 'Füße erhöht für mehr Intensität' },
      ]
    },
    'pull-a': {
      name: 'Pull A – Rücken, Bizeps',
      exercises: [
        { id: 'barbell-row', name: 'Langhantelrudern', equipment: 'Langhantel', sets: 4, repsMin: 8, repsMax: 12, rest: 150, notes: 'Oberkörper ~45°, Ellbogen eng' },
        { id: 'lat-pull', name: 'Latzug', equipment: 'Station', sets: 3, repsMin: 10, repsMax: 12, rest: 120, notes: 'Breiter Griff, zur Brust ziehen' },
        { id: 'db-row', name: 'Kurzhantelrudern einarmig', equipment: 'Kurzhantel', sets: 3, repsMin: 10, repsMax: 12, rest: 90, notes: 'Pro Seite, Rücken gerade' },
        { id: 'reverse-fly', name: 'Reverse Flys', equipment: 'Kurzhanteln', sets: 3, repsMin: 15, repsMax: 20, rest: 60, notes: 'Vorgebeugt, hintere Schulter' },
        { id: 'ez-curl', name: 'Bizeps-Curls', equipment: 'SZ-Stange', sets: 3, repsMin: 10, repsMax: 12, rest: 90, notes: 'Ellbogen fixiert, kein Schwung' },
        { id: 'hammer-curl', name: 'Hammer Curls', equipment: 'Kurzhanteln', sets: 3, repsMin: 12, repsMax: 15, rest: 60, notes: 'Neutraler Griff, langsam absenken' },
      ]
    },
    'legs-a': {
      name: 'Legs A – Beine, Core',
      exercises: [
        { id: 'squat', name: 'Kniebeugen', equipment: 'Langhantel', sets: 4, repsMin: 8, repsMax: 12, rest: 180, notes: 'Mindestens parallel, Knie über Zehenspitzen' },
        { id: 'rdl', name: 'Rumänisches Kreuzheben', equipment: 'Langhantel', sets: 3, repsMin: 10, repsMax: 12, rest: 120, notes: 'Beine leicht gebeugt, Hüfte nach hinten' },
        { id: 'leg-curl', name: 'Beincurls', equipment: 'Station', sets: 3, repsMin: 12, repsMax: 15, rest: 90, notes: 'Kontrolliert, voller Bewegungsumfang' },
        { id: 'lunges', name: 'Ausfallschritte', equipment: 'Kurzhanteln', sets: 3, repsMin: 10, repsMax: 12, rest: 90, notes: 'Pro Seite, Knie nicht über Zehen' },
        { id: 'calf-raise', name: 'Wadenheben', equipment: 'Langhantel', sets: 4, repsMin: 15, repsMax: 20, rest: 60, notes: 'Voller Stretch unten, Pause oben' },
        { id: 'ab-trainer', name: 'Bauchtrainer', equipment: 'Station', sets: 3, repsMin: 15, repsMax: 20, rest: 60, notes: 'Kontrolliert, kein Schwung' },
      ]
    },
    'push-b': {
      name: 'Push B – Brust, Schultern, Trizeps',
      exercises: [
        { id: 'close-grip-bench', name: 'Bankdrücken eng', equipment: 'Langhantel', sets: 4, repsMin: 10, repsMax: 15, rest: 120, notes: 'Enger Griff, mehr Trizeps-Fokus' },
        { id: 'db-press-flat', name: 'Kurzhantel-Bankdrücken', equipment: 'Kurzhanteln', sets: 3, repsMin: 10, repsMax: 15, rest: 120, notes: 'Flach, voller Bewegungsumfang' },
        { id: 'arnold-press', name: 'Arnold Press', equipment: 'Kurzhanteln', sets: 3, repsMin: 10, repsMax: 12, rest: 120, notes: 'Rotation von innen nach außen' },
        { id: 'front-raise', name: 'Frontheben', equipment: 'Kurzhanteln', sets: 3, repsMin: 12, repsMax: 15, rest: 60, notes: 'Abwechselnd, kontrolliert' },
        { id: 'lateral-raise-b', name: 'Seitheben', equipment: 'Kurzhanteln', sets: 3, repsMin: 15, repsMax: 20, rest: 60, notes: 'Leichtes Gewicht, Pause oben' },
        { id: 'tricep-kickback', name: 'Trizeps Kickbacks', equipment: 'Kurzhanteln', sets: 3, repsMin: 12, repsMax: 15, rest: 60, notes: 'Oberarm fixiert, nur Unterarm bewegt' },
      ]
    },
    'pull-b': {
      name: 'Pull B – Rücken, Bizeps',
      exercises: [
        { id: 'lat-pull-close', name: 'Latzug eng', equipment: 'Station', sets: 4, repsMin: 10, repsMax: 12, rest: 120, notes: 'Enger Griff, Ellbogen zum Körper' },
        { id: 'barbell-row-under', name: 'Langhantelrudern Untergriff', equipment: 'Langhantel', sets: 3, repsMin: 10, repsMax: 12, rest: 120, notes: 'Untergriff, mehr Bizeps-Beteiligung' },
        { id: 'db-row-b', name: 'Kurzhantelrudern', equipment: 'Kurzhantel', sets: 3, repsMin: 12, repsMax: 15, rest: 90, notes: 'Langsame Negative (3 Sek.)' },
        { id: 'face-pull-db', name: 'Reverse Flys vorgebeugt', equipment: 'Kurzhanteln', sets: 3, repsMin: 15, repsMax: 20, rest: 60, notes: 'Pause am höchsten Punkt' },
        { id: 'arm-curl-station', name: 'Armcurls', equipment: 'Station', sets: 3, repsMin: 10, repsMax: 12, rest: 90, notes: 'An der Curl-Station' },
        { id: 'concentration-curl', name: 'Konzentrations-Curls', equipment: 'Kurzhantel', sets: 3, repsMin: 12, repsMax: 15, rest: 60, notes: 'Sitzend, volle Kontraktion' },
      ]
    },
    'legs-b': {
      name: 'Legs B – Beine, Core, Kettlebell',
      exercises: [
        { id: 'front-squat', name: 'Frontkniebeugen', equipment: 'Langhantel', sets: 4, repsMin: 8, repsMax: 12, rest: 150, notes: 'Stange vorne auf Schultern, Oberkörper aufrecht' },
        { id: 'rdl-db', name: 'Einbeiniges Kreuzheben', equipment: 'Kurzhanteln', sets: 3, repsMin: 10, repsMax: 12, rest: 90, notes: 'Pro Seite, Balance trainieren' },
        { id: 'leg-curl-b', name: 'Beincurls', equipment: 'Station', sets: 3, repsMin: 12, repsMax: 15, rest: 90, notes: 'Langsame Negative (3 Sek.)' },
        { id: 'kb-swing', name: 'Kettlebell Swings', equipment: 'Kettlebell', sets: 4, repsMin: 15, repsMax: 20, rest: 60, notes: 'Hüfte explosiv strecken, Arme passiv' },
        { id: 'kb-goblet-squat', name: 'Goblet Squats', equipment: 'Kettlebell', sets: 3, repsMin: 15, repsMax: 20, rest: 60, notes: 'Tief gehen, Pause unten' },
        { id: 'calf-raise-b', name: 'Wadenheben einbeinig', equipment: 'Kurzhantel', sets: 3, repsMin: 15, repsMax: 20, rest: 60, notes: 'Pro Seite, auf Stufe stehen' },
        { id: 'plank', name: 'Plank', equipment: 'Bodyweight', sets: 3, repsMin: 45, repsMax: 60, rest: 60, notes: 'Sekunden halten, Körper gerade' },
      ]
    }
  }
};

function getWorkoutByType(type) {
  return TRAINING_PLAN.workouts[type] || null;
}
