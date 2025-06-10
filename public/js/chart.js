// Chart.js Implementation
document.addEventListener('DOMContentLoaded', function() {
    const ctx = document.getElementById('spendingChart').getContext('2d');
    
    const spendingChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Expenses',
                data: [65, 59, 80, 81, 56, 55, 40],
                backgroundColor: 'rgba(231, 76, 60, 0.7)',
                borderColor: 'rgba(231, 76, 60, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
});