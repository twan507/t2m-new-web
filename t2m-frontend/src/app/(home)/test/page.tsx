'use client'
import React from 'react';
import CandleChart from './candle_chart';
import AreaChart from './area_chart';

const HomePage: React.FC = () => {
    return (
        <div>
            <h1>Candlestick Chart</h1>
            <CandleChart />
            <AreaChart />
        </div>
    );
};

export default HomePage;
