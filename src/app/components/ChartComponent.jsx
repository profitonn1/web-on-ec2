"use client"; // Ensure this is at the top if you're using Next.js
import React, { useEffect, useRef ,useState } from 'react';
import { useTradeData } from './TradeDataContext'; // Import the context
import axios from 'axios';

const TradingViewChart = () => {
    const chartContainerRef = useRef(null);
    const { setTradeData } = useTradeData(); // Get the setTradeData function from context
    const [indicatorName , setIndicatorName] = useState("");
    const [toolName , setToolName] = useState("");
    const [timeInterval , setTimeInetval] = useState("");
    // const [indicatorName , storeIndicatorName] = useState([]);

    class Datafeed {
        constructor() {
            this.aggregatedBar = null;
            this.aggregationInterval = 1000; // 1 second in milliseconds
            this.intervalStart = null;
        }

        onReady(callback) {
            setTimeout(() => callback({
                exchanges: [{ value: "BINANCE", name: "Binance", desc: "Binance Exchange" }], 
                symbolsTypes: [{ name: "crypto", value: "crypto" }],
                supported_resolutions: ["1", "5", "15", "30", "60", "240", "1D"]
            }), 0);
        }

        resolveSymbol(symbolName, onSymbolResolvedCallback, onResolveErrorCallback) {
            const symbolStub = {
                name: symbolName,
                ticker: symbolName,
                type: 'crypto',
                session: '24x7',
                timezone: 'Etc/UTC',
                exchange: 'Binance',
                minmov: 1,
                pricescale: 100,
                has_intraday: true,
                intraday_multipliers: ['1', '5', '15', '30', '60'],
                supported_resolutions: ["1", "5", "15", "30", "60", "240", "1D"],
                volume_precision: 8,
                data_status: 'streaming'
            };
            setTimeout(() => onSymbolResolvedCallback(symbolStub), 0);
        }

        getBars(symbolInfo, resolution, { from, to }, onHistoryCallback, onErrorCallback, firstDataRequest) {
            const binanceSymbol = symbolInfo.ticker.replace("BINANCE:", "");
            const interval = this.convertResolution(resolution);
            const BinanceUrl = `https://api.binance.com/api/v3/klines?symbol=${binanceSymbol}&interval=${interval}&startTime=${from * 1000}&endTime=${to * 1000}`;
            fetch(`http://localhost:5000/proxy?url=${encodeURIComponent(BinanceUrl)}`)
                .then(response => response.json())
                .then(data => {
                    const bars = data.map(el => ({
                        time: el[0],
                        low: parseFloat(el[3]),
                        high: parseFloat(el[2]),
                        open: parseFloat(el[1]),
                        close: parseFloat(el[4]),
                        volume: parseFloat(el[5]),
                    }));
                    onHistoryCallback(bars, { noData: bars.length === 0 });
                })
                .catch(err => onErrorCallback(err));
        }

        subscribeBars(symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback) {
            const binanceSymbol = symbolInfo.ticker.replace("BINANCE:", "").toLowerCase();

            // Set up WebSocket connection
            this.binanceSocket = new WebSocket(`wss://stream.binance.com:9443/ws/${binanceSymbol}@trade`);

            this.binanceSocket.onmessage = event => {
                const data = JSON.parse(event.data);
                const currentPrice = parseFloat(data.p);
                const currentTime = Math.floor(data.T / this.aggregationInterval) * this.aggregationInterval;

                // Update trade data dynamically
                setTradeData([{ time: currentTime, price: currentPrice, symbol: binanceSymbol }]); // Set only the latest data

                // Initialize a new bar if no aggregation has started or the interval is complete
                if (!this.aggregatedBar || currentTime !== this.intervalStart) {
                    if (this.aggregatedBar) {
                        onRealtimeCallback(this.aggregatedBar); // Send completed bar
                    }
                    // Start a new bar
                    this.intervalStart = currentTime;
                    this.aggregatedBar = {
                        time: currentTime,
                        open: currentPrice,
                        high: currentPrice,
                        low: currentPrice,
                        close: currentPrice,
                        volume: 0
                    };
                } else {
                    // Update the existing bar's high, low, close, and volume
                    this.aggregatedBar.close = currentPrice;
                    this.aggregatedBar.high = Math.max(this.aggregatedBar.high, currentPrice);
                    this.aggregatedBar.low = Math.min(this.aggregatedBar.low, currentPrice);
                    this.aggregatedBar.volume += parseFloat(data.q); // Aggregate volume
                }
            };

            this.binanceSocket.onerror = error => {
                console.error("WebSocket error:", error);
            };

            this.binanceSocket.onclose = () => {
                console.log("WebSocket connection closed. Attempting to reconnect...");
                setTimeout(() => this.subscribeBars(symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback), 1000); // Reconnect if closed
            };
        }

        unsubscribeBars(subscriberUID) {
            if (this.binanceSocket) {
                this.binanceSocket.close();
            }
        }

        convertResolution(resolution) {
            switch (resolution) {
                case '1': return '1m';
                case '5': return '5m';
                case '15': return '15m';
                case '30': return '30m';
                case '60': return '1h';
                case '240': return '4h';
                case '1D': return '1d';
                default: return '1m';
            }
        }
    }

    function getCookieValue(name) {
        const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"))
        if (match) return match[2]
        return null
        }

        const storeIndicatorCount = async () => {
            try {
                const userDetailsCookie = getCookieValue("userDetails");
                if (userDetailsCookie) {
                    const decodedUserDetails = decodeURIComponent(userDetailsCookie);
                    const parsedUserDetails = JSON.parse(decodedUserDetails);
        
                    // Check if at least one value is not null or empty
                    if (indicatorName || toolName || timeInterval) {
                        // Prepare the payload only if there's data
                        const payload = {
                            userId: parsedUserDetails.id,
                            username: parsedUserDetails.username,
                        };
        
                        if (indicatorName) payload.indicatorName = indicatorName;
                        if (toolName) payload.toolName = toolName;
                        if (timeInterval) payload.timeInterval = timeInterval;
        
                        const response = await axios.post('/api/storeIndicatorCount', payload);
        
                        if (response.status === 201) {
                            setTimeInetval("");  // Clear timeInterval
                            setIndicatorName(""); // Clear indicatorName
                            setToolName("");      // Clear toolName
                        }
                    }
                }
            } catch (error) {
                console.error("Error storing indicator count:", error);
            }
        };
        
        useEffect(() => {
            storeIndicatorCount();
        }, [indicatorName, toolName, timeInterval]);
        
        

    useEffect(() => {
        const loadTradingViewScript = () => {
            return new Promise((resolve) => {
                const script = document.createElement('script');
                script.src = './charting_library/charting_library.standalone.js';
                script.onload = () => resolve();
                document.body.appendChild(script);
            });
        };

        loadTradingViewScript().then(() => {
            const widget = new window.TradingView.widget({
                symbol: 'BINANCE:BTCUSDT',
                width: 960,
                interval: '1', // default interval
                container: chartContainerRef.current,
                datafeed: new Datafeed(),
                library_path: './charting_library/',
                locale: 'en',
                timezone: "Asia/Kolkata",
                disabled_features: ["use_localstorage_for_settings"],
                theme: "Dark",
                precision: 10000,
            });
            widget.onChartReady(() => {
                widget.subscribe('study', (params) => {
                    setIndicatorName(params.value)
                    console.log("Indicator added: ", params);
                    console.log("Indicator name: ", params.value);
                });
                widget.subscribe('drawing' ,(params) =>{
                    setToolName(params.value)
                    console.log("Tool Used:",params)
                    console.log("Tool Name:",params.value)
                })
                const chart = widget.activeChart();
                chart.onIntervalChanged().subscribe(null, (interval) => {
                    setTimeInetval(interval)
                    console.log("Selected Interval: ", interval);
                });
            });

            return () => {
                // Clean up WebSocket connections here if needed
            };
        });
    }, []);

    return <div ref={chartContainerRef} style={{ width: '100%', height: '500px' }} />;
};

