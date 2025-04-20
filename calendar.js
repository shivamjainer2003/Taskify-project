const calendarEl = document.getElementById('calendar');
const modal = document.getElementById('modal');
const monthYearEl = document.getElementById('monthYear');

let selectedDate = null;
let current = new Date();
let events = JSON.parse(localStorage.getItem('calendarEvents')) || {};

function openModal(dateKey) {
  selectedDate = dateKey;
  document.getElementById('modalTitle').value = '';
  document.getElementById('modalDesc').value = '';
  modal.style.display = 'flex';
}

function closeModal() {
  modal.style.display = 'none';
}

function saveEvent() {
  const title = document.getElementById('modalTitle').value;
  const desc = document.getElementById('modalDesc').value;
  if (!title) return alert('Task title required');

  if (!events[selectedDate]) events[selectedDate] = [];
  events[selectedDate].push({ title, desc });

  localStorage.setItem('calendarEvents', JSON.stringify(events));
  closeModal();
  renderCalendar();
}

function changeMonth(offset) {
  current.setMonth(current.getMonth() + offset);
  renderCalendar();
}

function renderCalendar() {
  const year = current.getFullYear();
  const month = current.getMonth();
  const firstDay = new Date(year, month, 1).getDay(); // Sun = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  calendarEl.innerHTML = '';
  monthYearEl.textContent = `${current.toLocaleString('default', { month: 'long' })} ${year}`;

  // Padding days
  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement('div');
    calendarEl.appendChild(empty);
  }

  // Calendar days
  for (let day = 1; day <= daysInMonth; day++) {
    const cell = document.createElement('div');
    cell.className = 'calendar-day';
    const dateKey = `${year}-${month + 1}-${day}`;

    cell.innerHTML = `<div class="date-number">${day}</div>`;

    if (events[dateKey]) {
      events[dateKey].forEach(ev => {
        const evDiv = document.createElement('div');
        evDiv.className = 'event-title';
        evDiv.innerText = ev.title;
        cell.appendChild(evDiv);
      });
    }

    cell.onclick = () => openModal(dateKey);
    calendarEl.appendChild(cell);
  }
}

window.onload = renderCalendar;
window.onclick = e => {
  if (e.target === modal) closeModal();
};
