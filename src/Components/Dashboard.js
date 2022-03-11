import Navigation from "./Navigation";
import {Navigate, Route, Routes} from "react-router-dom";
import Country from "../Routes/countries";
import Language from "../Routes/languages";
import User from "../Routes/users";
import {QueryClient, QueryClientProvider} from "react-query";
import {useMediaQuery} from "@mui/material";
import DatePicker from "./DatePicker";

const Dashboard = () => {
    const queryClient = new QueryClient();

    return <>
        <Navigation/>
        <QueryClientProvider client={queryClient}>
            <Routes>
                <Route path="/" element={<Navigate to="/countries"/>}/>
                <Route path="/countries" element={<Country/>}/>
                <Route path="/languages" element={<Language/>}/>
                <Route path="/users" element={<User/>}/>
            </Routes>
        </QueryClientProvider>
    </>
};

export default Dashboard;
