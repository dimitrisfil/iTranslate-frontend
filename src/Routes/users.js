import {useState} from "react";
import {collection, query, where} from "firebase/firestore";
import {firestore} from "../firebase-config";
import {useFirestoreQuery} from "@react-query-firebase/firestore";
import Spinner from "react-bootstrap/Spinner";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import DatePicker from "../Components/DatePicker";
import DataTable from "../Components/DataTable";
import Tooltip from '@mui/material/Tooltip';
import MapWrapper from "../Components/Map/MapWrapper";

const CHARACTER_LIMIT = 100;

function truncate(input) {
    if (input.length > CHARACTER_LIMIT) {
        return input.substring(0, CHARACTER_LIMIT) + '...';
    }
    return input;
}


function getTableAggregations(translationSnapshot, userSnapshot) {
    let users = [];

    const translationSnapshotDocs = translationSnapshot.docs
        .sort((translationA, translationB) => (translationA.timestamp > translationB.timestamp) ? 1 : ((translationB.timestamp > translationA.timestamp) ? -1 : 0));

    const userSnapshotDocs = userSnapshot.docs.map(snapshot => {
        const data = snapshot.data();
        return {
            id: snapshot.id,
            firstName: data.firstName,
            lastName: data.lastName

        };
    });

    translationSnapshotDocs.forEach((docSnapshot) => {
        const data = docSnapshot.data();
        const userIndex = users.findIndex(user => {
            return user.tableData[0] === data.userId;
        });
        if (userIndex === -1) {
            users.push({
                tableData: [
                    data.userId,
                    data.country,
                    data.text,
                    1
                ],
            });
        } else {
            users[userIndex].tableData[2] = data.text;
            users[userIndex].tableData[3]++;
        }
    });

    users = users
        .sort((userA, userB) => (userA.tableData[3] < userB.tableData[3]) ? 1 : ((userB.tableData[3] < userA.tableData[3]) ? -1 : 0))
        .slice(0, 10)
        .map(user => {
            const uData = userSnapshotDocs.find(snapshot => snapshot.id === user.tableData[0]);
            return {
                tableData: [
                    uData.firstName + ' ' + uData.lastName,
                    user.tableData[1],
                    user.tableData[3],
                    <Tooltip title={user.tableData[2].length > CHARACTER_LIMIT ? user.tableData[2] : ""}>
                        <div>{truncate(user.tableData[2])}</div>
                    </Tooltip>,
                ]
            };
        });

    return users;
}

const User = (props) => {
    const [dateRange, setDateRange] = useState([props.initialDates.startDate, props.initialDates.endDate]);

    const ref = query(
        collection(firestore, "translations"),
        where("timestamp", ">=", dateRange[0].getTime()),
        where("timestamp", "<=", dateRange[1].getTime())
    );

    const userRef = query(
        collection(firestore, "users"),
    );

    const translations = useFirestoreQuery(["translations", dateRange[0].getTime(), dateRange[1].getTime()], ref, {
        subscribe: true,
    });

    const users = useFirestoreQuery(["users", dateRange[0].getTime(), dateRange[1].getTime()], userRef, {
        subscribe: true,
    });

    if (translations.isLoading || users.isLoading) {
        return <Spinner className="Loading" animation="grow"/>;
    }

    let tableAggregations = getTableAggregations(translations.data, users.data);
    const headers = ["User", "Country", "Translations", "Last Captured Text"];

    return <Container className="large-margin-top" maxWidth="xl">
        <Box sx={{flexGrow: 1}}>
            <Grid container spacing={{xs: 3, md: 4}} columns={{xs: 4, sm: 8, md: 12}}>
                <Grid item xs={4} sm={8} md={12}>
                    <DatePicker dateRange={dateRange} setDateRange={setDateRange}/>
                </Grid>
                <Grid item xs={4} sm={8} md={12}>
                    <h5><b>Top 10 Users</b></h5>
                </Grid>
                <Grid item xs={4} sm={8} md={12}>
                    <DataTable aggregations={tableAggregations} headers={headers} hasPagination={false}/>
                </Grid>
                <Grid item xs={4} sm={8} md={12}>
                    <MapWrapper translations={translations.data.docs} users={users.data.docs}/>
                </Grid>
            </Grid>
        </Box>
    </Container>
}

export default User;