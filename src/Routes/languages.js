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
import {collection, limit, query, where} from "firebase/firestore";
import {firestore} from "../firebase-config";
import {useFirestoreQuery} from "@react-query-firebase/firestore";
import Spinner from "react-bootstrap/Spinner";

function getTableAggregations(snapshot) {
    const languageData = [];
    snapshot.docs.forEach((docSnapshot) => {
        const data = docSnapshot.data();
        const languageIndex = languageData.findIndex(language => {
            return language.topic === data.sourceLanguage || language.topic === data.targetLanguage;
        });
        if (languageIndex === -1) {
            languageData.push({
                tableData: [
                    data.sourceLanguage, // Language
                    1, // Source Translations
                    0 // Target Translations
                ],
            });
            if (data.sourceLanguage.localeCompare(data.targetLanguage) !== 0) {
                languageData.push({
                    tableData: [
                        data.targetLanguage, // Language
                        0, // Source Translations
                        1 // Target Translations
                    ],
                });
            }
        } else {
            if (languageData[languageIndex].tableData[0].localeCompare(data.sourceLanguage) === 0) {
                languageData[languageIndex].tableData[1]++;
            }
            if (languageData[languageIndex].tableData[0].localeCompare(data.targetLanguage) === 0) {
                languageData[languageIndex].tableData[2]++;
            }
        }
    });
    return languageData.sort((languageA, languageB) => (languageA.tableData[0] < languageB.tableData[0]) ? 1 : ((languageB.tableData[0] < languageA.tableData[0]) ? -1 : 0));
}

function getRadarAggregations(snapshot) {
    return {
        categories: ['Greece', 'Germany', 'Italy', 'Spain'],
        series: [{
            name: 'Source Language',
            data: [80, 50, 30, 40]
        }, {
            name: 'Target Language',
            data: [20, 30, 40, 80]
        }]
    }
}

const Language = (props) => {
    const [dateRange, setDateRange] = useState([props.initialDates.startDate, props.initialDates.endDate]);

    const ref = query(
        collection(firestore, "translations"),
        limit(10),
        where("timestamp", ">=", dateRange[0].getTime()),
        where("timestamp", "<=", dateRange[1].getTime())
    );

    const translations = useFirestoreQuery(["translations", dateRange[0].getTime(), dateRange[1].getTime()], ref, {
        subscribe: true,
    });

    if (translations.isLoading) {
        return <Spinner className="Loading" animation="grow"/>;
    }

    const tableAggregations = getTableAggregations(translations.data);
    const radarAggregations = getRadarAggregations(translations.data);

    const headers = ["Language", "Source Translations", "Target Translations"];

    return <Container className="large-margin-top" maxWidth="xl">
        <Box sx={{flexGrow: 1}}>
            <Grid container spacing={{xs: 3, md: 4}} columns={{xs: 4, sm: 8, md: 12}}>
                <Grid item xs={4} sm={8} md={12}>
                    <DatePicker dateRange={dateRange} setDateRange={setDateRange}/>
                </Grid>
                <Grid item xs={4} sm={8} md={6}>
                    <DataRadarChart title="Top 10 Translations by Source/Target Language" categories={radarAggregations.categories} series={radarAggregations.series}/>
                </Grid>
                <Grid item xs={4} sm={8} md={6}>
                    <DataTable aggregations={tableAggregations} headers={headers} hasPagination={true}/>
                </Grid>
            </Grid>
        </Box>
    </Container>
}

export default Language;