export default TradingViewChart;







/////////////////////////////////////////////////////////////////////////////////////////////////////

// "use client"; // Ensure this is at the top if you're using Next.js
// import React, { useEffect, useRef ,useState } from 'react';
// import { useTradeData } from './TradeDataContext'; // Import the context
// import axios from 'axios';

// const TradingViewChart = () => {
//     const chartContainerRef = useRef(null);
//     const { setTradeData } = useTradeData(); // Get the setTradeData function from context
//     const [indicatorName , setIndicatorName] = useState("");
//     const [toolName , setToolName] = useState("");
//     const [timeInterval , setTimeInetval] = useState("");
//     // const [indicatorName , storeIndicatorName] = useState([]);

//     class Datafeed {
//         constructor() {
//             this.aggregatedBar = null;
//             this.aggregationInterval = 1000; // 1 second in milliseconds
//             this.intervalStart = null;
//         }

//         onReady(callback) {
//             setTimeout(() => callback({
//                 exchanges: [{ value: "BINANCE", name: "Binance", desc: "Binance Exchange" }], 
//                 symbolsTypes: [{ name: "crypto", value: "crypto" }],
//                 supported_resolutions: ["1", "5", "15", "30", "60", "240", "1D"]
//             }), 0);
//         }

//         resolveSymbol(symbolName, onSymbolResolvedCallback, onResolveErrorCallback) {
//             const symbolStub = {
//                 name: symbolName,
//                 ticker: symbolName,
//                 type: 'crypto',
//                 session: '24x7',
//                 timezone: 'Etc/UTC',
//                 exchange: 'Binance',
//                 minmov: 1,
//                 pricescale: 100,
//                 has_intraday: true,
//                 intraday_multipliers: ['1', '5', '15', '30', '60'],
//                 supported_resolutions: ["1", "5", "15", "30", "60", "240", "1D"],
//                 volume_precision: 8,
//                 data_status: 'streaming'
//             };
//             setTimeout(() => onSymbolResolvedCallback(symbolStub), 0);
//         }

