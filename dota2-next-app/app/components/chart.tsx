
import dynamic from 'next/dynamic';
import 'chart.js/auto';

const Line = dynamic(() => import('react-chartjs-2').then((mod) => mod.Line), {
  ssr: false,
});
const Bar = dynamic(() => import('react-chartjs-2').then((mod) => mod.Bar), {
  ssr: false,
});
export default function Chart({ dataLabels, dataBarChart }) {
  return (
    <div>
      <div className="flex flex-wrap">
        {Object.keys(dataLabels).map((key) => (
          <div key={key} className="w-1/3  p-2">
            <Line data={dataLabels[key]} />
          </div>
        ))}
      </div>

      <div>
        <Bar data={dataBarChart.data} options={dataBarChart.options} />
      </div>
    </div>


  )
}