import Container from "@mui/material/Container";
import {collection, query, where} from "firebase/firestore";
import {useFirestoreQuery} from "@react-query-firebase/firestore";
import {firestore} from "../firebase-config";
import PieChart from "../Components/Charts/PieChart";
import DataTable from "../Components/DataTable";
import Spinner from "react-bootstrap/Spinner";
import "../Components/App.css"
import DatePicker from "../Components/DatePicker";
import {useState} from "react";
import LineChart from "../Components/Charts/LineChart";
import moment from "moment";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

function getAggregations(snapshot) {
    const countryData = [];
    snapshot.docs.forEach((docSnapshot) => {
        const data = docSnapshot.data();
        const countryIndex = countryData.findIndex(country => {
            return country.country === data.country
        });
        if (countryIndex === -1) {
            countryData.push({
                country: data.country,
                count: 1,
                sourceLanguages: [{
                    language: data.sourceLanguage,
                    count: 1
                }]
            });
        } else {
            countryData[countryIndex].count++;
            const languageIndex = countryData[countryIndex].sourceLanguages.findIndex(source => {
                return source.language === data.sourceLanguage
            });
            if (languageIndex === -1) {
                countryData[countryIndex].sourceLanguages.push({
                    language: data.sourceLanguage,
                    count: 1
                });
            } else {
                countryData[countryIndex].sourceLanguages[languageIndex].count++
            }
        }
    });
    const aggregations = countryData.map(country => {
        const maxValue = Math.max.apply(Math, country.sourceLanguages.map(function (sourceLanguage) {
            return sourceLanguage.count;
        }));
        const maxKeyIndex = country.sourceLanguages.findIndex(sourceLanguage => {
            return sourceLanguage.count === maxValue
        });
        return {
            tableData: [
                country.country,
                country.count,
                country.sourceLanguages[maxKeyIndex].language // Top source Language
            ]
        };
    });
    return aggregations.sort((countryA, countryB) => (countryA.tableData[1] < countryB.tableData[1]) ? 1 : ((countryB.tableData[1] < countryA.tableData[1]) ? -1 : 0));
}

function getLineAggregations(snapshot, dateRange) {
    const startDate = moment(dateRange[0].getTime());
    const endDate = moment(dateRange[1].getTime());
    const slots = [];
    const lineData = [];

    while (endDate > startDate || startDate.format('M') === endDate.format('M')) {
        slots.push(startDate.format('MMMM'));
        startDate.add(1, 'month');
    }

    snapshot.docs.forEach((docSnapshot) => {
        const data = docSnapshot.data();
        let countryIndex = lineData.findIndex(entity => {
            return entity.topic === data.country
        });
        const month = moment(data.timestamp).format("MMMM");
        if (countryIndex === -1) {
            lineData.push({
                topic: data.country,
                values: new Array(slots.length).fill(0)
            });
            countryIndex = lineData.length - 1;
        }
        lineData[countryIndex].values[slots.indexOf(month)]++;
    });

    return {
        slots: slots,
        data: lineData
    };
}

const Country = (props) => {
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

    const countryAggregations = getAggregations(translations.data, dateRange);
    const countryLineAggregations = getLineAggregations(translations.data, dateRange);

    const headers = ["Country", "Translations", "Top Source Language"];

    const content = <Box sx={{flexGrow: 1}}>
        <Grid container spacing={{xs: 3, md: 4}} columns={{xs: 4, sm: 8, md: 12}}>
            <Grid item xs={4} sm={8} md={12}>
                <DatePicker dateRange={dateRange} setDateRange={setDateRange}/>
            </Grid>
            <Grid item xs={4} sm={8} md={12}>
                <LineChart aggregations={countryLineAggregations} title="Translations by Month"/>
            </Grid>
            <Grid item xs={4} sm={8} md={6}>
                <PieChart aggregations={countryAggregations} title="Translations Per Country"/>
            </Grid>
            <Grid item xs={4} sm={8} md={6}>
                <DataTable aggregations={countryAggregations} headers={headers} hasPagination={true}/>
            </Grid>
        </Grid>
    </Box>;

    const noContent = <Box sx={{flexGrow: 1}}>
        <Grid container spacing={{xs: 3, md: 4}} columns={{xs: 4, sm: 8, md: 12}}>
            <Grid item xs={4} sm={8} md={12}>
                <DatePicker dateRange={dateRange} setDateRange={setDateRange}/>
            </Grid>
            <Grid item xs={4} sm={8} md={12}>
                <h3 className="text-center mt-lg-5">No data found for the selected time frame.</h3>
            </Grid>
        </Grid>
    </Box>;

    return <Container className="large-margin-top" maxWidth="xl">
        {countryAggregations.length === 0 ? noContent : content}
    </Container>
}

export default Country;