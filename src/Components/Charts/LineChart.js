import ReactApexChart from "react-apexcharts";

const LineChart = (props) => {
    const options = {
        chart: {
            height: 350,
            type: 'line',
            zoom: {
                enabled: false
            }
        },
        colors: ["#C608D1", "#FF00FE", "#FF77FD", "#FFA9FD", "#2900A5", "#F66D44", "#FEAE65", "#E6F69D", "#AADEA7", "#64C2A6", "#2D87BB", "#c0392b", "#bdc3c7", "#7f8c8d", "#52D726", "#FFEC00", "#007ED6", "#7CDDDD", "#FF7300", "#FF0000"],
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'straight'
        },
        title: {
            text: props.title,
            align: 'left'
        },
        grid: {
            row: {
                colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                opacity: 0.5
            },
        },
        xaxis: {
            categories: props.aggregations.slots,
        },
        yaxis: {
            labels: {
                formatter: (value) => { return parseInt(value) },
            },
        }
    };

    const series = props.aggregations.data.map(entity => {
            return {
                name: entity.topic,
                data: entity.values
            }
        });

    return <ReactApexChart options={options} series={series} type="line" height={350}/>
}

export default LineChart;