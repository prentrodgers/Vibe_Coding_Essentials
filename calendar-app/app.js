(function () {
  'use strict';

  // ── State ──────────────────────────────────────────────────────────
  const state = {
    currentDate: new Date(),
    events: [],
    editingEventId: null,
  };

  // ── DOM References ─────────────────────────────────────────────────
  const monthYearEl = document.getElementById('month-year');
  const calendarGrid = document.getElementById('calendar-grid');
  const prevBtn = document.getElementById('prev-month');
  const nextBtn = document.getElementById('next-month');
  const addEventBtn = document.getElementById('add-event-btn');
  const modal = document.getElementById('event-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalCloseBtn = document.getElementById('modal-close');
  const eventForm = document.getElementById('event-form');
  const deleteBtn = document.getElementById('delete-event-btn');
  const cancelBtn = document.getElementById('cancel-btn');
  const titleInput = document.getElementById('event-title');
  const dateInput = document.getElementById('event-date');
  const timeInput = document.getElementById('event-time');
  const descInput = document.getElementById('event-description');
  const titleError = document.getElementById('title-error');
  const dateError = document.getElementById('date-error');

  // ── Storage ────────────────────────────────────────────────────────
  const STORAGE_KEY = 'calendar_events';

  function loadEvents() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed;
    } catch {
      return [];
    }
  }

  function saveEvents() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.events));
  }

  function generateId() {
    const rand = Math.random().toString(36).substring(2, 8);
    return 'evt_' + Date.now() + '_' + rand;
  }

  // ── Date Utilities ─────────────────────────────────────────────────
  function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
  }

  function getFirstDayOfMonth(year, month) {
    return new Date(year, month, 1).getDay();
  }

  function isToday(year, month, day) {
    const now = new Date();
    return now.getFullYear() === year && now.getMonth() === month && now.getDate() === day;
  }

  function formatDate(year, month, day) {
    const mm = String(month + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    return year + '-' + mm + '-' + dd;
  }

  const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // ── Event Manager ──────────────────────────────────────────────────
  function getEventsForDate(dateStr) {
    return state.events.filter(function (e) { return e.date === dateStr; });
  }

  function createEvent(data) {
    const event = {
      id: generateId(),
      title: data.title.trim().substring(0, 100),
      date: data.date,
      time: data.time || '',
      description: (data.description || '').trim().substring(0, 500),
      createdAt: new Date().toISOString(),
    };
    state.events.push(event);
    saveEvents();
    return event;
  }

  function updateEvent(id, data) {
    const idx = state.events.findIndex(function (e) { return e.id === id; });
    if (idx === -1) return null;
    state.events[idx].title = data.title.trim().substring(0, 100);
    state.events[idx].date = data.date;
    state.events[idx].time = data.time || '';
    state.events[idx].description = (data.description || '').trim().substring(0, 500);
    saveEvents();
    return state.events[idx];
  }

  function deleteEvent(id) {
    state.events = state.events.filter(function (e) { return e.id !== id; });
    saveEvents();
  }

  // ── Validator ──────────────────────────────────────────────────────
  function validateEvent(data) {
    const errors = {};
    if (!data.title || !data.title.trim()) {
      errors.title = 'Title is required.';
    } else if (data.title.trim().length > 100) {
      errors.title = 'Title must be 100 characters or less.';
    }
    if (!data.date) {
      errors.date = 'Date is required.';
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(data.date)) {
      errors.date = 'Invalid date format.';
    }
    return {
      isValid: Object.keys(errors).length === 0,
      errors: errors,
    };
  }

  function showErrors(errors) {
    // Clear previous
    titleInput.classList.remove('invalid');
    dateInput.classList.remove('invalid');
    titleError.textContent = '';
    dateError.textContent = '';

    if (errors.title) {
      titleInput.classList.add('invalid');
      titleError.textContent = errors.title;
    }
    if (errors.date) {
      dateInput.classList.add('invalid');
      dateError.textContent = errors.date;
    }
  }

  function clearErrors() {
    titleInput.classList.remove('invalid');
    dateInput.classList.remove('invalid');
    titleError.textContent = '';
    dateError.textContent = '';
  }

  // ── Calendar Renderer ──────────────────────────────────────────────
  function renderCalendar() {
    const year = state.currentDate.getFullYear();
    const month = state.currentDate.getMonth();

    // Update header
    monthYearEl.textContent = MONTH_NAMES[month] + ' ' + year;

    // Clear grid
    calendarGrid.innerHTML = '';

    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    // Previous month trailing days
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);

    for (var i = firstDay - 1; i >= 0; i--) {
      var day = daysInPrevMonth - i;
      var dateStr = formatDate(prevYear, prevMonth, day);
      calendarGrid.appendChild(createDayCell(day, dateStr, true));
    }

    // Current month days
    for (var d = 1; d <= daysInMonth; d++) {
      var dateStr2 = formatDate(year, month, d);
      var today = isToday(year, month, d);
      calendarGrid.appendChild(createDayCell(d, dateStr2, false, today));
    }

    // Next month leading days
    var totalCells = calendarGrid.children.length;
    var remaining = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
    var nextMonth = month === 11 ? 0 : month + 1;
    var nextYear = month === 11 ? year + 1 : year;

    for (var n = 1; n <= remaining; n++) {
      var dateStr3 = formatDate(nextYear, nextMonth, n);
      calendarGrid.appendChild(createDayCell(n, dateStr3, true));
    }
  }

  function createDayCell(dayNum, dateStr, isOtherMonth, isCurrentDay) {
    var cell = document.createElement('div');
    cell.className = 'day-cell';
    cell.setAttribute('role', 'gridcell');
    cell.setAttribute('data-date', dateStr);

    if (isOtherMonth) cell.classList.add('other-month');
    if (isCurrentDay) cell.classList.add('today');

    var numEl = document.createElement('div');
    numEl.className = 'day-number';
    numEl.textContent = dayNum;
    cell.appendChild(numEl);

    // Render event indicators
    var events = getEventsForDate(dateStr);
    events.forEach(function (evt) {
      var pill = document.createElement('div');
      pill.className = 'event-pill';
      pill.setAttribute('data-event-id', evt.id);
      var label = evt.time ? evt.time + ' ' + evt.title : evt.title;
      pill.textContent = label;
      pill.title = label;
      pill.addEventListener('click', function (e) {
        e.stopPropagation();
        openModal(dateStr, evt.id);
      });
      cell.appendChild(pill);
    });

    // Click day cell to add event
    cell.addEventListener('click', function () {
      openModal(dateStr);
    });

    return cell;
  }

  // ── Modal ──────────────────────────────────────────────────────────
  function openModal(date, eventId) {
    clearErrors();
    eventForm.reset();

    if (eventId) {
      // Edit mode
      state.editingEventId = eventId;
      modalTitle.textContent = 'Edit Event';
      deleteBtn.style.display = '';
      var evt = state.events.find(function (e) { return e.id === eventId; });
      if (evt) {
        titleInput.value = evt.title;
        dateInput.value = evt.date;
        timeInput.value = evt.time;
        descInput.value = evt.description;
      }
    } else {
      // Add mode
      state.editingEventId = null;
      modalTitle.textContent = 'Add Event';
      deleteBtn.style.display = 'none';
      dateInput.value = date || '';
    }

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    titleInput.focus();
  }

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    state.editingEventId = null;
    clearErrors();
  }

  // ── Event Listeners ────────────────────────────────────────────────
  prevBtn.addEventListener('click', function () {
    state.currentDate.setMonth(state.currentDate.getMonth() - 1);
    renderCalendar();
  });

  nextBtn.addEventListener('click', function () {
    state.currentDate.setMonth(state.currentDate.getMonth() + 1);
    renderCalendar();
  });

  addEventBtn.addEventListener('click', function () {
    var year = state.currentDate.getFullYear();
    var month = state.currentDate.getMonth();
    var today = new Date();
    var day = (year === today.getFullYear() && month === today.getMonth())
      ? today.getDate() : 1;
    openModal(formatDate(year, month, day));
  });

  eventForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var data = {
      title: titleInput.value,
      date: dateInput.value,
      time: timeInput.value,
      description: descInput.value,
    };

    var result = validateEvent(data);
    if (!result.isValid) {
      showErrors(result.errors);
      return;
    }

    if (state.editingEventId) {
      updateEvent(state.editingEventId, data);
    } else {
      createEvent(data);
    }

    closeModal();
    renderCalendar();
  });

  deleteBtn.addEventListener('click', function () {
    if (state.editingEventId) {
      deleteEvent(state.editingEventId);
      closeModal();
      renderCalendar();
    }
  });

  cancelBtn.addEventListener('click', closeModal);
  modalCloseBtn.addEventListener('click', closeModal);

  // Close on overlay click
  modal.addEventListener('click', function (e) {
    if (e.target === modal) closeModal();
  });

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // ── Init ───────────────────────────────────────────────────────────
  function init() {
    state.events = loadEvents();
    renderCalendar();
  }

  init();
})();
