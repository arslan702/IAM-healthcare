import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { getRelativePosition } from 'chart.js/helpers';

const LineChart = ({ data }) => {
    const chartContainer = useRef(null);

    useEffect(() => {
        const ctx = chartContainer.current;
        const chart = new Chart(ctx, {
            type: 'line',
            data: data,
            options: {
                onClick: (e) => {
                    const canvasPosition = getRelativePosition(e, chart);

                    // Substitute the appropriate scale IDs
                    const dataX = chart.scales.x.getValueForPixel(canvasPosition.x);
                    const dataY = chart.scales.y.getValueForPixel(canvasPosition.y);
                },
            },
        });

        // Cleanup: Destroy the chart when the component is unmounted
        return () => {
            chart.destroy();
        };
    }, [data]);

    return <canvas ref={chartContainer} width="400" height="200"></canvas>;
};

export default LineChart;
