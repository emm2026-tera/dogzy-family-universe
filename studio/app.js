(() => {
  "use strict";

  const STORAGE_KEY = "dogzy-studio-project-v1";
  const defaultProject = {
    title: "La grande aventure",
    format: "Film court",
    genre: "Aventure familiale",
    logline: "Quand une carte mystérieuse apparaît dans la vieille boutique, une famille de Dogzies part à la recherche d'un trésor oublié.",
    scenes: [
      {
        id: "scene-1",
        title: "La carte oubliée",
        location: "Boutique de la ville",
        time: "Jour",
        duration: 3,
        description: "Une lumière dorée traverse la vitrine. L'héroïne découvre une carte cachée dans un vieux livre et comprend qu'elle indique un lieu secret.",
        dialogue: "HÉROÏNE — « Cette marque… je l'ai déjà vue quelque part. »\nAMI — « Alors on n'a qu'à découvrir où elle mène. »",
        shots: [
          { size: "Plan d'ensemble", description: "La boutique s'éveille dans la lumière du matin." },
          { size: "Gros plan", description: "La carte se déplie sur le comptoir." }
        ]
      },
      {
        id: "scene-2",
        title: "En route !",
        location: "Place centrale",
        time: "Aube",
        duration: 4,
        description: "Le duo traverse la place encore calme. Les couleurs de la ville s'illuminent au lever du soleil.",
        dialogue: "AMI — « Prêts pour l'aventure ? »",
        shots: [
          { size: "Plan moyen", description: "Les personnages quittent la place en courant." }
        ]
      },
      {
        id: "scene-3",
        title: "Le premier indice",
        location: "Parc de Dogzy Town",
        time: "Jour",
        duration: 2,
        description: "Un indice gravé sous un banc les conduit vers le vieux chêne du parc.",
        dialogue: "",
        shots: [
          { size: "Insert", description: "Le symbole gravé dans le bois." }
        ]
      }
    ]
  };

  const get = (selector) => document.querySelector(selector);
  const sceneList = get("#sceneList");
  const storyboard = get("#storyboard");
  const timeline = get("#timeline");
  const saveStatus = get("#saveStatus");
  const sceneEditor = get("#sceneEditor");
  const sceneEmpty = get("#sceneEmpty");
  let project = loadProject();
  let selectedId = project.scenes[0]?.id ?? null;
  let saveTimeout;

  function loadProject() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (saved && typeof saved.title === "string" && Array.isArray(saved.scenes)) {
        return {
          ...defaultProject,
          ...saved,
          scenes: saved.scenes.filter((scene) => scene && typeof scene.id === "string").map((scene) => ({
            ...newScene(scene.id),
            ...scene,
            duration: validDuration(scene.duration),
            shots: Array.isArray(scene.shots) ? scene.shots.map((shot) => ({ ...newShot(), ...shot })) : []
          }))
        };
      }
    } catch (error) {
      // Start with the sample project if browser storage is unavailable or invalid.
    }
    return structuredClone(defaultProject);
  }

  function newScene(id = `scene-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`) {
    return {
      id,
      title: "Nouvelle scène",
      location: "",
      time: "Jour",
      duration: 2,
      description: "",
      dialogue: "",
      shots: []
    };
  }

  function newShot() {
    return { size: "Plan moyen", description: "" };
  }

  function validDuration(value) {
    const number = Number(value);
    return Number.isFinite(number) ? Math.min(999, Math.max(1, Math.round(number))) : 1;
  }

  function escapeText(value) {
    return String(value ?? "");
  }

  function make(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function currentScene() {
    return project.scenes.find((scene) => scene.id === selectedId) ?? null;
  }

  function save() {
    saveStatus.textContent = "Sauvegarde…";
    saveStatus.classList.add("saving");
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
        saveStatus.textContent = "Enregistré sur cet appareil";
      } catch (error) {
        saveStatus.textContent = "Sauvegarde indisponible";
      }
      saveStatus.classList.remove("saving");
    }, 180);
  }

  function refreshProjectFields() {
    get("#projectName").value = escapeText(project.title);
    get("#projectFormat").value = project.format;
    get("#projectGenre").value = escapeText(project.genre);
    get("#projectLogline").value = escapeText(project.logline);
    const minutes = project.scenes.reduce((total, scene) => total + validDuration(scene.duration), 0);
    const durationLabel = `${minutes} min`;
    get("#totalDuration").textContent = `Durée estimée · ${durationLabel}`;
    get("#timelineDuration").textContent = `${minutes} MIN`;
    const count = project.scenes.length;
    get("#sceneCount").textContent = `${count} scène${count === 1 ? "" : "s"}`;
  }

  function renderSceneList() {
    sceneList.replaceChildren();
    project.scenes.forEach((scene, index) => {
      const button = make("button", `scene-nav${scene.id === selectedId ? " active" : ""}`);
      button.type = "button";
      button.dataset.sceneId = scene.id;
      const number = make("span", "scene-number", String(index + 1).padStart(2, "0"));
      const text = make("span");
      text.append(make("strong", "", scene.title || "Scène sans titre"));
      text.append(make("small", "", `${scene.location || "Lieu à définir"} · ${validDuration(scene.duration)} min`));
      button.append(number, text);
      sceneList.append(button);
    });
  }

  function renderSceneEditor() {
    const scene = currentScene();
    sceneEmpty.hidden = Boolean(scene);
    sceneEditor.hidden = !scene;
    get("#deleteSceneButton").hidden = !scene;
    if (!scene) return;
    get("#sceneTitle").value = escapeText(scene.title);
    get("#sceneLocation").value = escapeText(scene.location);
    get("#sceneTime").value = scene.time || "Jour";
    get("#sceneDuration").value = validDuration(scene.duration);
    get("#sceneDescription").value = escapeText(scene.description);
    get("#sceneDialogue").value = escapeText(scene.dialogue);
    renderShots(scene);
  }

  function renderShots(scene) {
    const list = get("#shotList");
    list.replaceChildren();
    scene.shots.forEach((shot, index) => {
      const row = make("div", "shot-row");
      const number = make("span", "shot-index", String(index + 1).padStart(2, "0"));
      const size = document.createElement("select");
      size.setAttribute("aria-label", `Échelle du plan ${index + 1}`);
      size.dataset.shotField = "size";
      size.dataset.shotIndex = index;
      ["Plan d'ensemble", "Plan moyen", "Plan rapproché", "Gros plan", "Insert", "Travelling"].forEach((value) => {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = value;
        size.append(option);
      });
      size.value = shot.size;
      const description = document.createElement("input");
      description.type = "text";
      description.maxLength = 200;
      description.placeholder = "Action ou mouvement de caméra";
      description.setAttribute("aria-label", `Description du plan ${index + 1}`);
      description.dataset.shotField = "description";
      description.dataset.shotIndex = index;
      description.value = escapeText(shot.description);
      const remove = make("button", "shot-remove", "×");
      remove.type = "button";
      remove.dataset.removeShot = index;
      remove.setAttribute("aria-label", `Supprimer le plan ${index + 1}`);
      row.append(number, size, description, remove);
      list.append(row);
    });
    if (!scene.shots.length) list.append(make("p", "story-empty", "Aucun plan pour le moment. Ajoutez-en un pour préparer vos prises de vue."));
  }

  function renderStoryboard() {
    storyboard.replaceChildren();
    timeline.replaceChildren();
    if (!project.scenes.length) {
      storyboard.append(make("p", "story-empty", "Ajoutez une scène pour voir votre storyboard."));
      return;
    }
    project.scenes.forEach((scene, index) => {
      const card = make("button", `story-card${scene.id === selectedId ? " active" : ""}`);
      card.type = "button";
      card.dataset.sceneId = scene.id;
      const art = make("span", "story-art");
      art.append(make("span", "story-scene-number", `SCÈNE ${String(index + 1).padStart(2, "0")}`));
      art.append(make("span", "story-clapper", "✦"));
      const info = make("span", "story-info");
      info.append(make("strong", "", scene.title || "Scène sans titre"));
      info.append(make("small", "", `${scene.location || "Lieu à définir"} · ${validDuration(scene.duration)} min`));
      card.append(art, info);
      storyboard.append(card);

      const block = make("button", `timeline-block${scene.id === selectedId ? " active" : ""}`);
      block.type = "button";
      block.dataset.sceneId = scene.id;
      block.style.flexGrow = String(validDuration(scene.duration));
      block.append(make("strong", "", scene.title || "Scène sans titre"));
      block.append(make("small", "", `${validDuration(scene.duration)} min`));
      timeline.append(block);
    });
  }

  function render() {
    if (!project.scenes.some((scene) => scene.id === selectedId)) selectedId = project.scenes[0]?.id ?? null;
    refreshProjectFields();
    renderSceneList();
    renderSceneEditor();
    renderStoryboard();
  }

  function updateSceneFromInput(target) {
    const scene = currentScene();
    const field = target.dataset.sceneField;
    if (!scene || !field) return;
    scene[field] = field === "duration" ? validDuration(target.value) : target.value;
    if (field === "duration") target.value = scene.duration;
    save();
    refreshProjectFields();
    renderSceneList();
    renderStoryboard();
  }

  function addScene() {
    const scene = newScene();
    project.scenes.push(scene);
    selectedId = scene.id;
    render();
    save();
    get("#sceneTitle").focus();
  }

  document.querySelectorAll("#projectName, #projectFormat, #projectGenre, #projectLogline").forEach((field) => {
    field.addEventListener("input", () => {
      const properties = {
        projectName: "title",
        projectFormat: "format",
        projectGenre: "genre",
        projectLogline: "logline"
      };
      project[properties[field.id]] = field.value;
      save();
    });
  });

  get("#sceneEditor").addEventListener("input", (event) => updateSceneFromInput(event.target));
  get("#sceneEditor").addEventListener("change", (event) => {
    if (event.target.dataset.shotField) {
      const scene = currentScene();
      const index = Number(event.target.dataset.shotIndex);
      if (!scene || !scene.shots[index]) return;
      scene.shots[index][event.target.dataset.shotField] = event.target.value;
      save();
      renderStoryboard();
    } else {
      updateSceneFromInput(event.target);
    }
  });
  get("#sceneEditor").addEventListener("input", (event) => {
    if (!event.target.dataset.shotField) return;
    const scene = currentScene();
    const index = Number(event.target.dataset.shotIndex);
    if (!scene || !scene.shots[index]) return;
    scene.shots[index][event.target.dataset.shotField] = event.target.value;
    save();
  });
  get("#sceneList").addEventListener("click", (event) => {
    const button = event.target.closest("[data-scene-id]");
    if (!button) return;
    selectedId = button.dataset.sceneId;
    render();
  });
  get("#storyboard").addEventListener("click", (event) => {
    const button = event.target.closest("[data-scene-id]");
    if (!button) return;
    selectedId = button.dataset.sceneId;
    render();
  });
  get("#timeline").addEventListener("click", (event) => {
    const button = event.target.closest("[data-scene-id]");
    if (!button) return;
    selectedId = button.dataset.sceneId;
    render();
  });
  get("#addSceneButton").addEventListener("click", addScene);
  get("#firstSceneButton").addEventListener("click", addScene);
  get("#deleteSceneButton").addEventListener("click", () => {
    if (!selectedId) return;
    project.scenes = project.scenes.filter((scene) => scene.id !== selectedId);
    selectedId = project.scenes[0]?.id ?? null;
    render();
    save();
  });
  get("#addShotButton").addEventListener("click", () => {
    const scene = currentScene();
    if (!scene) return;
    scene.shots.push(newShot());
    renderShots(scene);
    save();
    get("#shotList input:last-of-type")?.focus();
  });
  get("#shotList").addEventListener("click", (event) => {
    const button = event.target.closest("[data-remove-shot]");
    if (!button) return;
    const scene = currentScene();
    if (!scene) return;
    scene.shots.splice(Number(button.dataset.removeShot), 1);
    renderShots(scene);
    save();
  });
  get("#exportButton").addEventListener("click", () => {
    const exportData = { ...project, exportedAt: new Date().toISOString() };
    const file = new Blob([`${JSON.stringify(exportData, null, 2)}\n`], { type: "application/json" });
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${(project.title || "projet-film").trim().replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase() || "projet-film"}.json`;
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  });

  render();
})();
