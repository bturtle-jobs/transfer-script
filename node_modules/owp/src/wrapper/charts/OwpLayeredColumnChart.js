import { merge } from '@amcharts/amcharts4/.internal/core/utils/Object';
import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { get, isEmpty, isEqual } from 'lodash';
import React, { useCallback, useEffect, useRef } from 'react';
import shortId from 'shortid';

function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
}

function LayeredColumnChart({
    id,
    useAnimated,
    data,
    height,
    style,
    numberFormat,
    categoryKeyName,
    valueTitle,
    categoryAxisProps,
    valueAxisProps,
    valueKeyNames,
}) {
    const chartInstance = useRef(null);
    const prevData = usePrevious(data);
    const prevValueKeyNames = usePrevious(valueKeyNames);

    const createChart = useCallback(
        () =>
            new Promise((resolve, reject) => {
                try {
                    if (!id || !categoryKeyName || isEmpty(valueKeyNames)) {
                        resolve(null);
                        return;
                    }
                    let chart = am4core.create(id, am4charts.XYChart);

                    // Add percent sign to all numbers
                    if (!isEmpty(numberFormat)) {
                        chart.numberFormatter.numberFormat = numberFormat;
                    }

                    chart.data = data;

                    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
                    categoryAxis.dataFields.category = categoryKeyName;
                    categoryAxis.renderer.grid.template.location = 0;
                    categoryAxis.renderer.minGridDistance = 30;

                    if (!isEmpty(categoryAxisProps)) {
                        categoryAxis = merge(categoryAxis, categoryAxisProps);
                    }

                    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
                    valueAxis.title.text = valueTitle;
                    valueAxis.title.fontWeight = 800;

                    if (!isEmpty(valueAxisProps)) {
                        valueAxis = merge(valueAxis, valueAxisProps);
                    }

                    valueKeyNames.forEach((name, index) => {
                        let series = chart.series.push(new am4charts.ColumnSeries());
                        series.dataFields.valueY = name;
                        series.dataFields.categoryX = categoryKeyName;
                        series.clustered = false;

                        if (index > 0) {
                            series.columns.template.width = am4core.percent(
                                Math.ceil(100 / (index + 1))
                            );
                        }

                        series.tooltipText = '{categoryX}: [bold]{valueY}[/]';
                    });

                    chart.cursor = new am4charts.XYCursor();
                    chart.cursor.lineX.disabled = true;
                    chart.cursor.lineY.disabled = true;

                    resolve(chart);
                } catch (error) {
                    console.error(error);
                    reject(error);
                }
            }),
        [
            data,
            id,
            numberFormat,
            valueKeyNames,
            categoryAxisProps,
            categoryKeyName,
            valueAxisProps,
            valueTitle,
        ]
    );

    useEffect(() => {
        if (
            !isEmpty(prevValueKeyNames) &&
            !isEmpty(valueKeyNames) &&
            !isEqual(prevValueKeyNames, valueKeyNames)
        ) {
            if (get(chartInstance.current, 'dispose')) {
                chartInstance.current.dispose();

                async function resetChart() {
                    chartInstance.current = await createChart();
                }

                resetChart();
            }
        }
        // eslint-disable-next-line
    }, [prevValueKeyNames, valueKeyNames]);

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
                    console.log('chart.create.layered');
                    chartInstance.current = await createChart();
                }
            } catch (error) {
                console.error(error);
            }
        });

        return () => {
            isUnmount = true;
            if (get(chartInstance.current, 'dispose')) {
                console.log('dispose.layered');
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

LayeredColumnChart.defaultProps = {
    id: `layered-chart-${shortId()}`,
    height: 500,
    style: {},
    useAnimated: true,
    useLegend: true,
    data: [],
    numberFormat: '',
    categoryAxisProps: {},
    categoryKeyName: 'category',
    valueAxisProps: {},
    valueTitle: '',
    valueKeyNames: [],
};

export default LayeredColumnChart;
