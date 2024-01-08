import React, { useEffect, useRef, useState } from 'react';
import '../styles/payrollReceipt.css';
import { getData } from '../FetchNodeServices';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Button } from '@mui/material';
import { round } from '@floating-ui/utils';
import ReactToPrint from 'react-to-print';

function PayrollReceipt(props) {
    const [displayusers, setDisplayUsers] = useState({});

    const userData = JSON.parse(localStorage.getItem("userData"));

    const downloadPDF = () => {
        const input = document.getElementById('pdf-content'); // Replace 'pdf-content' with the ID of the element you want to convert to PDF

        html2canvas(input, { dpi: 700 }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait', // or 'landscape'
                unit: 'mm',
                format: 'a5',
              });
              const width = pdf.internal.pageSize.getWidth();
              const height = (canvas.height * width) / canvas.width;
            pdf.addImage(imgData, "PNG", 0, 0, width,height);
            pdf.save('downloaded-file.pdf');
        });
    };

    const fetchUsers = async (e) => {
        console.log("Users refreshed");
        const config = {
            headers: {
                Authorization: `Bearer ${userData.token}`,
            },
        };

        const currentUserId = userData.eid;
        var result = await getData(`admin/displayUsersById/${currentUserId}`, config);
        setDisplayUsers(result.data[0]);
        // console.log("RESULT:", result.data[0]);
    };

    const handleClose = () => {
        props.onClose();
    };

    const componentRef=useRef();
    const handlePrint=()=>{
        window.print()
    }
    
    useEffect(() => {
        fetchUsers();
    }, []);
    return (
        <>
            <div className='popup-timesheet'>
                <div className='wrapper-timesheet' style={{ width: "auto", overflow: "auto",transform:"scale(0.8)" }}  id="pdf-content" >
                <button className="closeBtn2" onClick={handleClose}>&#10006;</button>
                    <div className='Pcontainer' style={{marginTop:'15px'}} ref={componentRef}>
                        <div className='Psub-container'>
                            <div>
                                <div className='pleft'>
                                    <h3>COLLABSPHERE TECHNOLOGIES</h3>
                                    <div className='subheading'>Apollo Bandar, Colaba, Mumbai, Maharashtra 400001, India</div>
                                </div>
                                <div className='pright'>
                                    <h3>Payslip for the Month</h3>
                                    <div>{props.data.month} {new Date().getFullYear()}</div>
                                </div>
                            </div>
                            <hr className='phr' />
                            <div className='section'>
                                <h4>EMPLOYEE SUMMARY</h4>
                                <div className='employeeInfo'>
                                    <p>Employee Name - {displayusers.name}</p>
                                    <p>Designation - {displayusers.designation}</p>
                                    <p>Date of Joining - {displayusers.joining}</p>
                                    <p>Email - {displayusers.email}</p>
                                    <p>Contact - {displayusers.contact}</p>
                                    <p>Address - {displayusers.address}, {displayusers.city}, {displayusers.state}, {displayusers.country}, {displayusers.pincode}</p>
                                </div>
                            </div>
                            <div className='section'>
                                <h4>ACCOUNT SUMMARY</h4>
                                <div className='employeeInfo'>
                                    <p>Pancard Number - {displayusers.pancard}</p>
                                    <p>Account Number - {displayusers.accountno}</p>
                                    <p>IFSC Code - {displayusers.ifsc}</p>
                                </div>
                            </div>
                            <div className='section2'>
                                <table id="customers">
                                    <tr>
                                        <th>Earnings</th>
                                        <th>Amount</th>
                                    </tr>
                                    <tr>
                                        <td>Basic Salary</td>
                                        <td>&#x20B9; {(((displayusers.package) - (displayusers.package) * props.data.tax) / 12).toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <td>Overtime Bonus</td>
                                        <td>&#x20B9; {(props.data.overtimepay).toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ color: '#ddd' }}>-</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>Gross Earnings</td>
                                        <td>&#x20B9; {(((displayusers.package) - (displayusers.package) * props.data.tax) / 12 + props.data.overtimepay).toFixed(2)}</td>
                                    </tr>
                                </table>
                                <table id="customers">
                                    <tr>
                                        <th>Deductions</th>
                                        <th>Amount</th>
                                    </tr>
                                    <tr>
                                        <td>Income Tax <small>(Yearly)</small> </td>
                                        <td>{props.data.tax * 100}%</td>
                                    </tr>
                                    <tr>
                                        <td>Provident Fund <small>({props.data.pf})</small></td>
                                        <td>&#x20B9; {props.data.pfamount}</td>
                                    </tr>
                                    <tr>
                                        <td>LOP</td>
                                        <td>&#x20B9; {props.data.lop}</td>
                                    </tr>
                                    <tr>
                                        <td>Total Deductions</td>
                                        <td>&#x20B9; {props.data.pfamount + props.data.lop}</td>
                                    </tr>
                                </table>

                            </div>
                            <div className='section'>
                                <div className='salarydiv'>
                                    <p>Total Net Payable</p>
                                    <p style={{ fontSize: '12px' }}>Gross Earnings - Total Deductions</p>
                                </div>
                                <div className='pright2'>
                                    &#x20B9; {(props.data.finalsalary).toFixed(2)}
                                </div>
                            </div>
                            <div style={{ fontSize: "11px", textAlign: "right", marginTop: "10px" }}>Receipt ID : {props.data._id}</div>
                        </div>
                    </div>
                    <ReactToPrint trigger={()=>(
                    <Button variant="contained" size="large" sx={{ width: "200px", backgroundColor: "#868aba", marginTop: "20px", '&:hover': { backgroundColor: '#868aba66' }, height: "50px" }} onClick={handlePrint}>Download</Button>
                    )}
                    content={()=>componentRef.current}
                    />
                </div>
            </div>
        </>
    );
}

export default PayrollReceipt;
