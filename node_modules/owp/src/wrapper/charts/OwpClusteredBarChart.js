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

function ClusteredBarChart({
    id,
    useAnimated,
    height,
    style,
    categoryTitle,
    valueTitle,
    bars,
    categoryKeyName,
    data,
    categoryAxisProps,
    valueAxisProps,
}) {
    const chartInstance = useRef(null);
    const prevData = usePrevious(data);
    const prevBars = usePrevious(bars);

    const createBar = useCallback(
        ({ chart, valueKeyName: valueX, label: name, color, barProps }) => {
            let series = chart.series.push(new am4charts.ColumnSeries());
            series.dataFields.valueX = valueX;
            series.dataFields.categoryY = categoryKeyName;
            series.name = name;

            if (!isEmpty(color)) {
                series.stroke = color;
                series.fill = color;
            }

            series.columns.template.tooltipText = '{name}: [bold]{valueX}[/]';
            series.columns.template.height = am4core.percent(100);
            series.sequencedInterpolation = true;

            if (!isEmpty(barProps)) {
                series = merge(series, barProps);
            }

            let valueLabel = series.bullets.push(new am4charts.LabelBullet());
            valueLabel.label.text = '{valueX}';
            valueLabel.label.horizontalCenter = 'left';
            valueLabel.label.dx = 10;
            valueLabel.label.hideOversized = false;
            valueLabel.label.truncate = false;

            let categoryLabel = series.bullets.push(new am4charts.LabelBullet());
            categoryLabel.label.text = '{name}';
            categoryLabel.label.horizontalCenter = 'right';
            categoryLabel.label.dx = -10;
            categoryLabel.label.fill = am4core.color('#fff');
            categoryLabel.label.hideOversized = false;
            categoryLabel.label.truncate = false;
        },
        [categoryKeyName]
    );

    const createChart = useCallback(
        () =>
            new Promise((resolve, reject) => {
                try {
                    if (isEmpty(id) || isEmpty(bars)) {
                        resolve(null);
                        return;
                    }

                    const chart = am4core.create(id, am4charts.XYChart);
                    chart.data = data;

                    // Create axes
                    let categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
                    categoryAxis.dataFields.category = categoryKeyName;
                    categoryAxis.numberFormatter.numberFormat = '#';
                    categoryAxis.renderer.inversed = true;
                    categoryAxis.renderer.grid.template.location = 0;
                    categoryAxis.renderer.cellStartLocation = 0.1;
                    categoryAxis.renderer.cellEndLocation = 0.9;
                    categoryAxis.title.text = categoryTitle;

                    if (!isEmpty(categoryAxisProps)) {
                        categoryAxis = merge(categoryAxis, categoryAxisProps);
                    }

                    let valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
                    valueAxis.title.text = valueTitle;
                    valueAxis.renderer.opposite = true;

                    if (!isEmpty(valueAxisProps)) {
                        valueAxis = merge(valueAxis, valueAxisProps);
                    }

                    bars.forEach((barProps) => {
                        createBar({ chart, ...barProps });
                    });

                    resolve(chart);
                } catch (error) {
                    console.error(error);
                    reject(error);
                }
            }),
        [
            id,
            bars,
            data,
            categoryKeyName,
            categoryTitle,
            categoryAxisProps,
            valueTitle,
            valueAxisProps,
            createBar,
        ]
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
                    console.log('chart.create.clustered.bar');
                    chartInstance.current = await createChart();
                }
            } catch (error) {
                console.error(error);
            }
        });

        return () => {
            isUnmount = true;
            if (get(chartInstance.current, 'dispose')) {
                console.log('dispose.bar');
                chartInstance.current.dispose();
            }
        };
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (!isEmpty(prevBars) && !isEmpty(bars) && !isEqual(prevBars, bars)) {
            if (get(chartInstance.current, 'dispose')) {
                chartInstance.current.dispose();

                async function resetChart() {
                    chartInstance.current = await createChart();
                }

                resetChart();
            }
        }
        // eslint-disable-next-line
    }, [prevBars, bars]);

    useEffect(() => {
        if (!isEmpty(chartInstance.current) && !isEqual(data, prevData)) {
            chartInstance.current.data = data;
        }
    }, [data, prevData]);

    return <div id={id} style={{ height, ...style }} />;
}

ClusteredBarChart.defaultProps = {
    id: `bar-chart-${shortId()}`,
    useAnimated: true,
    height: 500,
    style: {},
    categoryTitle: '',
    categoryKeyName: 'category',
    valueTitle: '',
    bars: [],
    data: [],
    categoryAxisProps: {},
    valueAxisProps: {},
};

export default ClusteredBarChart;
