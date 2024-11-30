"use client"
import { useEffect, useState } from "react"
import { useTradeData } from './components/TradeDataContext';
import axios from "axios";

const StoreSymbolData = () => {
  const { tradeData } = useTradeData();
  const latestTradeData = tradeData[0];

  // useEffect(() => {
  //   let symbolPrice = latestTradeData.price;
  //   let symbol = latestTradeData.symbol;
  
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
  //   }, 1000);
  
  //   // Initial call
  //   storeResponse();
  
  //   // Clean up interval on component unmount
  //   return () => clearInterval(intervalId);
  // }, [latestTradeData.price, latestTradeData.symbol]);
  

  return (
    <div></div>
  )
}

export default DoubleEndedSlider