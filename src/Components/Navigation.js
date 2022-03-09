import {Nav, Navbar} from "react-bootstrap";
import {LinkContainer} from "react-router-bootstrap";
import Container from "@mui/material/Container";
import {signOut} from "firebase/auth";
import {auth} from "../firebase-config";

const Navigation = () => {

    const logout = async () => {
        await signOut(auth);
    };

    return <>
        <Navbar bg="primary" variant="dark">
            <Container className="d-flex" maxWidth="xl">
                <Navbar.Brand href="/">Dashboard</Navbar.Brand>
                <Nav className="container-fluid">
                    <LinkContainer to="/countries">
                        <Nav.Link>Countries</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to="/languages">
                        <Nav.Link>Languages</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to="/users">
                        <Nav.Link>Users</Nav.Link>
                    </LinkContainer>
                </Nav>
                <Nav>
                    <Nav.Item className="d-flex">
                        <LinkContainer to="/login">
                            <Nav.Link onClick={logout}>Logout</Nav.Link>
                        </LinkContainer>
                    </Nav.Item>
                </Nav>
            </Container>
        </Navbar>
    </>
};

export default Navigation;