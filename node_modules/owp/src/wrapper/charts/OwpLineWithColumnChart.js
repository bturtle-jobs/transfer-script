import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { debounce, get, isEmpty, isEqual, last } from 'lodash';
import React, { useCallback, useEffect, useRef } from 'react';
import shortId from 'shortid';

function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
}

function LineWithColumnChart({
    id,
    height,
    style,
    useAnimated,
    useDateAxis,
    useSyncWithAxis,
    useDurationRightAxis,
    leftValueTitle,
    rightValueTitle,
    categoryKeyName,
    categoryLocale,
    durationAxisOption,
    unitText,
    series,
    data,
    onComplete,
}) {
    const chartInstance = useRef(null);
    const prevData = usePrevious(data);
    const prevSeries = usePrevious(series);

    const createChart = useCallback(
        () =>
            new Promise((resolve, reject) => {
                try {
                    if (isEmpty(series)) {
                        resolve(null);
                        return;
                    }

                    const chart = am4core.create(id, am4charts.XYChart);

                    chart.colors.step = 2;
                    chart.maskBullets = false;

                    chart.data = data;

                    // Create axes
                    let xAxis = chart.xAxes.push(
                        useDateAxis ? new am4charts.DateAxis() : new am4charts.CategoryAxis()
                    );

                    if (useDateAxis) {
                        chart.language.locale['_date_day'] = categoryLocale;
                    } else {
                        xAxis.dataFields.category = categoryKeyName;
                    }

                    xAxis.renderer.grid.template.location = 0;
                    xAxis.renderer.minGridDistance = 50;
                    xAxis.renderer.grid.template.disabled = true;
                    xAxis.renderer.fullWidthTooltip = true;

                    let leftYAxis = chart.yAxes.push(new am4charts.ValueAxis());
                    leftYAxis.title.text = leftValueTitle;
                    //leftYAxis.renderer.grid.template.disabled = true;

                    let rightYAxis = null;
                    if (useSyncWithAxis) {
                        rightYAxis = chart.yAxes.push(
                            useDurationRightAxis
                                ? new am4charts.DurationAxis()
                                : new am4charts.ValueAxis()
                        );
                        rightYAxis.title.text = rightValueTitle;
                        //rightYAxis.renderer.grid.template.disabled = true;
                        rightYAxis.renderer.opposite = true;
                        rightYAxis.syncWithAxis = leftYAxis;

                        if (useDurationRightAxis) {
                            rightYAxis.baseUnit = get(durationAxisOption, 'baseUnit', 'minute');
                            rightYAxis.durationFormatter.durationFormat = get(
                                durationAxisOption,
                                'durationFormat',
                                "hh'시' mm'분'"
                            );
                        }
                    }

                    const _series = series
                        .map(
                            ({
                                chartType,
                                chartName,
                                pointType = 'bullet',
                                useLabel,
                                targetCategory,
                                valueKeyName,
                            }) => {
                                if (isEmpty(chartType)) {
                                    return null;
                                }

                                if (chartType === 'line') {
                                    let lineSeries = chart.series.push(new am4charts.LineSeries());
                                    lineSeries.dataFields.valueY = valueKeyName;
                                    lineSeries.dataFields[
                                        useDateAxis ? 'dateX' : 'categoryX'
                                    ] = categoryKeyName;
                                    lineSeries.yAxis =
                                        !useSyncWithAxis || targetCategory === 'left'
                                            ? leftYAxis
                                            : rightYAxis;
                                    lineSeries.name = chartName;
                                    lineSeries.strokeWidth = 2;
                                    lineSeries.propertyFields.strokeDasharray = 'dashLength';
                                    lineSeries.tooltipText = '{valueY}';
                                    lineSeries.showOnInit = true;

                                    if (pointType === 'bullet') {
                                        let lineSeriesBullet = lineSeries.bullets.push(
                                            new am4charts.Bullet()
                                        );
                                        let lineSeriesRectangle = lineSeriesBullet.createChild(
                                            am4core.Rectangle
                                        );
                                        lineSeriesBullet.horizontalCenter = 'middle';
                                        lineSeriesBullet.verticalCenter = 'middle';
                                        lineSeriesBullet.width = 7;
                                        lineSeriesBullet.height = 7;
                                        lineSeriesRectangle.width = 7;
                                        lineSeriesRectangle.height = 7;

                                        let lineSeriesBulletState = lineSeriesBullet.states.create(
                                            'hover'
                                        );
                                        lineSeriesBulletState.properties.scale = 1.4;
                                    } else {
                                        // circle
                                        let lineSeriesCircle = lineSeries.bullets.push(
                                            new am4charts.CircleBullet()
                                        );
                                        lineSeriesCircle.circle.fill = am4core.color('#fff');
                                        lineSeriesCircle.circle.strokeWidth = 2;
                                        lineSeries.name = chartName;
                                        // lineSeriesCircle.circle.propertyFields.radius = 'keyName';

                                        let lineSeriesCircleState = lineSeriesCircle.states.create(
                                            'hover'
                                        );
                                        lineSeriesCircleState.properties.scale = 1.4;
                                    }

                                    if (useLabel) {
                                        let lineSeriesCircleLabel = lineSeries.bullets.push(
                                            new am4charts.LabelBullet()
                                        );
                                        lineSeriesCircleLabel.label.text = '{valueY}';
                                        lineSeriesCircleLabel.label.horizontalCenter = 'left';
                                        lineSeriesCircleLabel.label.dx = 14;
                                    }

                                    return lineSeries;
                                }

                                if (chartType === 'column') {
                                    let columnSeries = chart.series.push(
                                        new am4charts.ColumnSeries()
                                    );
                                    columnSeries.dataFields.valueY = valueKeyName;
                                    columnSeries.dataFields[
                                        useDateAxis ? 'dateX' : 'categoryX'
                                    ] = categoryKeyName;
                                    columnSeries.yAxis =
                                        !useSyncWithAxis || targetCategory === 'left'
                                            ? leftYAxis
                                            : rightYAxis;
                                    columnSeries.tooltipText = '{valueY}';
                                    columnSeries.name = chartName;
                                    columnSeries.columns.template.fillOpacity = 0.7;
                                    columnSeries.columns.template.propertyFields.strokeDasharray =
                                        'dashLength';
                                    columnSeries.columns.template.propertyFields.fillOpacity =
                                        'alpha';
                                    columnSeries.showOnInit = true;

                                    if (useLabel) {
                                        let bullet = columnSeries.bullets.push(
                                            new am4charts.LabelBullet()
                                        );
                                        bullet.interactionsEnabled = false;
                                        bullet.dy = 30;
                                        bullet.label.hideOversized = false;
                                        bullet.label.fontSize = 14;
                                        bullet.label.fontWeight = 'bolder';
                                        bullet.label.verticalCenter = 'bottom';
                                        bullet.label.valign = 'top';
                                        bullet.label.text = `{valueY}${
                                            isEmpty(unitText) ? '' : unitText
                                        }`;
                                    }

                                    let columnState = columnSeries.columns.template.states.create(
                                        'hover'
                                    );
                                    columnState.properties.fillOpacity = 0.9;

                                    return columnSeries;
                                }

                                return null;
                            }
                        )
                        .filter((instance) => !!instance);

                    last(_series).events.on(
                        'ready',
                        debounce(() => onComplete instanceof Function && onComplete(chart), 300)
                    );

                    // Add legend
                    chart.legend = new am4charts.Legend();

                    // Add cursor
                    chart.cursor = new am4charts.XYCursor();
                    chart.cursor.fullWidthLineX = true;
                    chart.cursor.xAxis = xAxis;
                    chart.cursor.lineX.strokeOpacity = 0;
                    chart.cursor.lineX.fill = am4core.color('#000');
                    chart.cursor.lineX.fillOpacity = 0.1;

                    resolve(chart);
                } catch (error) {
                    console.error(error);
                    reject(error);
                }
            }),
        [
            data,
            durationAxisOption,
            id,
            leftValueTitle,
            onComplete,
            rightValueTitle,
            series,
            unitText,
            useDateAxis,
            useDurationRightAxis,
            useSyncWithAxis,
            categoryKeyName,
            categoryLocale,
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
                    console.log('chart.create.line.with.column');
                    chartInstance.current = await createChart();
                }
            } catch (error) {
                console.error(error);
            }
        });

        return () => {
            isUnmount = true;
            if (get(chartInstance.current, 'dispose')) {
                console.log('dispose.line.with.column');
                chartInstance.current.dispose();
            }
        };
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (!isEmpty(prevSeries) && !isEmpty(series) && !isEqual(prevSeries, series)) {
            if (get(chartInstance.current, 'dispose')) {
                console.log('dispose.line.with.column');
                chartInstance.current.dispose();

                async function resetChart() {
                    chartInstance.current = await createChart();
                }

                resetChart();
            }
        }
        // eslint-disable-next-line
    }, [prevSeries, series]);

    useEffect(() => {
        if (!isEmpty(chartInstance.current) && !isEqual(data, prevData)) {
            chartInstance.current.data = data;
        }
    }, [data, prevData]);

    return <div id={id} style={{ height, ...style }} />;
}

LineWithColumnChart.defaultProps = {
    id: `line-w-column-chart-${shortId()}`,
    height: 500,
    style: {},
    useAnimated: true,
    useDateAxis: false,
    useSyncWithAxis: false,
    useDurationRightAxis: false,
    unitText: '',
    leftValueTitle: '',
    rightValueTitle: '',
    categoryKeyName: 'date',
    categoryLocale: 'MM/dd',
    durationAxisOption: {
        baseUnit: 'minute',
        durationFormat: "hh'시' mm'분'",
    },
    series: [
        {
            chartType: 'line',
            chartName: '',
            pointType: 'bullet',
            targetCategory: 'left',
            valueKeyName: '',
            useLabel: false,
        },
    ],
    data: [],
    onComplete: (chartInstance) => {},
};

export default LineWithColumnChart;
