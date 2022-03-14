import ReactApexChart from "react-apexcharts";

const GroupChart = (props) => {
    const options = {
        chart: {
            type: 'bar',
            height: 430
        },
        title: {
            text: props.title,
            align: 'left'
        },
        plotOptions: {
            bar: {
                horizontal: true,
                dataLabels: {
                    position: 'top',
                },
            }
        },
        dataLabels: {
            enabled: true,
            offsetX: -6,
            style: {
                fontSize: '12px',
                colors: ['#fff']
            }
        },
        stroke: {
            show: true,
            width: 1,
            colors: ['#fff']
        },
        tooltip: {
            shared: true,
            intersect: false
        },
        xaxis: {
            categories: props.aggregations.categories,
        },
        yaxis: {
            labels: {
                minWidth: 150,
                maxWidth: 200,
                style: {
                    fontSize: '10px',
                },
            },
        },
    };

    const series = props.aggregations.series;

    return <ReactApexChart options={options} series={series} type="bar" height={430}/>
}

export default GroupChart;