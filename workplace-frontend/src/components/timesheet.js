import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import TimesheetForm from './timesheetForm';
import { getData, postData } from '../FetchNodeServices';
import TimesheetView from "./timesheetView";

function Timesheet(props) {
    const [openForm, setOpenForm] = useState(false);
    const [openView, setOpenView] = useState(false);
    const [timesheetData, setTimesheetData] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState('');
    const [data, setData] = useState([]);
    const [viewData, setViewData] = useState([]);
    const userData = JSON.parse(localStorage.getItem("userData"));
    const loginTime = JSON.parse(localStorage.getItem("LoginTime"));

    const showForm = (e) => {
        setData(e);
        setOpenForm(true);
    };

    const showView = (e) => {
        setViewData(e);
        setOpenView(true);
    };

    const closePopup = () => {
        setOpenForm(false);
    };

    const closeView = () => {
        setOpenView(false);
    };

    const month = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const handleMonthClick = async (event) => {
        setSelectedMonth(event.target.value);
        const currentYear = new Date().getFullYear();
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        const monthIndex = monthNames.indexOf(event.target.value);
        const datesForMonth = [];

        for (let day = 1; day <= 31; day++) {
            const date = new Date(currentYear, monthIndex, day);

            // Check if the month of the date matches the selected month
            if (date.getMonth() === monthIndex) {
                datesForMonth.push(date);
            }
        }
        function formatDate(inputDate) {
            const date = new Date(inputDate);
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based, so we add 1.
            const year = date.getFullYear().toString();
            return `${day}-${month}-${year}`;
        }
        const todayDate = formatDate(new Date());
        // console.log(todayDate);
        // Insert date entries into the database
        datesForMonth.forEach(async (date) => {
            const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const day = new Date(date).getDay();
            const weekday = weekdays[day];

            // const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
            const formattedDate = formatDate(date); // Format to DD/MM/YYYY
            try {
                if (formattedDate === todayDate) {
                    var body = {
                        eid: userData.eid, date: formattedDate, day: weekday, month: event.target.value, clockin: loginTime, clockout: '—', overtime: 0, totalhours: 0, pause: '00:00:00', resume: '00:00:00'
                    };
                }
                else {
                    var body = {
                        eid: userData.eid, date: formattedDate, day: weekday, month: event.target.value, clockin: '—', clockout: '—', overtime: 0, totalhours: 0, pause: '00:00:00', resume: '00:00:00'
                    };
                }
                var result = await postData('timesheet/insertTimesheet', body);
                // console.log('Result Timesheet', result);
            }
            catch (error) {
                console.log(error);
            }

        });
        const config = {
            headers: {
                Authorization: `Bearer ${userData.token}`,
            },
        };
        if (selectedMonth === '') {
            try {
                const ID = userData.eid;
                const months = month[new Date().getMonth()];
                var results = await getData(`timesheet/getTimesheet/${ID}/${months}`, config);
                // console.log('getTimesheet', results);
                setTimesheetData(results);
            } catch (error) {
                console.log(error);
            }
        }
        else {
            try {
                const ID = userData.eid;
                const month = selectedMonth;
                var results = await getData(`timesheet/getTimesheet/${ID}/${month}`, config);
                // console.log('getTimesheet', results);
                setTimesheetData(results);
            } catch (error) {
                console.log(error);
            }
        }
    };

    const currentMonth = month[new Date().getMonth()];
    useEffect(() => {
        handleMonthClick({ target: { value: selectedMonth } });
    }, [selectedMonth]);

    // console.log(timesheetData);

    function formatDate(inputDate) {
        const date = new Date(inputDate);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based, so we add 1.
        const year = date.getFullYear().toString();
        return `${day}-${month}-${year}`;
    }
    const currentDate = formatDate(new Date());

    return (
        <>
            <div className="middle-container timesheettop">
                <div style={{color:"#6a7983",letterSpacing:"1px",fontWeight:"bold",textTransform:"uppercase",fontSize:"18px"}}>Timesheet</div>
                <select value={selectedMonth === '' ? currentMonth : selectedMonth} onChange={handleMonthClick}>
                    {month.map((data) => (
                        <option key={data._id}>{data}</option>
                    ))}
                </select>
            </div>

            <div className="timesheetContainer">
                <TableContainer component={Paper} style={{ backgroundColor: '#fff', border: 'none', outline: 'none', boxShadow: 'none' }}>
                    <Table stickyHeader >
                        <TableHead >
                            <TableRow>
                                <TableCell style={{ fontSize: '16px', fontWeight: 'bold', backgroundColor: '#fff', color: '#576b90' }}>Unique Id</TableCell>
                                <TableCell style={{ fontSize: '16px', fontWeight: 'bold', backgroundColor: '#fff', color: '#576b90' }}>Date</TableCell>
                                <TableCell style={{ fontSize: '16px', fontWeight: 'bold', backgroundColor: '#fff', color: '#576b90' }}>Day</TableCell>
                                <TableCell style={{ fontSize: '16px', fontWeight: 'bold', backgroundColor: '#fff', color: '#576b90' }}>Leave Status</TableCell>
                                <TableCell style={{ fontSize: '16px', fontWeight: 'bold', backgroundColor: '#fff', color: '#576b90', width:"180px" }}>View Timesheet</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {timesheetData !== null && timesheetData !== undefined
                                ?
                                <>
                                    {timesheetData.map((data) => (
                                        <TableRow key={data._id} >
                                            <TableCell style={{color:"#6a7983"}}>
                                                {data._id}
                                            </TableCell>
                                            <TableCell style={{color:"#a5abb3"}}>
                                                {data.date}
                                            </TableCell>
                                            <TableCell style={{color:"#a5abb3"}}>
                                                {data.day}
                                            </TableCell>
                                            <TableCell style={{color:"#a5abb3"}}>
                                                {data.date <= currentDate ?
                                                    <>
                                                        {data.totalhours === 0 ? 'YES' : 'NO'}
                                                    </>
                                                    :
                                                    '-'
                                                }
                                            </TableCell>
                                            <TableCell style={{color:"#a5abb3"}}>
                                                {data.date === currentDate ?
                                                    <Button style={{ backgroundColor: '#868aba', borderRadius: '6px', color: '#fff', cursor: 'pointer', marginRight: '10px' }} onClick={() => showForm(data)}>Fill</Button>
                                                    :
                                                    <Button style={{ backgroundColor: '#868aba', borderRadius: '6px', color: '#fff', cursor: 'not-allowed', marginRight: '10px',opacity:"30%" }} >Fill</Button>}
                                                {data.clockin !== '—' && data.clockout !== '—' ?
                                                    <Button style={{ backgroundColor: '#868aba', borderRadius: '6px', color: '#fff', cursor: 'pointer' }} onClick={() => showView(data)}>View </Button>
                                                    :
                                                    <Button style={{ backgroundColor: '#868aba', borderRadius: '6px', color: '#fff', cursor: 'not-allowed',opacity:"30%" }} >View </Button>}

                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </>
                                :
                                <></>}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
            {openForm ?
                <TimesheetForm onClose={closePopup} data={data} />
                :
                <></>}
            {openView ?
                <TimesheetView onClose={closeView} data={viewData} />
                :
                <></>}

        </>
    );
}
export default Timesheet;
