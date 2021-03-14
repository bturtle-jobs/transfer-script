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

function ClusteredColumnChart({
    id,
    height,
    style,
    useAnimated,
    useLegend,
    legendProps,
    categoryKeyName,
    columns,
    data,
    categoryAxisProps,
    valueAxisProps,
}) {
    const chartInstance = useRef(null);
    const prevData = usePrevious(data);
    const prevColumns = usePrevious(columns);

    const arrangeColumns = useCallback(({ chart, xAxis }) => {
        let series = chart.series.getIndex(0);

        let w = 1 - xAxis.renderer.cellStartLocation - (1 - xAxis.renderer.cellEndLocation);
        if (series.dataItems.length > 1) {
            let x0 = xAxis.getX(series.dataItems.getIndex(0), 'categoryX');
            let x1 = xAxis.getX(series.dataItems.getIndex(1), 'categoryX');
            let delta = ((x1 - x0) / chart.series.length) * w;
            if (am4core.isNumber(delta)) {
                let middle = chart.series.length / 2;

                let newIndex = 0;
                chart.series.each(function (series) {
                    if (!series.isHidden && !series.isHiding) {
                        series.dummyData = newIndex;
                        newIndex++;
                    } else {
                        series.dummyData = chart.series.indexOf(series);
                    }
                });
                let visibleCount = newIndex;
                let newMiddle = visibleCount / 2;

                chart.series.each(function (series) {
                    let trueIndex = chart.series.indexOf(series);
                    let newIndex = series.dummyData;

                    let dx = (newIndex - trueIndex + middle - newMiddle) * delta;

                    series.animate(
                        { property: 'dx', to: dx },
                        series.interpolationDuration,
                        series.interpolationEasing
                    );
                    series.bulletsContainer.animate(
                        { property: 'dx', to: dx },
                        series.interpolationDuration,
                        series.interpolationEasing
                    );
                });
            }
        }
    }, []);

    const createSeries = useCallback(
        ({
            chart,
            xAxis,
            label,
            valueKeyName,
            bullet: { unitText = '', ...restBulletProps } = {},
        }) => {
            let series = chart.series.push(new am4charts.ColumnSeries());
            series.dataFields.valueY = valueKeyName;
            series.dataFields.categoryX = categoryKeyName;
            series.name = label;

            series.events.on('hidden', () => arrangeColumns({ chart, xAxis }));
            series.events.on('shown', () => arrangeColumns({ chart, xAxis }));

            let bullet = series.bullets.push(new am4charts.LabelBullet());
            bullet.interactionsEnabled = false;
            bullet.dy = 30;
            bullet.label.text = `{valueY}${isEmpty(unitText) ? '' : unitText}`;
            bullet.label.fill = am4core.color('#ffffff');

            if (!isEmpty(restBulletProps)) {
                bullet = merge(bullet, restBulletProps);
            }

            return series;
        },
        [arrangeColumns, categoryKeyName]
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
                    chart.colors.step = 2;

                    chart.data = data;

                    if (useLegend) {
                        chart.legend = new am4charts.Legend();
                        chart.legend.position = 'top';
                        chart.legend.paddingBottom = 20;
                        chart.legend.labels.template.maxWidth = 95;

                        if (!isEmpty(legendProps)) {
                            chart.legend = merge(chart.legend, legendProps);
                        }
                    }

                    let xAxis = chart.xAxes.push(new am4charts.CategoryAxis());
                    xAxis.dataFields.category = categoryKeyName;
                    xAxis.renderer.cellStartLocation = 0.1;
                    xAxis.renderer.cellEndLocation = 0.9;
                    xAxis.renderer.grid.template.location = 0;

                    if (!isEmpty(categoryAxisProps)) {
                        xAxis = merge(xAxis, categoryAxisProps);
                    }

                    let yAxis = chart.yAxes.push(new am4charts.ValueAxis());
                    yAxis.min = 0;

                    if (!isEmpty(valueAxisProps)) {
                        yAxis = merge(yAxis, valueAxisProps);
                    }

                    if (!isEmpty(columns)) {
                        columns.forEach(({ valueKeyName, label, bullet }) =>
                            createSeries({ chart, xAxis, valueKeyName, label, bullet })
                        );
                    }

                    resolve(chart);
                } catch (error) {
                    console.error(error);
                    reject(error);
                }
            }),
        [
            id,
            data,
            useLegend,
            categoryKeyName,
            categoryAxisProps,
            valueAxisProps,
            columns,
            legendProps,
            createSeries,
        ]
    );

    useEffect(() => {
        if (!isEmpty(prevColumns) && !isEmpty(columns) && !isEqual(prevColumns, columns)) {
            if (get(chartInstance.current, 'dispose')) {
                console.log('dispose.clustered.column');
                chartInstance.current.dispose();

                async function resetChart() {
                    chartInstance.current = await createChart();
                }

                resetChart();
            }
        }
        // eslint-disable-next-line
    }, [prevSeries, columns]);

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
                    console.log('chart.create.clustered');
                    chartInstance.current = await createChart();
                }
            } catch (error) {
                console.error(error);
            }
        });

        return () => {
            isUnmount = true;
            if (get(chartInstance.current, 'dispose')) {
                console.log('dispose.clustered');
                chartInstance.current.dispose();
            }
        };
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (!isEmpty(chartInstance.current) && !isEqual(data, prevData)) {
            chartInstance.current.data = data;
        }
    }, [data, prevData]);

    return <div id={id} style={{ height, ...style }} />;
}

ClusteredColumnChart.defaultProps = {
    id: `clustered-chart-${shortId()}`,
    height: 500,
    style: {},
    useAnimated: true,
    useLegend: true,
    legendProps: { position: 'top' },
    categoryKeyName: 'category',
    columns: [],
    data: [],
    categoryAxisProps: {},
    valueAxisProps: {},
};

export default ClusteredColumnChart;
