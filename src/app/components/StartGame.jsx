// "use client"

// import { useEffect } from 'react';
// import io from 'socket.io-client';

// const TradingViewChart = () => {
//     useEffect(() => {
//         const socket = io();

//         const widget = new (window as any).TradingView.widget({
//             container_id: 'tv_chart_container',
//             library_path: '/tradingview/',
//             autosize: true,
//             symbol: 'AAPL',
//             interval: 'D',
//             timezone: 'Etc/UTC',
//             theme: 'dark',
//             style: '1',
//             locale: 'en',
//             toolbar_bg: '#f1f3f6',
//             enable_publishing: false,
//             allow_symbol_change: true,
//             hideideas: true,
//             studies_overrides: {},
//             container_id: 'tv_chart_container',
//             datafeed: {
//                 onReady: (callback: any) => {
//                     callback({
//                         supported_resolutions: ['1', '5', '15', '30', '60', '240', 'D'],
//                     });
//                 },
//                 resolveSymbol: (symbolName: string, onSymbolResolvedCallback: any) => {
//                     onSymbolResolvedCallback({
//                         name: symbolName,
//                         ticker: symbolName,
//                         minmov: 1,
//                         pricescale: 100,
//                         session: '24x7',
//                         has_intraday: true,
//                         supported_resolutions: ['1', '5', '15', '30', '60', '240', 'D'],
//                     });
//                 },
//                 getBars: (symbolInfo: any, resolution: any, from: any, to: any, onHistoryCallback: any) => {
//                     // Mock data
//                     onHistoryCallback([], { noData: true });
//                 },
//                 subscribeBars: (symbolInfo: any, resolution: any, onRealtimeCallback: any) => {
//                     socket.on('priceUpdate', (priceData: any) => {
//                         onRealtimeCallback({
//                             time: priceData.time,
//                             close: priceData.price,
//                         });
//                     });
//                 },
//                 unsubscribeBars: () => {
//                     socket.off('priceUpdate');
//                 },
//             },
//         });

//         return () => {
//             socket.disconnect();
//         };
//     }, []);

//     return (
//         <div>
//             <div id="tv_chart_container" style={{ position: 'relative', height: '600px' }}></div>
//         </div>
//     );
// };

// export default TradingViewChart;
