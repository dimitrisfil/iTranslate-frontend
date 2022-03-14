import Navigation from "./Navigation";
import {Navigate, Route, Routes} from "react-router-dom";
import Country from "../Routes/countries";
import Language from "../Routes/languages";
import User from "../Routes/users";
import {QueryClient, QueryClientProvider} from "react-query";
import moment from "moment";

const Dashboard = () => {
    const queryClient = new QueryClient();

    const expirationDate = localStorage.getItem("expirationDate");
    if (expirationDate && moment(expirationDate)
        .startOf('day')
        .diff(moment().startOf('day'), 'days') < 0) {
        localStorage.clear();
    }

    const startDateString = localStorage.getItem("startDate");
    const endDateString = localStorage.getItem("endDate");
    const endDate = endDateString ? new Date(endDateString) : new Date();
    let startDate;
    if (startDateString) {
        startDate = new Date(startDateString);
    } else {
        startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 1); // One month
    }
    const initialDates = {
        startDate: startDate,
        endDate: endDate
    };

    return <>
        <Navigation/>
        <QueryClientProvider client={queryClient}>
            <Routes>
                <Route path="/" element={<Navigate to="/countries"/>}/>
                <Route path="/countries" element={<Country initialDates={initialDates}/>}/>
                <Route path="/languages" element={<Language initialDates={initialDates}/>}/>
                <Route path="/users" element={<User initialDates={initialDates}/>}/>
            </Routes>
        </QueryClientProvider>
    </>
};

export default Dashboard;
