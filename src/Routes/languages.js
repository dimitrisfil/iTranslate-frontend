import {useMediaQuery} from "@mui/material";
import {useState} from "react";
import Container from "@mui/material/Container";
import DatePicker from "../Components/DatePicker";
import PieChart from "../Components/Charts/PieChart";
import DataTable from "../Components/DataTable";
import Grid from "@mui/material/Grid";
import LineChart from "../Components/Charts/LineChart";
import Box from "@mui/material/Box";
import DataRadarChart from "../Components/Charts/DataRadarChart";

function getAggregations(snapshot) {
    const dummyData = [];
    for (let i = 0; i < 10; i++) {
        dummyData.push({
            topic: "English" + i,
            count: Math.floor(Math.random() * 100),
            tableData: [
                35// Number of users
            ],
        });
    }
    return dummyData;
}

const Language = () => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1); // One month
    const [dateRange, setDateRange] = useState([startDate, endDate]);

    const sourceLanguageAggregations = getAggregations("sourceLanguage");
    const targetLanguageAggregations = getAggregations("targetLanguage");

    const headers = ["Language", "Translations (Source/Target)", "Users (Source/Target)"];

    const categories = ['Greece', 'Germany', 'Italy', 'Spain'];

    const series = [{
        name: 'Source Language',
        data: [80, 50, 30, 40],
    }, {
        name: 'Target Language',
        data: [20, 30, 40, 80],
    }];

    return <Container className="large-margin-top" maxWidth="xl">
        <Box sx={{flexGrow: 1}}>
            <Grid container spacing={{xs: 3, md: 4}} columns={{xs: 4, sm: 8, md: 12}}>
                <Grid item xs={4} sm={8} md={12}>
                    <DatePicker dateRange={dateRange} setDateRange={setDateRange}/>
                </Grid>
                <Grid item xs={4} sm={8} md={6}>
                    <DataRadarChart title="Translations by Source/Target Language" categories={categories} series={series}/>
                </Grid>
                <Grid item xs={4} sm={8} md={6}>
                    <DataTable aggregations={sourceLanguageAggregations} headers={headers}/>
                </Grid>
            </Grid>
        </Box>
    </Container>
}

export default Language;