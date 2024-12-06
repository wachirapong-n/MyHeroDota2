import dynamic from 'next/dynamic';
import 'chart.js/auto';
export default function Chart({ dataLabels }) {
  const Line = dynamic(() => import('react-chartjs-2').then((mod) => mod.Line), {
    ssr: false,
  });

  return (
    <div className="flex flex-wrap">
      {Object.keys(dataLabels).map((key) => (
        <div key={key} className="w-1/3  p-2">
          <Line data={dataLabels[key]} />
        </div>
      ))}
    </div>
  )
}