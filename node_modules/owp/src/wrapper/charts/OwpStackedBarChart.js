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

function StackedBarChart({
    id,
    useAnimated,
    height,
    style,
    labels,
    numberFormat,
    unitText,
    minValueKeyName,
    maxValueKeyName,
    categoryKeyName,
    data,
    categoryAxisProps,
    valueAxisProps,
    minBarSeriesProps,
    maxBarSeriesProps,
}) {
    const chartInstance = useRef(null);
    const prevData = usePrevious(data);

    const createChart = useCallback(
        () =>
            new Promise((resolve, reject) => {
                try {
                    if (isEmpty(id)) {
                        resolve(null);
                        return;
                    }

                    const chart = am4core.create(id, am4charts.XYChart);
                    chart.data = data;

                    // Use only absolute numbers
                    chart.numberFormatter.numberFormat = numberFormat;

                    // Create axes
                    let categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
                    categoryAxis.dataFields.category = categoryKeyName;
                    categoryAxis.renderer.grid.template.location = 0;
                    categoryAxis.renderer.inversed = true;

                    if (!isEmpty(categoryAxisProps)) {
                        categoryAxis = merge(categoryAxis, categoryAxisProps);
                    }

                    const minLabelText = get(labels, 'min', '하한');
                    const maxLabelText = get(labels, 'max', '상한');

                    const minLabelProps = get(labels, 'minProps');
                    const maxLabelProps = get(labels, 'maxProps');

                    let valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
                    valueAxis.extraMin = 0.1;
                    valueAxis.extraMax = 0.1;
                    valueAxis.renderer.minGridDistance = 40;
                    valueAxis.renderer.ticks.template.length = 5;
                    valueAxis.renderer.ticks.template.disabled = false;
                    valueAxis.renderer.ticks.template.strokeOpacity = 0.4;
                    valueAxis.renderer.labels.template.adapter.add('text', function (text) {
                        return `${text}${[minLabelText, maxLabelText].includes(text) ? '' : unitText}`;
                    });

                    if (!isEmpty(valueAxisProps)) {
                        valueAxis = merge(valueAxis, valueAxisProps);
                    }

                    // Create series
                    let min = chart.series.push(new am4charts.ColumnSeries());
                    min.dataFields.valueX = minValueKeyName;
                    min.dataFields.categoryY = categoryKeyName;
                    min.clustered = false;

                    if (!isEmpty(minBarSeriesProps)) {
                        min = merge(min, minBarSeriesProps);
                    }

                    let minLabel = min.bullets.push(new am4charts.LabelBullet());
                    minLabel.label.text = `{valueX}${unitText}`;
                    minLabel.label.hideOversized = false;
                    minLabel.label.truncate = false;
                    minLabel.label.horizontalCenter = 'right';
                    minLabel.label.dx = -10;

                    if (!isEmpty(minLabelProps)) {
                        minLabel = merge(minLabel, minLabelProps);
                    }

                    let max = chart.series.push(new am4charts.ColumnSeries());
                    max.dataFields.valueX = maxValueKeyName;
                    max.dataFields.categoryY = categoryKeyName;
                    max.clustered = false;

                    if (!isEmpty(maxBarSeriesProps)) {
                        max = merge(max, maxBarSeriesProps);
                    }

                    let maxLabel = max.bullets.push(new am4charts.LabelBullet());
                    maxLabel.label.text = `{valueX}${unitText}`;
                    maxLabel.label.hideOversized = false;
                    maxLabel.label.truncate = false;
                    maxLabel.label.horizontalCenter = 'left';
                    maxLabel.label.dx = 10;

                    if (!isEmpty(maxLabelProps)) {
                        maxLabel = merge(maxLabel, maxLabelProps);
                    }

                    let minRange = valueAxis.axisRanges.create();
                    minRange.value = -10;
                    minRange.endValue = 0;
                    minRange.label.text = minLabelText;
                    minRange.label.fill = chart.colors.list[0];
                    minRange.label.dy = 20;
                    minRange.label.fontWeight = '600';
                    minRange.grid.strokeOpacity = 1;
                    minRange.grid.stroke = min.stroke;

                    let maxRange = valueAxis.axisRanges.create();
                    maxRange.value = 0;
                    maxRange.endValue = 10;
                    maxRange.label.text = maxLabelText;
                    maxRange.label.fill = chart.colors.list[1];
                    maxRange.label.dy = 20;
                    maxRange.label.fontWeight = '600';
                    maxRange.grid.strokeOpacity = 1;
                    maxRange.grid.stroke = max.stroke;

                    resolve(chart);
                } catch (error) {
                    console.error(error);
                    reject(error);
                }
            }),
        [
            id,
            data,
            numberFormat,
            categoryKeyName,
            categoryAxisProps,
            labels,
            valueAxisProps,
            minValueKeyName,
            minBarSeriesProps,
            unitText,
            maxValueKeyName,
            maxBarSeriesProps,
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
                    console.log('chart.create.stacked.bar');
                    chartInstance.current = await createChart();
                }
            } catch (error) {
                console.error(error);
            }
        });

        return () => {
            isUnmount = true;
            if (get(chartInstance.current, 'dispose')) {
                console.log('dispose.stacked.bar');
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

StackedBarChart.defaultProps = {
    id: `stacked-bar-chart-${shortId()}`,
    useAnimated: true,
    height: 500,
    style: {},
    numberFormat: '#.#s',
    labels: { min: '하한', minProps: {}, max: '상한', maxProps: {} },
    minValueKeyName: 'min',
    maxValueKeyName: 'max',
    categoryKeyName: 'category',
    unitText: '%',
    data: [],
    categoryAxisProps: {},
    valueAxisProps: {},
    minBarSeriesProps: {},
    maxBarSeriesProps: {},
};

export default StackedBarChart;