//         getBars(symbolInfo, resolution, { from, to }, onHistoryCallback, onErrorCallback, firstDataRequest) {
//             const binanceSymbol = symbolInfo.ticker.replace("BINANCE:", "");
//             const interval = this.convertResolution(resolution);
//             const BinanceUrl = `https://api.binance.com/api/v3/klines?symbol=${binanceSymbol}&interval=${interval}&startTime=${from * 1000}&endTime=${to * 1000}`;
//             fetch(`http://localhost:5000/proxy?url=${encodeURIComponent(BinanceUrl)}`)
//                 .then(response => response.json())
//                 .then(data => {
//                     const bars = data.map(el => ({
//                         time: el[0],
//                         low: parseFloat(el[3]),
//                         high: parseFloat(el[2]),
//                         open: parseFloat(el[1]),
//                         close: parseFloat(el[4]),
//                         volume: parseFloat(el[5]),
//                     }));
//                     onHistoryCallback(bars, { noData: bars.length === 0 });
//                 })
//                 .catch(err => onErrorCallback(err));
//         }

//         subscribeBars(symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback) {
//             const binanceSymbol = symbolInfo.ticker.replace("BINANCE:", "").toLowerCase();

//             // Set up WebSocket connection
//             this.binanceSocket = new WebSocket(`wss://stream.binance.com:9443/ws/${binanceSymbol}@trade`);

//             this.binanceSocket.onmessage = event => {
//                 const data = JSON.parse(event.data);
//                 const currentPrice = parseFloat(data.p);
//                 const currentTime = Math.floor(data.T / this.aggregationInterval) * this.aggregationInterval;

//                 // Update trade data dynamically
//                 setTradeData([{ time: currentTime, price: currentPrice, symbol: binanceSymbol }]); // Set only the latest data

//                 // Initialize a new bar if no aggregation has started or the interval is complete
//                 if (!this.aggregatedBar || currentTime !== this.intervalStart) {
//                     if (this.aggregatedBar) {
//                         onRealtimeCallback(this.aggregatedBar); // Send completed bar
//                     }
//                     // Start a new bar
//                     this.intervalStart = currentTime;
//                     this.aggregatedBar = {
//                         time: currentTime,
//                         open: currentPrice,
//                         high: currentPrice,
//                         low: currentPrice,
//                         close: currentPrice,
//                         volume: 0
//                     };
//                 } else {
//                     // Update the existing bar's high, low, close, and volume
//                     this.aggregatedBar.close = currentPrice;
//                     this.aggregatedBar.high = Math.max(this.aggregatedBar.high, currentPrice);
//                     this.aggregatedBar.low = Math.min(this.aggregatedBar.low, currentPrice);
//                     this.aggregatedBar.volume += parseFloat(data.q); // Aggregate volume
//                 }
//             };

//             this.binanceSocket.onerror = error => {
//                 console.error("WebSocket error:", error);
//             };

//             this.binanceSocket.onclose = () => {
//                 console.log("WebSocket connection closed. Attempting to reconnect...");
//                 setTimeout(() => this.subscribeBars(symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback), 1000); // Reconnect if closed
//             };
//         }

//         unsubscribeBars(subscriberUID) {
//             if (this.binanceSocket) {
//                 this.binanceSocket.close();
//             }
//         }

//         convertResolution(resolution) {
//             switch (resolution) {
//                 case '1': return '1m';
//                 case '5': return '5m';
//                 case '15': return '15m';
//                 case '30': return '30m';
//                 case '60': return '1h';
//                 case '240': return '4h';
//                 case '1D': return '1d';
//                 default: return '1m';
//             }
//         }
//     }

//     function getCookieValue(name) {
//         const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"))
//         if (match) return match[2]
//         return null
//         }

//         const saveIndicatorTemplate = async (name, content) => {
//             try {
//                 const userDetailsCookie = getCookieValue("userDetails");
//                 if (userDetailsCookie) {
//                     const decodedUserDetails = decodeURIComponent(userDetailsCookie);
//                     const parsedUserDetails = JSON.parse(decodedUserDetails);
//                 const response = await axios.post(`/api/charts_storage_api_version/study_templates`, {
//                     user: parsedUserDetails.username,
//                     name,
//                     content,
//                 });
//                 console.log("Save template response: ", response.data);
//             }
//             } catch (error) {
//                 console.error("Error saving indicator template: ", error);
//             }
//         };
    
//         const loadIndicatorTemplate = async (name) => {
//             try {
//                 const response = await axios.get(`/charts_storage_api_version/study_templates?client=client_id&user=user_id&template=${name}`);
//                 console.log("Loaded template content: ", response.data);
//             } catch (error) {
//                 console.error("Error loading indicator template: ", error);
//             }
//         };
    
//         const deleteIndicatorTemplate = async (name) => {
//             try {
//                 const response = await axios.delete(`/charts_storage_api_version/study_templates?client=client_id&user=user_id&template=${name}`);
//                 console.log("Delete template response: ", response.data);
//             } catch (error) {
//                 console.error("Error deleting indicator template: ", error);
//             }
//         };

