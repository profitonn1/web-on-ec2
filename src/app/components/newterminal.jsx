"use client"

import React, { useEffect, useState } from "react";
import ToogleButton from "./ToggleButton";
import TradingViewChart from "./ChartComponent";
import { useTradeData } from './TradeDataContext'; // Adjust the path as needed
import axios from "axios";
import Timer from "./Timer";
import { useRef } from 'react';
import { update } from "lodash";


export default function Terminal() {

  const { tradeData } = useTradeData();
  const latestTradeData = tradeData[0];
  const [activeButton, setActiveButton] = useState(null);
  const [selectButton, setSelectButton] = useState(null);
  const [openTrades, setopenTrades] = useState([]);
  const [pendingTrades, setpendingTrades] = useState([]);
  const [closedTrades, setclosedTrades] = useState([]);
  const [demoBalance, setDemoBalance] = useState(null);
  const [dynamicBalance, setDynamicBalance] = useState(null);
  const [trades,setTrades] = useState([]);
  const [isTradeClosed , setisTradeClosed] = useState(false)
  const [isTradeActive , setisTradeActive] = useState(false)
  const [symbolPrice , setSymbolPrice] = useState(0);
  const [symbol , setSymbol] = useState("");
  const [allProfit , setAllProfit]  = useState([]);
  const [closingTradeId , setClosingTradeId]  = useState(0);
  const [stopLossValue, setStopLossValue] = useState(2);
  const [takeProfitValue, setTakeProfitValue] = useState(2);
  const [units, setUnits] = useState(0.01); 
  const [inputValue, setInputValue] = useState(units.toFixed(3)); 
  const [opponentBalance, setOpponentBalance] = useState(null);
  const dynamicBalanceRef = useRef(dynamicBalance);
  const [pendingActive, setPendingActive] = useState(false);
  const [takeProfitActive, setTakeProfitActive] = useState(false);
  const [stopLossActive, setStopLossActive] = useState(false);

  const handlePendingToggle = () => setPendingActive(!pendingActive);
  const handleTakeProfitToggle = () => setTakeProfitActive(!takeProfitActive);
  const handleStopLossToggle = () => setStopLossActive(!stopLossActive);

  useEffect(() => {
    if (latestTradeData) {
      setSymbolPrice(latestTradeData.price);
      setSymbol(latestTradeData.symbol)

    }
  }, [latestTradeData]); // Update whenever latestTradeData changes
 
//  // This effect will only set stopLossValue when stopLossActive transitions from false to true
//  useEffect(() => {
//   if (stopLossActive && selectButton ==="buy") {
//     setStopLossValue(symbolPrice - 12);
//   }else{
//     setStopLossValue(symbolPrice + 12);
//   }
// }, [stopLossActive,selectButton]);

// useEffect(() => {
//   if (takeProfitActive && selectButton ==="buy") {
//     setTakeProfitValue(symbolPrice + 12);
//   }else{
//     setTakeProfitValue(symbolPrice - 12);
//   }
// }, [takeProfitActive,selectButton]);

  

  // Increase function
  const handleIncrease = () => {
    const newValue = parseFloat((units + 0.01).toFixed(2));
    setUnits(newValue);
    setInputValue(newValue.toFixed(2));
  };

  // Decrease function
  const handleDecrease = () => {
    const newValue = units > 0.01 ? parseFloat((units - 0.01).toFixed(2)) : units;
    setUnits(newValue);
    setInputValue(newValue.toFixed(2));
  };

  const increaseStopLoss = () => {
    const newValue = parseFloat(parseFloat(stopLossValue) + 1).toFixed(1);
    setStopLossValue(newValue);
  };
  
  // Decrease function with a check for non-negative values
  const decreaseStopLoss = () => {
    const newValue = parseFloat(parseFloat(stopLossValue) - 1).toFixed(1);
    if (newValue >= 0) {
      setStopLossValue(newValue);
    }
  };
  
  // Increase take profit
  const increasetakeProfit = () => {
    const newValue = parseFloat(parseFloat(takeProfitValue) + 1).toFixed(1);
    setTakeProfitValue(newValue);
  };
  
  // Decrease take profit with a check for non-negative values
  const decreasetakeProfit = () => {
    const newValue = parseFloat(parseFloat(takeProfitValue) - 1).toFixed(1);
    if (newValue >= 0) {
      setTakeProfitValue(newValue);
    }
  };
  
  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
  
    // Allow empty input for easier typing
    if (value === "") {
      setInputValue(value);
      return;
    }
  
    // Validate the input value to ensure it has at most four decimal places
    const decimalPattern = /^\d*\.?\d{0,2}$/; // Regex pattern for max 4 decimal places
    if (decimalPattern.test(value)) {
      setInputValue(value); // Update inputValue if valid
  
      // Update units based on input value if it's a valid number
      const parsedValue = parseFloat(value);
      if (!isNaN(parsedValue) && parsedValue >= 0) {
        setUnits(parsedValue); // Update units to match the input value
      }
    }
  };
  
  // Update the units state when the input loses focus
  const handleBlur = () => {
    const parsedValue = parseFloat(inputValue);
    if (!isNaN(parsedValue) && parsedValue >= 0) {
      setUnits(parsedValue); // Update main units state
    } else {
      setInputValue(units.toFixed(3)); // Reset inputValue to the current units value if invalid
    }
  };
  
    // Function to handle button clicks
    const handleButtonClick = (button) => {
        setActiveButton(button); // Set the active button
    };

    const handleSelectClick = (button) => {
      setSelectButton(button); // Set the selectButton
  };


  //function for getting userdetails from cookie
  function getCookieValue(name) {
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"))
    if (match) return match[2]
    return null
  }


  const userDetailsCookie = getCookieValue("userDetails")
    const decodedUserDetails = decodeURIComponent(userDetailsCookie)
    const parsedUserDetails = JSON.parse(decodedUserDetails)
  
    const placeTradeFunction = async () => {
      try {
        let margin = units * latestTradeData.price;
        let symbol = latestTradeData.symbol;
    
        // Initialize params object with the common values
        let params = {
          id: parsedUserDetails.id,
          username: parsedUserDetails.username,
          margin,
          openingprice: symbolPrice,
          units,
          buyOrSell: selectButton,
          symbol,
          openingTime: new Date(),
        };
    
        // Add stopLossValue to params if stopLossActive is true and selectButton is changed
        if (stopLossActive && selectButton) {
          params.stopLossValue = stopLossValue;
        }
    
        // Add takeProfitValue to params if takeProfitActive is true and selectButton is changed
        if (takeProfitActive && selectButton) {
          params.takeProfitValue = takeProfitValue;
        }
    
        // Send the request with the updated params
        const placeResponse = await axios.post('/api/placetrade', { params });
    
        if (placeResponse.status === 201) {
          setisTradeActive(!isTradeActive);
          handleButtonClick(1)
        }
      } catch (error) {
        console.error("Error placing trade:", error);
      }
    };
    
    

  useEffect(() => {
    const fetchBalance = async () => {
      if (!parsedUserDetails?.id || !parsedUserDetails?.username) {
        console.warn("User details are missing");
        return;
      }
  
      try {
        const response = await axios.get("/api/placetrade", {
          params: {
            id: parsedUserDetails.id,
            username: parsedUserDetails.username,
          },
        });
  
        setTrades([])
        if (response.status === 200) {
          const trade = response.data.trades;
          if (trade && trade.length > 0) {  // Check if trade data exists and has items
            setTrades(trade);
          } else {
            console.log("No trades available."); // No trades to display
            setTrades([]); // Optionally set an empty array to clear previous data
          }
        }
      } catch (error) {
        console.error("Error fetching trades:", error.response?.data || error.message);
      }
    };
  
    fetchBalance();
  }, [selectButton, isTradeActive,isTradeClosed]);
  

  
