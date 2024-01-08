import { Alert, Button, Collapse, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import React, { useEffect, useState } from 'react';
import '../styles/adminpage.css';
import { getData, postData } from '../FetchNodeServices';
import Viewpayrolltimesheet from './viewpayrolltimesheet';

function Adminpayrollview() {
    const [selectedMonth, setSelectedMonth] = useState('');
    const [payrollView, setPayrollView] = useState(false);
    const [timesheetData, setTimesheetData] = useState([]);
    const [displayusers, setDisplayUsers] = useState([]);
    const [displayPayroll, setDisplayPayroll] = useState([]);
    const [openAlert, setOpenAlert] = React.useState(false);
    const [alertMsg, setAlertMsg] = React.useState("");
    const [alertType, setAlertType] = React.useState("success");

    const handleClose = () => {
        setPayrollView(false);
    };

    const userData = JSON.parse(localStorage.getItem("userData"));

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // var pfamount = (((data.package) - (data.package) * tax) / 12) - ((((data.package) - (data.package) * tax) / 12) * 0.12);

    const handleSelectMonth = async (monthName) => {
        setSelectedMonth(monthName);
        displayusers.forEach(async (data) => {
            try {
                if (data.email !== '') {
                    if (data.package >= 0 && data.package <= 250000) {
                        var tax = 0;
                        var pfamount = (((data.package) - (data.package) * tax) / 12) * 0.12;

                    }
                    else if (data.package > 250000 && data.package <= 500000) {
                        var tax = 0.05;
                        var pfamount = (((data.package) - (data.package) * tax) / 12) * 0.12;

                    }
                    else if (data.package > 500000 && data.package <= 750000) {
                        var tax = 0.1;
                        var pfamount = (((data.package) - (data.package) * tax) / 12) * 0.12;

                    }
                    else if (data.package > 750000 && data.package <= 1000000) {
                        var tax = 0.15;
                        var pfamount = (((data.package) - (data.package) * tax) / 12) * 0.12;

                    }
                    else {
                        var tax = 0.2;
                        var pfamount = (((data.package) - (data.package) * tax) / 12) * 0.12;
                    }
                    var body = {
                        eid: data.eid, name: data.name, designation: data.designation, isApproved: "pending...", date: '—', tax: tax, pfamount: pfamount, pf: '12%', overtimepay: 0, lop: 0, finalsalary: 0, month: monthName, package: data.package
                    };
                    var result = await postData('admin/insertPayroll', body);
                    // console.log('Result Payroll', result);
                }
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
        if (monthName !== '') {
            try {
                var result = await getData(`admin/fetchPayroll/${monthName}`, config);
                setDisplayPayroll(result);
            }
            catch (error) {
                console.log(error);
            }
        }
        else {
            console.log('hhjkhjkhj');
        }

    };

    const handleViewClick = async (event) => {
        setPayrollView(true);
        const config = {
            headers: {
                Authorization: `Bearer ${userData.token}`,
            },
        };
        try {
            var results = await getData(`timesheet/getTimesheet/${event.eid}/${selectedMonth}`, config);
            // console.log('getTimesheet', results);
            setTimesheetData(results);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchUsers = async (e) => {
        console.log("Users refreshed");
        const config = {
            headers: {
                Authorization: `Bearer ${userData.token}`,
            },
        };

        const currentUserId = userData.eid;
        var result = await getData(`admin/displayUsers/${currentUserId}`, config);
        setDisplayUsers(result.data);
        // console.log("RESULT:", result.data);
    };

    function formatDate(inputDate) {
        const date = new Date(inputDate);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based, so we add 1.
        const year = date.getFullYear().toString();
        return `${day}-${month}-${year}`;
    }

    const handleApproved = async (data) => {
        const config = {
            headers: {
                Authorization: `Bearer ${userData.token}`,
            },
        };
        try {
            var results = await getData(`timesheet/getTimesheet/${data?.eid}/${selectedMonth}`, config);
            // console.log('getTimesheet', results);

            var totalOvertimeHrs = 0;
            var totalLOP = 0;

            results.map((data) => {
                totalOvertimeHrs = totalOvertimeHrs + data.overtime;
                if (data.totalhours === 0) {
                    totalLOP = totalLOP + 1;
                }
                if ((data.day === "Saturday" || data.day === "Sunday") && data.totalhours !== 0) {
                    totalOvertimeHrs = totalOvertimeHrs + data.totalhours;
                }
            });

            totalLOP = totalLOP * 100;
            const overtimePay = (totalOvertimeHrs / 3600) * 70;

            const currentDate = formatDate(new Date());
            const finalsalary = (((data.package) - (data.package) * data.tax) / 12) - ((((data.package) - (data.package) * data.tax) / 12) * 0.12) + overtimePay - totalLOP;

            var body = { isApproved: "approved", date: currentDate, finalsalary: finalsalary, overtimepay: overtimePay, lop: totalLOP };
            var result = await postData(`admin/updatePayroll/${data._id}`, body);
            if (result) {
                setAlertMsg(result.message);
                setAlertType(result.msgType);
                setOpenAlert(true);
                handleSelectMonth(selectedMonth);
            }
        }
        catch (error) {
            console.log(error);
        }
    };

    const handleRejected = async (data) => {
        const config = {
            headers: {
                Authorization: `Bearer ${userData.token}`,
            },
        };
        try {
            const currentDate = formatDate(new Date());
            var body = { isApproved: "rejected", date: currentDate, finalsalary: 0, overtimepay: 0, lop: 0 };
            var result = await postData(`admin/updatePayroll/${data._id}`, body);
            if (result) {
                setAlertMsg(result.message);
                setAlertType(result.msgType);
                setOpenAlert(true);
                handleSelectMonth(selectedMonth);
            }
        }
        catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        if (openAlert) {
            const timer = setTimeout(() => {
                setOpenAlert(false);
            }, 4000);

            return () => {
                clearTimeout(timer); // Clear the timer if the component unmounts before the timeout
            };
        }
    }, [openAlert]);

    // console.log(selectedMonth);

    return (
        <>
            <Collapse in={openAlert} sx={{ position: "absolute", top: "20px", right: "40px", height: "auto", zIndex: 2000, boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px", }}>
                <Alert severity={alertType}
                    action={
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => {
                                setOpenAlert(false);
                            }}
                        >
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }
                    sx={{ fontSize: "16px" }}
                >
                    {alertMsg}
                </Alert>
            </Collapse>
            <div className="middle-container timesheettop">
                <div style={{ color: "#6a7983", letterSpacing: "1px", fontWeight: "bold", textTransform: "uppercase", fontSize: "18px" }}>Payroll {new Date().getFullYear()}</div>
                <select onChange={(event) => handleSelectMonth(event.target.value)}>
                    <option value=''>-Select Month-</option>
                    {monthNames.map((data) => (
                        <option key={data._id}>{data}</option>
                    ))}
                </select>
            </div>
            <div className="payrollContainer" >
                <TableContainer component={Paper} style={{ backgroundColor: '#fff', border: 'none', outline: 'none', boxShadow: 'none' }}>
                    <Table stickyHeader >
                        <TableHead >
                            <TableRow>
                                <TableCell style={{ fontSize: '16px', fontWeight: 'bold', backgroundColor: '#fff', color: '#576b90' }}>Employee ID</TableCell>
                                <TableCell style={{ fontSize: '16px', fontWeight: 'bold', backgroundColor: '#fff', color: '#576b90' }}>Name</TableCell>
                                <TableCell style={{ fontSize: '16px', fontWeight: 'bold', backgroundColor: '#fff', color: '#576b90' }}>Designation</TableCell>
                                {/* <TableCell style={{ fontSize: '16px', fontWeight: 'bold', backgroundColor: '#fff', color: '#576b90' }}>Receipt ID</TableCell> */}
                                <TableCell style={{ fontSize: '16px', fontWeight: 'bold', backgroundColor: '#fff', color: '#576b90' }}>Date</TableCell>
                                <TableCell style={{ fontSize: '16px', fontWeight: 'bold', backgroundColor: '#fff', color: '#576b90' }}>Status</TableCell>
                                <TableCell style={{ fontSize: '16px', fontWeight: 'bold', backgroundColor: '#fff', color: '#576b90' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {displayPayroll.map((data) => (
                                <>
                                    {data.email !== '' ?
                                        <TableRow >
                                            <TableCell style={{ color: "#6a7983" }}>
                                                {data.eid}
                                            </TableCell>
                                            <TableCell style={{ color: "#a5abb3" }}>
                                                {data.name}
                                            </TableCell>
                                            <TableCell style={{ color: "#a5abb3" }}>
                                                {data.designation}
                                            </TableCell>
                                            {/* <TableCell>
                                                {data._id}
                                            </TableCell> */}
                                            <TableCell style={{ color: "#a5abb3" }}>
                                                {data.date === "—" ?
                                                    "—"
                                                    :
                                                    data.date
                                                }
                                            </TableCell>
                                            <TableCell style={{ color: "#a5abb3" }}>
                                                {data.isApproved}
                                            </TableCell>
                                            <TableCell style={{ color: "#a5abb3" }}>
                                                {selectedMonth !== '' ?
                                                    <i className="fa-regular fa-eye" onClick={() => handleViewClick(data)} style={{ fontSize: "22px", marginRight: "10px", color: "#576b90", cursor: "pointer" }}></i>
                                                    :
                                                    <i className="fa-regular fa-eye" style={{ fontSize: "22px", marginRight: "10px", color: "#576b90", cursor: "pointer" }}></i>
                                                }
                                                {data.isApproved === "approved" ?
                                                    <i className="fa-regular fa-circle-check" style={{ fontSize: "22px", marginRight: "10px", color: "#007400", cursor: "not-allowed", opacity: '0.3' }}></i>
                                                    :
                                                    <i className="fa-regular fa-circle-check" style={{ fontSize: "22px", marginRight: "10px", color: "#007400", cursor: "pointer" }} onClick={() => handleApproved(data)}></i>

                                                }
                                                {data.isApproved === "rejected" ?
                                                    <i className="fa-regular fa-circle-xmark" style={{ fontSize: "22px", color: "#ae0000", cursor: "not-allowed", opacity: '0.3' }}></i>
                                                    :
                                                    <i className="fa-regular fa-circle-xmark" style={{ fontSize: "22px", color: "#ae0000", cursor: "pointer" }} onClick={() => handleRejected(data)}></i>
                                                }

                                            </TableCell>
                                        </TableRow>
                                        :
                                        <></>}
                                </>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
            {payrollView ?
                <Viewpayrolltimesheet onClose={handleClose} timesheetData={timesheetData} month={selectedMonth} />
                :
                <></>
            }

        </>
    );
}

export default Adminpayrollview;
