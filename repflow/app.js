(() => {
  "use strict";

  const STORAGE_KEY = "repflow-library-v2";
  const LEGACY_STORAGE_KEY = "repflow-programs-v1";
  const DEFAULT_ROUTINES_VERSION_KEY = "repflow-default-routines-version";
  const DEFAULT_ROUTINES_VERSION = 2;
  const DEFAULT_PROGRAM_ID = "week-1-12";
  const DEFAULT_PROGRAM_DESCRIPTION = "A balanced 12-week strength plan with four repeatable routines.";
  const TIMER_CIRCUMFERENCE = 622;

  const EXAMPLE_PROGRAM = {
    title: "Upper Body + Abs Strength",
    description: "Controlled strength work for the upper body, grip, and core. Rest properly and keep every rep clean.",
    restSeconds: 75,
    exercises: [
      { title: "Arm Circles", sets: 2, reps: 20, description: "10 forward, 10 backward. Use smooth, controlled movements.", restSeconds: 15 },
      { title: "Kettlebell Halo", sets: 2, reps: 5, description: "Move with control around your head and keep your ribs down.", restSeconds: 15 },
      { title: "Scapular Pull-Up", sets: 2, reps: 6, description: "Keep your arms straight. Pull your shoulder blades down without bending your elbows.", restSeconds: 15 },
      { title: "Push-Up Warm-Up", sets: 2, reps: 6, description: "Use slow reps and leave plenty of strength in reserve.", restSeconds: 15 },
      { title: "Chin Tuck", sets: 2, reps: 8, description: "Pull your chin straight back without tilting your head downward.", restSeconds: 15 },
      { title: "Chin-Up", sets: 3, reps: 6, description: "Keep your chest up and shoulders down. Stay controlled throughout.", restSeconds: 90 },
      { title: "Single-Arm Floor Press", sets: 3, reps: 10, description: "Brace your core and press steadily without rotating your body.", restSeconds: 75 },
      { title: "Single-Arm Kettlebell Row", sets: 3, reps: 10, description: "Pull your elbow back toward your hip and keep your back stable.", restSeconds: 75 },
      { title: "Single-Arm Overhead Press", sets: 3, reps: 8, description: "Squeeze your glutes and brace your core. Press straight up without arching your back.", restSeconds: 75 },
      { title: "Push-Up", sets: 3, reps: 12, description: "Keep your body straight and lower with control. Bring your chest close to the floor.", restSeconds: 60 },
      { title: "Kettlebell Curl", sets: 3, reps: 10, description: "Keep your elbow still and avoid swinging the weight.", restSeconds: 60 },
      { title: "Dead Hang", sets: 3, durationSeconds: 30, description: "Hang long and relaxed while maintaining a secure grip.", restSeconds: 60 },
      { title: "Hanging Knee Raise", sets: 2, reps: 10, description: "Use your abs to pull your knees up without swinging.", restSeconds: 45 },
      { title: "Reverse Plank", sets: 2, durationSeconds: 30, description: "Press your hips up and keep your body in a straight line.", restSeconds: 45 },
      { title: "Wall Angels", sets: 2, reps: 10, description: "Keep your back and arms as close to the wall as possible.", restSeconds: 30 }
    ]
  };

  const VIDEO_EXAMPLE_PROGRAM = {
    title: "Follow-Along Mobility",
    description: "A guided mobility session from YouTube.",
    youtubeUrl: "https://www.youtube.com/watch?v=M7lc1UVf-VE"
  };

  const KETTLEBELL_LEG_STRENGTH_PROGRAM = {
    title: "40 Min Kettlebell Leg Strength",
    description: "Leg-focused strength workout using 8 kg and 12 kg kettlebells, with a short warmup and core finisher.",
    restSeconds: 60,
    exercises: [
      { title: "Bodyweight Squat", sets: 1, reps: 15, description: "Move slowly and warm up the hips and knees.", restSeconds: 15 },
      { title: "Alternating Reverse Lunge", sets: 1, reps: 10, description: "Use bodyweight and keep the front foot planted.", restSeconds: 15 },
      { title: "Glute Bridge", sets: 1, reps: 15, description: "Squeeze the glutes without arching the lower back.", restSeconds: 30 },
      { title: "Double Kettlebell Split Squat", sets: 3, reps: 8, description: "Hold 8 kg and 12 kg at your sides and swap hands each set.", restSeconds: 75 },
      { title: "Double Kettlebell Reverse Lunge", sets: 3, reps: 8, description: "Hold both bells at your sides and stay tall through the torso.", restSeconds: 75 },
      { title: "Slow Goblet Squat", sets: 3, reps: 12, description: "Use 12 kg, lower for 3 seconds and drive up strongly.", restSeconds: 60 },
      { title: "Kettlebell Sumo Squat", sets: 3, reps: 12, description: "Use a wide stance and keep your torso upright.", restSeconds: 60 },
      { title: "Weighted Glute Bridge", sets: 3, reps: 15, description: "Place the kettlebell on your hips and squeeze at the top.", restSeconds: 45 },
      { title: "Standing Calf Raise", sets: 3, reps: 18, description: "Hold both kettlebells and pause briefly at the top.", restSeconds: 30 },
      { title: "Dead Bug", sets: 2, reps: 10, description: "Move slowly and keep your lower back gently pressed down.", restSeconds: 30 }
    ]
  };

  const DEFAULT_VIDEO_PROGRAMS = [
    {
      title: "Upper body kettlebell",
      description: "25min workout",
      youtubeUrl: "https://www.youtube.com/watch?v=rgYyLxI3wIo"
    },
    {
      title: "Leg kettlebell workout",
      description: "20min workout",
      youtubeUrl: "https://www.youtube.com/watch?v=5WlI327TSR4"
    }
  ];

  const AI_PROMPT = `Create a workout routine for the Repflow app and return ONLY valid JSON — no markdown fences or explanation.

For a traditional exercise routine, use exactly this structure:
{
  "title": "Routine name",
  "description": "Short optional summary",
  "restSeconds": 30,
  "exercises": [
    {
      "title": "Exercise name",
      "sets": 3,
      "reps": 12,
      "description": "Optional concise form cue",
      "restSeconds": 30
    },
    {
      "title": "Plank",
      "sets": 3,
      "durationSeconds": 45,
      "description": "Optional concise form cue"
    }
  ]
}

For a follow-along YouTube routine, use exactly this structure instead:
{
  "title": "Video routine name",
  "description": "Short optional summary",
  "youtubeUrl": "https://www.youtube.com/watch?v=VIDEO_ID"
}

Rules:
- Create either an exercise routine OR a YouTube routine, never both.
- Every exercise needs title and sets.
- Use either reps OR durationSeconds for each exercise, never both.
- All number values must be positive whole numbers.
- restSeconds is optional per exercise and overrides the routine default.
- Keep descriptions short enough to read during training.

My goal, experience, available equipment, workout duration, and preferences are: [REPLACE THIS WITH MY DETAILS]`;

  const $ = (selector) => document.querySelector(selector);
  const els = {
    home: $("#homeView"), workout: $("#workoutView"), video: $("#videoView"), finish: $("#finishView"),
    grid: $("#programGrid"), count: $("#programCount"),
    create: $("#createButton"), install: $("#installButton"), dialog: $("#programDialog"),
    closeDialog: $("#closeDialogButton"), dialogTitle: $("#dialogTitle"), jsonTab: $("#jsonTab"), visualTab: $("#visualTab"), aiTab: $("#aiTab"),
    jsonPanel: $("#jsonPanel"), visualPanel: $("#visualPanel"), aiPanel: $("#aiPanel"), jsonInput: $("#jsonInput"),
    jsonError: $("#jsonError"), loadExample: $("#loadExampleButton"), loadVideoExample: $("#loadVideoExampleButton"), saveProgram: $("#saveProgramButton"),
    aiPrompt: $("#aiPrompt"), copyPrompt: $("#copyPromptButton"), toast: $("#toast"),
    programName: $("#workoutProgramName"), exit: $("#exitWorkoutButton"), sound: $("#soundButton"),
    progressLabel: $("#progressLabel"), progressPercent: $("#progressPercent"), progressFill: $("#progressFill"),
    progressTrack: $(".progress-track"), phasePill: $("#phasePill"), setLabel: $("#setLabel"),
    exerciseTitle: $("#exerciseTitle"), exerciseDescription: $("#exerciseDescription"),
    metric: $("#metric"), metricValue: $("#metricValue"), metricUnit: $("#metricUnit"),
    timerRing: $("#timerRing"), timerCircle: $("#timerCircle"), timerTime: $("#timerTime"),
    action: $("#actionButton"), actionLabel: $("#actionButtonLabel"), pause: $("#pauseButton"),
    nextTitle: $("#nextTitle"), nextDetail: $("#nextDetail"),
    confirmDialog: $("#confirmDialog"), continueWorkout: $("#continueWorkoutButton"), confirmExit: $("#confirmExitButton"),
    videoTitle: $("#videoProgramTitle"), videoDescription: $("#videoProgramDescription"), videoLoading: $("#videoLoading"),
    youtubePlayer: $("#youtubePlayer"), exitVideo: $("#exitVideoButton"), finishVideo: $("#finishVideoButton"),
    videoCompletionHint: $("#videoCompletionHint"),
    exerciseKind: $("#exerciseKindButton"), videoKind: $("#videoKindButton"), builderTitle: $("#builderTitle"),
    builderDescription: $("#builderDescription"), exerciseBuilder: $("#exerciseBuilder"), videoBuilder: $("#videoBuilder"),
    builderDefaultRest: $("#builderDefaultRest"), exerciseBuilderList: $("#exerciseBuilderList"), addExercise: $("#addExerciseButton"),
    builderYoutubeUrl: $("#builderYoutubeUrl"), builderError: $("#builderError"), saveBuilder: $("#saveBuilderButton"),
    finishTime: $("#finishTime"), finishTimeLabel: $("#finishTimeLabel"),
    finishExercises: $("#finishExercises"), finishExercisesLabel: $("#finishExercisesLabel"),
    finishSets: $("#finishSets"), finishSetsLabel: $("#finishSetsLabel"), finishButton: $("#finishButton")
  };

  let programs = loadPrograms();
  const expandedProgramIds = new Set();
  let workout = null;
  let timerId = null;
  let deferredInstallPrompt = null;
  let toastTimeout = null;
  let audioContext = null;
  let wakeLock = null;
  let videoSession = null;
  let youtubePlayer = null;
  let youtubeApiPromise = null;
  let videoProgressTimer = null;
  let editingRoutineId = null;
  let builderKind = "exercise";
  let exerciseSortable = null;

  function loadPrograms() {
    try {
      const storedLibrary = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (Array.isArray(storedLibrary) && storedLibrary.length) {
        const normalizedLibrary = storedLibrary.map(normalizeProgramGroup);
        addDefaultRoutineUpdates(normalizedLibrary);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizedLibrary));
        return normalizedLibrary;
      }

      const legacyRoutines = JSON.parse(localStorage.getItem(LEGACY_STORAGE_KEY));
      if (Array.isArray(legacyRoutines) && legacyRoutines.length) {
        const migratedProgram = createProgramGroup(migrateLegacyRoutines(legacyRoutines));
        localStorage.setItem(STORAGE_KEY, JSON.stringify([migratedProgram]));
        localStorage.setItem(DEFAULT_ROUTINES_VERSION_KEY, String(DEFAULT_ROUTINES_VERSION));
        return [migratedProgram];
      }
    } catch (_) { /* Fall back to a fresh default library. */ }

    const defaultProgram = createProgramGroup([EXAMPLE_PROGRAM, KETTLEBELL_LEG_STRENGTH_PROGRAM, ...DEFAULT_VIDEO_PROGRAMS]);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([defaultProgram]));
      localStorage.setItem(DEFAULT_ROUTINES_VERSION_KEY, String(DEFAULT_ROUTINES_VERSION));
    } catch (_) { /* Storage may be unavailable. */ }
    return [defaultProgram];
  }

  function addDefaultRoutineUpdates(library) {
    const storedVersion = Number(localStorage.getItem(DEFAULT_ROUTINES_VERSION_KEY)) || 1;
    if (storedVersion >= DEFAULT_ROUTINES_VERSION) return;
    const defaultProgram = library.find((program) => program.id === DEFAULT_PROGRAM_ID) || library[0];
    defaultProgram.routines = dedupeRoutines([...defaultProgram.routines, normalizeRoutine(KETTLEBELL_LEG_STRENGTH_PROGRAM)]);
    if (defaultProgram.id === DEFAULT_PROGRAM_ID) defaultProgram.description = DEFAULT_PROGRAM_DESCRIPTION;
    localStorage.setItem(DEFAULT_ROUTINES_VERSION_KEY, String(DEFAULT_ROUTINES_VERSION));
  }

  function createProgramGroup(routines) {
    return {
      id: DEFAULT_PROGRAM_ID,
      title: "Week 1–12",
      description: DEFAULT_PROGRAM_DESCRIPTION,
      routines: dedupeRoutines(routines.map(normalizeRoutine))
    };
  }

  function normalizeProgramGroup(raw) {
    return {
      id: raw.id || crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`,
      title: String(raw.title || "Untitled program").trim(),
      description: String(raw.description || "").trim(),
      routines: Array.isArray(raw.routines) ? dedupeRoutines(raw.routines.map(normalizeRoutine)) : []
    };
  }

  function migrateLegacyRoutines(stored) {
    const routines = stored.map((routine) => {
      const isLegacyDummy = routine?.title === "Full Body Ignite";
      const isSwedishStarter = routine?.title === "Upper Body + Abs Strength"
        && routine?.description === "Kontrollerad styrka för överkropp, grepp och core. Vila ordentligt och håll varje rep ren.";
      if (isLegacyDummy || isSwedishStarter) {
        return { ...normalizeRoutine(EXAMPLE_PROGRAM), id: routine.id, ...(routine.lastCompletedAt ? { lastCompletedAt: routine.lastCompletedAt } : {}) };
      }
      return normalizeRoutine(routine);
    });

    DEFAULT_VIDEO_PROGRAMS.forEach((defaultRoutine) => {
      const videoId = extractYouTubeVideoId(defaultRoutine.youtubeUrl);
      if (!routines.some((routine) => routine.youtubeVideoId === videoId)) routines.push(normalizeRoutine(defaultRoutine));
    });
    routines.push(normalizeRoutine(KETTLEBELL_LEG_STRENGTH_PROGRAM));
    return routines;
  }

  function dedupeRoutines(routines) {
    const unique = [];
    const seen = new Map();
    routines.forEach((routine) => {
      const identity = routine.youtubeVideoId
        ? `video:${routine.youtubeVideoId}`
        : `exercise:${routine.title.trim().toLocaleLowerCase()}`;
      const existing = seen.get(identity);
      if (!existing) {
        seen.set(identity, routine);
        unique.push(routine);
        return;
      }

      const existingCompleted = existing.lastCompletedAt ? new Date(existing.lastCompletedAt).getTime() || 0 : 0;
      const duplicateCompleted = routine.lastCompletedAt ? new Date(routine.lastCompletedAt).getTime() || 0 : 0;
      if (duplicateCompleted > existingCompleted) existing.lastCompletedAt = routine.lastCompletedAt;
    });
    return unique;
  }

  function persistPrograms() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(programs));
  }

  function normalizeRoutine(raw) {
    const videoId = raw.youtubeUrl ? extractYouTubeVideoId(raw.youtubeUrl) : null;
    if (videoId) {
      return {
        id: raw.id || crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`,
        title: String(raw.title || "Untitled video routine").trim(),
        description: String(raw.description || "").trim(),
        youtubeUrl: String(raw.youtubeUrl).trim(),
        youtubeVideoId: videoId,
        ...(raw.lastCompletedAt ? { lastCompletedAt: String(raw.lastCompletedAt) } : {})
      };
    }
    return {
      id: raw.id || crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`,
      title: String(raw.title || "Untitled routine").trim(),
      description: String(raw.description || "").trim(),
      restSeconds: Number(raw.restSeconds) || 30,
      ...(raw.lastCompletedAt ? { lastCompletedAt: String(raw.lastCompletedAt) } : {}),
      exercises: raw.exercises.map((exercise) => ({
        title: String(exercise.title).trim(),
        sets: Number(exercise.sets),
        ...(exercise.reps != null ? { reps: Number(exercise.reps) } : {}),
        ...(exercise.durationSeconds != null ? { durationSeconds: Number(exercise.durationSeconds) } : {}),
        ...(exercise.description ? { description: String(exercise.description).trim() } : {}),
        ...(exercise.restSeconds != null ? { restSeconds: Number(exercise.restSeconds) } : {})
      }))
    };
  }

  function validateRoutine(value) {
    if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("The JSON must contain one routine object.");
    if (typeof value.title !== "string" || !value.title.trim()) throw new Error("Add a routine title.");
    if (value.youtubeUrl != null) {
      if (typeof value.youtubeUrl !== "string" || !extractYouTubeVideoId(value.youtubeUrl)) {
        throw new Error("Add a valid YouTube video URL.");
      }
      if (value.exercises != null) throw new Error("A routine cannot contain both youtubeUrl and exercises.");
      return;
    }
    if (!Array.isArray(value.exercises) || !value.exercises.length) throw new Error("Add at least one exercise.");
    if (value.restSeconds != null && !isPositiveInteger(value.restSeconds)) throw new Error("Routine restSeconds must be a positive whole number.");

    value.exercises.forEach((exercise, index) => {
      const position = `Exercise ${index + 1}`;
      if (!exercise || typeof exercise.title !== "string" || !exercise.title.trim()) throw new Error(`${position} needs a title.`);
      if (!isPositiveInteger(exercise.sets)) throw new Error(`${position} needs sets as a positive whole number.`);
      const hasReps = exercise.reps != null;
      const hasDuration = exercise.durationSeconds != null;
      if (hasReps === hasDuration) throw new Error(`${position} must have either reps or durationSeconds, but not both.`);
      if (hasReps && !isPositiveInteger(exercise.reps)) throw new Error(`${position} reps must be a positive whole number.`);
      if (hasDuration && !isPositiveInteger(exercise.durationSeconds)) throw new Error(`${position} durationSeconds must be a positive whole number.`);
      if (exercise.restSeconds != null && !isPositiveInteger(exercise.restSeconds)) throw new Error(`${position} restSeconds must be a positive whole number.`);
    });
  }

  function isPositiveInteger(value) {
    return Number.isInteger(Number(value)) && Number(value) > 0;
  }

  function extractYouTubeVideoId(value) {
    try {
      const url = new URL(String(value).trim());
      const host = url.hostname.replace(/^www\./, "").replace(/^m\./, "");
      let id = null;
      if (host === "youtu.be") id = url.pathname.split("/").filter(Boolean)[0];
      if (host === "youtube.com" || host === "youtube-nocookie.com") {
        if (url.pathname === "/watch") id = url.searchParams.get("v");
        else if (/^\/(embed|shorts|live)\//.test(url.pathname)) id = url.pathname.split("/")[2];
      }
      return /^[a-zA-Z0-9_-]{11}$/.test(id || "") ? id : null;
    } catch (_) {
      return null;
    }
  }

  function estimateMinutes(program) {
    if (program.youtubeVideoId) return null;
    let seconds = 0;
    program.exercises.forEach((exercise) => {
      seconds += exercise.durationSeconds ? exercise.durationSeconds * exercise.sets : 35 * exercise.sets;
      seconds += (exercise.restSeconds || program.restSeconds) * exercise.sets;
    });
    return Math.max(1, Math.round(seconds / 60));
  }

  function renderPrograms() {
    els.grid.replaceChildren();
    programs.forEach((program, programIndex) => {
      const isExpanded = expandedProgramIds.has(program.id);
      const group = document.createElement("article");
      group.className = `program-group${isExpanded ? " is-expanded" : ""}`;
      group.innerHTML = `
        <button class="program-summary" type="button" aria-expanded="${isExpanded}">
          <span class="program-week"><i data-lucide="calendar-range"></i><strong>12</strong><small>WEEKS</small></span>
          <span class="program-summary-copy">
            <span class="card-type">TRAINING PROGRAM ${String(programIndex + 1).padStart(2, "0")}</span>
            <strong class="program-group-title"></strong>
            <span class="program-group-description"></span>
          </span>
          <span class="program-summary-end">
            <span>${program.routines.length} ${program.routines.length === 1 ? "routine" : "routines"}</span>
            <i class="program-chevron" data-lucide="chevron-down"></i>
          </span>
        </button>
        <div class="routine-panel" ${isExpanded ? "" : "hidden"}>
          <div class="routine-panel-heading">
            <div><p class="kicker">ROUTINES</p><h3>Choose today’s work</h3></div>
            <span>Complete any routine at least 90% to log it.</span>
          </div>
          <div class="routine-grid"></div>
        </div>`;
      group.querySelector(".program-group-title").textContent = program.title;
      group.querySelector(".program-group-description").textContent = program.description;

      const summary = group.querySelector(".program-summary");
      const panel = group.querySelector(".routine-panel");
      summary.addEventListener("click", () => {
        const expanded = summary.getAttribute("aria-expanded") === "true";
        summary.setAttribute("aria-expanded", String(!expanded));
        panel.hidden = expanded;
        group.classList.toggle("is-expanded", !expanded);
        if (expanded) expandedProgramIds.delete(program.id);
        else expandedProgramIds.add(program.id);
      });

      const routineGrid = group.querySelector(".routine-grid");
      program.routines.forEach((routine, routineIndex) => routineGrid.appendChild(createRoutineCard(routine, routineIndex)));

      const addCard = document.createElement("button");
      addCard.className = "empty-card routine-add-card";
      addCard.type = "button";
      addCard.innerHTML = `<div><i data-lucide="plus-circle"></i><strong>Add another routine</strong><span>Import a workout from JSON</span></div>`;
      addCard.addEventListener("click", openProgramDialog);
      routineGrid.appendChild(addCard);
      els.grid.appendChild(group);
    });
    const routineCount = programs.reduce((sum, program) => sum + program.routines.length, 0);
    els.count.textContent = `${programs.length} ${programs.length === 1 ? "program" : "programs"} · ${routineCount} routines`;
    refreshIcons();
  }

  function createRoutineCard(routine, index) {
    const isVideo = Boolean(routine.youtubeVideoId);
    const card = document.createElement("article");
    card.className = "program-card routine-card";
    card.innerHTML = `
      <div class="card-top">
        <span class="card-type">${isVideo ? "VIDEO" : "ROUTINE"} ${String(index + 1).padStart(2, "0")}</span>
        <span class="card-actions">
          <button class="card-menu edit-routine-button" type="button" aria-label="Edit ${escapeHtml(routine.title)}"><i data-lucide="pencil"></i></button>
          <button class="card-menu delete-routine-button" type="button" aria-label="Delete ${escapeHtml(routine.title)}"><i data-lucide="trash-2"></i></button>
        </span>
      </div>
      <div class="card-orb"><i data-lucide="${isVideo ? "youtube" : index % 3 === 0 ? "dumbbell" : index % 3 === 1 ? "flame" : "activity"}"></i></div>
      <h3></h3>
      <p class="card-meta">${isVideo ? "Follow-along video workout" : `${routine.exercises.length} exercises · ${totalSets(routine)} sets`}</p>
      ${routine.lastCompletedAt ? `<p class="card-completed"><i data-lucide="circle-check"></i>${formatLastCompleted(routine.lastCompletedAt)}</p>` : ""}
      <div class="card-bottom">
        <span class="card-duration"><i data-lucide="${isVideo ? "play-square" : "clock-3"}"></i> ${isVideo ? "WATCH & TRAIN" : `~${estimateMinutes(routine)} MIN`}</span>
        <button class="start-button" type="button" aria-label="Start ${escapeHtml(routine.title)}"><i data-lucide="play"></i></button>
      </div>`;
    card.querySelector("h3").textContent = routine.title;
    card.querySelector(".start-button").addEventListener("click", () => isVideo ? startVideoProgram(routine) : startWorkout(routine));
    card.querySelector(".edit-routine-button").addEventListener("click", () => openRoutineEditor(routine));
    card.querySelector(".delete-routine-button").addEventListener("click", () => deleteRoutine(routine.id));
    return card;
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));
  }

  function totalSets(program) {
    return program.exercises?.reduce((sum, exercise) => sum + exercise.sets, 0) || 0;
  }

  function formatLastCompleted(value) {
    const completed = new Date(value);
    if (Number.isNaN(completed.getTime())) return "Last completed recently";
    const now = new Date();
    const todayUtc = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
    const completedUtc = Date.UTC(completed.getFullYear(), completed.getMonth(), completed.getDate());
    const days = Math.max(0, Math.round((todayUtc - completedUtc) / 86400000));
    if (days === 0) return "Last completed today";
    return `Last completed ${days} ${days === 1 ? "day" : "days"} ago`;
  }

  function findRoutine(id) {
    for (const program of programs) {
      const routine = program.routines.find((item) => item.id === id);
      if (routine) return routine;
    }
    return null;
  }

  function markRoutineCompleted(routine) {
    const completedAt = new Date().toISOString();
    routine.lastCompletedAt = completedAt;
    const storedRoutine = findRoutine(routine.id);
    if (storedRoutine) storedRoutine.lastCompletedAt = completedAt;
    persistPrograms();
    renderPrograms();
  }

  function deleteRoutine(id) {
    const routine = findRoutine(id);
    if (!routine || !window.confirm(`Delete routine “${routine.title}”?`)) return;
    programs.forEach((program) => { program.routines = program.routines.filter((item) => item.id !== id); });
    persistPrograms();
    renderPrograms();
    showToast("Routine deleted", "trash-2");
  }

  function showView(view) {
    [els.home, els.workout, els.video, els.finish].forEach((item) => item.classList.toggle("is-active", item === view));
    document.querySelector(".topbar").hidden = view === els.workout || view === els.video;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openProgramDialog() {
    editingRoutineId = null;
    els.dialogTitle.textContent = "Add a routine";
    els.jsonTab.hidden = false;
    els.aiTab.hidden = false;
    els.jsonError.hidden = true;
    resetVisualBuilder();
    selectDialogTab("visual");
    els.dialog.showModal();
    ensureExerciseSortable();
    setTimeout(() => els.builderTitle.focus(), 100);
  }

  function closeProgramDialog() { els.dialog.close(); }

  function selectDialogTab(tab) {
    const tabs = [
      ["json", els.jsonTab, els.jsonPanel],
      ["visual", els.visualTab, els.visualPanel],
      ["ai", els.aiTab, els.aiPanel]
    ];
    tabs.forEach(([name, button, panel]) => {
      const active = name === tab;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-selected", String(active));
      panel.classList.toggle("is-active", active);
    });
    if (tab === "visual") ensureExerciseSortable();
  }

  function openRoutineEditor(routine) {
    editingRoutineId = routine.id;
    els.dialogTitle.textContent = "Edit routine";
    els.jsonTab.hidden = true;
    els.aiTab.hidden = true;
    populateVisualBuilder(routine);
    selectDialogTab("visual");
    els.dialog.showModal();
    ensureExerciseSortable();
    setTimeout(() => els.builderTitle.focus(), 100);
  }

  function resetVisualBuilder() {
    els.builderTitle.value = "";
    els.builderDescription.value = "";
    els.builderDefaultRest.value = "30";
    els.builderYoutubeUrl.value = "";
    els.builderError.hidden = true;
    els.exerciseBuilderList.replaceChildren();
    setBuilderKind("exercise");
    addExerciseEditor();
  }

  function populateVisualBuilder(routine) {
    els.builderTitle.value = routine.title;
    els.builderDescription.value = routine.description || "";
    els.builderError.hidden = true;
    els.exerciseBuilderList.replaceChildren();
    if (routine.youtubeVideoId) {
      setBuilderKind("video");
      els.builderYoutubeUrl.value = routine.youtubeUrl;
      els.builderDefaultRest.value = "30";
    } else {
      setBuilderKind("exercise");
      els.builderDefaultRest.value = String(routine.restSeconds || 30);
      routine.exercises.forEach(addExerciseEditor);
    }
  }

  function setBuilderKind(kind) {
    builderKind = kind;
    const isExercise = kind === "exercise";
    els.exerciseKind.classList.toggle("is-active", isExercise);
    els.videoKind.classList.toggle("is-active", !isExercise);
    els.exerciseBuilder.hidden = !isExercise;
    els.videoBuilder.hidden = isExercise;
    refreshIcons();
  }

  function addExerciseEditor(exercise = {}) {
    const isTimed = exercise.durationSeconds != null;
    const item = document.createElement("div");
    item.className = "exercise-builder-item";
    item.innerHTML = `
      <div class="exercise-builder-top">
        <button class="drag-handle" type="button" aria-label="Drag to reorder"><i data-lucide="grip-vertical"></i><span>EXERCISE <b class="drag-index"></b></span></button>
        <button class="remove-exercise-button" type="button" aria-label="Remove exercise"><i data-lucide="trash-2"></i></button>
      </div>
      <div class="exercise-builder-grid">
        <label class="exercise-field exercise-field-title"><span>TITLE</span><input class="exercise-title-input" type="text" placeholder="Exercise name" /></label>
        <label class="exercise-field"><span>MEASURE</span><select class="exercise-measure"><option value="reps">Repetitions</option><option value="timer">Timer</option></select></label>
        <label class="exercise-field"><span class="exercise-value-label">REPS</span><input class="exercise-value" type="number" min="1" step="1" /></label>
        <label class="exercise-field"><span>SETS</span><input class="exercise-sets" type="number" min="1" step="1" /></label>
        <label class="exercise-field"><span>REST SEC</span><input class="exercise-rest" type="number" min="1" step="1" placeholder="Default" /></label>
        <label class="exercise-field exercise-field-description"><span>DESCRIPTION / FORM CUE</span><input class="exercise-description-input" type="text" placeholder="Optional coaching cue" /></label>
      </div>`;
    item.querySelector(".exercise-title-input").value = exercise.title || "";
    item.querySelector(".exercise-measure").value = isTimed ? "timer" : "reps";
    item.querySelector(".exercise-value").value = String(isTimed ? exercise.durationSeconds : exercise.reps || 10);
    item.querySelector(".exercise-sets").value = String(exercise.sets || 3);
    item.querySelector(".exercise-rest").value = exercise.restSeconds || "";
    item.querySelector(".exercise-description-input").value = exercise.description || "";
    updateExerciseMeasure(item);
    item.querySelector(".exercise-measure").addEventListener("change", () => updateExerciseMeasure(item));
    item.querySelector(".remove-exercise-button").addEventListener("click", () => {
      item.remove();
      updateExerciseEditorNumbers();
    });
    els.exerciseBuilderList.appendChild(item);
    updateExerciseEditorNumbers();
    refreshIcons();
  }

  function updateExerciseMeasure(item) {
    const timed = item.querySelector(".exercise-measure").value === "timer";
    item.querySelector(".exercise-value-label").textContent = timed ? "SECONDS" : "REPS";
  }

  function updateExerciseEditorNumbers() {
    [...els.exerciseBuilderList.children].forEach((item, index) => {
      item.querySelector(".drag-index").textContent = String(index + 1).padStart(2, "0");
    });
  }

  function ensureExerciseSortable() {
    if (exerciseSortable || !window.Sortable) return;
    exerciseSortable = new window.Sortable(els.exerciseBuilderList, {
      animation: 180,
      handle: ".drag-handle",
      ghostClass: "is-dragging",
      forceFallback: true,
      fallbackTolerance: 4,
      onEnd: updateExerciseEditorNumbers
    });
  }

  function readVisualBuilder() {
    const routine = {
      title: els.builderTitle.value.trim(),
      description: els.builderDescription.value.trim()
    };
    if (builderKind === "video") {
      routine.youtubeUrl = els.builderYoutubeUrl.value.trim();
      return routine;
    }

    routine.restSeconds = Number(els.builderDefaultRest.value);
    routine.exercises = [...els.exerciseBuilderList.children].map((item) => {
      const timed = item.querySelector(".exercise-measure").value === "timer";
      const restValue = item.querySelector(".exercise-rest").value.trim();
      return {
        title: item.querySelector(".exercise-title-input").value.trim(),
        sets: Number(item.querySelector(".exercise-sets").value),
        ...(timed
          ? { durationSeconds: Number(item.querySelector(".exercise-value").value) }
          : { reps: Number(item.querySelector(".exercise-value").value) }),
        ...(item.querySelector(".exercise-description-input").value.trim()
          ? { description: item.querySelector(".exercise-description-input").value.trim() }
          : {}),
        ...(restValue ? { restSeconds: Number(restValue) } : {})
      };
    });
    return routine;
  }

  function saveVisualBuilder() {
    try {
      const rawRoutine = readVisualBuilder();
      validateRoutine(rawRoutine);
      const normalized = normalizeRoutine(rawRoutine);
      if (editingRoutineId) {
        const existing = findRoutine(editingRoutineId);
        normalized.id = editingRoutineId;
        if (existing?.lastCompletedAt) normalized.lastCompletedAt = existing.lastCompletedAt;
        programs.forEach((program) => {
          const index = program.routines.findIndex((routine) => routine.id === editingRoutineId);
          if (index >= 0) program.routines[index] = normalized;
        });
      } else {
        programs[0].routines.unshift(normalized);
      }
      expandedProgramIds.add(programs[0].id);
      persistPrograms();
      renderPrograms();
      closeProgramDialog();
      showToast(editingRoutineId ? "Routine updated" : "Routine saved");
      editingRoutineId = null;
    } catch (error) {
      els.builderError.textContent = error.message;
      els.builderError.hidden = false;
    }
  }

  function saveProgram() {
    try {
      const raw = els.jsonInput.value.trim();
      if (!raw) throw new Error("Paste your routine JSON first.");
      const parsed = JSON.parse(raw);
      validateRoutine(parsed);
      programs[0].routines.unshift(normalizeRoutine(parsed));
      expandedProgramIds.add(programs[0].id);
      persistPrograms();
      renderPrograms();
      closeProgramDialog();
      els.jsonInput.value = "";
      showToast("Routine saved");
    } catch (error) {
      els.jsonError.textContent = error instanceof SyntaxError ? "That JSON has a syntax error. Check commas, quotes, and brackets." : error.message;
      els.jsonError.hidden = false;
    }
  }

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(AI_PROMPT);
      showToast("Prompt copied");
    } catch (_) {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(els.aiPrompt);
      selection.removeAllRanges();
      selection.addRange(range);
      showToast("Prompt selected — copy it now", "copy");
    }
  }

  function showToast(message, icon = "check") {
    els.toast.innerHTML = `<i data-lucide="${icon}"></i><span></span>`;
    els.toast.querySelector("span").textContent = message;
    refreshIcons();
    els.toast.classList.add("is-visible");
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => els.toast.classList.remove("is-visible"), 2200);
  }

  function loadYouTubeApi() {
    if (window.YT?.Player) return Promise.resolve(window.YT);
    if (youtubeApiPromise) return youtubeApiPromise;
    youtubeApiPromise = new Promise((resolve, reject) => {
      const timeout = window.setTimeout(() => reject(new Error("YouTube API timed out.")), 8000);
      const previousCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        window.clearTimeout(timeout);
        previousCallback?.();
        resolve(window.YT);
      };
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      script.onerror = () => reject(new Error("YouTube could not be loaded."));
      document.head.appendChild(script);
    });
    return youtubeApiPromise;
  }

  function resetYouTubeMount() {
    stopVideoProgressTracking();
    try { youtubePlayer?.destroy(); } catch (_) { /* The player may not be ready yet. */ }
    youtubePlayer = null;
    document.querySelector("#youtubePlayer")?.remove();
  }

  function createYouTubeIframe(program) {
    const params = new URLSearchParams({ enablejsapi: "1", playsinline: "1", rel: "0" });
    if (/^https?:$/.test(location.protocol)) params.set("origin", location.origin);
    const iframe = document.createElement("iframe");
    iframe.id = "youtubePlayer";
    iframe.title = `${program.title} YouTube workout`;
    iframe.src = `https://www.youtube.com/embed/${program.youtubeVideoId}?${params}`;
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    iframe.allowFullscreen = true;
    iframe.addEventListener("load", () => { els.videoLoading.hidden = true; }, { once: true });
    document.querySelector(".video-frame-shell").appendChild(iframe);
    return iframe;
  }

  async function startVideoProgram(program) {
    clearTimer();
    resetYouTubeMount();
    videoSession = { program, startedAt: Date.now(), completed: false, credited: false };
    els.videoTitle.textContent = program.title;
    els.videoDescription.textContent = program.description || "Follow along at your own pace. The routine completes when the video ends.";
    els.videoCompletionHint.textContent = "This session finishes automatically when the video ends.";
    els.finishVideo.hidden = true;
    els.videoLoading.hidden = false;
    els.videoLoading.innerHTML = `<span class="loading-mark"><i data-lucide="loader-circle"></i></span><strong>Loading your workout…</strong>`;
    showView(els.video);
    refreshIcons();
    requestWakeLock();

    if (location.protocol === "file:") {
      showVideoError(153);
      return;
    }

    const iframe = createYouTubeIframe(program);

    try {
      const YT = await loadYouTubeApi();
      if (!videoSession || videoSession.program.id !== program.id) return;
      youtubePlayer = new YT.Player(iframe, {
        events: {
          onReady: () => {
            els.videoLoading.hidden = true;
            startVideoProgressTracking();
          },
          onStateChange: (event) => {
            checkVideoCompletionProgress();
            if (event.data === YT.PlayerState.ENDED) completeVideoProgram();
          },
          onError: (event) => showVideoError(event.data)
        }
      });
    } catch (_) {
      enableManualVideoFinish();
    }
  }

  function enableManualVideoFinish() {
    if (!videoSession) return;
    els.videoLoading.hidden = true;
    els.videoCompletionHint.textContent = "When the video ends, finish the workout here.";
    els.finishVideo.hidden = false;
    showToast("Video ready · manual finish enabled", "play");
  }

  function startVideoProgressTracking() {
    stopVideoProgressTracking();
    checkVideoCompletionProgress();
    videoProgressTimer = window.setInterval(checkVideoCompletionProgress, 1000);
  }

  function stopVideoProgressTracking() {
    if (videoProgressTimer) window.clearInterval(videoProgressTimer);
    videoProgressTimer = null;
  }

  function checkVideoCompletionProgress() {
    if (!videoSession || videoSession.credited || !youtubePlayer?.getDuration) return;
    try {
      const duration = youtubePlayer.getDuration();
      const currentTime = youtubePlayer.getCurrentTime();
      if (duration > 0 && currentTime / duration >= 0.9) {
        videoSession.credited = true;
        markRoutineCompleted(videoSession.program);
        stopVideoProgressTracking();
      }
    } catch (_) { /* The player may not be ready or available in standalone mode. */ }
  }

  function showVideoError(errorCode) {
    if (!videoSession) return;
    const messages = {
      2: ["The YouTube link is invalid.", "Check the URL or replace this routine with a valid public video."],
      5: ["YouTube could not play this video here.", "Try opening it on YouTube or choose a different video."],
      100: ["This video is unavailable.", "It may have been removed or made private."],
      101: ["The video owner disabled embedding.", "Repflow cannot override this YouTube setting. Choose another video or open it on YouTube."],
      150: ["The video owner disabled embedding.", "Repflow cannot override this YouTube setting. Choose another video or open it on YouTube."],
      153: ["YouTube could not identify this app page.", "Open Repflow from GitHub Pages or a local web server—not directly as a file."],
      api: ["The YouTube player could not load.", "Check your connection, content blocker, or browser privacy settings and try again."]
    };
    const [title, detail] = messages[errorCode] || ["This video could not be embedded.", `YouTube returned player error ${errorCode || "unknown"}.`];
    els.videoLoading.hidden = false;
    els.videoLoading.replaceChildren();
    const message = document.createElement("strong");
    message.textContent = title;
    const explanation = document.createElement("p");
    explanation.textContent = detail;
    const link = document.createElement("a");
    link.href = videoSession.program.youtubeUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "Open it on YouTube";
    els.videoLoading.append(message, explanation, link);
  }

  function completeVideoProgram() {
    if (!videoSession || videoSession.completed) return;
    videoSession.completed = true;
    if (!videoSession.credited) {
      videoSession.credited = true;
      markRoutineCompleted(videoSession.program);
    }
    stopVideoProgressTracking();
    const elapsed = Math.max(1, Math.round((Date.now() - videoSession.startedAt) / 1000));
    try { youtubePlayer?.destroy(); } catch (_) { /* Player is already ending. */ }
    youtubePlayer = null;
    els.finishTime.textContent = formatTime(elapsed);
    els.finishTimeLabel.textContent = "TIME";
    els.finishExercises.textContent = "1";
    els.finishExercisesLabel.textContent = "VIDEO";
    els.finishSets.textContent = "✓";
    els.finishSetsLabel.textContent = "COMPLETE";
    videoSession = null;
    releaseWakeLock();
    beep(true);
    showView(els.finish);
    refreshIcons();
  }

  function startWorkout(program) {
    clearTimer();
    workout = {
      program, exerciseIndex: 0, setIndex: 0, phase: "work", remaining: 0, timerTotal: 0,
      running: false, muted: false, startedAt: Date.now(), nextTarget: null,
      lastBeepSecond: null, workTimerStarted: false, credited: false
    };
    showView(els.workout);
    requestWakeLock();
    renderWorkout();
  }

  function renderWorkout() {
    if (!workout) return;
    const exercise = currentExercise();
    const isRest = workout.phase === "rest";
    const isSetup = workout.phase === "setup";
    els.programName.textContent = workout.program.title;
    els.phasePill.classList.toggle("is-rest", isRest);
    els.phasePill.innerHTML = `<span></span> ${isRest ? "REST" : isSetup ? "GET READY" : "WORK"}`;
    els.exerciseTitle.textContent = isRest ? "Catch your breath." : exercise.title;
    els.exerciseDescription.textContent = isRest
      ? "Reset, breathe, and get ready to move again."
      : isSetup
        ? "Get into position. Your work timer starts after the tone."
        : (exercise.description || "");
    els.setLabel.textContent = isRest ? "NEXT SET" : isSetup ? `SET ${workout.setIndex + 1} · STARTS IN` : `SET ${workout.setIndex + 1} / ${exercise.sets}`;

    if (isRest || isSetup || exercise.durationSeconds) {
      els.metric.hidden = true;
      els.timerRing.hidden = false;
      if (!isRest && workout.timerTotal === 0) setupTimer(exercise.durationSeconds, false);
      updateTimerDisplay();
      if (isRest) {
        els.action.hidden = false;
        els.actionLabel.textContent = "Skip rest";
      } else if (isSetup) {
        els.action.hidden = true;
      } else {
        els.action.hidden = workout.running;
        els.actionLabel.textContent = workout.remaining < workout.timerTotal ? "Resume timer" : "Start timer";
      }
      els.pause.hidden = isSetup || !workout.running;
    } else {
      els.metric.hidden = false;
      els.timerRing.hidden = true;
      els.metricValue.textContent = exercise.reps;
      els.metricUnit.textContent = "REPS";
      els.action.hidden = false;
      els.actionLabel.textContent = "Complete set";
      els.pause.hidden = true;
    }

    updateProgress();
    updateNextUp();
    refreshIcons();
  }

  function currentExercise() { return workout.program.exercises[workout.exerciseIndex]; }

  function setupTimer(seconds, autoStart) {
    clearTimer();
    workout.timerTotal = seconds;
    workout.remaining = seconds;
    workout.running = false;
    workout.lastBeepSecond = null;
    if (autoStart) startTimer();
  }

  function startTimer() {
    if (!workout || workout.running) return;
    prepareAudio();
    workout.running = true;
    const endAt = Date.now() + workout.remaining * 1000;
    clearTimer();
    timerId = window.setInterval(() => {
      workout.remaining = Math.max(0, Math.ceil((endAt - Date.now()) / 1000));
      updateTimerDisplay();
      if (workout.remaining > 0 && workout.remaining <= 5 && workout.lastBeepSecond !== workout.remaining) {
        workout.lastBeepSecond = workout.remaining;
        beepCountdown(workout.remaining);
      }
      if (workout.remaining <= 0) timerFinished();
    }, 200);
    renderWorkoutControls();
  }

  function pauseTimer() {
    if (!workout?.running) return;
    workout.running = false;
    clearTimer();
    renderWorkoutControls();
  }

  function clearTimer() {
    if (timerId) window.clearInterval(timerId);
    timerId = null;
  }

  function updateTimerDisplay() {
    if (!workout) return;
    els.timerTime.textContent = formatTime(workout.remaining);
    const progress = workout.timerTotal ? workout.remaining / workout.timerTotal : 0;
    els.timerCircle.style.strokeDashoffset = String(TIMER_CIRCUMFERENCE * (1 - progress));
  }

  function renderWorkoutControls() {
    if (!workout) return;
    if (workout.phase === "rest") {
      els.action.hidden = false;
      els.actionLabel.textContent = "Skip rest";
    } else if (workout.phase === "setup") {
      els.action.hidden = true;
    } else {
      els.action.hidden = workout.running;
      els.actionLabel.textContent = workout.remaining < workout.timerTotal ? "Resume timer" : "Start timer";
    }
    els.pause.hidden = workout.phase === "setup" || !workout.running;
    els.pause.innerHTML = `<i data-lucide="pause"></i><span>Pause timer</span>`;
    refreshIcons();
  }

  function timerFinished() {
    clearTimer();
    workout.running = false;
    beepCountdown(0);
    if (workout.phase === "setup") {
      workout.phase = "work";
      workout.workTimerStarted = true;
      setupTimer(currentExercise().durationSeconds, true);
      renderWorkout();
    } else if (workout.phase === "rest") enterTarget();
    else completeWorkSet(true);
  }

  function handleAction() {
    if (!workout) return;
    const exercise = currentExercise();
    if (workout.phase === "rest") enterTarget();
    else if (exercise.durationSeconds && !workout.workTimerStarted) beginSetupCountdown();
    else if (exercise.durationSeconds) startTimer();
    else completeWorkSet();
  }

  function beginSetupCountdown() {
    workout.phase = "setup";
    setupTimer(3, true);
    renderWorkout();
  }

  function completeWorkSet(timerAlreadySignaled = false) {
    creditWorkoutAtThreshold();
    const next = getNextTarget();
    if (!next) {
      completeWorkout(!timerAlreadySignaled);
      return;
    }
    const restSeconds = currentExercise().restSeconds || workout.program.restSeconds || 30;
    workout.phase = "rest";
    workout.nextTarget = next;
    setupTimer(restSeconds, true);
    renderWorkout();
  }

  function creditWorkoutAtThreshold() {
    if (!workout || workout.credited) return;
    let completedBeforeCurrent = 0;
    workout.program.exercises.forEach((exercise, index) => {
      if (index < workout.exerciseIndex) completedBeforeCurrent += exercise.sets;
      if (index === workout.exerciseIndex) completedBeforeCurrent += workout.setIndex;
    });
    const completedIncludingCurrent = completedBeforeCurrent + 1;
    if (completedIncludingCurrent / totalSets(workout.program) >= 0.9) {
      workout.credited = true;
      markRoutineCompleted(workout.program);
    }
  }

  function getNextTarget() {
    const exercise = currentExercise();
    if (workout.setIndex + 1 < exercise.sets) return { exerciseIndex: workout.exerciseIndex, setIndex: workout.setIndex + 1 };
    if (workout.exerciseIndex + 1 < workout.program.exercises.length) return { exerciseIndex: workout.exerciseIndex + 1, setIndex: 0 };
    return null;
  }

  function enterTarget() {
    clearTimer();
    const target = workout.nextTarget;
    if (!target) return completeWorkout();
    workout.exerciseIndex = target.exerciseIndex;
    workout.setIndex = target.setIndex;
    workout.phase = "work";
    workout.nextTarget = null;
    workout.timerTotal = 0;
    workout.remaining = 0;
    workout.running = false;
    workout.workTimerStarted = false;
    renderWorkout();
  }

  function updateProgress() {
    let completed = 0;
    workout.program.exercises.forEach((exercise, index) => {
      if (index < workout.exerciseIndex) completed += exercise.sets;
      if (index === workout.exerciseIndex) completed += workout.setIndex;
    });
    if (workout.phase === "rest") completed += 1;
    const total = totalSets(workout.program);
    const percent = Math.round((completed / total) * 100);
    els.progressLabel.textContent = `Exercise ${workout.exerciseIndex + 1} of ${workout.program.exercises.length}`;
    els.progressPercent.textContent = `${percent}%`;
    els.progressFill.style.width = `${percent}%`;
    els.progressTrack.setAttribute("aria-valuenow", String(percent));
  }

  function updateNextUp() {
    let target;
    if (workout.phase === "rest") target = workout.nextTarget;
    else target = getNextTarget();

    if (!target) {
      els.nextTitle.textContent = "Workout complete";
      els.nextDetail.textContent = "Finish strong";
      return;
    }
    const exercise = workout.program.exercises[target.exerciseIndex];
    els.nextTitle.textContent = exercise.title;
    els.nextDetail.textContent = `Set ${target.setIndex + 1} of ${exercise.sets} · ${exercise.durationSeconds ? `${formatCompactDuration(exercise.durationSeconds)} timed` : `${exercise.reps} reps`}`;
  }

  function completeWorkout(playFinishSound = true) {
    clearTimer();
    if (!workout.credited) markRoutineCompleted(workout.program);
    if (playFinishSound) beep(true);
    const elapsed = Math.max(1, Math.round((Date.now() - workout.startedAt) / 1000));
    els.finishTime.textContent = formatTime(elapsed);
    els.finishTimeLabel.textContent = "TIME";
    els.finishExercises.textContent = workout.program.exercises.length;
    els.finishExercisesLabel.textContent = "EXERCISES";
    els.finishSets.textContent = totalSets(workout.program);
    els.finishSetsLabel.textContent = "SETS";
    releaseWakeLock();
    workout = null;
    showView(els.finish);
    refreshIcons();
  }

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainder = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
  }

  function formatCompactDuration(seconds) {
    return seconds >= 60 && seconds % 60 === 0 ? `${seconds / 60} min` : `${seconds} sec`;
  }

  function beep(finish = false) {
    if (workout?.muted) return;
    try {
      prepareAudio();
      const count = finish ? 2 : 1;
      for (let i = 0; i < count; i += 1) {
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();
        oscillator.connect(gain);
        gain.connect(audioContext.destination);
        oscillator.frequency.value = finish ? 720 + (i * 140) : 660;
        gain.gain.setValueAtTime(0.0001, audioContext.currentTime + i * .18);
        gain.gain.exponentialRampToValueAtTime(.16, audioContext.currentTime + i * .18 + .01);
        gain.gain.exponentialRampToValueAtTime(.0001, audioContext.currentTime + i * .18 + .13);
        oscillator.start(audioContext.currentTime + i * .18);
        oscillator.stop(audioContext.currentTime + i * .18 + .14);
      }
      navigator.vibrate?.(finish ? [80, 60, 80] : 80);
    } catch (_) { /* Sound is an enhancement. */ }
  }

  function prepareAudio() {
    try {
      audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
      if (audioContext.state === "suspended") audioContext.resume();
    } catch (_) { /* Sound is an enhancement. */ }
  }

  function beepCountdown(secondsRemaining) {
    if (workout?.muted) return;
    try {
      prepareAudio();
      if (!audioContext) return;
      const isFinal = secondsRemaining === 0;
      const now = audioContext.currentTime;
      const duration = isFinal ? .58 : .09;
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.type = isFinal ? "sine" : "square";
      oscillator.frequency.setValueAtTime(isFinal ? 880 : 620, now);
      if (isFinal) oscillator.frequency.exponentialRampToValueAtTime(1040, now + .12);
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      gain.gain.setValueAtTime(.0001, now);
      gain.gain.exponentialRampToValueAtTime(isFinal ? .2 : .11, now + .012);
      gain.gain.setValueAtTime(isFinal ? .2 : .11, now + Math.max(.02, duration - .06));
      gain.gain.exponentialRampToValueAtTime(.0001, now + duration);
      oscillator.start(now);
      oscillator.stop(now + duration + .01);
      navigator.vibrate?.(isFinal ? 180 : 35);
    } catch (_) { /* Sound is an enhancement. */ }
  }

  function toggleSound() {
    if (!workout) return;
    workout.muted = !workout.muted;
    els.sound.innerHTML = `<i data-lucide="${workout.muted ? "volume-x" : "volume-2"}"></i>`;
    els.sound.setAttribute("aria-label", workout.muted ? "Turn sounds on" : "Mute sounds");
    refreshIcons();
  }

  async function requestWakeLock() {
    try { wakeLock = await navigator.wakeLock?.request("screen"); } catch (_) { /* Optional API. */ }
  }

  async function releaseWakeLock() {
    try { await wakeLock?.release(); } catch (_) { /* Optional API. */ }
    wakeLock = null;
  }

  function exitWorkout() {
    clearTimer();
    stopVideoProgressTracking();
    try { youtubePlayer?.destroy(); } catch (_) { /* Player may still be loading. */ }
    youtubePlayer = null;
    videoSession = null;
    releaseWakeLock();
    workout = null;
    els.confirmDialog.close();
    showView(els.home);
  }

  function refreshIcons() {
    if (window.lucide) window.lucide.createIcons({ attrs: { "aria-hidden": "true" } });
  }

  function setupInstall() {
    const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone;
    if (isIos && !isStandalone) els.install.hidden = false;

    window.addEventListener("beforeinstallprompt", (event) => {
      event.preventDefault();
      deferredInstallPrompt = event;
      els.install.hidden = false;
    });
    els.install.addEventListener("click", async () => {
      if (deferredInstallPrompt) {
        deferredInstallPrompt.prompt();
        await deferredInstallPrompt.userChoice;
        deferredInstallPrompt = null;
        els.install.hidden = true;
      } else if (isIos) {
        showToast("Tap Share, then Add to Home Screen", "share");
      }
    });
  }

  els.create.addEventListener("click", openProgramDialog);
  els.closeDialog.addEventListener("click", closeProgramDialog);
  els.dialog.addEventListener("click", (event) => { if (event.target === els.dialog) closeProgramDialog(); });
  els.jsonTab.addEventListener("click", () => selectDialogTab("json"));
  els.visualTab.addEventListener("click", () => selectDialogTab("visual"));
  els.aiTab.addEventListener("click", () => selectDialogTab("ai"));
  els.exerciseKind.addEventListener("click", () => setBuilderKind("exercise"));
  els.videoKind.addEventListener("click", () => setBuilderKind("video"));
  els.addExercise.addEventListener("click", () => addExerciseEditor());
  els.saveBuilder.addEventListener("click", saveVisualBuilder);
  els.loadExample.addEventListener("click", () => { els.jsonInput.value = JSON.stringify(EXAMPLE_PROGRAM, null, 2); els.jsonError.hidden = true; });
  els.loadVideoExample.addEventListener("click", () => { els.jsonInput.value = JSON.stringify(VIDEO_EXAMPLE_PROGRAM, null, 2); els.jsonError.hidden = true; });
  els.saveProgram.addEventListener("click", saveProgram);
  els.copyPrompt.addEventListener("click", copyPrompt);
  els.action.addEventListener("click", handleAction);
  els.pause.addEventListener("click", pauseTimer);
  els.sound.addEventListener("click", toggleSound);
  els.exit.addEventListener("click", () => els.confirmDialog.showModal());
  els.exitVideo.addEventListener("click", () => els.confirmDialog.showModal());
  els.finishVideo.addEventListener("click", completeVideoProgram);
  els.continueWorkout.addEventListener("click", () => els.confirmDialog.close());
  els.confirmExit.addEventListener("click", exitWorkout);
  els.finishButton.addEventListener("click", () => showView(els.home));
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible" && workout) requestWakeLock(); });

  els.aiPrompt.textContent = AI_PROMPT;
  renderPrograms();
  setupInstall();
  refreshIcons();

  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js", { updateViaCache: "none" }).catch(() => {}));
  }
})();
