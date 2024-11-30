"use client"


import Head from 'next/head';
import TradingViewChart from '../components/ChartComponent';
import Terminal from '../components/newterminal';

export default function TradingViewPage() {
    return (
        <div>
            <Terminal/>
        </div>
    );
}
