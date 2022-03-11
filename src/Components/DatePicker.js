import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateRangePicker from '@mui/lab/DateRangePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

const DatePicker = (props) => {
    return <div className="float-end">
        <LocalizationProvider className="float-right" dateAdapter={AdapterDateFns}>
            <DateRangePicker
                startText="Start Date"
                endText="End Date"
                inputFormat="dd/MM/yyyy"
                value={props.dateRange}
                onChange={(newValue) => {
                    newValue[1].setHours(23, 59, 59, 999);
                    props.setDateRange(newValue);
                }}
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