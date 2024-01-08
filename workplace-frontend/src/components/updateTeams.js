import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { getData, postData } from '../FetchNodeServices';
import UpdateTeamsForm from './updateTeamsForm';


function UpdateTeams() {
    const [openForm, setOpenForm] = useState(false);
    const [openUpdateForm, setOpenUpdateForm] = useState(false);
    const [channel, setChannel] = useState([]);
    const [data, setData] = useState([]);
    const [updateChannel, getUpdateChannel] = useState(false);
    const userData = JSON.parse(localStorage.getItem("userData"));
    const showForm = () => {
        setOpenForm(true);
    };
    const showUpdateChannel = (e) => {
        setData(e);
        getUpdateChannel(true);
    };
    const deleteChannel = async (data) => {
        const isConfirmed = window.confirm('Are you sure you want to delete?');
        if (isConfirmed) {
            const body = { channelID: data };
            var result = await postData('admin/deleteChannel', body);
            setTimeout(() => {
                window.location.reload();
            }, 250);
        }
    };
    const closePopup = () => {
        setOpenForm(false);
    };
    const closeUpdatePopup = () => {
        getUpdateChannel(false);
    };
    const fetchChannels = async (e) => {
        const config = {
            headers: {
                Authorization: `Bearer ${userData.token}`,
            },
        };
        var result = await getData(`channel/displayAllChannels`, config);
        // console.log('result', result);
        setChannel(result);
    };

    useEffect(() => {
        fetchChannels();
    }, []);

    return (
        <>
            <div className="middle-container timesheettop">
                <div style={{ color: "#6a7983", letterSpacing: "1px", fontWeight: "bold", textTransform: "uppercase", fontSize: "18px" }}>Update Teams</div>
            </div>
            <div className="payrollContainer">
                <TableContainer component={Paper} style={{ backgroundColor: '#fff', border: 'none', outline: 'none', boxShadow: 'none' }}>
                    <Table stickyHeader >
                        <TableHead >
                            <TableRow>
                                <TableCell style={{ fontSize: '16px', fontWeight: 'bold', backgroundColor: '#fff', color: '#576b90' }}>Unique ID</TableCell>
                                <TableCell style={{ fontSize: '16px', fontWeight: 'bold', backgroundColor: '#fff', color: '#576b90' }}>Team Name</TableCell>
                                <TableCell style={{ fontSize: '16px', fontWeight: 'bold', backgroundColor: '#fff', color: '#576b90' }}>Admins</TableCell>
                                <TableCell style={{ fontSize: '16px', fontWeight: 'bold', backgroundColor: '#fff', color: '#576b90' }}>Members Count</TableCell>
                                <TableCell style={{ fontSize: '16px', fontWeight: 'bold', backgroundColor: '#fff', color: '#576b90' }}>Update/Delete</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {channel.map((data) => (
                                <TableRow >
                                    <TableCell style={{ color: "#6a7983" }}>
                                        {data._id}
                                    </TableCell>
                                    <TableCell style={{ color: "#a5abb3" }}>
                                        {data.channelName}
                                    </TableCell>
                                    <TableCell style={{ color: "#a5abb3" }}>
                                        {data.admins.map((admin) => (
                                            admin.name + ", "
                                        ))}
                                    </TableCell>
                                    <TableCell style={{ color: "#a5abb3" }}>
                                        {data.members.length}
                                    </TableCell>
                                    <TableCell style={{ color: "#a5abb3" }}>
                                        <i className='fa-solid fa-pen-to-square' style={{ color: "#868aba", fontSize: "22px", cursor: "pointer", marginRight: "1rem" }} title='Update' onClick={() => showUpdateChannel(data)}></i>
                                        <i className='fa-solid fa-trash-can' style={{ color: "#868aba", fontSize: "22px", cursor: "pointer" }} title='Delete' onClick={() => deleteChannel(data._id)}></i>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
            {updateChannel ?
                <UpdateTeamsForm onClose={closeUpdatePopup} data={data} />
                :
                <></>}
        </>
    );
}

export default UpdateTeams;