//         const storeIndicatorCount = async () => {
//             try {
//                 const userDetailsCookie = getCookieValue("userDetails");
//                 if (userDetailsCookie) {
//                     const decodedUserDetails = decodeURIComponent(userDetailsCookie);
//                     const parsedUserDetails = JSON.parse(decodedUserDetails);
        
//                     // Check if at least one value is not null or empty
//                     if (indicatorName || toolName || timeInterval) {
//                         // Prepare the payload only if there's data
//                         const payload = {
//                             userId: parsedUserDetails.id,
//                             username: parsedUserDetails.username,
//                         };
        
//                         if (indicatorName) payload.indicatorName = indicatorName;
//                         if (toolName) payload.toolName = toolName;
//                         if (timeInterval) payload.timeInterval = timeInterval;
        
//                         const response = await axios.post('/api/storeIndicatorCount', payload);
        
//                         if (response.status === 201) {
//                             setTimeInetval("");  // Clear timeInterval
//                             setIndicatorName(""); // Clear indicatorName
//                             setToolName("");      // Clear toolName
//                         }
//                     }
//                 }
//             } catch (error) {
//                 console.error("Error storing indicator count:", error);
//             }
//         };
        
//         useEffect(() => {
//             storeIndicatorCount();
//         }, [indicatorName, toolName, timeInterval]);
        
        

//         useEffect(() => {
//             const loadTradingViewScript = () => {
//                 return new Promise((resolve) => {
//                     const script = document.createElement('script');
//                     script.src = './charting_library/charting_library.standalone.js';
//                     script.onload = () => resolve();
//                     document.body.appendChild(script);
//                 });
//             };
        
//             const loadSavedSettings = async () => {
//                 try {
//                     const userDetailsCookie = getCookieValue("userDetails");
//                     if (userDetailsCookie) {
//                         const decodedUserDetails = decodeURIComponent(userDetailsCookie);
//                         const parsedUserDetails = JSON.parse(decodedUserDetails);
        
//                         const response = await axios.get(`/api/charts_storage_api_version/study_templates`, {
//                             params: { user: parsedUserDetails.username }
//                         });
        
//                         if (response.data) {
//                             const savedTemplates = response.data;
//                             return savedTemplates;
//                         }
//                     }
//                 } catch (error) {
//                     console.error("Error loading saved settings:", error);
//                 }
//                 return null;
//             };
        
//             loadTradingViewScript().then(() => {
//                 const widget = new window.TradingView.widget({
//                     symbol: 'BINANCE:BTCUSDT',
//                     width: 920,
//                     interval: '1', // default interval
//                     container: chartContainerRef.current,
//                     datafeed: new Datafeed(),
//                     library_path: './charting_library/',
//                     locale: 'en',
//                     timezone: "Asia/Kolkata",
//                     disabled_features: ["use_localstorage_for_settings"],
//                     theme: "Dark",
//                     precision: 10000,
//                 });
        
//                 widget.onChartReady(async () => {
//                     // Load saved settings
//                     const savedSettings = await loadSavedSettings();
//                     if (savedSettings) {
//                         savedSettings.forEach(({ name, content }) => {
//                             widget.activeChart().createStudy(name, false, false, content);
//                         });
//                     }
        
//                     widget.subscribe('study', (params) => {
//                         setIndicatorName(params.value);
//                         saveIndicatorTemplate(params.value, params.content);
//                         console.log("Indicator added: ", params);
//                     });
        
//                     widget.subscribe('drawing', (params) => {
//                         setToolName(params.value);
//                         console.log("Tool Used:", params);
//                     });
        
//                     const chart = widget.activeChart();
//                     chart.onIntervalChanged().subscribe(null, (interval) => {
//                         setTimeInetval(interval);
//                         console.log("Selected Interval: ", interval);
//                     });
//                 });
        
//                 return () => {
//                     // Clean up WebSocket connections here if needed
//                 };
//             });
//         }, []);
        

//     return <div ref={chartContainerRef} style={{ width: '100%', height: '500px' }} />;
// };

// export default TradingViewChart;





// "use client";

// import React, { useEffect, useRef } from 'react';
// import axios from 'axios';

// const TradingViewChart = () => {
//   const chartContainerRef = useRef(null);

//   useEffect(() => {
//     const container = chartContainerRef.current;

//     const initTradingView = () => {
//       console.log("Initializing TradingView...");
//       if (typeof TradingView !== 'undefined' && typeof Datafeeds !== 'undefined') {
//         const widget = new TradingView.widget({
//           debug: true,
//           theme: "dark",
//           width: 920,
//           fullscreen: false,
//           symbol: "AAPL",
//           interval: "1D",
//           container: container,
//           datafeed: new Datafeeds.UDFCompatibleDatafeed("http://localhost:5001/api"),
//           library_path: "/charting_library/",
//           locale: "en",
//           timezone: "Asia/Kolkata",
//           enabled_features: ["study_templates", "use_localstorage_for_settings"],
//           disabled_features: ["header_indicators"],
//           charts_storage_url: "https://saveload.tradingview.com",
//           charts_storage_api_version: "1.1",
//           client_id: "tradingview.com",
//           user_id: "public_user_id",
//           symbol_search_request_delay: 1500,
//           auto_save_delay: 5,
//           supported_resolutions: ["1", "5", "15", "30", "60", "240", "1D", "1W", "1M"],
//         });

