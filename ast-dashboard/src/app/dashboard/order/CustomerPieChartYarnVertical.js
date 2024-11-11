import { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels'; // Import the plugin

// Register Chart.js components and the plugin
Chart.register(ArcElement, Tooltip, Legend, ChartDataLabels);

export default function CustomerPieChartYarnVertical({ astPurchaseorder }) {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const extractedTextArray = astPurchaseorder.map((order) => {
      const fabricStructure = order.fabricStructure || ""; // Ensure fabricStructure exists
      return fabricStructure.split(" * ")[0].trim(); // Get text before the first '*', remove extra spaces
    });
  
    const countMap = extractedTextArray.reduce((acc, text) => {
      acc[text] = (acc[text] || 0) + 1;
      return acc;
    }, {});

    // Convert to an array of [yarn, count]
    const sortedYarns = Object.entries(countMap)
      .sort((a, b) => b[1] - a[1]) // Sort by count descending
      .slice(0, 5); // Take only the top 5 yarns

    const labels = sortedYarns.map(([yarn]) => yarn);
    const data = sortedYarns.map(([, count]) => count);

    setChartData({
      labels,
      datasets: [
        {
          label: 'Top 5 Yarns',
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
      <h2>ด้ายยืน 5 ด้ายที่มากที่สุด</h2>
      <div style={{ width: '300px', height: '300px' }}> {/* Set desired width and height */}
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
