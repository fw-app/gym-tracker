// Trainingsplan-Daten: Push/Pull/Legs Split (A/B Varianten)
// Trainingstage statt Wochentage - flexible Rotation

const TRAINING_PLAN = {
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
        {
          id: 'bench-press', name: 'Bankdrücken', equipment: 'Langhantel',
          sets: 4, repsMin: 8, repsMax: 12, rest: 150,
          muscles: 'Brust, vordere Schulter, Trizeps',
          notes: 'Kontrollierte Bewegung, Schulterblätter zusammen',
          description: 'Lege dich flach auf die Bank, Füße fest am Boden. Greife die Stange etwas breiter als schulterbreit. Senke die Stange kontrolliert zur mittleren Brust ab (3 Sek.), kurz halten, dann explosiv nach oben drücken. Schulterblätter zusammenziehen und während der gesamten Bewegung angespannt lassen. Achte darauf, dass die Handgelenke gerade bleiben.'
        },
        {
          id: 'incline-db-press', name: 'Schrägbankdrücken', equipment: 'Kurzhanteln',
          sets: 3, repsMin: 10, repsMax: 15, rest: 120,
          muscles: 'Obere Brust, vordere Schulter',
          notes: 'Bank auf ~30° Schräge',
          description: 'Stelle die Bank auf ca. 30° Schräge ein. Nimm die Kurzhanteln auf Brusthöhe, Handflächen nach vorne. Drücke die Gewichte nach oben zusammen (leichter Bogen), ohne die Ellbogen komplett durchzustrecken. Langsam absenken bis die Oberarme parallel zum Boden sind. Der Fokus liegt auf der oberen Brust.'
        },
        {
          id: 'pullover', name: 'Überzüge', equipment: 'Kurzhantel',
          sets: 3, repsMin: 12, repsMax: 15, rest: 90,
          muscles: 'Brust, Latissimus, Trizeps',
          notes: 'Arme leicht gebeugt, Stretch spüren',
          description: 'Lege dich quer über die Bank (nur Schulterblätter aufgelegt). Halte eine Kurzhantel mit beiden Händen über der Brust, Arme leicht gebeugt. Senke das Gewicht langsam hinter den Kopf ab, bis du einen Stretch in Brust und Lat spürst. Ziehe das Gewicht in einem Bogen zurück über die Brust. Hüfte bleibt stabil.'
        },
        {
          id: 'shoulder-press', name: 'Schulterdrücken', equipment: 'Kurzhanteln',
          sets: 3, repsMin: 10, repsMax: 12, rest: 120,
          muscles: 'Seitliche & vordere Schulter, Trizeps',
          notes: 'Stehend oder sitzend',
          description: 'Stehend oder sitzend, Kurzhanteln auf Schulterhöhe mit den Handflächen nach vorne. Drücke die Gewichte über den Kopf, bis die Arme fast gestreckt sind. Langsam zurück auf Schulterhöhe absenken. Rumpf anspannen, kein Hohlkreuz. Stehend trainiert zusätzlich die Core-Stabilität.'
        },
        {
          id: 'lateral-raise', name: 'Seitheben', equipment: 'Kurzhanteln',
          sets: 3, repsMin: 15, repsMax: 20, rest: 60,
          muscles: 'Seitliche Schulter',
          notes: 'Leichtes Gewicht, kontrolliert',
          description: 'Stehend, Kurzhanteln seitlich am Körper. Hebe die Arme seitlich bis auf Schulterhöhe an (nicht höher). Ellbogen leicht gebeugt, Daumen zeigen leicht nach unten (als würdest du Wasser aus Kannen gießen). Oben kurz halten, dann 3 Sek. kontrolliert absenken. Kein Schwung aus dem Körper!'
        },
        {
          id: 'tricep-dips', name: 'Dips an der Bank', equipment: 'Bank',
          sets: 3, repsMin: 12, repsMax: 15, rest: 60,
          muscles: 'Trizeps, vordere Schulter',
          notes: 'Füße erhöht für mehr Intensität',
          description: 'Hände hinter dir auf der Bankkante, Finger nach vorne. Beine ausgestreckt (Füße auf einer zweiten Erhöhung für mehr Schwierigkeit). Senke den Körper ab, bis die Oberarme parallel zum Boden sind. Drücke dich wieder hoch. Ellbogen bleiben eng am Körper und zeigen nach hinten.'
        },
      ]
    },
    'pull-a': {
      name: 'Pull A – Rücken, Bizeps',
      exercises: [
        {
          id: 'barbell-row', name: 'Langhantelrudern', equipment: 'Langhantel',
          sets: 4, repsMin: 8, repsMax: 12, rest: 150,
          muscles: 'Oberer Rücken, Latissimus, Bizeps',
          notes: 'Oberkörper ~45°, Ellbogen eng',
          description: 'Stehe mit leicht gebeugten Knien, Oberkörper ca. 45° nach vorne gebeugt. Greife die Stange schulterbreit im Obergriff. Ziehe die Stange zum unteren Brustkorb/oberen Bauch. Schulterblätter am höchsten Punkt zusammenpressen. Langsam ablassen. Rücken bleibt gerade, kein Rundrücken!'
        },
        {
          id: 'lat-pull', name: 'Latzug', equipment: 'Station',
          sets: 3, repsMin: 10, repsMax: 12, rest: 120,
          muscles: 'Latissimus, Bizeps, Rhomboiden',
          notes: 'Breiter Griff, zur Brust ziehen',
          description: 'Setze dich an die Latzug-Station, Oberschenkel unter der Polsterung fixiert. Greife die Stange breit (doppelt schulterbreit). Ziehe die Stange zur oberen Brust, dabei Brust rausstrecken und Schulterblätter nach unten/hinten ziehen. Kontrolliert zurückführen, Arme nicht komplett durchstrecken.'
        },
        {
          id: 'db-row', name: 'Kurzhantelrudern einarmig', equipment: 'Kurzhantel',
          sets: 3, repsMin: 10, repsMax: 12, rest: 90,
          muscles: 'Latissimus, oberer Rücken, Bizeps',
          notes: 'Pro Seite, Rücken gerade',
          description: 'Ein Knie und eine Hand auf der Bank abstützen, Rücken parallel zum Boden. Mit der freien Hand die Kurzhantel vom Boden zur Hüfte ziehen. Ellbogen eng am Körper vorbeiführen. Schulterblatt am höchsten Punkt zusammenziehen. Langsam ablassen. Rumpf bleibt stabil, nicht rotieren.'
        },
        {
          id: 'reverse-fly', name: 'Reverse Flys', equipment: 'Kurzhanteln',
          sets: 3, repsMin: 15, repsMax: 20, rest: 60,
          muscles: 'Hintere Schulter, Rhomboiden',
          notes: 'Vorgebeugt, hintere Schulter',
          description: 'Vorgebeugt stehend oder sitzend auf der Bankkante. Kurzhanteln hängen unter der Brust. Hebe die Arme seitlich an wie Flügel, Ellbogen leicht gebeugt. Schulterblätter zusammenpressen. Oben 1 Sek. halten, langsam absenken. Leichtes Gewicht, Fokus auf die hintere Schulter.'
        },
        {
          id: 'ez-curl', name: 'Bizeps-Curls', equipment: 'SZ-Stange',
          sets: 3, repsMin: 10, repsMax: 12, rest: 90,
          muscles: 'Bizeps, Unterarme',
          notes: 'Ellbogen fixiert, kein Schwung',
          description: 'Stehend, SZ-Stange im Untergriff an den schrägen Griffen. Ellbogen eng am Körper fixiert - nur die Unterarme bewegen sich. Gewicht kontrolliert nach oben curlen, oben kurz anspannen. 3 Sek. langsam absenken. Kein Schwung aus der Hüfte! Wenn du schwingen musst, ist das Gewicht zu schwer.'
        },
        {
          id: 'hammer-curl', name: 'Hammer Curls', equipment: 'Kurzhanteln',
          sets: 3, repsMin: 12, repsMax: 15, rest: 60,
          muscles: 'Bizeps (langer Kopf), Brachialis, Unterarme',
          notes: 'Neutraler Griff, langsam absenken',
          description: 'Stehend, Kurzhanteln seitlich am Körper im neutralen Griff (Handflächen zeigen zueinander). Abwechselnd oder gleichzeitig nach oben curlen. Der neutrale Griff trainiert besonders den Brachialis und die Unterarme. Langsam absenken (3 Sek.).'
        },
      ]
    },
    'legs-a': {
      name: 'Legs A – Beine, Core',
      exercises: [
        {
          id: 'squat', name: 'Kniebeugen', equipment: 'Langhantel',
          sets: 4, repsMin: 8, repsMax: 12, rest: 180,
          muscles: 'Quadrizeps, Gesäß, Core',
          notes: 'Mindestens parallel, Knie über Zehenspitzen',
          description: 'Stange auf dem oberen Rücken (nicht auf dem Nacken). Füße schulterbreit, Zehen leicht nach außen. In die Hocke gehen - mindestens bis die Oberschenkel parallel zum Boden sind. Gewicht auf den ganzen Fuß verteilen. Brust raus, Rücken gerade. Aus der Hüfte explosiv nach oben drücken. Die wichtigste Übung für die Beine!'
        },
        {
          id: 'rdl', name: 'Rumänisches Kreuzheben', equipment: 'Langhantel',
          sets: 3, repsMin: 10, repsMax: 12, rest: 120,
          muscles: 'Beinbizeps, Gesäß, unterer Rücken',
          notes: 'Beine leicht gebeugt, Hüfte nach hinten',
          description: 'Stehend, Stange vor den Oberschenkeln. Beine bleiben leicht gebeugt (Winkel ändert sich nicht!). Schiebe die Hüfte nach hinten und senke die Stange an den Beinen entlang ab. Du solltest einen starken Stretch im Beinbizeps spüren. Rücken bleibt gerade! Aus der Hüfte wieder aufrichten.'
        },
        {
          id: 'leg-curl', name: 'Beincurls', equipment: 'Station',
          sets: 3, repsMin: 12, repsMax: 15, rest: 90,
          muscles: 'Beinbizeps (Hamstrings)',
          notes: 'Kontrolliert, voller Bewegungsumfang',
          description: 'An der Beincurl-Station. Polster über den Fersen/Achillessehnen. Beine kontrolliert beugen, am höchsten Punkt 1 Sek. anspannen. Langsam zurückführen, aber nicht komplett ablegen. Hüfte bleibt auf dem Polster - nicht abheben.'
        },
        {
          id: 'lunges', name: 'Ausfallschritte', equipment: 'Kurzhanteln',
          sets: 3, repsMin: 10, repsMax: 12, rest: 90,
          muscles: 'Quadrizeps, Gesäß, Balance',
          notes: 'Pro Seite, Knie nicht über Zehen',
          description: 'Kurzhanteln seitlich halten. Großen Schritt nach vorne, bis beide Knie ~90° gebeugt sind. Das hintere Knie berührt fast den Boden. Oberkörper aufrecht. Aus dem vorderen Bein zurück in den Stand drücken. Abwechselnd oder alle Reps pro Seite.'
        },
        {
          id: 'calf-raise', name: 'Wadenheben', equipment: 'Langhantel',
          sets: 4, repsMin: 15, repsMax: 20, rest: 60,
          muscles: 'Waden (Gastrocnemius, Soleus)',
          notes: 'Voller Stretch unten, Pause oben',
          description: 'Stange auf dem Rücken wie bei Kniebeugen. Auf die Zehenspitzen hochdrücken, oben 1-2 Sek. halten und die Waden anspannen. Langsam absenken bis die Fersen fast den Boden berühren (voller Stretch). Waden brauchen hohe Wiederholungszahlen und vollen Bewegungsumfang.'
        },
        {
          id: 'ab-trainer', name: 'Bauchtrainer', equipment: 'Station',
          sets: 3, repsMin: 15, repsMax: 20, rest: 60,
          muscles: 'Bauchmuskeln (Rectus abdominis)',
          notes: 'Kontrolliert, kein Schwung',
          description: 'An der Bauchtrainer-Station. Oberkörper langsam nach vorne beugen und die Bauchmuskeln zusammenziehen. Nicht mit den Armen ziehen - die Bewegung kommt aus dem Bauch. Oben kurz halten, kontrolliert zurück. Kein Schwung!'
        },
      ]
    },
    'push-b': {
      name: 'Push B – Brust, Schultern, Trizeps',
      exercises: [
        {
          id: 'close-grip-bench', name: 'Bankdrücken eng', equipment: 'Langhantel',
          sets: 4, repsMin: 10, repsMax: 15, rest: 120,
          muscles: 'Trizeps, innere Brust',
          notes: 'Enger Griff, mehr Trizeps-Fokus',
          description: 'Wie normales Bankdrücken, aber Hände nur schulterbreit oder enger greifen. Die Ellbogen bleiben eng am Körper. Das verlagert die Belastung auf den Trizeps und die innere Brust. Nicht zu eng greifen - das belastet die Handgelenke.'
        },
        {
          id: 'db-press-flat', name: 'Kurzhantel-Bankdrücken', equipment: 'Kurzhanteln',
          sets: 3, repsMin: 10, repsMax: 15, rest: 120,
          muscles: 'Brust, Schultern, Trizeps',
          notes: 'Flach, voller Bewegungsumfang',
          description: 'Flach auf der Bank, Kurzhanteln auf Brusthöhe. Drücke nach oben und führe die Hanteln leicht zusammen. Kurzhanteln erlauben einen größeren Bewegungsumfang als die Langhantel - nutze das aus und senke die Gewichte tief ab. Kontrollierte Bewegung.'
        },
        {
          id: 'arnold-press', name: 'Arnold Press', equipment: 'Kurzhanteln',
          sets: 3, repsMin: 10, repsMax: 12, rest: 120,
          muscles: 'Gesamte Schulter, Trizeps',
          notes: 'Rotation von innen nach außen',
          description: 'Sitzend, Kurzhanteln vor dem Gesicht mit den Handflächen zu dir. Während du nach oben drückst, rotiere die Hände nach außen, bis sie am höchsten Punkt nach vorne zeigen. Die Rotation trainiert alle drei Schulterköpfe. Benannt nach Arnold Schwarzenegger!'
        },
        {
          id: 'front-raise', name: 'Frontheben', equipment: 'Kurzhanteln',
          sets: 3, repsMin: 12, repsMax: 15, rest: 60,
          muscles: 'Vordere Schulter',
          notes: 'Abwechselnd, kontrolliert',
          description: 'Stehend, Kurzhanteln vor den Oberschenkeln. Hebe einen Arm gestreckt nach vorne bis auf Schulterhöhe. 1 Sek. halten, kontrolliert absenken. Dann den anderen Arm. Kein Schwung, Rumpf stabil. Leichtes Gewicht reicht hier völlig.'
        },
        {
          id: 'lateral-raise-b', name: 'Seitheben', equipment: 'Kurzhanteln',
          sets: 3, repsMin: 15, repsMax: 20, rest: 60,
          muscles: 'Seitliche Schulter',
          notes: 'Leichtes Gewicht, Pause oben',
          description: 'Wie bei Push A, aber mit Pause am höchsten Punkt (2 Sek. halten). Das erhöht die Zeit unter Spannung und macht die Übung effektiver bei leichtem Gewicht. 15-20 Wiederholungen für maximale Schulter-Breite.'
        },
        {
          id: 'tricep-kickback', name: 'Trizeps Kickbacks', equipment: 'Kurzhanteln',
          sets: 3, repsMin: 12, repsMax: 15, rest: 60,
          muscles: 'Trizeps (langer Kopf)',
          notes: 'Oberarm fixiert, nur Unterarm bewegt',
          description: 'Vorgebeugt, eine Hand auf der Bank abstützen. Oberarm parallel zum Boden fixieren. Strecke den Unterarm nach hinten aus, bis der Arm komplett gestreckt ist. Am Ende anspannen. Langsam zurückbeugen. Nur der Unterarm bewegt sich! Sehr effektiv mit leichtem Gewicht.'
        },
      ]
    },
    'pull-b': {
      name: 'Pull B – Rücken, Bizeps',
      exercises: [
        {
          id: 'lat-pull-close', name: 'Latzug eng', equipment: 'Station',
          sets: 4, repsMin: 10, repsMax: 12, rest: 120,
          muscles: 'Latissimus, unterer Rücken, Bizeps',
          notes: 'Enger Griff, Ellbogen zum Körper',
          description: 'Enger Griff an der Latzug-Station (Hände ca. schulterbreit, Untergriff). Ziehe die Stange zur oberen Brust, Ellbogen eng am Körper nach unten/hinten. Der enge Griff betont den unteren Latissimus und den Bizeps stärker als der breite Griff.'
        },
        {
          id: 'barbell-row-under', name: 'Langhantelrudern Untergriff', equipment: 'Langhantel',
          sets: 3, repsMin: 10, repsMax: 12, rest: 120,
          muscles: 'Latissimus, Bizeps, oberer Rücken',
          notes: 'Untergriff, mehr Bizeps-Beteiligung',
          description: 'Wie normales Langhantelrudern, aber im Untergriff (Handflächen nach oben). Das erhöht die Bizeps-Beteiligung. Ziehe die Stange zum Bauchnabel. Schulterblätter zusammenziehen. Rücken gerade halten!'
        },
        {
          id: 'db-row-b', name: 'Kurzhantelrudern', equipment: 'Kurzhantel',
          sets: 3, repsMin: 12, repsMax: 15, rest: 90,
          muscles: 'Latissimus, Rhomboiden',
          notes: 'Langsame Negative (3 Sek.)',
          description: 'Wie bei Pull A, aber mit Fokus auf langsame Negative: 1 Sek. nach oben ziehen, 3 Sek. kontrolliert ablassen. Die langsame exzentrische Phase erhöht die Muskelspannung deutlich - ideal wenn du mit begrenztem Gewicht arbeitest.'
        },
        {
          id: 'face-pull-db', name: 'Reverse Flys vorgebeugt', equipment: 'Kurzhanteln',
          sets: 3, repsMin: 15, repsMax: 20, rest: 60,
          muscles: 'Hintere Schulter, Rotatorenmanschette',
          notes: 'Pause am höchsten Punkt',
          description: 'Vorgebeugt, Kurzhanteln mit neutralem Griff. Arme seitlich anheben, am höchsten Punkt 2 Sek. halten und die Schulterblätter zusammenpressen. Sehr wichtig für die Schultergesundheit und Haltung! Wird oft vernachlässigt.'
        },
        {
          id: 'arm-curl-station', name: 'Armcurls', equipment: 'Station',
          sets: 3, repsMin: 10, repsMax: 12, rest: 90,
          muscles: 'Bizeps',
          notes: 'An der Curl-Station',
          description: 'An der Armcurl-Station. Arme auf dem Polster ablegen, Ellbogen fixiert. Gewicht kontrolliert nach oben curlen, oben anspannen. Langsam ablassen. Das Polster verhindert Abfälschen und isoliert den Bizeps perfekt.'
        },
        {
          id: 'concentration-curl', name: 'Konzentrations-Curls', equipment: 'Kurzhantel',
          sets: 3, repsMin: 12, repsMax: 15, rest: 60,
          muscles: 'Bizeps (Peak)',
          notes: 'Sitzend, volle Kontraktion',
          description: 'Sitzend, Beine gespreizt. Ellbogen an der Innenseite des Oberschenkels abstützen. Kurzhantel langsam curlen und am höchsten Punkt maximal anspannen (2 Sek. halten). Die beste Übung für den Bizeps-Peak. Leichtes Gewicht, volle Konzentration.'
        },
      ]
    },
    'legs-b': {
      name: 'Legs B – Beine, Core, Kettlebell',
      exercises: [
        {
          id: 'front-squat', name: 'Frontkniebeugen', equipment: 'Langhantel',
          sets: 4, repsMin: 8, repsMax: 12, rest: 150,
          muscles: 'Quadrizeps, Core, oberer Rücken',
          notes: 'Stange vorne auf Schultern, Oberkörper aufrecht',
          description: 'Stange vorne auf den Schultern/Schlüsselbeinen, Ellbogen hoch. Gehe tief in die Hocke - Frontkniebeugen erlauben eine aufrechtere Haltung. Fokus auf den Quadrizeps. Oberkörper bleibt aufrecht, sonst fällt die Stange nach vorne. Weniger Gewicht als bei normalen Kniebeugen nötig.'
        },
        {
          id: 'rdl-db', name: 'Einbeiniges Kreuzheben', equipment: 'Kurzhanteln',
          sets: 3, repsMin: 10, repsMax: 12, rest: 90,
          muscles: 'Beinbizeps, Gesäß, Balance',
          notes: 'Pro Seite, Balance trainieren',
          description: 'Stehe auf einem Bein, Kurzhantel in der gegenüberliegenden Hand. Beuge dich nach vorne, das freie Bein geht nach hinten als Gegengewicht. Senke die Hantel Richtung Boden. Stretch im Beinbizeps spüren. Trainiert Kraft UND Balance gleichzeitig. Verdoppelt das effektive Gewicht pro Bein!'
        },
        {
          id: 'leg-curl-b', name: 'Beincurls', equipment: 'Station',
          sets: 3, repsMin: 12, repsMax: 15, rest: 90,
          muscles: 'Beinbizeps (Hamstrings)',
          notes: 'Langsame Negative (3 Sek.)',
          description: 'Wie bei Legs A, aber mit 3 Sek. Negativen: Normal nach oben curlen, dann 3 Sek. langsam absenken. Das erhöht die Intensität ohne mehr Gewicht zu brauchen.'
        },
        {
          id: 'kb-swing', name: 'Kettlebell Swings', equipment: 'Kettlebell',
          sets: 4, repsMin: 15, repsMax: 20, rest: 60,
          muscles: 'Gesäß, Beinbizeps, Core, Kondition',
          notes: 'Hüfte explosiv strecken, Arme passiv',
          description: 'Füße schulterbreit, Kettlebell zwischen den Beinen. Hüfte nach hinten schieben (Hinge), dann die Hüfte explosiv nach vorne strecken. Die Kraft kommt NUR aus der Hüfte - die Arme schwingen passiv mit. Kettlebell bis auf Brusthöhe. Core anspannen. Ideal für Fettverbrennung und Kondition!'
        },
        {
          id: 'kb-goblet-squat', name: 'Goblet Squats', equipment: 'Kettlebell',
          sets: 3, repsMin: 15, repsMax: 20, rest: 60,
          muscles: 'Quadrizeps, Gesäß, Core',
          notes: 'Tief gehen, Pause unten',
          description: 'Kettlebell mit beiden Händen vor der Brust halten (wie einen Kelch/Goblet). Tief in die Hocke gehen, Ellbogen zwischen die Knie. Unten 2 Sek. Pause halten. Aufrecht bleiben. Perfekt für Beweglichkeit und Beintraining mit leichtem Gewicht.'
        },
        {
          id: 'calf-raise-b', name: 'Wadenheben einbeinig', equipment: 'Kurzhantel',
          sets: 3, repsMin: 15, repsMax: 20, rest: 60,
          muscles: 'Waden',
          notes: 'Pro Seite, auf Stufe stehen',
          description: 'Stelle dich mit einem Fuß auf eine Stufe oder Gewichtsscheibe, Ferse hängt über. Kurzhantel in der gleichen Hand halten, andere Hand zum Abstützen. Auf die Zehenspitzen hochdrücken, langsam absenken bis zur vollen Dehnung. Einbeinig = doppelt so viel effektives Gewicht!'
        },
        {
          id: 'plank', name: 'Plank', equipment: 'Bodyweight',
          sets: 3, repsMin: 45, repsMax: 60, rest: 60,
          muscles: 'Core, Schultern, Rücken',
          notes: 'Sekunden halten, Körper gerade',
          description: 'Unterarmstütz: Unterarme und Zehen auf dem Boden, Körper bildet eine gerade Linie. Po nicht zu hoch oder zu tief. Bauchmuskeln aktiv anspannen. Halte 45-60 Sekunden. Wenn das zu leicht wird: Gewichtsscheibe auf den Rücken legen.'
        },
      ]
    }
  }
};

function getWorkoutByType(type) {
  return TRAINING_PLAN.workouts[type] || null;
}
