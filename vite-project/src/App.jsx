// import { useState, useEffect } from 'react';
// // import reactLogo from './assets/react.svg'
// // import viteLogo from '/vite.svg'
// import './App.css';

// function App() {
//   const [selectedCity, setSelectedCity] = useState(''); //都市名を保存するためのuseState
//   function App() {
//     return <WeatherComponent />;
//   }
//   const WeatherComponent = () => {
//     const [weatherData, setWeatherData] = useState(null);
//     useEffect(() => {
//       const fetchData = async () => {
//         try {
//           const response = await fetch(
//             'https://www.jma.go.jp/bosai/forecast/data/forecast/130000.json'
//           );
//           const data = await response.json();
//           setWeatherData(data);
//         } catch (error) {
//           console.error('Error fetching weather data:', error);
//         }
//       };

//       fetchData();
//     }, []);
//     return (
//       <>
//         <h1>天気</h1>
//         <pre>{JSON.stringify(weatherData, null, 2)}</pre>
//       </>
//     );
//   };
//   useEffect(() => {
//     if (selectedCity !== '') {
//       //初回マウント時はアラートが出ないようにする
//       alert(`${selectedCity}を選択`);
//     }
//   }, [selectedCity]);

//   const handleChange = (e) => {
//     setSelectedCity(e.target.value);
//   };
//   return (
//     <>
//       <select onChange={handleChange}>
//         <option value="tokyo">東京</option>
//         <option value="osaka">大阪</option>
//         <option value="sapporo">札幌</option>
//       </select>
//     </>
//   );
// }
// function App() {
//   return <WeatherComponent />;
// }
// const WeatherComponent = () => {
//   const [weatherData, setWeatherData] = useState(null);
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch(
//           'https://www.jma.go.jp/bosai/forecast/data/forecast/130000.json'
//         );
//         const data = await response.json();
//         setWeatherData(data);
//       } catch (error) {
//         console.error('Error fetching weather data:', error);
//       }
//     };

//     fetchData();
//   }, []);
//   return (
//     <>
//       <h1>天気</h1>
//       <pre>{JSON.stringify(weatherData, null, 2)}</pre>
//     </>
//   );
// };

// export default App;
// import { useState, useEffect } from 'react';
// import './App.css';

// const App = () => {
//   const [selectedCity, setSelectedCity] = useState('');
//   const [temperature, setTemperature] = useState(null);

//   const WeatherComponent = () => {
//     useEffect(() => {
//       const fetchData = async () => {
//         try {
//           const response = await fetch(
//             `https://www.jma.go.jp/bosai/forecast/data/forecast/000000.json`
//           );
//           console.log(response);
//           const data = await response.json();

//           // データ構造を確認し、適切なプロパティを選択する
//           const temperatureData =
//             data &&
//             data[0] &&
//             data[0].timeSeries &&
//             data[0].timeSeries[2] &&
//             data[0].timeSeries[2].areas &&
//             data[0].timeSeries[2].areas[0] &&
//             data[0].timeSeries[2].areas[0].temps &&
//             data[0].timeSeries[2].areas[0].temps[0];
//           console.log(data);
//           setTemperature(temperatureData);
//         } catch (error) {
//           console.error('天気データの取得エラー:', error);
//         }
//       };

//       fetchData();
//     }, []);

//     return (
//       <>
//         <h1>{selectedCity}の天気</h1>
//         {temperature && <p>気温: {temperature} ℃</p>}
//       </>
//     );
//   };

//   const handleChange = (e) => {
//     setSelectedCity(e.target.value);
//   };

//   return (
//     <>
//       <select onChange={handleChange}>
//         <option value="tokyo">東京</option>
//         <option value="osaka">大阪</option>
//         <option value="sapporo">札幌</option>
//       </select>
//       <WeatherComponent />
//     </>
//   );
// };

// export default App;
import { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [selectedCity, setSelectedCity] = useState('');
  const [temperature, setTemperature] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const WeatherComponent = () => {
    useEffect(() => {
      const fetchData = async () => {
        setLoading(true);
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
              cityCode = '014100'; // 札幌のコード
              break;
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

            // 新しいAPIレスポンスの構造に基づいて気温データを取り出す
            const temperatureData =
              data &&
              data[0] &&
              data[0].timeSeries &&
              data[0].timeSeries[0] &&
              data[0].timeSeries[0].areas &&
              data[0].timeSeries[0].areas[0] &&
              data[0].timeSeries[0].areas[0].temps &&
              data[0].timeSeries[0].areas[0].temps[0] &&
              data[0].timeSeries[0].areas[0].temps[0].temp;

            if (temperatureData !== undefined) {
              setTemperature(temperatureData);
            } else {
              throw new Error('気温データが見つかりません');
            }
          }
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCity]);

    return (
      <>
        <h1>{selectedCity}の天気</h1>
        {temperature && <p>気温: {temperature} ℃</p>}
        {loading && <p>データを読み込んでいます...</p>}
        {error && <p>{error}</p>}
      </>
    );
  };

  const handleClick = () => {
    // ボタンがクリックされたときに天気データを取得する
    WeatherComponent();
  };

  return (
    <>
      <button onClick={handleClick}>天気を取得</button>
      <select onChange={(e) => setSelectedCity(e.target.value)}>
        <option value="tokyo">東京</option>
        <option value="osaka">大阪</option>
        <option value="sapporo">札幌</option>
      </select>
      <WeatherComponent />
    </>
  );
};

export default App;
