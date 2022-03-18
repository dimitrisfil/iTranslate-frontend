import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import SignIn from './SignIn';
import {auth} from "../firebase-config";
import {onAuthStateChanged} from "firebase/auth";
import {useEffect, useState} from "react";
import Spinner from 'react-bootstrap/Spinner';
import Dashboard from "./Dashboard";
import {useNavigate} from "react-router-dom";

function App() {

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        onAuthStateChanged(auth, (currentUser) => {
            setIsLoggedIn(!!currentUser);
            if (!!currentUser) {
                navigate('/countries');
            } else {
                navigate('/login');
            }
            if (isLoading) {
                setIsLoading(false);
            }
        });
    }, [isLoading]);

    const loadingContent = <Spinner className="Loading" animation="grow" />;
    const mainContent = isLoggedIn ?  <Dashboard/> : <SignIn/>;

    return (<>
        {isLoading ? loadingContent : mainContent}
        </>
    );
}

export default App;
