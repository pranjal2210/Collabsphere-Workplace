import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import React from 'react';

function Viewpayrolltimesheet(props) {
    const handleClose = () => {
        props.onClose();
    };

    function secondsToHMS(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;

        const formattedHours = hours.toString().padStart(2, '0');
        const formattedMinutes = minutes.toString().padStart(2, '0');
        const formattedSeconds = remainingSeconds.toString().padStart(2, '0');

        return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    }

    return (
        <>
            <div className='popup-timesheet'>
                <div className='wrapper-timesheet' style={{ width: '70%', height: '90%' }}>
                    <button className="closeBtn2" onClick={handleClose}>&#10006;</button>
                    <h2>Timesheet <span style={{ fontSize: "16px", color: '#a5abb3' }}>({props.month})</span></h2>
                    <hr />
                    <div className="timesheetContainer" style={{ backgroundColor: '#fff', padding: '0', marginTop: '10px' }}>
                        <TableContainer component={Paper} style={{ border: 'none', outline: 'none', boxShadow: 'none' }}>
                            <Table stickyHeader >
                                <TableHead >
                                    <TableRow>
                                        <TableCell style={{ fontSize: '16px', fontWeight: 'bold', color: '#576b90' }}>EId</TableCell>
                                        <TableCell style={{ fontSize: '16px', fontWeight: 'bold', color: '#576b90' }}>Date</TableCell>
                                        <TableCell style={{ fontSize: '16px', fontWeight: 'bold', color: '#576b90' }}>Day</TableCell>
                                        <TableCell style={{ fontSize: '16px', fontWeight: 'bold', color: '#576b90' }}>Clockin</TableCell>
                                        <TableCell style={{ fontSize: '16px', fontWeight: 'bold', color: '#576b90' }}>Clockout</TableCell>
                                        <TableCell style={{ fontSize: '16px', fontWeight: 'bold', color: '#576b90' }}>Overtime</TableCell>
                                        <TableCell style={{ fontSize: '16px', fontWeight: 'bold', color: '#576b90' }}>Total Hours</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {props.timesheetData !== null && props.timesheetData !== undefined && props.timesheetData.length !== 0
                                        ?
                                        <>
                                            {props.timesheetData.map((data) => (
                                                <TableRow key={data._id}>
                                                    <TableCell style={{ color: "#a5abb3" }}>
                                                        {data.eid}
                                                    </TableCell>
                                                    <TableCell style={{ color: "#a5abb3" }}>
                                                        {data.date}
                                                    </TableCell>
                                                    <TableCell style={{ color: "#a5abb3" }}>
                                                        {data.day}
                                                    </TableCell>
                                                    <TableCell style={{ color: "#a5abb3" }}>
                                                        {data.clockin}
                                                    </TableCell>
                                                    <TableCell style={{ color: "#a5abb3" }}>
                                                        {data.clockout}
                                                    </TableCell>
                                                    <TableCell style={{ color: "#a5abb3" }}>
                                                        {secondsToHMS(data.overtime)}
                                                    </TableCell>
                                                    <TableCell style={{ color: "#a5abb3" }}>
                                                        {secondsToHMS(data.totalhours)}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </>
                                        :
                                        <TableRow>
                                            <TableCell colSpan={7} style={{ textAlign: 'center' }}>
                                                Timesheet not filled by employee.....
                                            </TableCell>
                                        </TableRow>
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>

                </div>
            </div>
        </>
    );
}

export default Viewpayrolltimesheet;
