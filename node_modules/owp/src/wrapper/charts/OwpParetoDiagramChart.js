import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { get, isEmpty, isEqual, merge, sum } from 'lodash';
import React, { useCallback, useEffect, useRef } from 'react';
import shortId from 'shortid';

function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
}

function prepareParetoData(data, valueKey) {
    const total = sum(data.map((d) => get(d, valueKey, 0)));

    const { mergeData } = data.reduce(({ sumValue = 0, mergeData = [] } = {}, item) => {
        const _sumValue = sumValue + get(item, valueKey, 0);
        mergeData.push({ ...item, pareto: (_sumValue / total) * 100 });
        return {
            sumValue: _sumValue,
            mergeData,
        };
    }, {});

    return mergeData || data;
}

function ParetoDiagramChart({
    useAnimated,
    useInsideLabel,
    useScrollbar,
    id,
    height,
    style,
    categoryKeyName,
    valueKeyName,
    valueTitle,
    paretoValueTitle,
    categoryAxisProps,
    valueAxisProps,
    paretoValueAxisProps,
    columnSeriesProps,
    paretoSeriesProps,
    data,
}) {
    const chartInstance = useRef(null);
    const prevData = usePrevious(data);

    const createChart = useCallback(
        () =>
            new Promise((resolve, reject) => {
                try {
                    const chart = am4core.create(id, am4charts.XYChart);

                    if (useScrollbar) {
                        chart.scrollbarX = new am4core.Scrollbar();
                    }

                    chart.data = prepareParetoData(data, valueKeyName);

                    // Create axes
                    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
                    categoryAxis.dataFields.category = categoryKeyName;
                    categoryAxis.renderer.grid.template.location = 0;
                    categoryAxis.renderer.minGridDistance = 60;

                    if (useInsideLabel) {
                        categoryAxis.renderer.labels.template.rotation = -90;
                        categoryAxis.renderer.labels.template.horizontalCenter = 'left';
                        categoryAxis.renderer.inside = true;
                    }

                    categoryAxis.tooltip.disabled = true;

                    if (!isEmpty(categoryAxisProps)) {
                        categoryAxis = merge(categoryAxis, categoryAxisProps);
                    }

                    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
                    valueAxis.renderer.minWidth = 50;
                    valueAxis.min = 0;
                    valueAxis.title.text = valueTitle;
                    valueAxis.cursorTooltipEnabled = false;

                    if (!isEmpty(valueAxisProps)) {
                        valueAxis = merge(valueAxis, valueAxisProps);
                    }

                    // Create series
                    let series = chart.series.push(new am4charts.ColumnSeries());
                    series.sequencedInterpolation = true;
                    series.dataFields.valueY = valueKeyName;
                    series.dataFields.categoryX = categoryKeyName;

                    series.tooltipText = '[{categoryX}: bold]{valueY}[/]';
                    series.columns.template.strokeWidth = 0;

                    series.tooltip.pointerOrientation = 'vertical';

                    series.columns.template.column.cornerRadiusTopLeft = 10;
                    series.columns.template.column.cornerRadiusTopRight = 10;
                    series.columns.template.column.fillOpacity = 0.8;

                    if (!isEmpty(columnSeriesProps)) {
                        series = merge(series, columnSeriesProps);
                    }

                    // on hover, make corner radiuses bigger
                    let hoverState = series.columns.template.column.states.create('hover');
                    hoverState.properties.cornerRadiusTopLeft = 0;
                    hoverState.properties.cornerRadiusTopRight = 0;
                    hoverState.properties.fillOpacity = 1;

                    series.columns.template.adapter.add('fill', function (fill, target) {
                        return chart.colors.getIndex(target.dataItem.index);
                    });

                    let paretoValueAxis = chart.yAxes.push(new am4charts.ValueAxis());
                    paretoValueAxis.renderer.opposite = true;
                    paretoValueAxis.min = 0;
                    paretoValueAxis.max = 100;
                    paretoValueAxis.title.text = paretoValueTitle;
                    paretoValueAxis.strictMinMax = true;
                    paretoValueAxis.renderer.grid.template.disabled = true;
                    paretoValueAxis.numberFormatter = new am4core.NumberFormatter();
                    paretoValueAxis.numberFormatter.numberFormat = "#'%'";
                    paretoValueAxis.cursorTooltipEnabled = false;

                    if (!isEmpty(paretoValueAxisProps)) {
                        paretoValueAxis = merge(paretoValueAxis, paretoValueAxisProps);
                    }

                    let paretoSeries = chart.series.push(new am4charts.LineSeries());
                    paretoSeries.dataFields.valueY = 'pareto';
                    paretoSeries.dataFields.categoryX = categoryKeyName;
                    paretoSeries.yAxis = paretoValueAxis;
                    paretoSeries.tooltipText = "{valueY.formatNumber('#.0')}%[/]";
                    paretoSeries.bullets.push(new am4charts.CircleBullet());
                    paretoSeries.strokeWidth = 2;
                    paretoSeries.stroke = new am4core.InterfaceColorSet().getFor(
                        'alternativeBackground'
                    );
                    paretoSeries.strokeOpacity = 0.5;

                    if (!isEmpty(paretoSeriesProps)) {
                        paretoSeries = merge(paretoSeries, paretoSeriesProps);
                    }

                    if (useScrollbar) {
                        chart.cursor = new am4charts.XYCursor();
                        chart.cursor.behavior = 'panX';
                    }

                    resolve(chart);
                } catch (error) {
                    console.error(error);
                    reject(error);
                }
            }),
        [
            columnSeriesProps,
            data,
            id,
            paretoSeriesProps,
            useInsideLabel,
            useScrollbar,
            categoryKeyName,
            categoryAxisProps,
            valueKeyName,
            valueAxisProps,
            valueTitle,
            paretoValueAxisProps,
            paretoValueTitle,
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
                    console.log('chart.create.pareto');
                    chartInstance.current = await createChart();
                }
            } catch (error) {
                console.error(error);
            }
        });

        return () => {
            isUnmount = true;
            if (get(chartInstance.current, 'dispose')) {
                console.log('dispose.pareto');
                chartInstance.current.dispose();
            }
        };
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (!isEmpty(chartInstance.current) && !isEqual(data, prevData)) {
            chartInstance.current.data = prepareParetoData(data, valueKeyName);
        }
    }, [data, prevData, valueKeyName]);

    return <div id={id} style={{ height, ...style }} />;
}

ParetoDiagramChart.defaultProps = {
    id: `pareto-diagram-chart-${shortId()}`,
    height: 500,
    style: {},
    useScrollbar: true,
    useAnimated: true,
    useInsideLabel: true,
    data: [],
    categoryKeyName: 'category',
    valueKeyName: 'value',
    valueTitle: '',
    paretoValueTitle: '',
    categoryAxisProps: {},
    valueAxisProps: {},
    paretoValueAxisProps: {},
    columnSeriesProps: {},
    paretoSeriesProps: {},
};

export default ParetoDiagramChart;