// Monitor open trades and close if symbol price reaches stopLossValue or takeProfitValue

// useEffect(() => {
//   openTrades.forEach((trade) => {
//     const profitData = allProfit.find((profit) => profit.id === trade.id);
//     const profitOrLoss = profitData ? profitData.profit.toFixed(3) : "0.00";
//     // Close trade if the symbolPrice reaches stopLossValue
//     if (profitOrLoss <= -(trade.stopLossValue)) {
//       closeTradeFunc(trade.id, profitOrLoss);
//     }
    
//     // Close trade if the symbolPrice reaches takeProfitValue
//     if (profitOrLoss >= takeProfitValue) {
//       closeTradeFunc(trade.id, profitOrLoss);
//     }
//   });
// }, [symbolPrice, openTrades]); 


const closeTradeFunc = async (tradeId, profitOrLoss) => {
    try {
      // Validate profitOrLoss as a number
      if (profitOrLoss === undefined || profitOrLoss === null || isNaN(profitOrLoss)) {
        return;
      }
  
      // Prepare parameters for API request
      const params = {
        tradeId,
        userId: parsedUserDetails.id,
        username: parsedUserDetails.username,
        profitOrLoss: parseFloat(profitOrLoss), // Ensure it's a number
      };
  
      // Validate required parameters
      if (!params.tradeId || !params.userId || !params.username || isNaN(params.profitOrLoss)) {
        return;
      }
  
      // API call to close trade
      const closetradeResponse = await axios.post("/api/closeTrade", { params });
  
      if (closetradeResponse.status >= 200 && closetradeResponse.status < 300) {
        // Trigger UI update for closed trade
        setisTradeClosed((prev) => !prev);
  
        // Update trades
        setTrades((prevTrades) =>
          prevTrades.map((trade) =>
            trade.id === tradeId
              ? { ...trade, profitOrLoss, closingTime: new Date() }
              : trade
          )
        );
  
        // Update closedTrades after updating trades
        setclosedTrades((prevTrades) =>
          prevTrades.filter((trade) => trade.closingTime !== null)
        );
  
        updateBalance()
      }
    } catch (error) {
      console.error("Error closing trades:", error.response?.data || error.message);
    }
  };
  
  // Log updates after state changes

  

    //   setclosedTrades((prevClosedTrades) =>
    //     prevClosedTrades.map((trade) =>
    //       trade.id === tradeId
    //         ? { ...trade, profitOrLoss, closingTime: new Date() }
    //         : trade
    //     )
    //   );

    // const newClosedTrades = trades.filter((trade) => trade.closingTime !==null);
    // setclosedTrades(newClosedTrades);

     // dynamicBalanceRef.current = parseFloat(dynamicBalanceRef.current + profitOrLoss).toFixed(2);
      // setDynamicBalance(parseFloat(dynamicBalanceRef.current));
      
      // Recalculate balance after trade closure
      // updateBalanceAfterTradeClose();
