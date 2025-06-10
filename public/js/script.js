// Transaction Page Specific Scripts
document.addEventListener('DOMContentLoaded', function() {
    // Filter transactions
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const statusFilter = document.getElementById('statusFilter');
    const transactionRows = document.querySelectorAll('.transaction-table tbody tr');
    
    function filterTransactions() {
        const searchTerm = searchInput.value.toLowerCase();
        const categoryValue = categoryFilter.value;
        const statusValue = statusFilter.value;
        
        transactionRows.forEach(row => {
            const description = row.cells[1].textContent.toLowerCase();
            const category = row.cells[2].textContent;
            const status = row.cells[4].textContent;
            
            const matchesSearch = description.includes(searchTerm);
            const matchesCategory = categoryValue === '' || category === categoryValue;
            const matchesStatus = statusValue === '' || status === statusValue;
            
            if (matchesSearch && matchesCategory && matchesStatus) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }
    
    if (searchInput) searchInput.addEventListener('input', filterTransactions);
    if (categoryFilter) categoryFilter.addEventListener('change', filterTransactions);
    if (statusFilter) statusFilter.addEventListener('change', filterTransactions);

    // Confirm before deleting
    const deleteForms = document.querySelectorAll('form[action*="delete"]');
    deleteForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!confirm('Are you sure you want to delete this transaction?')) {
                e.preventDefault();
            }
        });
    });
});