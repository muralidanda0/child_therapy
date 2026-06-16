document.addEventListener('DOMContentLoaded', () => {
  const parentRadio = document.getElementById('role-parent');
  const therapistRadio = document.getElementById('role-therapist');
  const parentFields = document.getElementById('parent-fields');
  const therapistFields = document.getElementById('therapist-fields');
  const licenseInput = document.getElementById('licenseNo');

  function updateFields() {
    if (parentRadio.checked) {
      parentFields.classList.add('active');
      therapistFields.classList.remove('active');
      licenseInput.removeAttribute('required');
    } else {
      parentFields.classList.remove('active');
      therapistFields.classList.add('active');
      licenseInput.setAttribute('required', 'required');
    }
  }

  parentRadio.addEventListener('change', updateFields);
  therapistRadio.addEventListener('change', updateFields);
  updateFields();
});
