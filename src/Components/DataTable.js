import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow} from "@mui/material";
import Box from "@mui/material/Box";
import {useState} from "react";
import "./DataTable.css";

const DataTable = (props) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return <Box className="mt-lg-3 flex-grow-1">
        <TableContainer component={Paper}>
            <Table aria-label="simple table">
                <TableHead sx={{backgroundColor: "#126efd"}}>
                    <TableRow>
                        {props.headers.map(header => {
                            return <TableCell
                                key={header}
                                sx={{color: "white", fontWeight: "bold"}}
                                align={props.headers.indexOf(header) > 0 ? "right" : "left"}
                            >{header}
                            </TableCell>
                        })}

                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.aggregations
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((entity) => (
                            <TableRow
                                key={entity.topic}
                                sx={{'&:last-child td, &:last-child th': {border: 0}}}
                            >
                                <TableCell component="th" scope="row">
                                    {entity.topic}
                                </TableCell>
                                <TableCell align="right">{entity.count}</TableCell>
                                {entity.tableData.map(data => {
                                    return <TableCell key={entity.tableData.indexOf(data)} align="right">{data}</TableCell>
                                })}
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
        </TableContainer>
        <TablePagination
            className="TableFooter"
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={props.aggregations.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
        />
    </Box>
}

export default DataTable;