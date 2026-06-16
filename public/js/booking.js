document.addEventListener('DOMContentLoaded', () => {
  const wizard = document.getElementById('booking-wizard');
  if (!wizard) return;

  let currentStep = 1;
  const panels = wizard.querySelectorAll('.wizard__panel');
  const stepIndicators = wizard.querySelectorAll('.wizard__step');

  function showStep(step) {
    currentStep = step;
    panels.forEach(p => p.classList.toggle('active', parseInt(p.dataset.panel) === step));
    stepIndicators.forEach(s => {
      const sNum = parseInt(s.dataset.step);
      s.classList.toggle('active', sNum === step);
      s.classList.toggle('completed', sNum < step);
    });
    wizard.querySelector(`[data-panel="${step}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function validateStep(step) {
    const panel = wizard.querySelector(`[data-panel="${step}"]`);
    const inputs = panel.querySelectorAll('[required]');
    for (const input of inputs) {
      if (!input.checkValidity()) {
        input.reportValidity();
        return false;
      }
    }
    if (step === 2) {
      const therapist = document.querySelector('input[name="therapistId"]:checked');
      const dateTime = document.getElementById('dateTime');
      if (!therapist) { alert('Please select a therapist.'); return false; }
      if (!dateTime.value) { alert('Please select a time slot.'); return false; }
    }
    return true;
  }

  wizard.querySelectorAll('[data-next]').forEach(btn => {
    btn.addEventListener('click', () => {
      const next = parseInt(btn.dataset.next);
      if (validateStep(currentStep)) {
        if (next === 3) updateSummary();
        showStep(next);
      }
    });
  });

  wizard.querySelectorAll('[data-prev]').forEach(btn => {
    btn.addEventListener('click', () => showStep(parseInt(btn.dataset.prev)));
  });

  // Therapist selection
  document.querySelectorAll('.therapist-select-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.therapist-select-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      generateTimeSlots();
      document.getElementById('time-slots-section').style.display = 'block';
    });
  });

  // Filter tabs
  document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.dataset.filter;
      document.querySelectorAll('.therapist-select-card').forEach(card => {
        if (filter === 'all') {
          card.style.display = '';
        } else {
          const specs = card.dataset.specialties || '';
          card.style.display = specs.includes(filter) ? '' : 'none';
        }
      });
    });
  });

  function generateTimeSlots() {
    const grid = document.getElementById('time-grid');
    const dateTimeInput = document.getElementById('dateTime');
    grid.innerHTML = '';
    dateTimeInput.value = '';

    const hours = [9, 10, 11, 13, 14, 15, 16];
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    const now = new Date();

    days.forEach((day, dayIndex) => {
      const dayDate = new Date(now);
      dayDate.setDate(now.getDate() + dayIndex + 1);
      if (dayDate.getDay() === 0) dayDate.setDate(dayDate.getDate() + 1);
      if (dayDate.getDay() === 6) dayDate.setDate(dayDate.getDate() + 2);

      hours.forEach(hour => {
        const slotDate = new Date(dayDate);
        slotDate.setHours(hour, 0, 0, 0);

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'time-slot';
        btn.textContent = `${day} ${hour > 12 ? hour - 12 : hour}${hour >= 12 ? 'pm' : 'am'}`;
        btn.dataset.datetime = slotDate.toISOString();
        btn.setAttribute('aria-label', `Select ${day} at ${hour}:00`);

        btn.addEventListener('click', () => {
          grid.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
          btn.classList.add('selected');
          dateTimeInput.value = slotDate.toISOString();
        });

        grid.appendChild(btn);
      });
    });
  }

  function updateSummary() {
    document.getElementById('summary-child').textContent =
      document.getElementById('childName').value || '—';
    document.getElementById('summary-concern').textContent =
      document.getElementById('concern').value || '—';

    const selectedTherapist = document.querySelector('input[name="therapistId"]:checked');
    if (selectedTherapist) {
      const card = selectedTherapist.closest('.therapist-select-card');
      document.getElementById('summary-therapist').textContent =
        card ? card.querySelector('strong').textContent : '—';
    }

    const dt = document.getElementById('dateTime').value;
    document.getElementById('summary-datetime').textContent = dt
      ? new Date(dt).toLocaleString('en-US', { weekday:'long', month:'long', day:'numeric', hour:'2-digit', minute:'2-digit' })
      : '—';
  }

  // Add to calendar on success page
  const calBtn = document.getElementById('add-to-calendar');
  if (calBtn) {
    calBtn.addEventListener('click', (e) => {
      e.preventDefault();
      alert('Calendar integration would download an .ics file in production.');
    });
  }
});
