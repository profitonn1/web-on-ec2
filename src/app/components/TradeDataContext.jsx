"use client"

import React, { createContext, useContext, useState } from 'react';

const TradeDataContext = createContext();

export const TradeDataProvider = ({ children }) => {
    const [tradeData, setTradeData] = useState([]);

    return (
        <TradeDataContext.Provider value={{ tradeData, setTradeData }}>
            {children}
        </TradeDataContext.Provider>
    );
};

export const useTradeData = () => {
    return useContext(TradeDataContext);
};
