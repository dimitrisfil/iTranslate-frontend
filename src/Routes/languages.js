import {useState} from "react";
import Container from "@mui/material/Container";
import DatePicker from "../Components/DatePicker";
import DataTable from "../Components/DataTable";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import DataRadarChart from "../Components/Charts/DataRadarChart";
import {collection, query, where} from "firebase/firestore";
import {firestore} from "../firebase-config";
import {useFirestoreQuery} from "@react-query-firebase/firestore";
import Spinner from "react-bootstrap/Spinner";

function median(arr) {
    const mid = Math.floor(arr.length / 2),
        nums = [...arr].sort((a, b) => a - b);
    return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
}

function getTableAggregations(snapshot) {
    const languageData = [];
    snapshot.docs.forEach((docSnapshot) => {
        const data = docSnapshot.data();
        const languageIndex = languageData.findIndex(language => {
            return language.tableData[0] === data.sourceLanguage || language.tableData[0] === data.targetLanguage;
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

    return languageData.sort((languageA, languageB) => (
        median([languageA.tableData[1], languageA.tableData[2]]) < median([languageB.tableData[1], languageB.tableData[2]])) ? 1 :
        ((median([languageB.tableData[1], languageB.tableData[2]]) < median([languageA.tableData[1], languageA.tableData[2]])) ? -1 : 0));
}

function getRadarAggregations(aggregations) {
    aggregations = aggregations.slice(0, 10);
    return {
        categories: aggregations.map(language => language.tableData[0]),
        series: [{
            name: 'Source Language',
            data: aggregations.map(language => language.tableData[1])
        }, {
            name: 'Target Language',
            data: aggregations.map(language => language.tableData[2])
        }]
    }
}

const Language = (props) => {
    const [dateRange, setDateRange] = useState([props.initialDates.startDate, props.initialDates.endDate]);

    const ref = query(
        collection(firestore, "translations"),
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
    const radarAggregations = getRadarAggregations(tableAggregations);

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