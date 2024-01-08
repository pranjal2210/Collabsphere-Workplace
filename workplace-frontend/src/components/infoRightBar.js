import React, { useEffect, useState } from 'react';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { Avatar as MuiAvatar, Badge, Button, InputAdornment, List, ListItem, ListItemButton, ListItemIcon, ListItemText, TextField, Tooltip } from '@mui/material';
import Avatar from 'react-avatar-edit';
import { getData, postData } from '../FetchNodeServices';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import '../styles/homepage.css';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import GroupRemoveIcon from '@mui/icons-material/GroupRemove';
import AddParticipants from './addParticipants';
import RemoveParticipants from './removeParticipants';

function InfoRightbar(props) {
    const [state, setState] = useState(false);
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [participants, setParticipants] = useState([]);
    const [addParticipants, getAddParticipants] = useState(false);
    const [removeParticipants, getRemoveParticipants] = useState(false);
    const [data, setData] = useState([]);
    const [common, setCommon] = useState(0);
    const [dialogs, setDialogs] = useState(false);
    const [croppedImage, setCroppedImage] = useState(null);
    const [profileImage, setProfileImage] = useState(null);

    const onCrop = (e) => {
        // console.log('onCrop', e);
        setCroppedImage(e);
    };

    const onClose = async (e) => {
        setProfileImage(croppedImage);
        setDialogs(false);
        const body = { channelID: id, image: croppedImage };
        var result = await postData('admin/updateImage', body);
        setTimeout(() => {
            window.location.reload();
        }, 250);
    };


    const userData = JSON.parse(localStorage.getItem("userData"));

    const toggleDrawer = (anchor, open) => (event) => {
        if (
            event &&
            event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')
        ) {
            return;
        }

        setState({ ...state, [anchor]: open });
    };

    function getInitials(name) {
        if (name !== null && name !== undefined && name !== '') {
            const nameArray = name.split(' ');
            const initials = nameArray.map(word => word[0].toUpperCase()).join('');
            return initials;
        }
    }

    const updateName = async () => {
        const body = { id: id, name: name };
        var result = await postData('admin/updateChannelName', body);
    };

    const fetchChannelByID = async (e) => {
        console.log("Users refreshed");
        const config = {
            headers: {
                Authorization: `Bearer ${userData.token}`,
            },
        };
        if (props.channelData !== null) {
            var result = await getData(`channel/displayChannelsById/${props?.channelData?._id}`, config);
            setParticipants(result);
        }
        // console.log("RESULT:", result);
    };

    function formatDate(inputDate) {
        const date = new Date(inputDate);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based, so we add 1.
        const year = date.getFullYear().toString();
        return `${day}-${month}-${year}`;
    }

    function convertTimeFormat(inputTime) {
        // Split the input time string into hours, minutes, and AM/PM parts
        const [timePart, ampm] = inputTime.split(' ');
        const [hours, minutes] = timePart.split(':');

        // Format the time as HH:MM AM/PM
        const formattedTime = `${hours}:${minutes} ${ampm}`;

        return formattedTime;
    }

    function checkIsAdmin(data) {
        var val = true;
        participants.admins.map((value) => {
            if (value._id === data._id) {
                val = false;
            }
        });
        return val;
    }

    const commonParticipants = () => {
        if (props.channelData !== null) {
            var count = 0;
            props?.channelData?.admins?.map((ad) => {
                props?.channelData?.members?.map((mem) => {
                    if (mem === ad) {
                        count++;
                    }
                });
            });
            setCommon(count);
        }
    };

    const handleCreateChat = async (data) => {
        try {
            var body = {
                senderID: userData._id,
                receiverID: data._id
            };
            const result = await postData('chat/createChat', body);
            setTimeout(() => {
                props.onShowChat(result);
            }, 250);
        }
        catch (error) {
            console.log(error);
        }
    };

    const showAddParticipant = (data) => {
        setData(data);
        getAddParticipants(true);
    };
    const showRemoveParticipant = (data) => {
        setData(data);
        getRemoveParticipants(true);
    };

    const closeAddParticipantPopup = () => {
        getAddParticipants(false);
    };
    const closeRemoveParticipantPopup = () => {
        getRemoveParticipants(false);
    };

    useEffect(function () {
        const getUsers = () => {
            setId(props?.channelData?._id);
            setName(props?.channelData?.channelName);
        };
        getUsers();
        fetchChannelByID();
        commonParticipants();
    }, [props]);

    return (
        <div style={{ height: "-webkit-fill-available", backgroundColor: "#fff", position: "absolute", right: props.isOpenRB ? "0" : "-20rem", top: "88px", zIndex: dialogs || addParticipants || removeParticipants ? 4 : 2, width: "18rem", transition: ".5s all ease", overflow: 'auto' }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", padding: "20px" }}>
                {participants.admins !== undefined && participants.admins !== null ?
                    (!checkIsAdmin(userData) ?
                        <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Badge
                                sx={{ cursor: "pointer" }}
                                overlap="circular"
                                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                                onClick={() => setDialogs(true)}
                                badgeContent={
                                    <i className="fa-solid fa-pencil" style={{ color: "#868aba", backgroundColor: "#fff", padding: "4px", borderRadius: "10px" }}></i>
                                }
                            >
                                {
                                    props.channelData.image !== null ?
                                        <MuiAvatar sx={{ width: 80, height: 80, outline: "2px solid #868aba" }} src={props.channelData.image} />

                                        :
                                        <MuiAvatar sx={{ bgcolor: '#868aba', width: 80, height: 80, fontSize: "26px" }}>{getInitials(props.channelData.channelName)}</MuiAvatar>

                                }
                            </Badge>
                        </div>

                        :
                        <>
                            {
                                props.channelData.image === null ?
                                    <MuiAvatar sx={{ bgcolor: '#868aba', width: 80, height: 80, fontSize: "26px" }}>{getInitials(props.channelData.channelName)}</MuiAvatar>
                                    :
                                    <MuiAvatar sx={{ width: 80, height: 80, outline: "2px solid #868aba" }} src={props.channelData.image} />
                            }
                        </>)
                    :
                    <></>
                }


                <div style={{ color: "#6a7983", fontSize: "12px", marginTop: "5px" }}>Total {participants.admins !== undefined ? participants.admins.length + participants.members.length - common : 0} Participants</div>

                {participants.admins !== undefined && participants.admins !== null ?
                    (!checkIsAdmin(userData) ?
                        <TextField
                            spellCheck='false'
                            label="Channel Name"
                            size='small'
                            variant="outlined"
                            value={name}
                            onChange={(event) => { setName(event.target.value); }}
                            sx={{
                                '& .MuiInputLabel-root': {
                                    color: '#868aba', // Default label color
                                },
                                '& .Mui-focused .MuiInputLabel-root': {
                                    color: '#868aba', // Label color when focused
                                },
                                '& .MuiInputBase-root': {
                                    color: '#868aba', // Label color when focused
                                    paddingRight: 0
                                },
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: '#868aba', // Change the outline color
                                        borderRadius: "2px",
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#868aba', // Change the outline color on hover
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#868aba', // Change the outline color when focused
                                    },
                                    '& .MuiInputBase-input': {
                                        color: '#6a7983', // Change the text color inside the TextField
                                        borderRadius: "2px",
                                    },
                                },
                                width: '100%',
                                marginTop: "20px"
                            }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="start">
                                        <Tooltip title="Click to change channel name">
                                            <TaskAltIcon style={{ cursor: 'pointer', color: '#868aba' }} onClick={() => updateName()} />
                                        </Tooltip>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        :
                        <TextField
                            spellCheck='false'
                            disabled
                            size='small'
                            label="Channel Name"
                            variant="outlined"
                            value={name}
                            sx={{
                                '& .MuiInputLabel-root.Mui-disabled': {
                                    color: '#868aba', // Default label color
                                },
                                '& .Mui-focused .MuiInputLabel-root': {
                                    color: '#868aba', // Label color when focused
                                },
                                '& .MuiInputBase-root.Mui-disabled': {
                                    color: '#868aba', // Label color when focused
                                    paddingRight: 0,
                                    backgroundColor: '#e5e5e57a',
                                },
                                '& .MuiOutlinedInput-root.Mui-disabled': {
                                    '& fieldset': {
                                        borderColor: '#868aba', // Change the outline color
                                        borderRadius: "2px",
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#868aba', // Change the outline color on hover
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#868aba', // Change the outline color when focused
                                    },
                                    '& .MuiInputBase-input.Mui-disabled': {
                                        color: '#6a7983', // Change the text color inside the TextField
                                        borderRadius: "2px",
                                    },
                                },
                                width: '100%',
                                marginTop: "20px",
                            }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="start">
                                        <Tooltip>
                                            <TaskAltIcon style={{ color: '#868aba' }} />
                                        </Tooltip>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    )
                    :
                    <></>
                }
            </div>

            <div style={{ width: "100%", padding: '20px', borderBottom: "1px solid #d1d7e0", borderTop: "1px solid #d1d7e0" }}>
                <h4 style={{ color: "#a5abb3", textTransform: "uppercase", fontSize: '15px', letterSpacing: '1px' }}>Channel Description</h4>
                <p style={{ marginTop: "10px", fontSize: "14px", color: "#6a7983" }}>Channel created by Admininstrator on {formatDate(new Date(props?.channelData?.createdAt).toLocaleDateString())} at {convertTimeFormat(new Date(props?.channelData?.createdAt).toLocaleTimeString())}</p>
            </div>

            <div style={{ width: "100%", padding: "20px", flex: 1 }}>
                <div style={{ color: "#a5abb3", textTransform: "uppercase", letterSpacing: '1px', fontSize: "15px", fontWeight: "bold" }}>{participants.admins !== undefined ? participants.admins.length + participants.members.length - common : 0} Participants</div>

                <List>
                    {participants.admins !== undefined && participants.admins !== null ?
                        (!checkIsAdmin(userData) ?
                            <ListItem style={{ marginTop: "10px", padding: 0 }} >
                                {participants.admins ?
                                    <ListItemButton style={{ padding: "0", borderRadius: '4px', cursor: 'pointer' }} onClick={() => showAddParticipant(props.channelData)}>
                                        <ListItemIcon sx={{ minWidth: '40px', marginRight: '8px' }}>
                                            <MuiAvatar sx={{ bgcolor: '#868aba', width: 40, height: 40 }} variant="rounded">
                                                <GroupAddIcon style={{ color: "#fff", fontSize: '26px' }} />
                                            </MuiAvatar>
                                        </ListItemIcon>
                                        <ListItemText primary={"Add Participants"} primaryTypographyProps={{ style: { fontSize: '15px', color: '#6a7983' } }} />
                                    </ListItemButton>
                                    :
                                    <></>
                                }
                            </ListItem>
                            :
                            <></>
                        )
                        :
                        <></>
                    }

                    {participants.admins !== undefined && participants.admins !== null ?
                        <>
                            {participants.admins.map((data) => (
                                <ListItem key={data._id} style={{ marginTop: "10px", padding: 0 }} >
                                    {data._id === userData._id ?
                                        <ListItemButton disableTouchRipple style={{ padding: "0", borderRadius: '4px', cursor: 'default' }}>
                                            <ListItemIcon sx={{ minWidth: '40px', marginRight: '8px' }}>
                                                {data.image === null ?
                                                    <MuiAvatar sx={{ bgcolor: '#868aba', color: "#fff", width: 40, height: 40, fontSize: "16px" }} variant="rounded">{data.name ? getInitials(data.name) : <></>}</MuiAvatar>
                                                    :
                                                    <MuiAvatar variant="rounded" sx={{ width: 40, height: 40, cursor: "pointer" }} src={data.image} />}
                                            </ListItemIcon>

                                            <ListItemText sx={{ margin: 0, display: 'flex', flexDirection: 'column', gap: '0px' }} primary={data.name + " (You)"} secondary={data.designation} primaryTypographyProps={{ style: { fontSize: '14px', color: '#6a7983' } }} secondaryTypographyProps={{ style: { fontSize: '11px', color: '#a5abb3' } }} />

                                            <ListItemText sx={{ margin: 0, display: 'flex', flexDirection: 'column', gap: '2px', alignItems: 'end' }} primary={'Admin'} secondary={data.contact} primaryTypographyProps={{ style: { backgroundColor: "#e7fce3", color: "#1b8748", padding: "2px 6px", borderRadius: "2px", fontSize: "10px" } }} secondaryTypographyProps={{ style: { fontSize: '10px', color: '#a5abb3' } }} />
                                        </ListItemButton>
                                        :
                                        <ListItemButton style={{ padding: "0", borderRadius: '4px' }} onClick={() => handleCreateChat(data)}>
                                            <ListItemIcon sx={{ minWidth: '40px', marginRight: '8px' }}>
                                                {data.image === null ?
                                                    <MuiAvatar variant='rounded' sx={{ bgcolor: '#868aba', width: 40, height: 40, color: "#fff", cursor: "pointer" }}>{data.name ? getInitials(data.name) : <></>}</MuiAvatar>
                                                    :
                                                    <MuiAvatar variant='rounded' sx={{ width: 40, height: 40, cursor: "pointer" }} src={data.image} />}
                                            </ListItemIcon>
                                            <ListItemText sx={{ margin: 0, display: 'flex', flexDirection: 'column', gap: '0px' }} primary={data.name} secondary={data.designation} primaryTypographyProps={{ style: { fontSize: '14px', color: '#6a7983' } }} secondaryTypographyProps={{ style: { fontSize: '11px', color: '#a5abb3' } }} />
                                            <ListItemText sx={{ margin: 0, display: 'flex', flexDirection: 'column', gap: '2px', alignItems: 'end' }} primary={'Admin'} secondary={data.contact} primaryTypographyProps={{ style: { backgroundColor: "#e7fce3", color: "#1b8748", padding: "2px 6px", borderRadius: "2px", fontSize: "10px" } }} secondaryTypographyProps={{ style: { fontSize: '10px', color: '#a5abb3' } }} />
                                        </ListItemButton>
                                    }
                                </ListItem>
                            ))}

                            {participants.members.map((data) => (
                                checkIsAdmin(data) ?
                                    <ListItem key={data._id} style={{ marginTop: "10px", padding: 0 }} >
                                        {data._id === userData._id ?
                                            <ListItemButton disableTouchRipple style={{ padding: "0", borderRadius: '4px', cursor: 'default' }}>
                                                <ListItemIcon sx={{ minWidth: '40px', marginRight: '8px' }} >
                                                    {data.image === null ?
                                                        <MuiAvatar variant='rounded' sx={{ bgcolor: '#868aba', width: 40, height: 40, color: "#fff", cursor: "default" }}>{data.name ? getInitials(data.name) : <></>}</MuiAvatar>
                                                        :
                                                        <MuiAvatar variant='rounded' sx={{ width: 40, height: 40, cursor: "default" }} src={data.image} />}
                                                </ListItemIcon>
                                                <ListItemText sx={{ margin: 0, display: 'flex', flexDirection: 'column', gap: '0px' }} primary={data.name + " (You)"} secondary={data.designation} primaryTypographyProps={{ style: { fontSize: '14px', color: '#6a7983' } }} secondaryTypographyProps={{ style: { fontSize: '11px', color: '#a5abb3' } }} />
                                                <ListItemText sx={{ margin: 0, display: 'flex', flexDirection: 'column', gap: '2px', alignItems: 'end' }} secondary={data.contact} secondaryTypographyProps={{ style: { fontSize: '10px', color: '#a5abb3' } }} />
                                            </ListItemButton>
                                            :
                                            <ListItemButton style={{ padding: "0", borderRadius: '4px' }} onClick={() => handleCreateChat(data)}>
                                                <ListItemIcon sx={{ minWidth: '40px', marginRight: '8px' }}>
                                                    {data.image === null ?
                                                        <MuiAvatar variant='rounded' sx={{ bgcolor: '#868aba', width: 40, height: 40, color: "#fff", cursor: "pointer" }}>{data.name ? getInitials(data.name) : <></>}</MuiAvatar>
                                                        :
                                                        <MuiAvatar variant='rounded' sx={{ width: 40, height: 40, cursor: "pointer" }} src={data.image} />}
                                                </ListItemIcon>
                                                <ListItemText sx={{ margin: 0, display: 'flex', flexDirection: 'column', gap: '0px' }} primary={data.name} secondary={data.designation} primaryTypographyProps={{ style: { fontSize: '14px', color: '#6a7983' } }} secondaryTypographyProps={{ style: { fontSize: '11px', color: '#a5abb3' } }} />
                                                <ListItemText sx={{ margin: 0, display: 'flex', flexDirection: 'column', gap: '2px', alignItems: 'end' }} secondary={data.contact} secondaryTypographyProps={{ style: { fontSize: '10px', color: '#a5abb3' } }} />
                                            </ListItemButton>
                                        }
                                    </ListItem>
                                    :
                                    <></>
                            ))}
                        </>
                        :
                        <>
                        </>
                    }

                    {participants.admins !== undefined && participants.admins !== null ?
                        (!checkIsAdmin(userData) ?
                            <ListItem style={{ marginTop: "10px", padding: 0 }} >
                                {participants.admins ?
                                    <ListItemButton style={{ padding: "0", borderRadius: '4px', cursor: 'pointer' }} onClick={() => showRemoveParticipant(props.channelData)}>
                                        <ListItemIcon sx={{ minWidth: '40px', marginRight: '8px' }}>
                                            <MuiAvatar sx={{ bgcolor: '#868aba', width: 40, height: 40 }} variant="rounded">
                                                <GroupRemoveIcon style={{ color: "#fff", fontSize: '26px' }} />
                                            </MuiAvatar>
                                        </ListItemIcon>
                                        <ListItemText primary={"Remove Participants"} primaryTypographyProps={{ style: { fontSize: '15px', color: '#6a7983' } }} />
                                    </ListItemButton>
                                    :
                                    <></>
                                }
                            </ListItem>
                            :
                            <></>
                        )
                        :
                        <></>
                    }
                </List>
            </div>
            {addParticipants ?
                <AddParticipants onClose={closeAddParticipantPopup} data={data} />
                :
                <></>}
            {removeParticipants ?
                <RemoveParticipants onClose={closeRemoveParticipantPopup} data={data} />
                :
                <></>}
            {dialogs &&
                <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.4)", zIndex: "5", display: "flex", alignItems: "center", justifyContent: "center", zIndex: "1500" }}>
                    <div style={{ height: "480px", width: "430px", backgroundColor: "#fff", position: "relative", borderRadius: '6px' }}>
                        <button className="closeBtn" onClick={() => setDialogs(false)}>&#10006;</button>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", width: "100%" }}>
                            <Avatar
                                width={400}
                                height={400}
                                imageHeight={400}
                                onCrop={onCrop}
                                closeIconColor="red"
                                exportAsSquare
                                exportSize={150}
                                labelStyle={{ width: "100%", lineHeight: "400px", fontSize: "1.25em", fontWeight: "700", color: "#868aba", display: "inline-block", cursor: "pointer" }}
                            />
                            <Button variant="contained" size="small" sx={{ width: "200px", backgroundColor: "#868aba", marginTop: "8px", '&:hover': { backgroundColor: '#868aba66' }, height: "40px" }} onClick={onClose}>Save</Button>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}

export default InfoRightbar;