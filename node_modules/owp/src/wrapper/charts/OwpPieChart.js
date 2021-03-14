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

function PieChart({
    id,
    useAnimated,
    height,
    style,
    disableLabels,
    disableTicks,
    useLegend,
    useShare,
    useSemiCircle,
    alignLabels,
    unitText,
    innerRadius,
    labelProps,
    labelText,
    valueKeyName,
    categoryKeyName,
    pieSeriesProps,
    legendProps,
    data,
}) {
    const chartInstance = useRef(null);
    const labelInstance = useRef(null);

    const prevLabelText = usePrevious(labelText);
    const prevLabelProps = usePrevious(labelProps);
    const prevData = usePrevious(data);

    const createChart = useCallback(
        () =>
            new Promise((resolve, reject) => {
                try {
                    if (isEmpty(id)) {
                        resolve(null);
                        return;
                    }

                    const chart = am4core.create(id, am4charts.PieChart);
                    chart.data = data;

                    chart.innerRadius = am4core.percent(innerRadius);

                    if (useSemiCircle) {
                        chart.radius = am4core.percent(70);
                        chart.startAngle = 180;
                        chart.endAngle = 360;
                    }

                    if (innerRadius > 0) {
                        let label = chart.seriesContainer.createChild(am4core.Label);
                        label.text = labelText;
                        label.horizontalCenter = 'middle';
                        label.verticalCenter = useSemiCircle ? 'bottom' : 'middle';
                        label.fontSize = 50;

                        if (!isEmpty(labelProps)) {
                            label = merge(label, labelProps);
                        }

                        labelInstance.current = label;
                    }

                    let pieSeries = chart.series.push(new am4charts.PieSeries());
                    pieSeries.dataFields.value = valueKeyName;
                    pieSeries.dataFields.category = categoryKeyName;

                    // TODO: dragging & radius 가 필요하다면...
                    // pieSeries.slices.template.cornerRadius = 10;
                    // pieSeries.slices.template.innerCornerRadius = 7;
                    // pieSeries.slices.template.draggable = true;
                    // pieSeries.slices.template.inert = true;
                    // pieSeries.alignLabels = false;

                    pieSeries.slices.template.stroke = am4core.color('#fff');
                    pieSeries.slices.template.strokeWidth = 2;
                    pieSeries.slices.template.strokeOpacity = 1;

                    pieSeries.labels.template.text = `{category}: {value.value}${unitText} ${
                        useShare ? "({value.percent.formatNumber('#.0')}%)" : ''
                    }`;
                    pieSeries.slices.template.tooltipText = `{category}: {value.value}${unitText} ${
                        useShare ? "({value.percent.formatNumber('#.0')}%)" : ''
                    }`;

                    if (!alignLabels) {
                        pieSeries.alignLabels = false;
                        pieSeries.labels.template.bent = true;
                        pieSeries.labels.template.radius = 3;
                        pieSeries.labels.template.padding(0, 0, 0, 0);

                        // pieSeries.hiddenInLegend = false;

                        // this makes labels to be hidden if they don't fit
                        pieSeries.labels.template.truncate = true;
                        pieSeries.labels.template.hideOversized = true;
                    }

                    pieSeries.labels.template.disabled = disableLabels;
                    pieSeries.ticks.template.disabled = !alignLabels || disableTicks;

                    if (useAnimated) {
                        pieSeries.hiddenState.properties.opacity = 1;
                        pieSeries.hiddenState.properties.endAngle = useSemiCircle ? 90 : -90;
                        pieSeries.hiddenState.properties.startAngle = useSemiCircle ? 90 : -90;
                    }

                    if (!isEmpty(pieSeriesProps)) {
                        pieSeries = merge(pieSeries, pieSeriesProps);
                    }

                    if (useLegend) {
                        chart.legend = new am4charts.Legend();
                        chart.legend.valueLabels.template.text = `{value.value}${unitText} ${
                            useShare ? "({value.percent.formatNumber('#.0')}%)" : ''
                        }`;

                        if (!isEmpty(legendProps)) {
                            chart.legend = merge(chart.legend, legendProps);
                        }
                    }

                    resolve(chart);
                } catch (error) {
                    console.error(error);
                    reject(error);
                }
            }),
        [
            alignLabels,
            categoryKeyName,
            data,
            disableLabels,
            disableTicks,
            id,
            innerRadius,
            labelProps,
            labelText,
            legendProps,
            pieSeriesProps,
            unitText,
            useAnimated,
            useLegend,
            useSemiCircle,
            useShare,
            valueKeyName,
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
                    console.log('chart.create.pie');
                    chartInstance.current = await createChart();
                }
            } catch (error) {
                console.error(error);
            }
        });

        return () => {
            isUnmount = true;
            if (get(chartInstance.current, 'dispose')) {
                console.log('dispose.pie');
                chartInstance.current.dispose();
            }
        };
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (!isEmpty(labelInstance.current)) {
            if (labelText !== prevLabelText) {
                labelInstance.current.text = labelText;
            }

            if (!isEqual(labelProps, prevLabelProps)) {
                labelInstance.current = merge(labelInstance.current, labelProps);
            }
        }
    }, [labelProps, labelText, prevLabelProps, prevLabelText]);

    useEffect(() => {
        if (!isEmpty(chartInstance.current) && !isEqual(data, prevData)) {
            chartInstance.current.data = data;
        }
    }, [data, prevData]);

    return <div id={id} style={{ height, ...style }} />;
}

PieChart.defaultProps = {
    id: `pie-chart-${shortId()}`,
    useAnimated: true,
    height: 500,
    style: {},
    disableLabels: false,
    disableTicks: false,
    useLegend: true,
    useShare: true,
    useSemiCircle: false,
    alignLabels: true,
    unitText: '',
    innerRadius: 40,
    labelText: '',
    labelProps: {},
    pieSeriesProps: {},
    legendProps: {},
    valueKeyName: 'value',
    categoryKeyName: 'category',
};

export default PieChart;
