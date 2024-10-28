// import React, { useEffect } from 'react';

// // Define specific types or use 'unknown' if the type is uncertain
// declare global {
//     interface Window {
//         TradingView: {
//             widget: (options: {
//                 container: string;
//                 locale: string;
//                 library_path: string;
//                 datafeed: any; // You can define a proper type for the datafeed if possible
//                 symbol: string;
//                 interval: string;
//                 fullscreen: boolean;
//                 debug: boolean;
//             }) => void;
//         };
//         Datafeeds: {
//             UDFCompatibleDatafeed: new (url: string) => any; // Define the appropriate constructor type
//         };
//     }
// }

// const RealTerminal = () => {
//   useEffect(() => {
//     const loadScripts = () => {
//       const tradingViewScript = document.createElement('script');
//       tradingViewScript.src = '/charting_library/charting_library/charting_library.standalone.js';
//       tradingViewScript.async = true;

//       const dataFeedScript = document.createElement('script');
//       dataFeedScript.src = '/charting_library/datafeeds/udf/dist/bundle.js';
//       dataFeedScript.async = true;

//       document.body.appendChild(tradingViewScript);
//       document.body.appendChild(dataFeedScript);

//       tradingViewScript.onload = () => {
//         // Initialize the TradingView widget once the script is loaded
//         new window.TradingView.widget({
//           container: 'chartContainer',
//           locale: 'en',
//           library_path: 'charting_library/',
//           datafeed: new window.Datafeeds.UDFCompatibleDatafeed("https://demo-feed-data.tradingview.com"),
//           symbol: 'AAPL',
//           interval: '1D',
//           fullscreen: true,
//           debug: true,
//         });
//       };
//     };

//     loadScripts();

//     // Cleanup function to remove scripts if needed
//     return () => {
//       const scripts = document.querySelectorAll('script[src*="charting_library"]');
//       scripts.forEach(script => script.remove());
//     };
//   }, []);

//   return (
//     <div id="chartContainer" style={{ width: '100%', height: '500px' }}></div>
//   );
// };

// export default RealTerminal;
