import Container from "@mui/material/Container";
import {collection, query, limit, where} from "firebase/firestore";
import {useFirestoreQuery} from "@react-query-firebase/firestore";
import {firestore} from "../firebase-config";
import PieChart from "../Components/Charts/PieChart";
import DataTable from "../Components/DataTable";
import Spinner from "react-bootstrap/Spinner";
import {useMediaQuery} from "@mui/material";
import "../Components/App.css"
import DatePicker from "../Components/DatePicker";
import {useMemo, useState} from "react";
import LineChart from "../Components/Charts/LineChart";
import moment from "moment";
import dateRange from "react-date-range/dist/components/DateRange";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

function getAggregations(snapshot) {
    /*const countryData = [];
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
            topic: country.country,
            count: country.count,
            tableData: [
                country.sourceLanguages[maxKeyIndex].language // Top source Language
            ]
        };
    });
    return aggregations.sort((countryA, countryB) => (countryA.count < countryB.count) ? 1 : ((countryB.count < countryA.count) ? -1 : 0));*/

    return [{
        topic: 'Greece',
        count: 60,
        tableData: [
            "English" // Top source Language
        ]
    },
        {
            topic: 'Germany',
            count: 65,
            tableData: [
                "English" // Top source Language
            ]
        }];
}

function getLineAggregations(snapshot, dateRange) {
    /*const startDate = moment(dateRange[0].getTime());
    const endDate = moment(dateRange[1].getTime());
    const slots = [];
    const lineData = [];

    while (endDate > startDate || startDate.format('M') === endDate.format('M')) {
        slots.push(startDate.format('MMMM'));
        startDate.add(1, 'month');
    }

    snapshot.docs.forEach((docSnapshot) => {
        const data = docSnapshot.data();
        const countryIndex = lineData.findIndex(entity => {
            return entity.topic === lineData.country
        });
        const month = moment(data.timestamp).format("MMMM");
        if (countryIndex === -1) {
            lineData.push({
                topic: data.country,
                values: new Array(slots.length).fill(0)
            });

        }
        lineData[countryIndex].values[slots.indexOf(month)]++;
    });

    return {
        slots: slots,
        data: lineData
    };*/

    return {
        slots: ["January", "February", "March"],
        data: [
            {
                topic: "Greece",
                values: [10, 20, 30]
            },
            {
                topic: "Germany",
                values: [8, 25, 32]
            }
        ]
    };
}

const Country = () => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1); // One month
    const [dateRange, setDateRange] = useState([startDate, endDate]);

    /*const ref = query(
        collection(firestore, "translations"),
        limit(5),
        //where("timestamp", ">=", dateRange[0].getTime()),
        //where("timestamp", "<=", dateRange[1].getTime())
    );

    const translations = useFirestoreQuery(["translations"], ref);

    if (translations.isLoading) {
        return <Spinner className="Loading" animation="grow"/>;
    }*/

    const countryAggregations = getAggregations("dummy");
    const countryLineAggregations = getLineAggregations("dummy", dateRange);

    /*const countryAggregations = useMemo(() => getAggregations(translations.data), [translations.data]);
    const countryLineAggregations = useMemo(() => getLineAggregations(translations.data), [translations.data]);*/

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
                <DataTable aggregations={countryAggregations} headers={headers}/>
            </Grid>
        </Grid>
    </Box>;

    const noContent = <Box sx={{flexGrow: 1}}>
    </Box>;

    return <Container className="large-margin-top" maxWidth="xl">
        {countryAggregations.length === 0 ? noContent : content}
    </Container>
}

export default Country;