import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import SignIn from './SignIn';
import {auth} from "../firebase-config";
import {onAuthStateChanged, signOut} from "firebase/auth";
import {useEffect, useState} from "react";
import Spinner from 'react-bootstrap/Spinner';
import Dashboard from "./Dashboard";


function App() {

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        onAuthStateChanged(auth, (currentUser) => {
            console.log(!!currentUser);
            setIsLoggedIn(!!currentUser);
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
