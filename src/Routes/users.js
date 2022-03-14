import {useState} from "react";
import {collection, limit, query, where} from "firebase/firestore";
import {firestore} from "../firebase-config";
import {useFirestoreQuery} from "@react-query-firebase/firestore";
import Spinner from "react-bootstrap/Spinner";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import DatePicker from "../Components/DatePicker";
import DataRadarChart from "../Components/Charts/DataRadarChart";
import DataTable from "../Components/DataTable";
import GroupChart from "../Components/Charts/GroupChart";

function getTableAggregations(snapshot) {
    const users = [];
    snapshot.docs.forEach((docSnapshot) => {
        const data = docSnapshot.data()
            .sort((translationA, translationB) => (translationA.timestamp < translationB.timestamp) ? 1 : ((translationB.timestamp < translationA.timestamp) ? -1 : 0));
        const userIndex = users.findIndex(user => {
            return user.id === data.userId;
        });
        if (userIndex === -1) {
            users.push({
                tableData: [
                    data.userId,
                    data.country,
                    1
                ],
            });
        } else {
            users[userIndex].tableData[2]++;
        }
    });

    const tableAggs = [];
    for (let i = 0; i < 10; i++) {
        tableAggs.push({
            tableData: [
                "Dimitris Filiopoulos",
                "Greece",
                "Some random text"
            ]
        });
    }
    return tableAggs;
}

function getGroupAggregations(snapshot) {
    return {
        categories: ['Dimitris Filiopoulos (Greece)', 2002, 2003, 2004, 2005, 2006, 2007],
        series: [{
            name: 'Source Language',
            data: [44, 55, 41, 64, 22, 43, 21]
        }, {
            name: 'Source Language',
            data: [53, 32, 33, 52, 13, 44, 32]
        }]
    };
}

const User = (props) => {
    const [dateRange, setDateRange] = useState([props.initialDates.startDate, props.initialDates.endDate]);

    /*const ref = query(
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
    }*/

    const tableAggregations = getTableAggregations("dummy");
    const groupAggregations = getGroupAggregations("dummy");
    const headers = ["User", "Country", "Last Captured Text"];

    return <Container className="large-margin-top" maxWidth="xl">
        <Box sx={{flexGrow: 1}}>
            <Grid container spacing={{xs: 3, md: 4}} columns={{xs: 4, sm: 8, md: 12}}>
                <Grid item xs={4} sm={8} md={12}>
                    <DatePicker dateRange={dateRange} setDateRange={setDateRange}/>
                </Grid>
                <Grid item xs={4} sm={8} md={12}>
                    <GroupChart aggregations={groupAggregations} title="Top 10 User Translations"/>
                </Grid>
                <Grid item xs={4} sm={8} md={12}>
                    <DataTable aggregations={tableAggregations} headers={headers} hasPagination={false}/>
                </Grid>
            </Grid>
        </Box>
    </Container>
}

export default User;