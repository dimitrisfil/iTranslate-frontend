import ReactApexChart from 'react-apexcharts'
import Container from "@mui/material/Container";
import {Col, Row} from "react-bootstrap";
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";

const Country = () => {

    const options = {
        labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 200
                },
                legend: {
                    position: 'bottom'
                }
            }
        }]
    };

    function createData(name, calories, fat) {
        return {name, calories, fat};
    }

    const rows = [
        createData('Frozen yoghurt', 159, 6.0),
        createData('Ice cream sandwich', 237, 9.0),
        createData('Eclair', 262, 16.0),
        createData('Cupcake', 305, 3.7),
        createData('Gingerbread', 356, 16.0)
    ];

    const series = [44, 55, 13, 43, 22];

    return <Container className="mt-lg-5 d-flex" maxWidth="xl">
        <ReactApexChart options={options} series={series} type="pie" width="700"/>
        <TableContainer component={Paper}>
            <Table sx={{minWidth: 650}} aria-label="simple table">
                <TableHead sx={{backgroundColor: "#126efd"}}>
                    <TableRow>
                        <TableCell sx={{color: "white", fontWeight: "bold"}}>Country</TableCell>
                        <TableCell sx={{color: "white", fontWeight: "bold"}} align="right">Translations</TableCell>
                        <TableCell sx={{color: "white", fontWeight: "bold"}} align="right">Top Source Language</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow
                            key={row.name}
                            sx={{'&:last-child td, &:last-child th': {border: 0}}}
                        >
                            <TableCell component="th" scope="row">
                                {row.name}
                            </TableCell>
                            <TableCell align="right">{row.calories}</TableCell>
                            <TableCell align="right">{row.fat}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    </Container>
}

export default Country;