//         widget.onChartReady(() => {
//           const indicatorButton = widget.createButton();
//           indicatorButton.innerHTML = 'Indicators';
//           indicatorButton.style.cursor = 'pointer';
//           indicatorButton.style.position = 'relative';
//           indicatorButton.style.padding = '9px';
//           indicatorButton.style.borderRadius = "2px";

//           indicatorButton.addEventListener('mouseenter', () => {
//             indicatorButton.style.backgroundColor = '#383746';
//           });

//           indicatorButton.addEventListener('mouseleave', () => {
//             indicatorButton.style.backgroundColor = '#131722';
//           });

//           const dropdownMenu = document.createElement('div');
//           dropdownMenu.style.width = '350px';
//           dropdownMenu.style.display = 'none';
//           dropdownMenu.style.position = 'absolute';
//           dropdownMenu.style.top = '95px';
//           dropdownMenu.style.marginLeft = '240px';
//           dropdownMenu.style.color = '#D1D4DC';
//           dropdownMenu.style.backgroundColor = '#2A2939';
//           dropdownMenu.style.borderRadius = '10px';
//           dropdownMenu.style.boxShadow = '10px 4px 20px rgba(0, 0, 0, 0.2)';
//           dropdownMenu.style.overflowY = 'auto';
//           dropdownMenu.style.maxHeight = '300px';

//           dropdownMenu.style.scrollbarWidth = 'thin';
//           dropdownMenu.style.scrollbarColor = '#383746 #2A2939';

//           dropdownMenu.style.cssText += `
//               ::-webkit-scrollbar {
//                   width: 1px;
//               }
//               ::-webkit-scrollbar-track {
//                   background: #2A2939;
//               }
//               ::-webkit-scrollbar-thumb {
//                   background-color: #383746;
//                   border-radius: 10px;
//               }
//           `;

//           const indicatorHeader = document.createElement("div");
//           indicatorHeader.innerHTML = "Indicators";
//           indicatorHeader.style.fontSize = '20px';
//           indicatorHeader.style.padding = "20px 20px";
//           indicatorHeader.style.width = "100%";
//           indicatorHeader.style.borderBottom = '1px solid #9598A1';
//           indicatorHeader.style.backgroundColor = '#2A2939';
//           indicatorHeader.style.position = 'sticky';
//           indicatorHeader.style.top = '0';

//           dropdownMenu.appendChild(indicatorHeader);

//           const optionStyle = {
//             padding: '10px 15px',
//             fontSize: '13px',
//             cursor: 'pointer',
//           };

          
//           function getCookieValue(name) {
//             const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"))
//             if (match) return match[2]
//             return null
//           } 

//           const createOption = (text, study, params) => {
//           const option = document.createElement('div');
//           option.innerHTML = text;
//           Object.assign(option.style, optionStyle);

//           option.addEventListener('click', async () => {
//             const userDetailsCookie = getCookieValue("userDetails")
//             // Start the game by posting the amount
//             if (userDetailsCookie) {
//               const decodedUserDetails = decodeURIComponent(userDetailsCookie)
//               const parsedUserDetails = JSON.parse(decodedUserDetails)

//               console.log(parsedUserDetails.id)
//               console.log(parsedUserDetails.username)
//               const storeIndicators = await axios.post("/api/storeIndicatorCount", {
//                 id: parsedUserDetails.id,          // Ensure id is present
//                 username: parsedUserDetails.username ,// Ensure username is present
//                 indicatorName : text
//               });
//           }
//               widget.chart().createStudy(study, false, false, params);
//               dropdownMenu.style.display = 'none';
//             });
//             option.addEventListener('mouseenter', () => {
//               option.style.backgroundColor = '#383746';
//             });
//             option.addEventListener('mouseleave', () => {
//               option.style.backgroundColor = 'transparent';
//             });
//             return option;
//           };

        
//           // Add indicators using the createOption function
//           const rsiOption = createOption('Relative Strength Index', 'Relative Strength Index', [14]);
//           const bollingerBandOption = createOption('Bollinger Bands', 'Bollinger Bands', [20, 2]);
//           const emaOption = createOption('Moving Average Exponential', 'Moving Average Exponential', [20]);
//           const momentumOption = createOption('Momentum', 'Momentum', [14]);
//           const massIndexOption = createOption('Mass Index', 'Mass Index', []);
//           const volumeOscillatorOption = createOption('Volume Oscillator', 'Volume Oscillator', [14, 28]);
//           const averagePriceOption = createOption('Average Price', 'Average Price', []);
//           const linearRegressionCurveOption = createOption('Linear Regression Curve', 'Linear Regression Curve', []);
//           const leastSquaresMovingAverageOption = createOption('Least Squares Moving Average', 'Least Squares Moving Average', []);
//           const netVolumeOption = createOption('Net Volume', 'Net Volume', []);
//           const onBalanceVolumeOption = createOption('On Balance Volume', 'On Balance Volume', []);
//           const moneyFlowIndexOption = createOption('Money Flow Index', 'Money Flow Index', [14]);
//           const movingAverageAdaptiveOption = createOption('Moving Average Adaptive', 'Moving Average Adaptive', []);
//           const movingAverageChannelOption = createOption('Moving Average Channel', 'Moving Average Channel', []);
//           const acceleratorOscillatorOption = createOption('Accelerator Oscillator', 'Accelerator Oscillator', []);
//           const chaikinOscillatorOption = createOption('Chaikin Oscillator', 'Chaikin Oscillator', []);
//           const bollingerBandsWidthOption = createOption('Bollinger Bands Width', 'Bollinger Bands Width', [20, 2]);
//           const fisherTransformOption = createOption('Fisher Transform', 'Fisher Transform', [14]);
//           const historicalVolatilityOption = createOption('Historical Volatility', 'Historical Volatility', [14]);
//           const hullMovingAverageOption = createOption('Hull Moving Average', 'Hull Moving Average', [14]);
//           const linearRegressionSlopeOption = createOption('Linear Regression Slope', 'Linear Regression Slope', [14]);
//           const priceOscillatorOption = createOption('Price Oscillator', 'Price Oscillator', [12, 26]);
//           const rateOfChangeOption = createOption('Rate of Change', 'Rate of Change', [14]);
//           const standardDeviationOption = createOption('Standard Deviation', 'Standard Deviation', [20]);
//           const stochasticRSIOption = createOption('Stochastic RSI', 'Stochastic RSI', [14, 3, 3]);
//           const stochasticOption = createOption('Stochastic', 'Stochastic', [14, 3, 3]);
//           const vortexIndicatorOption = createOption('Vortex Indicator', 'Vortex Indicator', [14]);
//           const zigZagOption = createOption('Zig Zag', 'Zig Zag', [5]);
        
