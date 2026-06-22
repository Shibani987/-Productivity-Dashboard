(function () {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const hourDial = document.querySelector(".hour");
  const minuteDial = document.querySelector(".minute");
  const secondDial = document.querySelector(".second");
  const timeText = document.querySelector(".time");
  const dayText = document.querySelector(".day");
  const dateText = document.querySelector(".date");
  const quickDate = document.querySelector("#quickDate");
  const display = document.querySelector("#calculatorDisplay");
  const notesArea = document.querySelector("#notesArea");
  const saveNotes = document.querySelector("#saveNotes");
  const clearNotes = document.querySelector("#clearNotes");
  const notesStatus = document.querySelector("#notesStatus");
  const savedNotes = document.querySelector("#savedNotes");
  const notesStorageKey = "productivity-dashboard-notes";

  let expression = "0";

  function scaledRadius(baseSize) {
    const container = document.querySelector(".clock-container");
    const currentSize = container.offsetWidth;
    return (baseSize / 480) * currentSize;
  }

  function buildDial(selector, count, radius, labelStart) {
    const dial = document.querySelector(selector);
    dial.innerHTML = "";

    for (let index = 0; index < count; index += 1) {
      const span = document.createElement("span");
      const label = labelStart + index;
      span.textContent = label;
      span.style.transform = `rotate(${6 * index}deg) translateX(${scaledRadius(radius)}px)`;
      dial.appendChild(span);
    }
  }

  function buildHourDial() {
    hourDial.innerHTML = "";

    for (let hour = 1; hour <= 12; hour += 1) {
      const span = document.createElement("span");
      span.textContent = hour;
      span.style.transform = `rotate(${30 * hour}deg) translateX(${scaledRadius(100)}px)`;
      hourDial.appendChild(span);
    }
  }

  function buildClockFace() {
    buildDial(".second", 60, 195, 0);
    buildDial(".minute", 60, 145, 0);
    buildDial(".dail", 60, 230, 0);
    buildHourDial();
  }

  function updateClock() {
    const now = new Date();
    const second = now.getSeconds();
    const minute = now.getMinutes();
    const hour = now.getHours();
    const time = now.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    secondDial.style.transform = `rotate(${-6 * second}deg)`;
    minuteDial.style.transform = `rotate(${-6 * minute}deg)`;
    hourDial.style.transform = `rotate(${-30 * (hour % 12) - minute / 2}deg)`;

    timeText.textContent = time;
    dayText.textContent = days[now.getDay()];
    dateText.textContent = `${now.getDate()} . ${months[now.getMonth()]}`;
    quickDate.textContent = `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}`;
  }

  function updateDisplay(value) {
    display.value = value.replaceAll("*", "×").replaceAll("/", "÷");
  }

  function appendCalculatorValue(value) {
    const operators = ["+", "-", "*", "/", "%"];
    const lastCharacter = expression.slice(-1);

    if (expression === "Error") {
      expression = "0";
    }

    if (operators.includes(value) && expression === "0" && value !== "-") {
      return;
    }

    if (operators.includes(value) && operators.includes(lastCharacter)) {
      expression = expression.slice(0, -1) + value;
    } else if (value === "." && expression.split(/[+\-*/%]/).pop().includes(".")) {
      return;
    } else if (expression === "0" && !operators.includes(value) && value !== ".") {
      expression = value;
    } else {
      expression += value;
    }

    updateDisplay(expression);
  }

  function calculateResult() {
    if (!/^[0-9+\-*/%.() ]+$/.test(expression)) {
      expression = "Error";
      updateDisplay(expression);
      return;
    }

    try {
      const result = Function(`"use strict"; return (${expression})`)();
      expression = Number.isFinite(result) ? String(Number(result.toFixed(8))) : "Error";
    } catch (error) {
      expression = "Error";
    }

    updateDisplay(expression);
  }

  function handleCalculatorAction(action, value) {
    if (action === "clear") {
      expression = "0";
      updateDisplay(expression);
      return;
    }

    if (action === "backspace") {
      if (expression === "Error") {
        expression = "0";
        updateDisplay(expression);
        return;
      }

      expression = expression.length > 1 ? expression.slice(0, -1) : "0";
      updateDisplay(expression);
      return;
    }

    if (action === "equals") {
      calculateResult();
      return;
    }

    appendCalculatorValue(value);
  }

  function setupCalculator() {
    document.querySelectorAll(".calc-key").forEach((button) => {
      button.addEventListener("click", () => {
        handleCalculatorAction(button.dataset.action, button.dataset.value);
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.target.matches("textarea, input")) {
        return;
      }

      const keyMap = {
        Enter: "equals",
        Escape: "clear",
        Backspace: "backspace",
      };

      if (/^[0-9+\-*/%.]$/.test(event.key)) {
        appendCalculatorValue(event.key);
      } else if (keyMap[event.key]) {
        handleCalculatorAction(keyMap[event.key]);
      } else {
        return;
      }

      event.preventDefault();
    });
  }

  function setupNotes() {
    let notes = [];

    function loadNotes() {
      try {
        const savedValue = localStorage.getItem(notesStorageKey);

        if (!savedValue) {
          return [];
        }

        const parsedNotes = JSON.parse(savedValue);
        return Array.isArray(parsedNotes) ? parsedNotes : [savedValue];
      } catch (error) {
        try {
          const savedValue = localStorage.getItem(notesStorageKey);
          return savedValue ? [savedValue] : [];
        } catch (storageError) {
          return [];
        }
      }
    }

    function saveNotesList() {
      localStorage.setItem(notesStorageKey, JSON.stringify(notes));
    }

    function renderNotes() {
      savedNotes.innerHTML = "";

      if (notes.length === 0) {
        savedNotes.innerHTML = '<p class="empty-notes">No saved notes yet.</p>';
        return;
      }

      notes.forEach((note, index) => {
        const noteCard = document.createElement("article");
        const noteText = document.createElement("p");
        const removeButton = document.createElement("button");

        noteCard.className = "saved-note";
        noteText.textContent = note;
        removeButton.type = "button";
        removeButton.className = "remove-note";
        removeButton.textContent = "Remove";
        removeButton.addEventListener("click", () => {
          notes.splice(index, 1);

          try {
            saveNotesList();
            notesStatus.textContent = "Saved note removed.";
          } catch (error) {
            notesStatus.textContent = "Note removed from the page.";
          }

          renderNotes();
        });

        noteCard.append(noteText, removeButton);
        savedNotes.appendChild(noteCard);
      });
    }

    try {
      notes = loadNotes();
      saveNotesList();
    } catch (error) {
      notes = [];
    }

    renderNotes();

    notesArea.addEventListener("input", () => {
      notesStatus.textContent = "Unsaved changes.";
    });

    saveNotes.addEventListener("click", () => {
      const noteText = notesArea.value.trim();

      if (!noteText) {
        notesStatus.textContent = "Write a note before saving.";
        notesArea.focus();
        return;
      }

      notes.push(noteText);

      try {
        saveNotesList();
        notesArea.value = "";
        renderNotes();
        notesStatus.textContent = "Notes saved.";
        notesArea.focus();
      } catch (error) {
        notesStatus.textContent = "Could not save notes in this browser.";
      }
    });

    clearNotes.addEventListener("click", () => {
      notes = [];
      notesArea.value = "";
      try {
        localStorage.removeItem(notesStorageKey);
        renderNotes();
        notesStatus.textContent = "All notes removed.";
      } catch (error) {
        renderNotes();
        notesStatus.textContent = "Notes removed from the page.";
      }
      notesArea.focus();
    });
  }

  buildClockFace();
  updateClock();
  setupCalculator();
  setupNotes();

  setInterval(updateClock, 1000);
  window.addEventListener("resize", buildClockFace);
})();