// Function to update the balance after trade closure
// const updateBalanceAfterTradeClose = () => {
//   let totalProfitOrLoss = 0;
//   allProfit.forEach(profit => {
//     totalProfitOrLoss += profit.profit;
//   });

//   setDynamicBalance((prevBalance) => {
//     const newBalance = demoBalance + totalProfitOrLoss;
//     return parseFloat(newBalance.toFixed(2));
//   });
// };


useEffect(() => {
  let totalProfitOrLoss = 0;
  const tempProfitArray = [];

  for (let i = 0; i < trades.length; i++) {
    const trade = trades[i];

    // Skip trades that are already closed
    if (trade.closingTime !== null) continue;

    let individualProfitOrLoss = 0;

    if (trade.buyOrSell === "buy") {
      individualProfitOrLoss = (symbolPrice * trade.unitsOrLots) - trade.margin;
    } else if (trade.buyOrSell === "sell") {
      individualProfitOrLoss = trade.margin - (symbolPrice * trade.unitsOrLots);
    }

    individualProfitOrLoss = parseFloat(individualProfitOrLoss.toFixed(2));
    totalProfitOrLoss += individualProfitOrLoss;

    const profitObject = { id: trade.id, profit: individualProfitOrLoss };
    tempProfitArray.push(profitObject);
  }

  setAllProfit(tempProfitArray);

  // Update dynamicBalance only for open trades
  setDynamicBalance(() => {
    const newBalance = demoBalance + totalProfitOrLoss;
    // console.log("Updated Balance (demoBalance + open trades):", newBalance);
    return parseFloat(newBalance.toFixed(2));
  });
}, [symbolPrice, trades]);


  
  useEffect(() => {
  
    const newOpenTrades = trades.filter((trade) => trade.closingTime === null);
    setopenTrades(newOpenTrades);
  }, [isTradeActive, isTradeClosed , selectButton, activeButton , trades]);
  

  useEffect(() => {
    const newClosedTrades = trades.filter((trade) => trade.closingTime !==null);
    setclosedTrades(newClosedTrades);
  }, [isTradeClosed, trades , isTradeActive ]);


  const updateBalance = async () => {
    try {
        
        var sum=0;
        for (let i = 0; i < closedTrades.length; i++) {
            sum += parseFloat(closedTrades[i].profitOrLoss);
        }
        const balance = 10000 + sum 

        // Updating the balance on the server
       await axios.post("/api/changeDemoBalance", {
        demoBalance: balance, // Send the current dynamicBalance
        username: parsedUserDetails.username,
        userId: parsedUserDetails.id
      });

      // Fetching the updated balance from the server
      const getDemoBalance = await axios.get("/api/changeDemoBalance", {
        params: { username: parsedUserDetails.username }
      });
  
      if (getDemoBalance.status === 200) {
        // Use the fetched balance directly for both updates to avoid inconsistencies
        setDynamicBalance(getDemoBalance.data.demoBalance);
        setDemoBalance(getDemoBalance.data.demoBalance);
      }
    } catch (error) {
      console.error("Error updating demo balance:", error);
    }
  };
  
  useEffect(() => {
    updateBalance();
  }, [closedTrades , trades]); // Run when isTradeClosed changes
  
  useEffect(() => {
    // Run on page load as well
    updateBalance();
  }, []); // Empty dependency array runs the effect only once on page load (or reload)
  
    
  



  // useEffect(() => {

  
  //   const storeResponse = async () => {
  //     try {
  //       const response = await axios.post('/api/storesymbolprice', {
  //         symbolPrice,
  //         symbol
  //       });
  //     } catch (error) {
  //       console.error("Error storing symbol price:", error);
  //     }
  //   };
  
  //   // Set interval to call storeResponse every 1 minute (60000 ms)
  //   const intervalId = setInterval(() => {
  //     storeResponse();
  //   }, 60000);
  
  //   // Initial call
  //   storeResponse();
  
  //   // Clean up interval on component unmount
  //   return () => clearInterval(intervalId);
  // }, [symbolPrice, symbol]); // Updated dependencies
  // ;


  return (

    <div className="containerOuter">
      <div className="w-[100vw] h-[40px] lg:h-[8vh] bg-zinc-950 border-b-4 border-slate-600 text-white flex justify-between items-center">
        <a
          href="#"
          className="text-xl lg:text-2xl font-ubuntu font-medium lg:font-semibold lg:px-5"
        >
          ProfitONN
        </a>
        <div className="grid grid-cols-3 gap-5 lg:text-lg items-center">
        <div className="font-bold flex justify-center gap-x-1">
          <div className="text-xl font-thin">$</div> {dynamicBalance !==null ? (dynamicBalance.toFixed(3)):' '}</div>
          <button className="w-[120px] h-[28px] text-slate-950 font-bold rounded-full bg-[yellow]">
            Deposit
          </button>
          <button className="pr-0 bg-[yellow]  text-slate-950 font-semibold w-8 rounded-full ml-4 h-8">
            {/* <img
              src="../../public/pulin.jpg"
              alt="profile"
              width={24}
              height={24}
              className="rounded-full"
            /> */}
            P
          </button>
        </div>
      </div>
      <div className="containerInner1 flex flex-col lg:flex-row w-[100vw] h-[100%] bg-gray-500 ">
        <div className="lg:w-[22vw] border-r-4 border-slate-600 border-box w-[100vw] h-[12vh] lg:h-[92vh] bg-zinc-950 ">
          <div className="w-[100%] h-[50%] flex flex-col items-center">
            <input
              type="text"
              placeholder="Search..."
              className="w-[96%] mt-4 py-2 pl-10 mx-2 text-gray-700 bg-[#FFF6F6] border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            />
            <ul className="w-[96%] mx-2 mt-6">
              <li className="bg-green-700 h-[50px] text-lg font-semibold text-white mb-3 rounded-lg flex items-center justify-around">
                <span>Your Balance</span>
                <span>$ {dynamicBalance !==null ? (dynamicBalance.toFixed(3)):' '}</span>
              </li>
              <li className="bg-red-700 h-[50px] text-lg font-semibold text-white rounded-lg flex items-center justify-around">
                {
                  opponentBalance!== null ? (<span>opponentBalance</span>) : (<span className="mr-10">Opponent Balance </span>)
                }
                {
                  opponentBalance!== null ? (<span>${opponentBalance}</span>) : (<span>---------</span>)
                }
              </li>
            </ul>
            <div className="text-4xl font-extrabold mt-4 text-white">Timer</div>
             <Timer/>
          </div>
          <div className="w-[100%] h-[50%] text-white bg-zinc-950 border-t-4 border-slate-600 border-box">
            <h1 className="pt-4 ml-5 text-xl font-semibold text-white">
              Your Profile
            </h1>
            <ul className="">
              <li className="h-[20px w-[90%] ml-5 mx-2 p-2  border-b-2 flex items-center justify-between">
                <span>BTCUSDT</span>
                <button className="text-3xl">+</button>
              </li>
              <li className="h-[20px w-[90%] ml-5 mx-2 p-2 border-b-2 flex items-center justify-between">
                <span>ETHUSDT</span>
                <button className="text-3xl">+</button>
              </li>
              <li className="h-[20px w-[90%] ml-5 mx-2 p-2  border-b-2 flex items-center justify-between">
                <span>USDTUSD</span>
                <button className="text-3xl">+</button>
              </li>
              <li className="h-[20px w-[90%] ml-5 mx-2 p-2  border-b-2 flex items-center justify-between">
                <span>FDUSD</span>
                <button className="text-3xl">+</button>
              </li>
              <li className="h-[20px w-[90%] ml-5 p-2 flex items-center justify-between">
                <span>SOL</span>
                <button className="text-3xl">+</button>
              </li>
            </ul>
          </div>
        </div>
        

        <div className="lg:w-[65vw] w-[100vw] h-[80vh] lg:h-[92vh] bg-slate-80 flex flex-col">
  {/* Trading View Component */}
  <div
    id="chart"
    className="h-[80vh] w-[100%] overflow-hidden bg-zinc-950 lg:text-8xl text-white flex items-center justify-center"
  >
    <TradingViewChart />
  </div>

  {/* Buttons and Table Section */}
  <div className="h-[20vh] w-[100%] bg-zinc-950 text-white border-t-4 border-slate-600 flex flex-col">
    <div className="flex text-base font-thin text-slate-500 justify-around h-[30%] w-[40%]">
      <button
        onClick={() => handleButtonClick(1)}
        className={`w-[120px] ${activeButton === 1 ? "bg-slate-800 text-white" : "bg-slate-900"}`}
      >
        Open ({openTrades.length})
      </button>
      <button
        onClick={() => handleButtonClick(2)}
        className={`w-[120px] ${activeButton === 2 ? "bg-slate-800 text-white" : "bg-slate-900"}`}
      >
        Pending ({pendingTrades.length})
      </button>
      <button
        onClick={() => handleButtonClick(3)}
        className={`w-[120px] ${activeButton === 3 ? "bg-slate-800 text-white" : "bg-slate-900"}`}
      >
        Closed ({closedTrades.length})
      </button>
    </div>

{/* Table Section */}
<div className="h-[80%] overflow-hidden text-[13px]">
  {activeButton !==null && (
   <div className="overflow-y-auto h-full max-h-[190px] custom-scrollbar overflow-x-auto w-full">
   {/* Header */}
   <div className="flex bg-gray-900 text-slate-400 text-[12px] h-8 sticky top-0 z-10 gap-x-2 w-full">
     <div className="w-1/12 min-w-[100px] p-2 flex-shrink-0">Symbol</div>
     <div className="w-1/12 min-w-[100px] p-2 flex-shrink-0">Sell/Buy</div>
     <div className="w-1/12 min-w-[100px] p-2 flex-shrink-0">Volume</div>
     <div className="w-1/12 min-w-[100px] p-2 flex-shrink-0">Margin</div>
     <div className="w-1/12 min-w-[100px] p-2 flex-shrink-0">OpeningPrice</div>
     {activeButton === 1 && (
       <div className="w-1/12 min-w-[100px] mr-4 p-2 flex-shrink-0">CurrentPrice</div>
     )}
     <div className="w-1/12 min-w-[100px] -mr-7 p-2 flex-shrink-0">Profit</div>
     {activeButton === 1 && (
       <div className="w-1/12 min-w-[100px] mr-4 p-2 flex-shrink-0">CloseTrade</div>
     )}
     <div className="w-1/12 min-w-[100px] mr-5 p-2 flex-shrink-0">OpeningTime</div>
     {activeButton === 3 && (
       <div className="w-1/12 min-w-[100px] mr-4 p-2   bg-gray-900 ">ClosingTime</div>
     )}
     <div className="w-1/12 min-w-[100px] p-2   bg-gray-900 ">TakeProfit</div>
     <div className="w-20 min-w-[100px] p-2   bg-gray-900">StopLoss</div>
   </div>

 

      
 
      {
        openTrades.length === 0 && activeButton === 1 ? (
          <div className="text-center text-slate-600 text-lg p-3">No Open Trade</div>
        ) : openTrades.length > 0 && activeButton === 1 ? (
          <>
            {/* Scrollable Table Body */}
            <div className="flex flex-col">
              {openTrades
                .slice() // Create a shallow copy to avoid mutating the original array
                .reverse() // Reverse the order of trades
                .map((row, index) => {
                  // Find the profit for the current trade from allProfit
                  const profitData = allProfit.find((profit) => profit.id === row.id);
                  const profitOrLoss = profitData ? profitData.profit.toFixed(3) : "0.00";

                  // Convert openingTime to desired format
                  const formattedTime = new Date(row.openingTime).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    second: 'numeric',
                    hour12: true,
                  });

                  return (
                    <div key={index} className="flex gap-x-2">
                      <div className="w-1/12 min-w-[100px] p-2">{row.symbol}</div>
                      <div className="w-1/12 min-w-[100px] p-2">{row.buyOrSell}</div>
                      <div className="w-1/12 min-w-[100px] p-2">{row.unitsOrLots}</div>
                      <div className="w-1/12 min-w-[100px] p-2">{row.margin}</div>
                      <div className="w-1/12 min-w-[100px] p-2 ">{row.openingprice}</div>
                      <div className="w-1/12 min-w-[100px] p-2 ">{symbolPrice}</div>
                      <div className="w-1/12 min-w-[100px] p-2 -mr-8 ">
                        <span
                          className={`${
                            profitOrLoss < 0 ? "text-red-500" : "text-green-600"
                          }`}
                        >
                          {profitOrLoss > 0 ? "+" : null}
                          {profitOrLoss}
                        </span>
                      </div>
                      <div className="w-1/12 min-w-[100px] p-2 ml-2 mr-4">
                        <button
                          onClick={() => {
                            closeTradeFunc(row.id, profitOrLoss);
                          }}
                          className={`h-6 rounded-full w-20 ${
                            row.buyOrSell === "buy"
                              ? "bg-blue-700 hover:bg-blue-600"
                              : "bg-red-700 hover:bg-red-500"
                          }`}
                        >
                          Close
                        </button>
                      </div>
                      <div className="w-1/12 mr-5 min-w-[100px] p-2 text-[12px] whitespace-nowrap">
                        {formattedTime}
                      </div>
                      {row.takeProfitValue === null ? (
                        <div className="w-1/12 min-w-[100px] ml-10 p-2">- - - -</div>
                      ) : (
                        <div className="w-1/12 min-w-[100px] p-2 ml-10">{row.takeProfitValue}</div>
                      )}
                      {row.stopLossValue === null ? (
                        <div className="w-1/12 min-w-[100px] p-2">- - - -</div>
                      ) : (
                        <div className="w-1/12 min-w-[100px] p-2">{row.stopLossValue}</div>
                      )}
                    </div>
                  );
                })}
            </div>
          </>
        ) : null
      }

    
       {
        pendingTrades.length === 0 && activeButton === 2 ? (
          <div className="text-center text-slate-600 text-lg p-3">No Pending Trades</div>
        ) : closedTrades.length > 0 && activeButton === 2 ? (
          <>
            <div>
              {closedTrades.map}
            </div>
          </>
        ) : null
      }


{
  closedTrades.length === 0 && activeButton === 3 ? (
    <div className="text-center text-slate-600 text-lg p-3">No Trade History</div>
  ) : closedTrades.length > 0 && activeButton === 3 ? (
    <div>
      {closedTrades
        .slice() // Create a shallow copy of the array to avoid mutating the state directly
        .sort((a, b) => new Date(b.closingTime) - new Date(a.closingTime)) // Sort in descending order by closingTime
        .map((row, index) => {
          const openformattedTime = new Date(row.openingTime).toLocaleString();
          const closedformattedTime = new Date(row.closingTime).toLocaleString();
          return (
            <div key={index} className="flex">
              <div className="w-1/12 mr-4 min-w-[100px] p-2">{row.symbol}</div>
              <div className="w-1/12 min-w-[100px] p-2">{row.buyOrSell}</div>
              <div className="w-1/12 min-w-[100px] p-2">{row.unitsOrLots}</div>
              <div className="w-1/12 min-w-[100px] p-2">{row.margin}</div>
              <div className="w-1/12 min-w-[100px] text-center p-2">{row.openingprice}</div>
              <div className="w-1/12 min-w-[100px] p-2">
                <span className={`ml-5 -mr-15 ${row.profitOrLoss < 0 ? "text-red-500" : "text-green-600"}`}>
                  {row.profitOrLoss > 0 ? "+" : null}
                  {row.profitOrLoss}
                </span>
              </div>
              <div className="w-1/12 min-w-[100px] p-2 text-[10px] whitespace-nowrap">
                {openformattedTime}
              </div>
              <div className="w-1/12 min-w-[100px] ml-5 mr-10 p-2 text-[10px] whitespace-nowrap">
                {closedformattedTime}
              </div>
              {row.takeProfitValue === null ? (
                <div className="w-1/12 min-w-[100px] ml-10 -mr-10 p-2">- - - -</div>
              ) : (
                <div className="w-1/12 min-w-[100px] p-2">{row.takeProfitValue}</div>
              )}
              {row.stopLossValue === null ? (
                <div className="w-1/12 min-w-[100px] p-2">- - - -</div>
              ) : (
                <div className="w-1/12 min-w-[100px] p-2">{row.stopLossValue}</div>
              )}
            </div>
          );
        })}
    </div>
  ) : null
} 


    </div>
  )}