//           // Create an array of options excluding the indicatorHeader
//           const options = [
//             rsiOption,
//             bollingerBandOption,
//             emaOption,
//             momentumOption,
//             massIndexOption,
//             averagePriceOption,
//             linearRegressionCurveOption,
//             leastSquaresMovingAverageOption,
//             netVolumeOption,
//             onBalanceVolumeOption,
//             moneyFlowIndexOption,
//             movingAverageAdaptiveOption,
//             movingAverageChannelOption,
//             volumeOscillatorOption,
//             acceleratorOscillatorOption,
//             chaikinOscillatorOption,
//             bollingerBandsWidthOption,
//             fisherTransformOption,
//             historicalVolatilityOption,
//             hullMovingAverageOption,
//             linearRegressionSlopeOption,
//             priceOscillatorOption,
//             rateOfChangeOption,
//             standardDeviationOption,
//             stochasticRSIOption,
//             stochasticOption,
//             vortexIndicatorOption,
//             zigZagOption
//           ];
        
//           options.sort((a, b) => a.innerHTML.localeCompare(b.innerHTML));
//           options.forEach(option => dropdownMenu.appendChild(option));

//           container.appendChild(dropdownMenu);

//           indicatorButton.addEventListener('click', (event) => {
//             event.stopPropagation();
//             dropdownMenu.style.display = dropdownMenu.style.display === 'none' ? 'block' : 'none';
//           });

          
//           document.addEventListener('click', (event) => {
//             event.stopPropagation();
//             dropdownMenu.style.display = dropdownMenu.style.display === 'none' ? 'block' : 'none';
//           });
          
           
//           container.addEventListener('click', (event) => {
//             event.stopPropagation();
//             dropdownMenu.style.display = dropdownMenu.style.display === 'none' ? 'block' : 'none';
//           });
          

//           document.addEventListener('click', (event) => {
//             if (!dropdownMenu.contains(event.target) && !indicatorButton.contains(event.target)) {
//               dropdownMenu.style.display = 'none';
//             }
//           });
//         });
//       } else {
//         console.error("TradingView or Datafeeds is undefined");
//       }
//     };

//     const loadScripts = () => {
//       const tvScript = document.createElement('script');
//       tvScript.src = '/charting_library/charting_library.standalone.js';
//       tvScript.onload = () => {
//         const datafeedsScript = document.createElement('script');
//         datafeedsScript.src = '/datafeeds/udf/dist/bundle.js';
//         datafeedsScript.onload = initTradingView;
//         document.body.appendChild(datafeedsScript);
//       };
//       document.body.appendChild(tvScript);
//     };

//     loadScripts();

//     return () => {
//       const scripts = document.querySelectorAll('script[src="/charting_library/charting_library.standalone.js"], script[src="/datafeeds/udf/dist/bundle.js"]');
//       scripts.forEach((script) => {
//         script.remove();
//       });
//     };
//   }, []);

//   return (
//     <div>
//       <div ref={chartContainerRef} id="tv_chart_container" style={{ width: '100%', height: '100%' }}></div>
//     </div>
//   );
// };

// export default TradingViewChart;


// "use client";

// import React, { useEffect, useRef } from 'react';

// const TradingViewChart = () => {
//   const chartContainerRef = useRef(null);

//   useEffect(() => {
//     const container = chartContainerRef.current;

