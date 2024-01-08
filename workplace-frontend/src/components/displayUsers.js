import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Collapse, Alert, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddUserForm from './addUserForm';
import { getData, postData } from '../FetchNodeServices';
import UpdateUserForm from './updateUserForm';


function DisplayUsers() {
    const [openForm, setOpenForm] = useState(false);
    const [openUpdateForm, setOpenUpdateForm] = useState(false);
    const [displayusers, setDisplayUsers] = useState([]);
    const [data, setData] = useState([]);
    const [updateForm, getUpdateForm] = useState(false);
    const [openAlert, setOpenAlert] = React.useState(false);
    const [alertMsg, setAlertMsg] = React.useState("");
    const [alertType, setAlertType] = React.useState("success");
    const userData = JSON.parse(localStorage.getItem("userData"));
    const showForm = () => {
        setOpenForm(!openForm);
    };
    const showUpdateForm = (e) => {
        setData(e);
        getUpdateForm(!updateForm);
    };
    const deleteUser = async (data) => {
        const isConfirmed = window.confirm('Are you sure you want to delete this item?');
        if (isConfirmed) {
            var result = await postData(`admin/deleteUsers/${data._id}`);
            setAlertMsg(result.message);
            setAlertType(result.msgType);
            setOpenAlert(true);
            if (result.msgType === "success") {
                fetchUsers();
            }
        }
    };
    const closePopup = () => {
        setOpenForm(false);
    };
    const closeUpdatePopup = () => {
        getUpdateForm(false);
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
                <div style={{ color: "#6a7983", letterSpacing: "1px", fontWeight: "bold", textTransform: "uppercase", fontSize: "18px" }}>Employees</div>
                <div>
                    <Button style={{ backgroundColor: "#fff", color: "#00cacb", borderRadius: "2px", fontSize: "12px", border: "1px solid #00cacb" }} onClick={showForm}><i className='fa-solid fa-plus' style={{ marginRight: "10px" }}></i>Add Employee</Button>
                </div>
            </div>
            <div className="payrollContainer">
                <TableContainer component={Paper} style={{ backgroundColor: '#fff', border: 'none', outline: 'none', boxShadow: 'none' }}>
                    <Table stickyHeader >
                        <TableHead >
                            <TableRow>
                                {/* <TableCell style={{ fontSize: '16px', fontWeight: 'bold', backgroundColor: '#fff', color: '#576b90' }}>Unique ID</TableCell> */}
                                <TableCell style={{ fontSize: '16px', fontWeight: 'bold', backgroundColor: '#fff', color: '#576b90' }}>Employee ID</TableCell>
                                <TableCell style={{ fontSize: '16px', fontWeight: 'bold', backgroundColor: '#fff', color: '#576b90' }}>Name</TableCell>
                                <TableCell style={{ fontSize: '16px', fontWeight: 'bold', backgroundColor: '#fff', color: '#576b90' }}>Email</TableCell>
                                <TableCell style={{ fontSize: '16px', fontWeight: 'bold', backgroundColor: '#fff', color: '#576b90' }}>Contact</TableCell>
                                <TableCell style={{ fontSize: '16px', fontWeight: 'bold', backgroundColor: '#fff', color: '#576b90' }}>Designation</TableCell>
                                <TableCell style={{ fontSize: '16px', fontWeight: 'bold', backgroundColor: '#fff', color: '#576b90' }}>Update/Delete</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {displayusers.map((data) => (
                                <TableRow >
                                    {/* <TableCell  style={{ color: "#6a7983" }}>
                                        {data._id}
                                    </TableCell> */}
                                    <TableCell style={{ color: "#6a7983" }}>
                                        {data.eid}
                                    </TableCell>
                                    {data.name && data.email && data.contact ?
                                        <>
                                            <TableCell style={{ color: "#a5abb3" }}>
                                                {data.name}
                                            </TableCell>
                                            <TableCell style={{ color: "#a5abb3" }}>
                                                {data.email}
                                            </TableCell>
                                            <TableCell style={{ color: "#a5abb3" }}>
                                                {data.contact}
                                            </TableCell>
                                        </>
                                        :
                                        <TableCell colSpan={3} sx={{ textAlign: "center", letterSpacing: "2px", wordSpacing: "10px", color: "#a5abb3" }}>
                                            Employee not registered
                                        </TableCell>
                                    }
                                    <TableCell style={{ color: "#a5abb3" }}>
                                        {data.designation}
                                    </TableCell>
                                    <TableCell style={{ color: "#a5abb3" }}>
                                        <i className='fa-solid fa-pen-to-square' style={{ color: "#868aba", fontSize: "22px", cursor: "pointer", marginRight: "1rem" }} title='Update' onClick={() => showUpdateForm(data)}></i>
                                        <i className='fa-solid fa-trash-can' style={{ color: "#868aba", fontSize: "22px", cursor: "pointer" }} title='Delete' onClick={() => deleteUser(data)}></i>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
            {openForm ?
                <AddUserForm onClose={closePopup} fetchUsers={fetchUsers} showForm={showForm} setAlertMsg={setAlertMsg} setAlertType={setAlertType} setOpenAlert={setOpenAlert} />
                :
                <></>}
            {updateForm ?
                <UpdateUserForm onClose={closeUpdatePopup} data={data} fetchUsers={fetchUsers} showUpdateForm={showUpdateForm} setAlertMsg={setAlertMsg} setAlertType={setAlertType} setOpenAlert={setOpenAlert} />
                :
                <></>}
        </>
    );
}

export default DisplayUsers;
