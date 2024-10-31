// // components/CustomerPieChart.js
// import { useEffect, useState } from 'react';
// import { Pie } from 'react-chartjs-2';
// import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';

// // Register Chart.js components
// Chart.register(ArcElement, Tooltip, Legend);

// export default function CustomerPieChart({ astPurchaseorder }) {
//   const [chartData, setChartData] = useState({
//     labels: [],
//     datasets: [],
//   });

//   useEffect(() => {
//     const customerCounts = {};

//     // Count occurrences of each customerName
//     astPurchaseorder.forEach((order) => {
//       const name = order.customerName || 'no data';
//       customerCounts[name] = (customerCounts[name] || 0) + 1;
//     });

//     // Convert to an array of [customerName, count]
//     const sortedCustomers = Object.entries(customerCounts).sort(
//       (a, b) => b[1] - a[1]
//     );

//     // Take top 5 customers and sum the rest as "อื่นๆ"
//     const top5 = sortedCustomers.slice(0, 5);
//     const otherCount = sortedCustomers
//       .slice(5)
//       .reduce((sum, [, count]) => sum + count, 0);

//     const labels = top5.map(([name]) => name);
//     const data = top5.map(([, count]) => count);

//     // Add "อื่นๆ" if there are remaining customers
//     if (otherCount > 0) {
//       labels.push('อื่นๆ');
//       data.push(otherCount);
//     }

//     setChartData({
//       labels,
//       datasets: [
//         {
//           label: 'Customer Orders',
//           data,
//           backgroundColor: [
//             '#FF6384',
//             '#36A2EB',
//             '#FFCE56',
//             '#4BC0C0',
//             '#9966FF',
//             '#C9CBCF',
//           ],
//           hoverBackgroundColor: [
//             '#FF6384',
//             '#36A2EB',
//             '#FFCE56',
//             '#4BC0C0',
//             '#9966FF',
//             '#C9CBCF',
//           ],
//         },
//       ],
//     });
//   }, [astPurchaseorder]);

//   return (
//     <div style={{ width: '50%', margin: '0 auto' }}>
//       <h2>Top 5 Customers + Others</h2>
//       <Pie data={chartData} />
//     </div>
//   );
// }


import { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels'; // Import the plugin

// Register Chart.js components and the plugin
Chart.register(ArcElement, Tooltip, Legend, ChartDataLabels);

export default function CustomerPieChart({ astPurchaseorder }) {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const customerCounts = {};

    // Count occurrences of each customerName
    astPurchaseorder.forEach((order) => {
      const name = order.customerName || 'no data';
      customerCounts[name] = (customerCounts[name] || 0) + 1;
    });

    // Convert to an array of [customerName, count]
    const sortedCustomers = Object.entries(customerCounts)
      .sort((a, b) => b[1] - a[1]) // Sort by count descending
      .slice(0, 5); // Take only the top 5 customers

    const labels = sortedCustomers.map(([name]) => name);
    const data = sortedCustomers.map(([, count]) => count);

    setChartData({
      labels,
      datasets: [
        {
          label: 'Top 5 Customers',
          data,
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF',
          ],
          hoverBackgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF',
          ],
        },
      ],
    });
  }, [astPurchaseorder]);

  return (
    <div style={{ width: '50%', margin: '0 auto' }}>
      <h2>ใบสั่งขาย 5 บริษัทที่มากที่สุด</h2>
      <div style={{ width: '400px', height: '400px' }}> {/* Set desired width and height */}

      <Pie 
        data={chartData} 
        options={{
          plugins: {
            legend: {
              display: true,
            },
            datalabels: {
              color: '#fff',
              formatter: (value, context) => {
                const total = context.chart.data.datasets[0].data.reduce((acc, val) => acc + val, 0);
                const percentage = ((value / total) * 100).toFixed(1) + '%';
                return `${value} (${percentage})`; // Show value and percentage
              },
            },
          },
        }} 
      />
      </div>
    </div>
  );
}