//     const initTradingView = () => {
//       console.log("Initializing TradingView...");
//       if (typeof TradingView !== 'undefined' && typeof Datafeeds !== 'undefined') {
//         const datafeed = new Datafeeds.UDFCompatibleDatafeed("http://localhost:5001/api");

//         datafeed.getBars = async function(symbolInfo, resolution, params, onResult, onError) {
//           let { from, to } = params;
        
//           // Default to current time if values are invalid
//           const currentTime = Math.floor(Date.now() / 1000);
//           from = from > 0 ? from : currentTime - 86400;  // Default `from` to 24 hours ago if invalid
//           to = to > 0 ? to : currentTime;                // Default `to` to current time if invalid
        
//           console.log("Adjusted Params for getBars - from:", from, "to:", to);
        
//           const url = `http://localhost:5001/api/getBars?symbol=${symbolInfo.name}&resolution=1m&from=${Math.floor(from)}&to=${Math.floor(to)}`;
//           try {
//             const response = await fetch(url);
//             if (!response.ok) throw new Error('Network response was not ok');
        
//             const result = await response.json();
//             const bars = result.map(candle => ({
//               time: candle.time * 1000,
//               low: candle.low,
//               high: candle.high,
//               open: candle.open,
//               close: candle.close,
//               volume: candle.volume,
//             }));
        
//             onResult(bars, { noData: bars.length === 0 });
//           } catch (error) {
//             console.error("Error fetching data:", error);
//             if (onError) onError(error);
//           }
//         };
        
        
      
   
        
//         new TradingView.widget({
//           // debug: true,
//           width: 920,
//           fullscreen: false,
//           symbol: "BTCUSDT",
//           interval: "1m",
//           container: container,
//           datafeed: datafeed,
//           library_path: "/charting_library/",
//           locale: "en",
//           timezone: "Asia/Kolkata",
//           enabled_features: ["study_templates", "use_localstorage_for_settings"],
//           charts_storage_url: "https://saveload.tradingview.com",
//           charts_storage_api_version: "1.1",
//           client_id: "tradingview.com",
//           user_id: "public_user_id",
//           symbol_search_request_delay: 1500,
//           auto_save_delay: 5,
//           supported_resolutions: ["1", "5", "15", "30", "60", "240", "1D", "1W", "1M"],
//         });
//       } else {
//         console.error("TradingView or Datafeeds is undefined");
//       }
//     };

//     const loadScripts = () => {
//       const tvScript = document.createElement('script');
//       tvScript.src = '/charting_library/charting_library.standalone.js';
//       tvScript.onload = () => {
//           const datafeedsScript = document.createElement('script');
//           datafeedsScript.src = '/datafeeds/udf/dist/bundle.js';
//           datafeedsScript.onload = initTradingView;
//           document.body.appendChild(datafeedsScript);
//       };
//       document.body.appendChild(tvScript);
//     };

//     loadScripts();

//     return () => {
//       const scripts = document.querySelectorAll('script[src="/charting_library/charting_library.standalone.js"], script[src="/datafeeds/udf/dist/bundle.js"]');
//       scripts.forEach((script) => {
//         script.remove();
//       });
//     };
//   }, []);

//   return (
//     <div>
//       <div ref={chartContainerRef} id="tv_chart_container" style={{ width: '100%', height: '500px' }}></div>
//     </div>
//   );
// };








////////////////////////////////////////////////////////////////////////////////////////////////////




// // export default TradingViewChart;
// "use client"; // Ensure this is at the top if you're using Next.js
// import React, { useEffect, useRef ,useState } from 'react';

// const TradingViewChart = () => {
//     const [indicator , setIndicator] = useState("")
//     const chartContainerRef = useRef(null);

//     class Datafeed {
//         constructor() {
//             this.aggregatedBar = null;
//             this.aggregationInterval = 1000; // 1 second in milliseconds
//             this.intervalStart = null;
//         }

//         onReady(callback) {
//             setTimeout(() => callback({
//                 exchanges: [{ value: "BINANCE", name: "Binance", desc: "Binance Exchange" }],
//                 symbolsTypes: [{ name: "crypto", value: "crypto" }],
//                 supported_resolutions: ["1", "5", "15", "30", "60", "240", "1D"]
//             }), 0);
//         }

//         resolveSymbol(symbolName, onSymbolResolvedCallback, onResolveErrorCallback) {
//             const symbolStub = {
//                 name: symbolName,
//                 ticker: symbolName,
//                 type: 'crypto',
//                 session: '24x7',
//                 timezone: 'Etc/UTC',
//                 exchange: 'Binance',
//                 minmov: 1,
//                 pricescale: 100,
//                 has_intraday: true,
//                 intraday_multipliers: ['1', '5', '15', '30', '60'],
//                 supported_resolutions: ["1", "5", "15", "30", "60", "240", "1D"],
//                 volume_precision: 8,
//                 data_status: 'streaming'
//             };
//             setTimeout(() => onSymbolResolvedCallback(symbolStub), 0);
//         }

//         getBars(symbolInfo, resolution, { from, to }, onHistoryCallback, onErrorCallback, firstDataRequest) {
//             const binanceSymbol = symbolInfo.ticker.replace("BINANCE:", "");
//             const interval = this.convertResolution(resolution);

