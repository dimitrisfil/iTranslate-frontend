import Navigation from "./Navigation";
import {Navigate, Route, Routes} from "react-router-dom";
import Country from "../Routes/countries";
import Language from "../Routes/languages";
import User from "../Routes/users";

const Dashboard = () => {
    return <>
        <Navigation/>
        <Routes>
            <Route path ="/" element={<Navigate to="/countries" />}/>
            <Route path="/countries" element={<Country/>} />
            <Route path="/languages" element={<Language/>} />
            <Route path="/users" element={<User/>} />
        </Routes>
    </>
};

export default Dashboard;