</div>


  </div>
</div>

        {/* div 3 */}
        <div className="flex items-center border-l-4 border-slate-600 border-box flex-col lg:w-[15vw] w-[100vw] h-[40vh] lg:h-[92vh] bg-zinc-950">
          <div className="flex justify-between w-[90%] h-[80px] mt-4">

          <button  onClick={() =>handleSelectClick('sell')} className={`transition-colors duration-50 p-3 w-[45%] h-full rounded-lg border-2  text-center ${selectButton === 'sell' ? 'bg-red-600 text-white border-red-500': 'bg-gray-950 text-red-400 border-red-600'} hover:bg-red-600 hover:text-slate-100`}>
              <span>Sell </span><br />
              {latestTradeData ? (
                  latestTradeData.price // Display the price directly
              ) : (
                  ""
              )}

            </button>
            <button  onClick={() => handleSelectClick('buy')} className={`transition-colors duration-50 p-3 w-[45%] h-full rounded-lg border-2 text-center ${selectButton === 'buy' ? 'bg-blue-600 text-white border-blue-500': 'bg-gray-950 text-blue-400 border-blue-600'} hover:bg-blue-600 hover:text-slate-100`}>
      
                <span>Buy </span><br />
                {latestTradeData ? (
                    latestTradeData.price // Display the price directly
                ) : (
                    ""
                )}

            </button>
          </div>
          <div className="flex w-[90%] h-[80px] text-white items-center bg-slate-900 mt-5">
      <div className="w-[70%] flex ml-2 justify-between">
      <input
          className="w-16 text-slate-200 bg-slate-900 h-12  no-spinner"
          placeholder="0.01" // Update placeholder to reflect four decimal places
          step="0.01" // Set the step for four decimal places
          type="number"
          inputMode="decimal"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          style={{
            border: 'none',
            outline: 'none',
          }}
        />

        <div  className="  relative cursor-pointer  flex items-center">
          <span>units</span>
          <button className="ml-3 text-xs mt-1 bg-slate-900" >▽</button>
        </div>
      </div>
      <div className="w-[25%] flex flex-col text-2xl ml-4 font-semibold mr-1">
        <button onClick={handleIncrease} className="ring-2 text-[#FEEC37] mb-1">+</button>
        <button onClick={handleDecrease} className="ring-2 text-[#6EC207]">-</button>
      </div>
    </div>


          <div className="pending flex flex-col items-center w-[90%] h-auto mt-4">
            <div className="flex items-center w-full h-[50px]">
              <ToogleButton
                onToggle={handlePendingToggle}
                isActive={pendingActive}
              />
              <span className="ml-4 text-m text-white">Pending</span>
              <span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                  <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM169.8 165.3c7.9-22.3 29.1-37.3 52.8-37.3l58.3 0c34.9 0 63.1 28.3 63.1 63.1c0 22.6-12.1 43.5-31.7 54.8L280 264.4c-.2 13-10.9 23.6-24 23.6c-13.3 0-24-10.7-24-24l0-13.5c0-8.6 4.6-16.5 12.1-20.8l44.3-25.4c4.7-2.7 7.6-7.7 7.6-13.1c0-8.4-6.8-15.1-15.1-15.1l-58.3 0c-3.4 0-6.4 2.1-7.5 5.3l-.4 1.2c-4.4 12.5-18.2 19-30.6 14.6s-19-18.2-14.6-30.6l.4-1.2zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z" />
                </svg>
              </span>
            </div>
            {pendingActive && (
              <div className="dropdown-content bg-gray-800 text-white rounded w-full">
                <div className="flex border-2 border-white w-[100%] h-[36px]">
                  <div className="w-[60%] h-[100%] text-sm flex items-center justify-between">
                    <li className="ml-1 list-none">1200</li>
                    <span className="mr-1">Limit</span>
                  </div>
                  <div className="w-[20%] h-[100%] border-l-2 border-white text-xl flex items-center justify-center">
                    -
                  </div>
                  <div className="w-[20%] h-[100%] border-l-2 border-white text-xl flex items-center justify-center">
                    +
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="Stop Loss flex flex-col items-center w-[90%] h-auto mt-4">
      <div className="flex items-center w-full h-[50px]">
        <ToogleButton
          onToggle={handleTakeProfitToggle}
          isActive={takeProfitActive}
          value={takeProfitValue}
          inputMode="decimal"
        />
        <span className="ml-4 text-m text-white">Take Profit</span>
      </div>

      {takeProfitActive && (
        <div className="dropdown-content bg-gray-800 text-white rounded w-full">
          <div className="flex border-2 border-white w-[100%] h-[36px]">
            <div className="w-[60%] h-[100%] text-sm flex items-center justify-between">
              <input
                className="ml-1 bg-gray-800 w-20 border-none outline-none"
                type="number"
                inputMode="decimal"
                placeholder={`2`}
                value={takeProfitValue}
                onChange={(e) => {
                  const newValue = Number(e.target.value);
                  if (newValue >= 0) {
                    setTakeProfitValue(newValue);
                  }
                }}
              
              />
              <span className="mr-1">USD</span>
            </div>
            <button
              onClick={decreasetakeProfit}
              className="w-[20%] h-[100%] border-l-2 border-white text-xl flex items-center justify-center"
            >
              -
            </button>
            <button
              onClick={increasetakeProfit}
              className="w-[20%] h-[100%] border-l-2 border-white text-xl flex items-center justify-center"
            >
              +
            </button>
          </div>
        </div>
      )}
    </div>

          <div className="Stop Loss flex flex-col items-center w-[90%] h-auto mt-4">
      <div className="flex items-center w-full h-[50px]">
        <ToogleButton
          onToggle={handleStopLossToggle}
          isActive={stopLossActive}
          value={stopLossValue}
          inputMode="decimal"
        />
        <span className="ml-4 text-m text-white">Stop Loss</span>
      </div>

      {stopLossActive && (
        <div className="dropdown-content bg-gray-800 text-white rounded w-full">
          <div className="flex border-2 border-white w-[100%] h-[36px]">
            <div className="w-[60%] h-[100%] text-sm flex items-center justify-between">
              <input
                className="ml-1 bg-gray-800 w-20 border-none outline-none"
                type="number"
                inputMode="decimal"
                placeholder={`2`}
                value={stopLossValue}
                onChange={(e) => {
                  const newValue = Number(e.target.value);
                  if (newValue >= 0) {
                    setStopLossValue(newValue);
                  }
                }}
              
              />

              <span className="mr-1">USD</span>
            </div>
            <button
              onClick={decreaseStopLoss}
              className="w-[20%] h-[100%] border-l-2 border-white text-xl flex items-center justify-center"
            >
              -
            </button>
            <button
              onClick={increaseStopLoss}
              className="w-[20%] h-[100%] border-l-2 border-white text-xl flex items-center justify-center"
            >
              +
            </button>
          </div>
        </div>
      )}
    </div>


          <button
    className={`flex items-center justify-center mt-8 w-[90%] rounded h-[60px] text-slate-900 
        ${units === 0 || selectButton === null ? 'bg-slate-500' : selectButton === 'sell' ? 'bg-red-500 text-white' : selectButton === 'buy' ? 'bg-blue-600 text-white' : 'bg-slate-500'}`}
    disabled={units === 0 || selectButton === null} // Disable button if units are 0 or no active button
    onClick={placeTradeFunction}
>
    <span className="text-base"> 
        {units === 0 || selectButton === null ? "Select Buy/Sell" : selectButton === 'sell' ? `Sell ${units} units` : selectButton === 'buy' ? `Buy ${units} units` : "Select Buy/Sell"} 
    </span>
</button>

{selectButton && units > 0 && ( // Only show second button when selectButton is set and units are greater than 0
    <button 
        onClick={() => { setSelectButton(null) }} 
        className={`text-white w-[90%] mt-2 rounded p-2 
            ${selectButton === 'sell' ? 'border-2 border-red-400 hover:bg-zinc-800' : selectButton === 'buy' ? 'border-2 border-blue-500 hover:bg-zinc-800' : null}`}>
        Cancel
    </button>
)}




          <div className="mt-4 w-[90%] text-white">
            <div className="flex justify-between items-center w-[90%]">
              <span className="mb-2">Fees: </span>
              <span>-</span>
            </div>
            <div className="flex justify-between items-center w-[90%]">
              <span className="mb-2">Leverage: </span>
              <span>-</span>
            </div>
            <div className="flex justify-between items-center w-[90%]">
              <span className="mb-2">Margin: </span>
              <span>-</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}