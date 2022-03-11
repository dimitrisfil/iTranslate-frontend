import {Nav, Navbar} from "react-bootstrap";
import {LinkContainer} from "react-router-bootstrap";
import Container from "@mui/material/Container";
import {signOut} from "firebase/auth";
import {auth} from "../firebase-config";
import {useMediaQuery} from "@mui/material";

const Navigation = () => {
    const isDesktop = useMediaQuery('(min-width:575px)');

    const logout = async () => {
        await signOut(auth);
    };

    return <>
        <Navbar collapseOnSelect fixed="top" expand="sm" bg="primary" variant="dark">
            <Container className={isDesktop ? "d-flex" : ""} maxWidth="xl">
                <Navbar.Brand href="/">iTranslate Dashboard</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
                <Navbar.Collapse id="responsive-navbar-nav">
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
                </Navbar.Collapse>
            </Container>
        </Navbar>
    </>
};

export default Navigation;