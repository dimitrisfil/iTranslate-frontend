import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateRangePicker from '@mui/lab/DateRangePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import {useState} from "react";
import moment from "moment";

const DatePicker = (props) => {
    const [value, setValue] = useState(props.dateRange);
    return <div className="float-end">
        <LocalizationProvider className="float-right" dateAdapter={AdapterDateFns}>
            <DateRangePicker
                startText="Start Date"
                endText="End Date"
                inputFormat="dd/MM/yyyy"
                value={props.dateRange}
                onChange={(newValue) => {
                    newValue[1].setHours(23, 59, 59, 999);
                    setValue(newValue);
                }}
                onClose={() => {
                    props.setDateRange(value);
                    localStorage.setItem("startDate", value[0]);
                    localStorage.setItem("endDate", value[1]);

                    const expirationDate = moment();
                    expirationDate.add(1, 'days');
                    localStorage.setItem("expirationDate", expirationDate.toString());
                }
                }
                renderInput={(startProps, endProps) => (
                    <>
                        <TextField {...startProps} />
                        <Box sx={{mx: 2}}> to </Box>
                        <TextField {...endProps} />
                    </>
                )}
            />
        </LocalizationProvider>
    </div>
}

export default DatePicker;