"use client";

import React, { useEffect, useState } from "react";
import ToogleButton from "./ToggleButton";
import TradingViewChart from "./ChartComponent";
import { useTradeData } from "./TradeDataContext"; // Adjust the path as needed
import axios from "axios";
import Timer from "./Timer";
import { useRef } from "react";
import Cookies from "js-cookie";

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
  const [initialFixedBalance, setInitialFixedBalance] = useState(null);
  const [trades, setTrades] = useState([]);
  const [isTradeClosed, setisTradeClosed] = useState(false);
  const [isTradeActive, setisTradeActive] = useState(false);
  const [symbolPrice, setSymbolPrice] = useState(null);
  const [symbol, setSymbol] = useState("");
  const [allProfit, setAllProfit] = useState([]);
  const [closingTradeId, setClosingTradeId] = useState(0);
  const [stopLossValue, setStopLossValue] = useState(2);
  const [takeProfitValue, setTakeProfitValue] = useState(2);
  const [pendingValue, setPendingValue] = useState("");
  const [units, setUnits] = useState(0.01);
  const [inputValue, setInputValue] = useState(units.toFixed(3));
  const [opponentBalance, setOpponentBalance] = useState(null);
  const dynamicBalanceRef = useRef(dynamicBalance);
  const [pendingActive, setPendingActive] = useState(false);
  const [takeProfitActive, setTakeProfitActive] = useState(false);
  const [stopLossActive, setStopLossActive] = useState(false);
  const [pendingResponse, setPendingResponse] = useState(false);
  const [leverageValue, setLeverageValue] = useState(50);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState(false);
  const [currentTotalProfitOrLoss, setCurrentTotalProfitorLoss] = useState(0);
  const [oppname, setOppname] = useState();
  const previousLengthRef = useRef(closedTrades.length); // Store the initial length of closedTrades
  const [isGameOver, setIsGameOver] = useState(false);
  const [showAfterMatchPopup, setShowAfterMatchPopup] = useState(false);
  const [winner, setWinner] = useState("");
  const [looser, setLooser] = useState("");
  const [chartHeight, setChartHeight] = useState(80); // Set initial height to 80vh
  const [isDynamicHigher, setIsDynamicHigher] = useState(true);
  const [isSlidingUp, setIsSlidingUp] = useState(false);

  const chartRef = useRef(null); // Reference for the chart component
  const resizingRef = useRef(false); // Flag for resizing status
  const lastY = useRef(0); // Store last Y position of mouse during drag

  const [oppData, setOppData] = useState({
    oppname: "",
    winrate: "",
    ranking: "",
    oppDemoBalance: 0,
  });

  //For changing the divs of user and opponent's Balance
  useEffect(() => {
    // Check which balance is higher and set the state accordingly
    if (dynamicBalance !== null && opponentBalance !== null) {
      setIsDynamicHigher(dynamicBalance >= opponentBalance);
    }
  }, [dynamicBalance, opponentBalance]);

  // auto leverage set according to the balance of the user.
  useEffect(() => {
    const leverageFunc = () => {
      if (demoBalance <= 20000) {
        setLeverageValue(125);
      } else if (20000 < demoBalance && demoBalance <= 60000) {
        setLeverageValue(100);
      } else {
        setLeverageValue(75);
      }
    };
    leverageFunc();
  }, [dynamicBalance]);

  //update the timer and announce gameOver
  const handleTimeEnd = () => {
    setIsGameOver(true);
  };

  //function to fetch cookies (opponent's data)
  function getCookieValue(name) {
    const match = document.cookie.match(
      new RegExp("(^| )" + name + "=([^;]+)")
    );
    if (match) return match[2];
    return null;
  }
  const getOpponentDetailsFromCookies = () => {
    const storedDetails = Cookies.get("oppData");
    return storedDetails ? JSON.parse(storedDetails) : null;
  };

  useEffect(() => {
    const storedDetails = getOpponentDetailsFromCookies();
    if (storedDetails) {
      setOppData(storedDetails);
    }
  }, []);

  //fetch oppBalance backend request
  useEffect(() => {
    const fetchOppBalanceFunc = async () => {
      if (oppData.oppname && isGameOver === false) {
        try {
          const oppBalanceResponse = await axios.get(
            "/api/game/fetchOppBalance",
            {
              params: { oppname: oppData.oppname },
            }
          );
          if (oppBalanceResponse.status === 201) {
            // console.log(oppBalanceResponse.data);
            setOpponentBalance(oppBalanceResponse.data.oppBalance);
          }
        } catch (error) {
          console.error("Error fetching opponent balance:", error);
        }
      }
    };

    fetchOppBalanceFunc();
  }, [symbolPrice]);

  // Function to start resizing
  const handleMouseDown = (e) => {
    resizingRef.current = true;
    lastY.current = e.clientY;
    document.body.style.cursor = "ns-resize"; // Change cursor to resize
  };

  // Function to resize the chart component
  const handleMouseMove = (e) => {
    if (!resizingRef.current) return;

    const diff = e.clientY - lastY.current; // Calculate difference in Y positions
    const sensitivityFactor = 1; // Sensitivity factor increased to make resizing more noticeable

    // Update height based on the mouse movement difference and sensitivity factor
    const newHeight = chartHeight + diff * sensitivityFactor;

    // Restrict resizing to between 50vh and 90vh
    if (newHeight >= 50 && newHeight <= 90) {
      setChartHeight(newHeight);
      lastY.current = e.clientY; // Update last Y position
    }
  };

  // Stop resizing when mouse is released
  const handleMouseUp = () => {
    resizingRef.current = false;
    document.body.style.cursor = "auto"; // Reset cursor
  };

  // UseEffect to attach mouse event listeners
  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const handlePendingToggle = () => {
    if (symbolPrice !== 0) {
      if (pendingActive === false && selectButton === null) {
        setPendingActive(!pendingActive);
        setSelectButton("buy");
      } else {
        setPendingActive(!pendingActive);
      }
      if (pendingActive === true) {
        setPendingActive(!pendingActive);
      }
    }
  };
  const handleTakeProfitToggle = () => setTakeProfitActive(!takeProfitActive);
  const handleStopLossToggle = () => setStopLossActive(!stopLossActive);

  useEffect(() => {
    if (latestTradeData) {
      setSymbolPrice(latestTradeData.price);
      setSymbol(latestTradeData.symbol);
    }
  }, [latestTradeData]); // Update whenever latestTradeData changes

  // This effect will only set stopLossValue when stopLossActive transitions from false to true
  useEffect(() => {
    if (symbolPrice === 0 && pendingActive) {
      setPendingValue("");
    }
    if (pendingActive && selectButton === "sell" && symbolPrice !== 0) {
      setPendingValue(symbolPrice - 12);
    }

    if (pendingActive && selectButton === "buy" && symbolPrice !== 0) {
      setPendingValue(symbolPrice + 12);
    }
  }, [pendingActive, selectButton]);

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
    const newValue =
      units > 0.01 ? parseFloat((units - 0.01).toFixed(2)) : units;
    setUnits(newValue);
    setInputValue(newValue.toFixed(2));
  };

  // Increase Stop Loss
  const increaseStopLoss = () => {
    const newValue = stopLossValue + 1;
    setStopLossValue(newValue); // Store the value as a number
  };

  // Decrease Stop Loss with a check for non-negative values
  const decreaseStopLoss = () => {
    const newValue = stopLossValue - 1;
    if (newValue >= 0) {
      setStopLossValue(newValue); // Store the value as a number
    }
  };

  // Increase Take Profit
  const increasetakeProfit = () => {
    const newValue = takeProfitValue + 1;
    setTakeProfitValue(newValue); // Store the value as a number
  };

  // Decrease Take Profit with a check for non-negative values
  const decreasetakeProfit = () => {
    const newValue = takeProfitValue - 1;
    if (newValue >= 0) {
      setTakeProfitValue(newValue); // Store the value as a number
    }
  };

  const increasePendingValue = () => {
    const newValue = parseFloat(parseFloat(pendingValue) + 1).toFixed(1);
    setPendingValue(newValue);
  };

  // Decrease function with a check for non-negative values
  const decreasePendingValue = () => {
    const newValue = parseFloat(parseFloat(pendingValue) - 1).toFixed(1);
    if (newValue >= 0) {
      setPendingValue(newValue);
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
    const match = document.cookie.match(
      new RegExp("(^| )" + name + "=([^;]+)")
    );
    if (match) return match[2];
    return null;
  }

  const userDetailsCookie = getCookieValue("userDetails");
  const decodedUserDetails = decodeURIComponent(userDetailsCookie);
  const parsedUserDetails = JSON.parse(decodedUserDetails);

  const placeTradeFunction = async () => {
    try {
      let margin = (units * symbolPrice) / leverageValue;

      let marginSum = 0;
      for (let i = 0; i < openTrades.length; i++) {
        const openTradesItems = openTrades[i];
        marginSum += openTradesItems.margin;
      }

      marginSum += margin;
      console.log(leverageValue, takeProfitValue, stopLossValue);

      if (
        marginSum < dynamicBalance &&
        symbolPrice !== null &&
        leverageValue > 0
      ) {
        // Initialize params object with the common values
        let params = {
          id: parsedUserDetails.id,
          username: parsedUserDetails.username,
          margin,
          leverage: leverageValue,
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

        if (pendingActive && selectButton) {
          params.pending = true;
          params.openingprice = pendingValue;
          params.margin = (units * pendingValue) / leverageValue;
        }
        // Send the request with the updated params
        const placeResponse = await axios.post("/api/placetrade", { params });

        if (placeResponse.status === 201) {
          setisTradeActive(!isTradeActive);
          setTakeProfitActive(false);
          setStopLossActive(false);
        }
      } else if (marginSum > dynamicBalance) {
        setAlertMessage("Insufficient Balance");
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 2000);
      }
    } catch (error) {
      console.error("Error placing trade:", error);
    }
  };

  useEffect(() => {
    const updatePendingTrades = async () => {
      try {
        // Define a buffer for reasonable price differences (you can adjust this threshold)
        const PRICE_BUFFER = 100; // Example threshold for valid price differences (can be changed based on market volatility)

        // Filter trades based on the condition, with a tolerance to avoid unrealistic trades
        const matchingTradeIds = pendingTrades
          .filter((trade) => {
            if (trade.buyOrSell === "buy") {
              // For 'buy', openingPrice must be >= symbolPrice and within buffer range
              return (
                symbolPrice >= trade.openingprice &&
                trade.openingprice >= symbolPrice - PRICE_BUFFER
              );
            } else if (trade.buyOrSell === "sell") {
              // For 'sell', openingPrice must be <= symbolPrice and within buffer range
              return (
                symbolPrice <= trade.openingprice &&
                trade.openingprice <= symbolPrice + PRICE_BUFFER
              );
            }
            return false;
          })
          .map((trade) => trade.id);

        // Send request only if matchingTradeIds is not empty
        if (matchingTradeIds.length > 0) {
          // Sending matchingTradeIds to the backend
          const response = await axios.post("/api/placetrade", {
            params: {
              matchingTradeIds,
              id: parsedUserDetails.id,
              username: parsedUserDetails.username,
            },
          });

          if (response.status === 201) {
            setPendingResponse(!pendingResponse);
          }
        }
      } catch (error) {
        console.error("Error updating trades:", error);
      }
    };

    updatePendingTrades();
  }, [symbolPrice, pendingTrades]);

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

        if (response.status === 200) {
          const trade = response.data.trades;
          if (trade && trade.length > 0) {
            setTrades(trade);
          } else {
            console.log("No trades available.");
          }
        }
      } catch (error) {
        console.error(
          "Error fetching trades:",
          error.response?.data || error.message
        );
      }
    };

    fetchBalance();
  }, [selectButton, isTradeActive, isTradeClosed, pendingResponse]); // Dependencies ensure fetchBalance is called appropriately

  // Monitor open trades and close if symbol price reaches stopLossValue or takeProfitValue

  useEffect(() => {
    // Validate symbolPrice before running logic
    if (!symbolPrice || symbolPrice <= 0) {
      console.warn("Invalid symbolPrice. Skipping trade closure evaluation.");
      return;
    }

    openTrades.forEach((trade) => {
      const profitData = allProfit.find((profit) => profit.id === trade.id);

      const profitOrLoss = profitData
        ? parseFloat(profitData.profit.toFixed(3))
        : 0;

      // Check if the trade is in loss and the margin is insufficient
      if (profitOrLoss < 0 && trade.margin <= Math.abs(profitOrLoss)) {
        closeTradeFunc(trade.id, profitOrLoss); // Close the trade
      }

      // Ensure trade closure is evaluated only when valid profit/loss values exist
      if (trade.stopLossValue && profitOrLoss <= -trade.stopLossValue) {
        closeTradeFunc(trade.id, profitOrLoss);
      } else if (
        trade.takeProfitValue &&
        profitOrLoss >= trade.takeProfitValue
      ) {
        closeTradeFunc(trade.id, profitOrLoss);
      }
    });
  }, [symbolPrice, openTrades, allProfit]);

  //function to close the trades
  const closeTradeFunc = async (tradeId, profitOrLoss) => {
    try {
      // Check for invalid values
      if (
        profitOrLoss === undefined ||
        profitOrLoss === null ||
        isNaN(profitOrLoss) ||
        !symbolPrice || // Ensure symbolPrice is valid
        symbolPrice <= 0
      ) {
        console.warn(
          "Invalid data passed to closeTradeFunc. Skipping trade closure."
        );
        return;
      }

      const params = {
        tradeId,
        userId: parsedUserDetails.id,
        username: parsedUserDetails.username,
        profitOrLoss: parseFloat(profitOrLoss),
        closingPrice: symbolPrice, // Use current symbolPrice
      };

      if (
        !params.tradeId ||
        !params.userId ||
        !params.username ||
        isNaN(params.profitOrLoss)
      ) {
        console.warn("Invalid params for closeTradeFunc:", params);
        return;
      }

      // Optimistically update state before API call
      setTrades((prevTrades) =>
        prevTrades.map((trade) =>
          trade.id === tradeId
            ? {
                ...trade,
                profitOrLoss,
                closingPrice: symbolPrice,
                closingTime: new Date(),
              }
            : trade
        )
      );

      // Persist trade closure on the backend
      const closetradeResponse = await axios.post("/api/closeTrade", {
        params,
      });

      if (closetradeResponse.status >= 200 && closetradeResponse.status < 300) {
        setisTradeClosed((prev) => !prev);

        // Update closed trades state
        setclosedTrades((prevTrades) =>
          prevTrades.filter((trade) => trade.closingTime !== null)
        );

        // Update the user's balance
        updateBalance();
      }
    } catch (error) {
      console.error(
        "Error closing trades:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    if (isGameOver === true && oppData) {
      // Check if the cookie already exists before setting it
      const existingBalance = Cookies.get("opponentBalance");
      setOpponentBalance(existingBalance);

      if (!existingBalance) {
        // Set the cookie to expire in 2 minutes only if it's not already set
        const twoMinutesFromNow = new Date(
          new Date().getTime() + 60 * 60 * 1000
        ); // 2 minutes from now
        Cookies.set("opponentBalance", opponentBalance, {
          expires: twoMinutesFromNow,
        });
      }

      const closeAllTrades = async () => {
        trades.forEach((trade) => {
          const profitData = allProfit.find((profit) => profit.id === trade.id);
          const profitOrLoss = profitData ? profitData.profit.toFixed(3) : 0;
          closeTradeFunc(trade.id, profitOrLoss); // Close each trade
        });
        setShowAfterMatchPopup(true); // Show the after-match popup
        await axios.post("/api/afterGameWalletBalanceUpdate", {
          params: {
            username: parsedUserDetails.username,
            oppname: oppData.oppname,
          },
        });
      };

      if (trades.length > 0) {
        closeAllTrades(); // Call the function to close all trades
      }
    }
  }, [isGameOver]);

  useEffect(() => {
    if (openTrades.length !== 0) {
      updateBalance();
    }
  }, [symbolPrice]);

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

    if (symbolPrice !== null) {
      // Calculate profit or loss for open trades
      for (let i = 0; i < trades.length; i++) {
        const trade = trades[i];

        // Skip trades that are already closed
        if (trade.closingTime !== null || trade.pending === true) continue;

        let individualProfitOrLoss = 0;

        if (trade.buyOrSell === "buy") {
          individualProfitOrLoss =
            symbolPrice * trade.unitsOrLots - trade.margin * trade.leverage;
        } else if (trade.buyOrSell === "sell") {
          individualProfitOrLoss =
            trade.margin * trade.leverage - symbolPrice * trade.unitsOrLots;
        }

        individualProfitOrLoss = parseFloat(individualProfitOrLoss.toFixed(3));
        totalProfitOrLoss += individualProfitOrLoss;

        const profitObject = { id: trade.id, profit: individualProfitOrLoss };
        tempProfitArray.push(profitObject);
      }

      setAllProfit(tempProfitArray);
      setCurrentTotalProfitorLoss(totalProfitOrLoss);

      // Check if the length of closedTrades has changed
      const currentLength = closedTrades.length;
      let sum = 0;
      for (let i = 0; i < currentLength; i++) {
        sum += parseFloat(closedTrades[i].profitOrLoss);
      }

      // If the length has changed (increased or decreased)
      if (
        currentLength !== previousLengthRef.current &&
        previousLengthRef.current !== 0
      ) {
        // Update the balance considering closed trades' profit or loss
        setDynamicBalance(() => {
          const newBalance = demoBalance + totalProfitOrLoss + sum;
          previousLengthRef.current = currentLength; // Update the previous length
          console.log(dynamicBalance)
          return parseFloat(newBalance.toFixed(3)); // Set new balance

        });
      } else {
        // If the length hasn't changed, only update balance for open trades
        setDynamicBalance(() => {
          const newBalance = demoBalance + totalProfitOrLoss;
          console.log(dynamicBalance)
          return parseFloat(newBalance.toFixed(3)); // Set new balance
        });
      }
    }
  }, [symbolPrice, trades, closedTrades, demoBalance]);

  useEffect(() => {
    // Update open trades
    const newOpenTrades = trades.filter(
      (trade) => trade.closingTime === null && trade.pending === false
    );
    setopenTrades(newOpenTrades);
  }, [isTradeActive, isTradeClosed, selectButton, activeButton, trades]);

  useEffect(() => {
    // Update closed trades
    const newClosedTrades = trades.filter(
      (trade) => trade.closingTime !== null && trade.pending === false
    );
    setclosedTrades(newClosedTrades);
  }, [isTradeClosed, trades, isTradeActive]);

  useEffect(() => {
    // Update pending trades
    const newPendingTrades = trades.filter(
      (trade) => trade.closingTime === null && trade.pending === true
    );
    setpendingTrades(newPendingTrades);
  }, [isTradeClosed, trades, isTradeActive]);

  const updateBalance = async () => {
    try {
      if (initialFixedBalance === null || isNaN(initialFixedBalance)) {
        console.warn("Initial fixed balance is not set. Skipping update.");
        return;
      }

      let sum = 0;

      // Add profit or loss from closed trades
      for (let i = 0; i < closedTrades.length; i++) {
        sum += parseFloat(closedTrades[i].profitOrLoss);
      }

      // Calculate the total dynamic balance
      const balance = initialFixedBalance + sum + currentTotalProfitOrLoss;

      if (balance === null || isNaN(balance)) {
        console.warn("Invalid balance calculation. Skipping update.");
        return;
      }

      // Updating the balance on the server
      await axios.post("/api/changeDemoBalance", {
        demoBalance: balance, // Send the correct dynamic balance
        username: parsedUserDetails.username,
        userId: parsedUserDetails.id,
      });

      setDemoBalance(initialFixedBalance + sum);
      console.log(demoBalance,'demoBalance')

      // // Fetching the updated balance from the server
      // const getDemoBalance = await axios.get("/api/changeDemoBalance", {
      //   params: { username: parsedUserDetails.username },
      // });

      // if (getDemoBalance.status === 200) {
      //   const updatedBalance = getDemoBalance.data.demoBalance;
      //   // setDynamicBalance(updatedBalance);
      //   setDemoBalance(initialFixedBalance + sum);
      // } else {
      //   console.error("Failed to fetch updated balance. Status:", getDemoBalance.status);
      // }
    } catch (error) {
      console.error("Error updating demo balance:", error);
    }
  };

  // Helper function to get the current market price
  const getCurrentMarketPrice = async (symbol) => {
    try {
      const response = await axios.get(`/api/marketPrice`, {
        params: { symbol },
      });

      if (response.status === 200) {
        return response.data.price; // Assuming the price is in response.data.price
      } else {
        console.error("Failed to fetch market price for symbol:", symbol);
        return 0;
      }
    } catch (error) {
      console.error("Error fetching market price:", error);
      return 0;
    }
  };

  useEffect(() => {
    const getInitialDemoBalance = async () => {
      try {
        const response = await axios.get(
          `/api/changeDemoBalance?username=${parsedUserDetails.username}`
        );
        if (response.status === 200) {
          let fixedBalance = 0;
          if (
            response.data.category === "beginner" ||
            response.data.category === "null"
          ) {
            fixedBalance = 10000;
          } else if (response.data.category === "plus") {
            fixedBalance = 50000;
          } else if (response.data.category === "pro") {
            fixedBalance = 100000;
          }
          setInitialFixedBalance(fixedBalance);
        }
      } catch (error) {
        console.error("Error fetching initial demo balance:", error);
      }
    };

    getInitialDemoBalance();
  }, []); // Run only on component mount

  useEffect(() => {
    if (initialFixedBalance !== null && !isNaN(initialFixedBalance)) {
      updateBalance();
    }
  }, [closedTrades, trades, initialFixedBalance]); // Ensure all dependencies are accounted for

  // useEffect(() => {\

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
    <div className="containerOuter  ">
      <div className=" w-[100vw] h-[40px] lg:h-[8vh]  bg-zinc-950 border-b-4 border-slate-600 text-white flex justify-between items-center">
        <a
          href="#"
          className="text-xl lg:text-2xl font-ubuntu font-medium lg:font-semibold lg:px-5"
        >
          ProfitONN
        </a>
        <div className="flex justify-end gap-x-6 lg:text-lg items-center ">
          <div className="font-bold flex justify-center gap-x-1">
            <div className="text-xl font-thin">$</div>{" "}
            {dynamicBalance !== null ? Number(dynamicBalance).toFixed(3) : " "}
          </div>
          <button className="w-[120px] h-[28px] text-slate-950 font-bold rounded-full bg-[yellow]">
            Deposit
          </button>
          <button className="pr-0 bg-[yellow]  text-slate-950 font-semibold w-8 rounded-full mr-2 h-8">
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

      {/* Popup after the match is over */}
      {isGameOver && (
        <div className="fixed inset-0 bg-black bg-opacity-50  flex items-center justify-center">
          <div className="relative w-11/12 max-w-lg bg-gradient-to-b from-gray-900 via-gray-800 to-black rounded-3xl shadow-2xl p-8 glow-effect">
            <h1 className="mb-6 font-mono text-center text-4xl text-white tracking-widest animate-pulse">
              Game Results
            </h1>

            <div className="flex justify-between items-center mb-8 px-6">
              {/* Player Balance */}
              <div className="text-center">
                <div className="text-gray-400 text-lg font-light">
                  Your Balance
                </div>
                <div className="font-bold font-mono text-3xl text-green-400 mt-2">
                  {dynamicBalance !== null ? dynamicBalance.toFixed(3) : "--"}
                </div>
              </div>

              {/* Opponent Balance */}
              <div className="text-center">
                <div className="text-gray-400 text-lg font-light">
                  {oppData.oppname || "Opponent"}&apos;s Balance
                </div>
                <div className="font-bold font-mono text-3xl text-red-400 mt-2">
                  {opponentBalance !== null && !isNaN(opponentBalance)
                    ? Number(opponentBalance).toFixed(3)
                    : "--"}
                </div>
              </div>
            </div>

            {/* Outcome Section */}
            <div className="text-center text-white mb-8">
              {dynamicBalance > opponentBalance && symbolPrice !== null ? (
                <div>
                  <p className="text-green-500 text-2xl font-bold mb-2 animate-bounce">
                    🎉 Victory!
                  </p>
                  <p className="text-gray-300">
                    You won by {(dynamicBalance - opponentBalance).toFixed(3)}!
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    ₹80 has been transferred to your wallet.
                  </p>
                </div>
              ) : dynamicBalance < opponentBalance && symbolPrice !== null ? (
                <div>
                  <p className="text-red-500 text-2xl font-bold mb-2">
                    😢 You Just Missed
                  </p>
                  <p className="text-gray-300">Better luck next time!</p>
                </div>
              ) : Math.abs(dynamicBalance - opponentBalance) < 0.0001 &&
                symbolPrice !== null ? (
                <div>
                  <p className="text-yellow-400 text-2xl font-bold mb-2">
                    🤝 It&apos;s a Tie!
                  </p>
                  <p className="text-gray-300">No winners this time.</p>
                </div>
              ) : (
                <p className="text-yellow-400 text-xl font-medium animate-pulse">
                  Fetching results...
                </p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex justify-center gap-8">
              <button className="w-[40%] font-mono text-lg font-bold transition duration-300 ease-in-out transform hover:scale-110 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white py-3 rounded-full shadow-lg hover:shadow-none">
                New Game
              </button>

              <button className="w-[40%] font-mono text-lg font-bold transition duration-300 ease-in-out transform hover:scale-110 bg-gradient-to-r from-red-600 to-red-500 text-white py-3 rounded-full shadow-lg">
                Exit
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="containerInner1 flex flex-col lg:flex-row w-[100vw] h-[100%] bg-gray-500 ">
        <div className="lg:w-[22vw] border-r-4 border-slate-600 border-box w-[100vw] h-[12vh] lg:h-[92vh] opac bg-zinc-950 ">
          <div className="w-[100%] h-[50%] flex flex-col items-center">
            <input
              type="text"
              placeholder="Search..."
              className="w-[96%] mt-4 py-2 pl-10 mx-2 text-gray-700 bg-[#FFF6F6] border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            />

            <div
              className={`w-[96%] mx-2 mt-6  ${
                isGameOver === true ? "opacity-50" : ""
              }`}
            >
              {/* Dynamic Balance */}
              <div
                className={`transition-transform duration-500 ${
                  isDynamicHigher
                    ? "translate-y-0"
                    : isSlidingUp
                    ? "-translate-y-[0px]"
                    : "translate-y-[60px]"
                } `}
              >
                <li
                  className={`h-[50px] text-base font-semibold text-white mb-2 rounded-lg flex items-center justify-between px-4 ${
                    isDynamicHigher ? "bg-green-700" : "bg-red-600"
                  }`}
                >
                  <div className="flex flex-col items-start">
                    <span>Your Balance</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span>
                      {dynamicBalance !== null
                        ? `$${dynamicBalance.toFixed(3)}`
                        : "-------"}
                    </span>
                  </div>
                </li>
              </div>

              {/* Opponent Balance */}
              {opponentBalance !== null && (
                <div
                  className={`transition-transform duration-500 ${
                    isSlidingUp
                      ? "translate-y-0"
                      : isDynamicHigher
                      ? "translate-y-[0px]"
                      : "-translate-y-[60px]"
                  } `}
                >
                  <li
                    className={`h-[50px] text-base font-semibold text-white mb-2 rounded-lg flex items-center justify-between px-4 bg-transparent border-2 border-slate-500 
          }`}
                  >
                    <div className="flex flex-col items-start">
                      <span>Opponent&apos;s Balance </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span>
                        {opponentBalance !== null
                          ? `$${Number(opponentBalance).toFixed(3)}`
                          : "-------"}
                      </span>
                    </div>
                  </li>
                </div>
              )}
            </div>

            {/* <div className="text-4xl font-bold text-white mt-2">Timer</div>
            <Timer startTime={oppData.startTime}  />
          </div> */}

            {/* Timer of the trade session */}
            {!isGameOver && oppData.startTime ? (
              <>
                <h1 className="text-white text-4xl mt-2 font-bold">Timer</h1>
                <Timer
                  startTime={oppData.startTime}
                  onTimeEnd={handleTimeEnd}
                />
              </>
            ) : !isGameOver ? (
              <h1 className="text-white text-4xl mt-2 font-bold">Timer</h1>
            ) : (
              <h1 className="font-bold text-5xl text-red-400 mt-7">
                Times Up!
              </h1>
            )}
          </div>
          <div className="w-[100%] h-[50%] text-white bg-zinc-950 border-t-4 border-slate-600 border-box">
            <h1 className="pt-4 ml-5 text-xl font-semibold text-white">
              Your Profile
            </h1>
            <ul className="">
              <li className="w-[90%] ml-5 mx-2 p-2  border-b-2 flex items-center justify-between">
                <span>BTCUSDT</span>
                <button className="text-3xl">+</button>
              </li>
              <li className="w-[90%] ml-5 mx-2 p-2 border-b-2 flex items-center justify-between">
                <span>ETHUSDT</span>
                <button className="text-3xl">+</button>
              </li>
              <li className="w-[90%] ml-5 mx-2 p-2  border-b-2 flex items-center justify-between">
                <span>USDTUSD</span>
                <button className="text-3xl">+</button>
              </li>
              <li className="w-[90%] ml-5 mx-2 p-2  border-b-2 flex items-center justify-between">
                <span>FDUSD</span>
                <button className="text-3xl">+</button>
              </li>
              <li className="w-[90%] ml-5 p-2 flex items-center justify-between">
                <span>SOL</span>
                <button className="text-3xl">+</button>
              </li>
            </ul>
          </div>
        </div>

        <div className="lg:w-[65vw] w-[100vw] h-[80vh] lg:h-[92vh] bg-slate-80 flex flex-col">
          {/* Trading View Component */}
          <div
            ref={chartRef}
            id="chart"
            className="terminal bg-zinc-950 lg:text-8xl text-white flex items-center justify-center"
            style={{ height: `${chartHeight}vh` }} // Dynamically adjust height
          >
            <TradingViewChart />
          </div>

          {/* Divider for resizing */}
          <div
            className="h-1 cursor-ns-resize bg-slate-600"
            onMouseDown={handleMouseDown}
            style={{ cursor: "ns-resize" }}
          ></div>

          {/* Buttons and Table Section */}
          <div className="h-[20vh] w-[100%] bg-zinc-950 text-white  border-slate-600 flex flex-col">
            <div className="flex text-base font-thin text-slate-500 justify-start h-[30%] w-[40%]">
              <button
                onClick={() => handleButtonClick(1)}
                className={`w-[120px] ${
                  activeButton === 1
                    ? "bg-slate-800 text-white"
                    : "bg-slate-900"
                } hover:bg-slate-800 border-r-2 border-slate-600`}
              >
                Open ({openTrades.length})
              </button>
              <button
                onClick={() => handleButtonClick(2)}
                className={`w-[120px] ${
                  activeButton === 2
                    ? "bg-slate-800 text-white"
                    : "bg-slate-900"
                } hover:bg-slate-800 border-r-2 border-slate-600`}
              >
                Pending ({pendingTrades.length})
              </button>
              <button
                onClick={() => handleButtonClick(3)}
                className={`w-[120px] ${
                  activeButton === 3
                    ? "bg-slate-800 text-white"
                    : "bg-slate-900"
                } hover:bg-slate-800`}
              >
                Closed ({closedTrades.length})
              </button>
            </div>

            {/* Table Section */}
            <div className="h-[80%] overflow-hidden text-[13px]">
              {activeButton !== null && (
                <div className="overflow-y-auto h-full max-h-[190px] custom-scrollbar overflow-x-auto w-full">
                  {/* Header */}
                  <div className="flex bg-gray-900 text-slate-400 text-[12px] h-8 sticky top-0 z-10 gap-x-2 w-full">
                    <div className="w-[70px] p-2   text-center flex-shrink-0">
                      Symbol
                    </div>
                    <div className="w-[70px]  p-2 text-center flex-shrink-0">
                      Sell/Buy
                    </div>
                    <div className="w-[70px] p-2 text-center flex-shrink-0">
                      Volume
                    </div>
                    <div className="w-[70px]  p-2 text-center flex-shrink-0">
                      Margin
                    </div>
                    <div className="w-[85px]  p-2 text-center flex-shrink-0">
                      OpeningPrice
                    </div>
                    {activeButton === 3 && (
                      <div className="w-[85px] p-2   text-center flex-shrink-0">
                        ClosingPrice
                      </div>
                    )}
                    {(activeButton === 1 || activeButton === 2) && (
                      <div className="w-[85px]  p-2  text-center flex-shrink-0">
                        CurrentPrice
                      </div>
                    )}
                    {(activeButton === 1 || activeButton === 3) && (
                      <div className="w-[70px]  p-2 text-center flex-shrink-0">
                        Profit
                      </div>
                    )}
                    {activeButton === 1 && (
                      <div className="w-[85px] p-2  text-center flex-shrink-0">
                        CloseTrade
                      </div>
                    )}
                    {(activeButton === 1 || activeButton === 3) && (
                      <div className="w-[115px] p-2 text-center flex-shrink-0">
                        OpeningTime
                      </div>
                    )}
                    {activeButton === 3 && (
                      <div className="w-[115px]   p-2 text-center  ">
                        ClosingTime
                      </div>
                    )}
                    <div className="w-[70px]  p-2 text-center ">TakeProfit</div>
                    <div className="w-[70px]  p-2  text-center">StopLoss</div>
                  </div>

                  {openTrades.length === 0 && activeButton === 1 ? (
                    <div className="text-center text-slate-600 text-lg p-3">
                      No Open Trade
                    </div>
                  ) : openTrades.length > 0 && activeButton === 1 ? (
                    <>
                      {/* Scrollable Table Body */}
                      <div className="flex flex-col">
                        {openTrades
                          .slice() // Create a shallow copy to avoid mutating the original array
                          .reverse() // Reverse the order of trades
                          .map((row, index) => {
                            // Find the profit for the current trade from allProfit
                            const profitData = allProfit.find(
                              (profit) => profit.id === row.id
                            );
                            const profitOrLoss = profitData
                              ? profitData.profit.toFixed(3)
                              : "0.00";

                            // Convert openingTime to desired format
                            const formattedTime = new Date(
                              row.openingTime
                            ).toLocaleString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "numeric",
                              minute: "numeric",
                              second: "numeric",
                              hour12: true,
                            });

                            return (
                              <div key={index} className="flex gap-x-2">
                                <div className="w-[70px] p-2 text-center">
                                  {row.symbol}
                                </div>
                                <div className="w-[70px] p-2 text-center">
                                  {row.buyOrSell}
                                </div>
                                <div className="w-[70px] p-2 text-center">
                                  {row.unitsOrLots}
                                </div>
                                <div className="w-[70px] p-2 text-center">
                                  {row.margin}
                                </div>
                                <div className="w-[85px] p-2 text-center ">
                                  {row.openingprice}
                                </div>
                                <div className="w-[85px] p-2 text-center ">
                                  {symbolPrice}
                                </div>
                                <div className="w-[70px] p-2 text-center ">
                                  <span
                                    className={`${
                                      profitOrLoss < 0
                                        ? "text-red-500"
                                        : "text-green-600"
                                    }`}
                                  >
                                    {profitOrLoss > 0 ? "+" : null}
                                    {profitOrLoss}
                                  </span>
                                </div>
                                <div className="w-[85px] p-2 text-center ">
                                  <button
                                    onClick={() => {
                                      closeTradeFunc(row.id, profitOrLoss);
                                    }}
                                    className={`h-6 rounded-full w-[60px] ${
                                      row.buyOrSell === "buy"
                                        ? "bg-blue-700 hover:bg-blue-600"
                                        : "bg-red-700 hover:bg-red-500"
                                    }`}
                                  >
                                    Close
                                  </button>
                                </div>
                                <div className="w-[115px] p-2 text-[12px] whitespace-nowrap">
                                  {formattedTime}
                                </div>
                                {row.takeProfitValue === null ? (
                                  <div className="w-[70px] p-2 text-center">
                                    - - - -
                                  </div>
                                ) : (
                                  <div className="w-[70px] p-2 text-center ">
                                    {row.takeProfitValue}
                                  </div>
                                )}
                                {row.stopLossValue === null ? (
                                  <div className="w-[70px] p-2 text-center">
                                    - - - -
                                  </div>
                                ) : (
                                  <div className="w-[70px] p-2 text-center">
                                    {row.stopLossValue}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                      </div>
                    </>
                  ) : null}

                  {pendingTrades.length === 0 && activeButton === 2 ? (
                    <div className="text-center text-slate-600 text-lg p-3">
                      No Pending Trades
                    </div>
                  ) : pendingTrades.length > 0 && activeButton === 2 ? (
                    <>
                      <div>
                        {pendingTrades
                          .slice() // Create a shallow copy of the array to avoid mutating the state directly
                          .sort(
                            (a, b) =>
                              new Date(b.closingTime) - new Date(a.closingTime)
                          ) // Sort in descending order by closingTime
                          .map((row, index) => {
                            const openformattedTime = new Date(
                              row.openingTime
                            ).toLocaleString();
                            const closedformattedTime = new Date(
                              row.closingTime
                            ).toLocaleString();
                            return (
                              <div key={index} className="flex gap-x-2">
                                <div className="w-[70px] p-2 text-center">
                                  {row.symbol}
                                </div>
                                <div className="w-[70px] p-2 text-center">
                                  {row.buyOrSell}
                                </div>
                                <div className="w-[70px] p-2 text-center">
                                  {row.unitsOrLots}
                                </div>
                                <div className="w-[70px] p-2 text-center">
                                  {row.margin}
                                </div>
                                <div className="w-[85px] p-2 text-center ">
                                  {row.openingprice}
                                </div>
                                <div className="w-[85px] p-2 text-center ">
                                  {symbolPrice}
                                </div>
                                {row.takeProfitValue === null ? (
                                  <div className="w-[70px] p-2 text-center ">
                                    - - - -
                                  </div>
                                ) : (
                                  <div className="w-[70px] p-2 text-center ">
                                    {row.takeProfitValue}
                                  </div>
                                )}
                                {row.stopLossValue === null ? (
                                  <div className="w-[70px] p-2 text-center ">
                                    - - - -
                                  </div>
                                ) : (
                                  <div className="w-[70px] p-2 text-center ">
                                    {row.stopLossValue}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                      </div>
                    </>
                  ) : null}

                  {closedTrades.length === 0 && activeButton === 3 ? (
                    <div className="text-center text-slate-600 text-lg p-3">
                      No Trade History
                    </div>
                  ) : closedTrades.length > 0 && activeButton === 3 ? (
                    <div>
                      {closedTrades
                        .slice() // Create a shallow copy of the array to avoid mutating the state directly
                        .sort(
                          (a, b) =>
                            new Date(b.closingTime) - new Date(a.closingTime)
                        ) // Sort in descending order by closingTime
                        .map((row, index) => {
                          const openformattedTime = new Date(
                            row.openingTime
                          ).toLocaleString();
                          const closedformattedTime = new Date(
                            row.closingTime
                          ).toLocaleString();
                          return (
                            <div key={index} className="flex gap-x-2 ">
                              <div className="w-[70px] p-2 text-center">
                                {row.symbol}
                              </div>
                              <div className="w-[70px] p-2 text-center">
                                {row.buyOrSell}
                              </div>
                              <div className="w-[70px] p-2 text-center">
                                {row.unitsOrLots}
                              </div>
                              <div className="w-[70px] p-2 text-center">
                                {row.margin}
                              </div>
                              <div className="w-[85px] p-2 text-center">
                                {row.openingprice}
                              </div>
                              <div className="w-[85px] p-2 text-center ">
                                {row.closingPrice}
                              </div>
                              <div className="w-[70px] p-2 text-center">
                                <span
                                  className={` ${
                                    row.profitOrLoss < 0
                                      ? "text-red-500"
                                      : "text-green-600"
                                  }`}
                                >
                                  {row.profitOrLoss > 0 ? "+" : null}
                                  {row.profitOrLoss}
                                </span>
                              </div>
                              <div className="w-[115px] p-2  text-[10px] whitespace-nowrap">
                                {openformattedTime}
                              </div>
                              <div className="w-[115px] p-2 text-[10px] whitespace-nowrap">
                                {closedformattedTime}
                              </div>
                              {row.takeProfitValue === null ? (
                                <div className="w-[70px] p-2 text-center">
                                  - - - -
                                </div>
                              ) : (
                                <div className="w-[70px] p-2 text-center">
                                  {row.takeProfitValue}
                                </div>
                              )}
                              {row.stopLossValue === null ? (
                                <div className="w-[70px] p-2 text-center">
                                  - - - -
                                </div>
                              ) : (
                                <div className="w-[70px] p-2 text-center">
                                  {row.stopLossValue}
                                </div>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* div 3 */}
        <div className="flex items-center border-l-4 border-slate-600 border-box flex-col lg:w-[15vw] w-[100vw] h-[40vh] lg:h-[92vh] bg-zinc-950 ">
          <div className="absolute top-15 ">
            <p
              className={` text-slate-300 p-2  text-base ${
                symbol ? "" : "invisible"
              }  ${isGameOver === true ? "opacity-50" : ""}`}
            >
              {symbol ? symbol.toUpperCase() : "Placeholder"}
            </p>
          </div>

          <div className="flex justify-between w-[90%] h-[80px] mt-10">
            <button
              onClick={() => handleSelectClick("sell")}
              className={`transition-colors duration-50 p-3 w-[45%] h-full rounded-lg border-2  text-center ${
                selectButton === "sell"
                  ? "bg-red-600 text-white border-red-500"
                  : "bg-gray-950 text-red-400 border-red-600"
              } hover:bg-red-600 hover:text-slate-100`}
            >
              <span>Sell </span>
              <br />
              {latestTradeData
                ? latestTradeData.price // Display the price directly
                : ""}
            </button>
            <button
              onClick={() => handleSelectClick("buy")}
              className={`transition-colors duration-50 p-3 w-[45%] h-full rounded-lg border-2 text-center ${
                selectButton === "buy"
                  ? "bg-blue-600 text-white border-blue-500"
                  : "bg-gray-950 text-blue-400 border-blue-600"
              } hover:bg-blue-600 hover:text-slate-100`}
            >
              <span>Buy </span>
              <br />
              {latestTradeData
                ? latestTradeData.price // Display the price directly
                : ""}
            </button>
          </div>
          <div className="flex w-[90%] h-[80px] text-white items-center bg-slate-900 mt-5">
            <div className="w-[70%] flex ml-2 justify-between">
              <input
                className="w-16 text-slate-200 bg-slate-900 h-12 no-spinner"
                placeholder="0.01"
                step="0.01"
                type="number"
                inputMode="decimal"
                value={inputValue}
                onChange={handleInputChange}
                onBlur={handleBlur}
                style={{
                  border: "none",
                  outline: "none",
                  MozAppearance: "textfield", // Specific for Firefox
                }}
              />

              {/* Units selecting Buttons */}
              <div
                className={`relative cursor-pointer  flex items-center" ${
                  isGameOver === true ? "opacity-50" : ""
                }`}
              >
                <span className="mt-3">units</span>
                <button className="ml-3 text-xs mt-1 bg-slate-900">▽</button>
              </div>
            </div>
            <div className="w-[25%] flex flex-col text-2xl ml-4 font-semibold mr-1">
              <button
                onClick={handleIncrease}
                className="ring-2 text-[#FEEC37] mb-1 hover:bg-slate-700"
              >
                +
              </button>
              <button
                onClick={handleDecrease}
                className="ring-2 text-[#6EC207] hover:bg-slate-700 "
              >
                -
              </button>
            </div>
          </div>

          <div className="pending flex flex-col items-center w-[90%] h-auto mt-1">
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
              <div className="dropdown-content  bg-zinc-950 text-white rounded w-full -mb-4 -mt-1">
                <div className="flex border-2 border-slate-600 rounded w-[100%] h-[32px]">
                  <div className="w-[60%] h-[100%] text-sm flex items-center justify-between">
                    <input
                      className="ml-1 bg-zinc-950  w-20 border-none outline-none"
                      type="number"
                      inputMode="decimal"
                      placeholder={`${pendingValue}`}
                      value={pendingValue}
                      style={{
                        border: "none",
                        outline: "none",
                        MozAppearance: "textfield", // Specific for Firefox
                      }}
                      onChange={(e) => {
                        const newValue = Number(e.target.value);
                        if (newValue >= 0) {
                          setPendingValue(newValue);
                        }
                      }}
                    />
                    <span className="mr-1">USD</span>
                  </div>
                  <button
                    onClick={decreasePendingValue}
                    className="w-[20%] h-[100%] border-l-2 border-slate-600 text-xl flex items-center justify-center hover:bg-gray-800"
                  >
                    -
                  </button>
                  <button
                    onClick={increasePendingValue}
                    className="w-[20%] h-[100%] border-l-2 border-slate-600 text-xl flex items-center justify-center hover:bg-gray-800"
                  >
                    +
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="Take Profit flex flex-col items-center w-[90%] h-auto mt-2">
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
              <div className="dropdown-content bg-zinc-950  text-white rounded w-full -mb-4 -mt-1">
                <div className="flex border-2 border-slate-600  rounded w-[100%] h-[32px]">
                  <div className="w-[60%] h-[100%] text-sm flex items-center justify-between">
                    <input
                      className="ml-1 bg-zinc-950 w-20 border-none outline-none"
                      type="number"
                      inputMode="decimal"
                      placeholder={takeProfitValue === "" ? "" : "0"} // Empty placeholder when input is cleared
                      value={takeProfitValue || ""}
                      style={{
                        border: "none",
                        outline: "none",
                        MozAppearance: "textfield", // Specific for Firefox
                      }}
                      onChange={(e) => {
                        const newValue = e.target.value;
                        // If the value is empty, set it to an empty string, otherwise set the number
                        if (newValue === "" || !isNaN(Number(newValue))) {
                          setTakeProfitValue(newValue);
                        }
                      }}
                    />

                    <span className="mr-1">USD</span>
                  </div>
                  <button
                    onClick={decreasetakeProfit}
                    className="w-[20%] h-[100%] border-l-2 border-slate-600 text-xl flex items-center justify-center hover:bg-gray-800"
                  >
                    -
                  </button>
                  <button
                    onClick={increasetakeProfit}
                    className="w-[20%] h-[100%] border-l-2 border-slate-600 text-xl flex items-center justify-center hover:bg-gray-800"
                  >
                    +
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="Stop Loss flex flex-col items-center w-[90%]  h-auto mt-2">
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
              <div className="dropdown-content bg-zinc-950 text-white   w-full -mb-4 -mt-1">
                <div className="flex border-2 rounded border-slate-600 w-[100%] h-[32px]">
                  <div className="w-[60%] h-[100%] text-sm flex items-center justify-between">
                    <input
                      className="ml-1 bg-zinc-950 w-20 border-none outline-none"
                      type="number"
                      inputMode="decimal"
                      placeholder={stopLossValue === "" ? "" : "0"} // Empty placeholder when input is cleared
                      value={stopLossValue || ""}
                      style={{
                        border: "none",
                        outline: "none",
                        MozAppearance: "textfield", // Specific for Firefox
                      }}
                      onChange={(e) => {
                        const newValue = e.target.value;
                        // If the value is empty, set it to an empty string, otherwise set the number
                        if (newValue === "" || !isNaN(Number(newValue))) {
                          setStopLossValue(newValue);
                        }
                      }}
                    />

                    <span className="mr-1">USD</span>
                  </div>
                  <button
                    onClick={decreaseStopLoss}
                    className="w-[20%] h-[100%] border-l-2 border-slate-600 text-xl flex items-center justify-center hover:bg-zinc-800 "
                  >
                    -
                  </button>
                  <button
                    onClick={increaseStopLoss}
                    className="w-[20%] h-[100%] border-l-2 border-slate-600 text-xl flex items-center justify-center hover:bg-zinc-800"
                  >
                    +
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            className={`flex items-center justify-center mt-8 w-[90%] rounded h-[60px] text-slate-900 
        ${
          units === 0 || selectButton === null
            ? "bg-slate-500 cursor-not-allowed"
            : selectButton === "sell"
            ? "bg-red-500 text-white"
            : selectButton === "buy"
            ? "bg-blue-600 text-white"
            : "bg-slate-500"
        }`}
            disabled={units === 0 || selectButton === null} // Disable button if units are 0 or no active button
            onClick={placeTradeFunction}
          >
            <span className="text-base">
              {units === 0 || selectButton === null
                ? "Select Buy/Sell"
                : selectButton === "sell"
                ? `Sell ${units} units`
                : selectButton === "buy"
                ? `Buy ${units} units`
                : "Select Buy/Sell"}
            </span>
          </button>

          {selectButton &&
            units > 0 && ( // Only show second button when selectButton is set and units are greater than 0
              <button
                onClick={() => {
                  setSelectButton(null);
                }}
                className={`text-white w-[90%] mt-2 rounded p-2 
            ${
              selectButton === "sell"
                ? "border-2 border-red-400 hover:bg-zinc-800"
                : selectButton === "buy"
                ? "border-2 border-blue-500 hover:bg-zinc-800"
                : null
            }`}
              >
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
              <span>{leverageValue}</span>
            </div>
            <div className="flex justify-between items-center w-[90%]">
              <span className="mb-2">Margin: </span>
              <span>-</span>
            </div>
          </div>
          {showAlert && (
            <div className="absolute right-0 bottom-2 flex justify-center items-center z-40">
              <p className="w-56 min-h-16 max-h-32 p-2 flex justify-center items-center text-center rounded-lg text-base text-white bg-black shadow-lg border-2 border-slate-400 overflow-hidden break-words">
                {alertMessage}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
