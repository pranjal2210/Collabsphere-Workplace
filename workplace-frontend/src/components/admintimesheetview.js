import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import React, { useState } from 'react';
import { getData } from '../FetchNodeServices';
import TimesheetView from './timesheetView';

function Admintimesheetview() {
    const [timesheetDataByDate, setTimesheetDataByDate] = useState([]);
    const [openView, setOpenView] = useState(false);
    const [viewData, setViewData] = useState([]);

    const userData = JSON.parse(localStorage.getItem("userData"));

    function formatDate(inputDate) {
        const date = new Date(inputDate);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based, so we add 1.
        const year = date.getFullYear().toString();
        return `${day}-${month}-${year}`;
    }

    const fetchtimesheetdata = async (event) => {
        const config = {
            headers: {
                Authorization: `Bearer ${userData.token}`,
            },
        };
        try {
            const date = formatDate(new Date(event.target.value));
            var results = await getData(`admin/getAdminTimesheetByDate/${date}`, config);
            // setTimesheetDataByDate(results);

            const timesheetData = results;
            const updatedTimesheetData = [];
            for (const item of timesheetData) {
                const userData = await getData(`admin/displayAUser/${item.eid}`, config);
                const updatedItem = {
                    ...item, userData
                };
                updatedTimesheetData.push(updatedItem);
            }

            // console.log('asdasd', updatedTimesheetData);
            setTimesheetDataByDate(updatedTimesheetData);
        } catch (error) {
            console.log(error);
        }
    };

    const handleShowForm = (event) => {
        setViewData(event);
        setOpenView(true);
    };

    const closeView = () => {
        setOpenView(false);
    };

    return (
        <>
            <div className="middle-container timesheettop">
                <div style={{ color: "#6a7983", letterSpacing: "1px", fontWeight: "bold", textTransform: "uppercase", fontSize: "18px" }}>Timesheet Data</div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ color: '#576b90', fontSize: "15px", marginRight:'6px' }}>Select Date :</span>
                    <input type='date' style={{ padding: "5px 10px", borderRadius: '2px', border: "1px solid #00cacb" }} onChange={(event) => fetchtimesheetdata(event)} />
                </div>

            </div>
            <div className="payrollContainer">
                <TableContainer component={Paper} style={{ backgroundColor: '#fff', border: 'none', outline: 'none', boxShadow: 'none' }}>
                    <Table stickyHeader >
                        <TableHead >
                            <TableRow>
                                <TableCell style={{ fontSize: '16px', fontWeight: 'bold', backgroundColor: '#fff', color: '#576b90' }}>Employee ID</TableCell>
                                <TableCell style={{ fontSize: '16px', fontWeight: 'bold', backgroundColor: '#fff', color: '#576b90' }}>Name</TableCell>
                                <TableCell style={{ fontSize: '16px', fontWeight: 'bold', backgroundColor: '#fff', color: '#576b90' }}>Designation</TableCell>
                                <TableCell style={{ fontSize: '16px', fontWeight: 'bold', backgroundColor: '#fff', color: '#576b90' }}>Leave Status</TableCell>
                                <TableCell style={{ fontSize: '16px', fontWeight: 'bold', backgroundColor: '#fff', color: '#576b90' }}>Detailed View</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {timesheetDataByDate.length !== 0 ?
                                <>
                                    {timesheetDataByDate.map((data) => (
                                        <>
                                            <TableRow >
                                                <TableCell style={{ color: "#6a7983" }}>
                                                    {data.eid}
                                                </TableCell>
                                                <TableCell style={{ color: "#a5abb3" }}>
                                                    {data.userData.name}
                                                </TableCell>
                                                <TableCell style={{ color: "#a5abb3" }}>
                                                    {data.userData.designation}
                                                </TableCell>
                                                <TableCell style={{ color: "#a5abb3" }}>
                                                    {data.totalhours === 0 ? 'YES' : 'NO'}
                                                </TableCell>
                                                <TableCell style={{ color: "#a5abb3" }}>
                                                    <Button style={{ backgroundColor: '#868aba', borderRadius: '6px', color: '#fff', cursor: 'pointer', marginRight: '10px' }} onClick={() => handleShowForm(data)}>View More</Button>
                                                </TableCell>
                                            </TableRow>
                                        </>
                                    ))}
                                </>
                                :
                                <TableRow>
                                    <TableCell colSpan={5} sx={{ textAlign: "center", color: "#a5abb3" }}>NO DATA</TableCell>
                                </TableRow>
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
            {openView ?
                <TimesheetView onClose={closeView} data={viewData} />
                :
                <></>}
        </>
    );
}

export default Admintimesheetview;
