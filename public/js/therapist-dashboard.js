document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('client-search');
  const table = document.getElementById('clients-table');

  if (searchInput && table) {
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.toLowerCase();
      table.querySelectorAll('tbody tr[data-search]').forEach(row => {
        row.style.display = row.dataset.search.includes(query) ? '' : 'none';
      });
    });
  }

  document.querySelectorAll('.avail-cell').forEach(cell => {
    cell.addEventListener('click', (e) => {
      if (e.target.tagName === 'INPUT') return;
      const checkbox = cell.querySelector('input');
      checkbox.checked = !checkbox.checked;
      cell.classList.toggle('available', checkbox.checked);
    });

    const checkbox = cell.querySelector('input');
    checkbox.addEventListener('change', () => {
      cell.classList.toggle('available', checkbox.checked);
    });
  });
});