//             const BinanceUrl = `https://api.binance.com/api/v3/klines?symbol=${binanceSymbol}&interval=${interval}&startTime=${from * 1000}&endTime=${to * 1000}`;
//             fetch(`http://localhost:5000/proxy?url=${encodeURIComponent(BinanceUrl)}`)
//                 .then(response => response.json())
//                 .then(data => {
//                     const bars = data.map(el => ({
//                         time: el[0],
//                         low: parseFloat(el[3]),
//                         high: parseFloat(el[2]),
//                         open: parseFloat(el[1]),
//                         close: parseFloat(el[4]),
//                         volume: parseFloat(el[5]),
//                     }));
//                     onHistoryCallback(bars, { noData: bars.length === 0 });
//                 })
//                 .catch(err => onErrorCallback(err));
//         }

//         subscribeBars(symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback) {
//             const binanceSymbol = symbolInfo.ticker.replace("BINANCE:", "").toLowerCase();

//             // Set up WebSocket connection
//             this.binanceSocket = new WebSocket(`wss://stream.binance.com:9443/ws/${binanceSymbol}@trade`);

//             this.binanceSocket.onmessage = event => {
//                 const data = JSON.parse(event.data);
//                 const currentPrice = parseFloat(data.p);
//                 const currentTime = Math.floor(data.T / this.aggregationInterval) * this.aggregationInterval;

//                 // Initialize a new bar if no aggregation has started or the interval is complete
//                 if (!this.aggregatedBar || currentTime !== this.intervalStart) {
//                     if (this.aggregatedBar) {
//                         onRealtimeCallback(this.aggregatedBar); // Send completed bar
//                     }
//                     // Start a new bar
//                     this.intervalStart = currentTime;
//                     this.aggregatedBar = {
//                         time: currentTime,
//                         open: currentPrice,
//                         high: currentPrice,
//                         low: currentPrice,
//                         close: currentPrice,
//                         volume: 0
//                     };
//                 } else {
//                     // Update the existing bar's high, low, close, and volume
//                     this.aggregatedBar.close = currentPrice;
//                     this.aggregatedBar.high = Math.max(this.aggregatedBar.high, currentPrice);
//                     this.aggregatedBar.low = Math.min(this.aggregatedBar.low, currentPrice);
//                     this.aggregatedBar.volume += parseFloat(data.q); // Aggregate volume
//                 }
//             };

//             this.binanceSocket.onerror = error => {
//                 console.error("WebSocket error:", error);
//             };

//             this.binanceSocket.onclose = () => {
//                 console.log("WebSocket connection closed. Attempting to reconnect...");
//                 setTimeout(() => this.subscribeBars(symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback), 1000); // Reconnect if closed
//             };
//         }

//         unsubscribeBars(subscriberUID) {
//             if (this.binanceSocket) {
//                 this.binanceSocket.close();
//             }
//         }

//         convertResolution(resolution) {
//             switch (resolution) {
//                 case '1': return '1m';
//                 case '5': return '5m';
//                 case '15': return '15m';
//                 case '30': return '30m';
//                 case '60': return '1h';
//                 case '240': return '4h';
//                 case '1D': return '1d';
//                 default: return '1m';
//             }
//         }
//     }

//     useEffect(() => {
//         const loadTradingViewScript = () => {
//             return new Promise((resolve) => {
//                 const script = document.createElement('script');
//                 script.src = './charting_library/charting_library.standalone.js';
//                 script.onload = () => resolve();
//                 document.body.appendChild(script);
//             });
//         };

//         loadTradingViewScript().then(() => {
//             const widget = new window.TradingView.widget({
//                 symbol: 'BINANCE:BTCUSDT',
//                 width: 920,
//                 interval: '1',
//                 container: chartContainerRef.current,
//                 datafeed: new Datafeed(),
//                 library_path: './charting_library/',
//                 locale: 'en',
//                 timezone: "Asia/Kolkata",
//                 disabled_features: ["use_localstorage_for_settings"],
//                 theme: "Dark",
//                 precision: 10000,
//                 studies_overrides: {
//                     "volume.volume.color.0": "#ff0000", // Customize some indicator appearance
//                 },
//             });

//             // Subscribe to event when study (indicator) is added
//             widget.onChartReady(() => {
//                 widget.subscribe('study', (params) => {
//                     setIndicator(params.value)
//                     console.log("Indicator added: ", params);
//                     console.log("Indicator name: ", params.value);
//                 });
//                 widget.subscribe('drawing' ,(params) =>{
//                     console.log("Tool Used:",params)
//                     console.log("Tool Name:",params.value)
//                 })
//                 widget.subscribe('timeframe' ,(params) =>{
//                     console.log("Tool Used:",params)
//                     console.log("Tool Name:",params.value)
//                 })
//             });

//         });

//         return () => {
//             // Cleanup function if needed
//         };
//     }, []);

//     return <div ref={chartContainerRef} style={{ width: '100%', height: '500px' }} ></div>;
// };

// export default TradingViewChart;
