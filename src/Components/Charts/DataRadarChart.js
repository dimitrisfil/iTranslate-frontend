import ReactApexChart from "react-apexcharts";

const DataRadarChart = (props) => {

    const options = {
        chart: {
            type: 'radar',
            dropShadow: {
                enabled: true,
                blur: 1,
                left: 1,
                top: 1
            }
        },
        title: {
            text: props.title
        },
        colors: ["#007ED6", "#7CDDDD"],
        stroke: {
            width: 2
        },

        fill: {
            opacity: 0.1
        },
        markers: {
            size: 4
        },
        xaxis: {
            categories: props.categories
        }
    };

    return <ReactApexChart options={options} series={props.series} type="radar"/>
}

export default DataRadarChart;