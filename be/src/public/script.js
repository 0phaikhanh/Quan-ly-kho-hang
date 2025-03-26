fetch('/api/sales/monthly-summary')
  .then(response => response.json())
  .then(data => {
    const months = data.map(item => `Month ${item.month}`);
    const totalSales = data.map(item => item.total_sales);

    const ctx = document.getElementById('salesChart').getContext('2d');
    
    const salesChart = new Chart(ctx, {
      type: 'bar',  // Biểu đồ cột
      data: {
        labels: months,  // Các tháng
        datasets: [{
          label: 'Total Sales',
          data: totalSales,  // Tổng doanh thu của từng tháng
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
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
  })
  .catch(error => console.error('Error fetching sales data:', error));
