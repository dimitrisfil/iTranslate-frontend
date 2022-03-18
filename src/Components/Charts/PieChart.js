import ReactApexChart from "react-apexcharts";

const PieChart = (props) => {
    const options = {
        title: {
            text: props.title,
            align: 'left',
        },
        colors: ["#C608D1", "#FF00FE", "#FF77FD", "#FFA9FD", "#2900A5", "#F66D44", "#FEAE65", "#E6F69D", "#AADEA7", "#64C2A6", "#2D87BB", "#c0392b", "#bdc3c7", "#7f8c8d", "#52D726", "#FFEC00", "#007ED6", "#7CDDDD", "#FF7300", "#FF0000"]
    };

    options.labels = props.aggregations.map(country => {
        return country.tableData[0];
    });

    const series = props.aggregations.map(country => {
        return country.tableData[1];
    });

    return <ReactApexChart options={options} series={series} type="pie"/>
}

export default PieChart;