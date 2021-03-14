import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { get, isEmpty, isEqual, merge } from 'lodash';
import React, { useCallback, useEffect, useRef } from 'react';
import shortId from 'shortid';

function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
}

function OwpBubbleChart({
    id,
    useAnimated,
    height,
    style,
    valueKeyName,
    valueXKeyName,
    valueYKeyName,
    titleKeyName,
    valueLabel,
    valueXLabel,
    valueYLabel,
    valueAxisXProps,
    valueAxisYProps,
    data,
}) {
    const chartInstance = useRef(null);
    const prevData = usePrevious(data);

    const createBubbleNode = useCallback(
        (chart, chartData) => {
            let series = chart.series.push(new am4charts.LineSeries());
            series.dataFields.valueX = valueXKeyName;
            series.dataFields.valueY = valueYKeyName;
            series.dataFields.value = valueKeyName;
            series.strokeOpacity = 0;
            // series.sequencedInterpolation = true;
            // series.tooltip.pointerOrientation = 'vertical';
            series.name = get(chartData, titleKeyName);
            series.fill = get(chartData, 'color');

            series.data = [chartData];

            const bullet = series.bullets.push(new am4charts.CircleBullet());
            bullet.strokeOpacity = 0;
            bullet.radius = 5;
            bullet.strokeWidth = 2;
            bullet.fillOpacity = 0.7;
            bullet.stroke = am4core.color('#ffffff');
            bullet.tooltipText = `[bold]{${titleKeyName}}:[/]\n${valueLabel}: {value.value}\n${valueXLabel}: {valueX.value}\n${valueYLabel}:{valueY.value}`;

            let hoverState = bullet.states.create('hover');
            hoverState.properties.fillOpacity = 1;
            hoverState.properties.strokeOpacity = 1;

            series.heatRules.push({
                target: bullet.circle,
                min: 10,
                max: 60,
                property: 'radius',
            });
        },
        [
            titleKeyName,
            valueKeyName,
            valueLabel,
            valueXKeyName,
            valueXLabel,
            valueYKeyName,
            valueYLabel,
        ]
    );

    const createChart = useCallback(
        () =>
            new Promise((resolve, reject) => {
                try {
                    if (isEmpty(id)) {
                        resolve(null);
                        return;
                    }

                    const chart = am4core.create(id, am4charts.XYChart);
                    chart.colors.step = 3;

                    chart.data = data;

                    let valueAxisX = chart.xAxes.push(new am4charts.ValueAxis());
                    valueAxisX.renderer.minGridDistance = 50;

                    if (!isEmpty(valueAxisXProps)) {
                        valueAxisX = merge(valueAxisX, valueAxisXProps);
                    }

                    let valueAxisY = chart.yAxes.push(new am4charts.ValueAxis());
                    valueAxisY.renderer.minGridDistance = 50;

                    if (!isEmpty(valueAxisYProps)) {
                        valueAxisY = merge(valueAxisY, valueAxisYProps);
                    }

                    // const rangeX = valueAxisX.axisRanges.create();
                    // rangeX.value = 200;
                    // rangeX.grid.stroke = am4core.color('#396478');
                    // rangeX.grid.strokeWidth = 2;
                    // rangeX.grid.strokeOpacity = 1;

                    // const rangeY = valueAxisY.axisRanges.create();
                    // rangeY.value = 200;
                    // rangeY.grid.stroke = am4core.color('#396478');
                    // rangeY.grid.strokeWidth = 2;
                    // rangeY.grid.strokeOpacity = 1;

                    const colorSet = new am4core.ColorSet();

                    chart.data.forEach((d) => {
                        d.color = colorSet.next();
                        createBubbleNode(chart, d);
                    });

                    chart.legend = new am4charts.Legend();

                    resolve(chart);
                } catch (error) {
                    console.error(error);
                    reject(error);
                }
            }),
        [createBubbleNode, data, id, valueAxisXProps, valueAxisYProps]
    );

    useEffect(() => {
        if (!isEmpty(chartInstance.current)) {
            return;
        }

        let isUnmount = false;
        am4core.ready(async () => {
            try {
                if (useAnimated) {
                    am4core.useTheme(am4themes_animated);
                } else {
                    am4core.unuseTheme(am4themes_animated);
                }

                am4core.options.commercialLicense = true;

                if (!isUnmount) {
                    console.log('chart.create.bubble');
                    chartInstance.current = await createChart();
                }
            } catch (error) {
                console.error(error);
            }
        });

        return () => {
            isUnmount = true;
            if (get(chartInstance.current, 'dispose')) {
                console.log('dispose.bubble');
                chartInstance.current.dispose();
            }
        };
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (!isEmpty(chartInstance.current) && !isEqual(data, prevData)) {
            chartInstance.current.series.clear();

            chartInstance.current.data = data;
            const colorSet = new am4core.ColorSet();
            chartInstance.current.data.forEach((d) => {
                d.color = colorSet.next();
                createBubbleNode(chartInstance.current, d);
            });
        }
    }, [createBubbleNode, data, prevData]);

    return <div id={id} style={{ height, ...style }} />;
}

OwpBubbleChart.defaultProps = {
    id: `bubble-chart-${shortId()}`,
    useAnimated: true,
    height: 500,
    style: {},
    valueKeyName: 'value',
    valueXKeyName: 'x',
    valueYKeyName: 'y',
    titleKeyName: 'title',
    valueLabel: 'data',
    valueXLabel: 'x',
    valueYLabel: 'y',
    valueAxisXProps: {},
    valueAxisYProps: {},
};

export default OwpBubbleChart;
