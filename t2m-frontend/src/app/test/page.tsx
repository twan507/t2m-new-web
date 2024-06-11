'use client'
import React from 'react';
import { Slider } from 'antd';

function getGradientColor(percentage: number) {
    const startColor = [225, 64, 64];
    const endColor = [36, 183, 94];

    const midColor = startColor.map((start, i) => {
        const end = endColor[i];
        const delta = end - start;
        return (start + delta * percentage).toFixed(0);
    });

    return `rgb(${midColor.join(',')})`;
}

const App: React.FC = () => {
    const [value, setValue] = React.useState([0, 10]);

    const start = value[0] / 100;
    const end = value[value.length - 1] / 100;

    return (
        <Slider
            range
            defaultValue={value}
            onChange={setValue}
            styles={{
                track: {
                    background: 'transparent',
                },
                tracks: {
                    background: `linear-gradient(to right, ${getGradientColor(start)} 0%, ${getGradientColor(end,)} 100%)`,
                },
            }}
        />
    );
};

export default App;