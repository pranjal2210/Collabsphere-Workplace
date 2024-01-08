import React from 'react';
import '../styles/payroll.css';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { useEffect } from 'react';
import { getData } from '../FetchNodeServices';
import { useState } from 'react';
import PayrollReceipt from './payrollReceipt';


function Payroll() {
    const [displayPayrolls, setDisplayPayrolls] = useState([]);
    const [data, setData] = useState([]);
    const [openPreview, setOpenPreview] = useState(false);

    const userData = JSON.parse(localStorage.getItem("userData"));

    const closePopup = () => {
        setOpenPreview(false);
    };

    const handleDownload = (data) => {
        setData(data);
        setOpenPreview(true);
    };

    const fetchPayroll = async (e) => {
        const config = {
            headers: {
                Authorization: `Bearer ${userData.token}`,
            },
        };

        const currentUserId = userData.eid;
        try {
            var result = await getData(`admin/fetchPayrollByEID/${currentUserId}`, config);
            setDisplayPayrolls(result);
        }
        catch (error) {
            console.log(error);
        }

    };

    useEffect(() => {
        fetchPayroll();
    }, []);


    return (
        <>
            <div className="middle-container timesheettop">
                <div style={{ color: "#6a7983", letterSpacing: "1px", fontWeight: "bold", textTransform: "uppercase", fontSize: "18px" }}>Payroll {new Date().getFullYear()}</div>
            </div>
            <div className="payrollContainer">
                <TableContainer component={Paper} style={{ backgroundColor: '#fff', border: 'none', outline: 'none', boxShadow: 'none' }}>
                    <Table stickyHeader >
                        <TableHead >
                            <TableRow>
                                <TableCell style={{ fontSize: '16px', fontWeight: 'bold', backgroundColor: '#fff', color: '#576b90' }}>Month</TableCell>
                                {/* <TableCell style={{ fontSize: '16px', fontWeight: 'bold', backgroundColor: '#fff', color: '#576b90' }}>Employee ID</TableCell> */}
                                <TableCell style={{ fontSize: '16px', fontWeight: 'bold', backgroundColor: '#fff', color: '#576b90' }}>Receipt ID</TableCell>
                                <TableCell style={{ fontSize: '16px', fontWeight: 'bold', backgroundColor: '#fff', color: '#576b90' }}>Date Generated</TableCell>
                                <TableCell style={{ fontSize: '16px', fontWeight: 'bold', backgroundColor: '#fff', color: '#576b90' }}>Status</TableCell>
                                <TableCell style={{ fontSize: '16px', fontWeight: 'bold', backgroundColor: '#fff', color: '#576b90' }}>Download Receipt</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {displayPayrolls.map((data) => (
                                <TableRow key={data._id}>
                                    <TableCell style={{ color: "#6a7983" }}>
                                        {data.month}
                                    </TableCell>
                                    {/* <TableCell>
                                        {data.eid}
                                    </TableCell> */}
                                    <TableCell style={{ color: "#6a7983" }}>
                                        {data._id}
                                    </TableCell>
                                    <TableCell style={{ color: "#6a7983" }}>
                                        {data.date}
                                    </TableCell>
                                    <TableCell style={{ color: "#6a7983" }}>
                                        {data.isApproved}
                                    </TableCell>
                                    <TableCell style={{ color: "#6a7983" }}>
                                        {data.isApproved === "approved" ?
                                            <>
                                                <Button style={{ backgroundColor: '#868aba', borderRadius: '6px', color: '#fff', cursor: 'pointer' }} onClick={() => handleDownload(data)} >Preview</Button>
                                            </>
                                            :
                                            <>
                                                <Button style={{ backgroundColor: '#868aba', borderRadius: '6px', color: '#fff', cursor: 'not-allowed', opacity: "30%" }} >Preview</Button>
                                            </>

                                        }

                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
            {openPreview ? <PayrollReceipt data={data} onClose={closePopup} /> : <></>}
        </>
    );
}

export default Payroll;
