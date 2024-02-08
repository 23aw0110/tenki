import { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [selectedCity, setSelectedCity] = useState('');
  const [temperature, setTemperature] = useState(null);

  const WeatherComponent = ({ selectedCity }) => {
    useEffect(() => {
      const fetchData = async () => {
        try {
          let cityCode = '';

          switch (selectedCity) {
            case 'tokyo':
              cityCode = '130000'; // 東京のコード
              break;
            case 'osaka':
              cityCode = '270000'; // 大阪のコード
              break;
            case 'sapporo':
              cityCode = '016000'; // 札幌のコード
              break;
            // 他の地域に対する処理を追加することもできます
            default:
              break;
          }

          if (cityCode) {
            const response = await fetch(
              `https://www.jma.go.jp/bosai/forecast/data/forecast/${cityCode}.json`
            );

            if (!response.ok) {
              throw new Error('天気データの取得エラー');
            }

            const data = await response.json();

            // データ構造を確認し、適切なプロパティを選択する
            const temperatureData =
              data &&
              data[0] &&
              data[0].timeSeries &&
              data[0].timeSeries[2] &&
              data[0].timeSeries[2].areas &&
              data[0].timeSeries[2].areas[0] &&
              data[0].timeSeries[2].areas[0].temps &&
              data[0].timeSeries[2].areas[0].temps[0];
            setTemperature(temperatureData);
          }
        } catch (error) {
          console.error('天気データの取得エラー:', error);
        }
      };

      fetchData();
    }, [selectedCity]);
  };

  const handleChange = (e) => {
    setSelectedCity(e.target.value);
  };

  return (
    <>
      <h1>今日の天気</h1>
      <select onChange={handleChange}>
        <option value="tokyo">東京</option>
        <option value="osaka">大阪</option>
        <option value="sapporo">札幌</option>
      </select>
      {temperature && <p className="temperature">気温: {temperature} ℃</p>}
      <WeatherComponent selectedCity={selectedCity} />
    </>
  );
};

export default App;
