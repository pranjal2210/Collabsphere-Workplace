import React, { useEffect, useState } from 'react';
import '../styles/adminpage.css';
import { getData, postData } from '../FetchNodeServices';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import { Accordion, AccordionDetails, AccordionSummary, Avatar as MuiAvatar, Box, InputAdornment, List, ListItem, ListItemText, TextField, Typography, Badge, Button } from '@mui/material';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import Avatar from 'react-avatar-edit';


function UpdateTeamsForm(props) {
    const [users, setUsers] = useState([]);
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [members, setMembers] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [openAlert, setOpenAlert] = React.useState(false);
    const [alertMsg, setAlertMsg] = React.useState("");
    const [alertType, setAlertType] = React.useState("success");
    const userData = JSON.parse(localStorage.getItem("userData"));
    const icon = <TaskAltIcon fontSize="small" />;
    const checkedIcon = <CheckBoxIcon fontSize="small" />;
    const [dense, setDense] = React.useState(false);
    const [secondary, setSecondary] = React.useState(false);
    const [isAdmin, setIsAdmin] = useState(true);
    const [dialogs, setDialogs] = useState(false);
    const [croppedImage, setCroppedImage] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    const [nameError, setNameError] = useState('');

    const handleChangeName = (event) => {
        const inputValue = event.target.value;
        const isValidInput = /^[a-zA-Z0-9\s]+$/.test(inputValue);
        if (inputValue === '' || isValidInput) {
            setName(inputValue);
            setNameError('');
            if (inputValue.length === 0) {
                setNameError('*Team name cannot be empty');
            }
        }
        else {
            setNameError('*Team name must contain alphabets');
        }
    };


    const onCrop = (e) => {
        // console.log('onCrop', e);
        setCroppedImage(e);
    };

    const onClose = async (e) => {
        setProfileImage(croppedImage);
        setDialogs(false);
        const body = { channelID: id, image: croppedImage };
        var result = await postData('admin/updateImage', body);
        setAlertMsg(result.message);
        setAlertType(result.msgType);
        setOpenAlert(true);
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    };


    const handleClose = () => {
        props.onClose();
    };

    const fetchUsers = async (e) => {
        const config = {
            headers: {
                Authorization: `Bearer ${userData.token}`,
            },
        };

        const currentUserId = userData.eid;
        var result = await getData(`channel/displayUsers/${currentUserId}`, config);
        setUsers(result.data);
    };

    const addAdmins = async (data) => {
        const body = { channelID: id, adminID: data };
        var result = await postData('admin/updateAdmins', body);
        setAlertMsg(result.message);
        setAlertType(result.msgType);
        setOpenAlert(true);
        setTimeout(() => {
            window.location.reload();
        }, 250);
    };
    const addMembers = async (data) => {
        const body = { channelID: id, memberID: data };
        var result = await postData('admin/updateMembers', body);
        setAlertMsg(result.message);
        setAlertType(result.msgType);
        setOpenAlert(true);
        setTimeout(() => {
            window.location.reload();
        }, 250);
    };
    const removeAdmins = async (data) => {
        const body = { channelID: id, adminID: data };
        var result = await postData('admin/deleteAdmins', body);
        setAlertMsg(result.message);
        setAlertType(result.msgType);
        setOpenAlert(true);
        setTimeout(() => {
            window.location.reload();
        }, 250);
    };
    const removeMembers = async (data) => {
        const body = { channelID: id, memberID: data };
        var result = await postData('admin/deleteMembers', body);
        setAlertMsg(result.message);
        setAlertType(result.msgType);
        setOpenAlert(true);
        setTimeout(() => {
            window.location.reload();
        }, 250);
    };

    const updateName = async () => {
        const body = { id: id, name: name };
        if (name.length === 0) {
            setNameError('*Team name cannot be empty');
        }
        else {
            var result = await postData('admin/updateChannelName', body);
            if (result) {
                setAlertMsg(result.message);
                setAlertType(result.msgType);
                setOpenAlert(true);
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            }
        }
    };

    const [expanded, setExpanded] = React.useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    function getInitials(name) {
        if (name !== null && name !== undefined) {
            const nameArray = name.split(' ');
            const initials = nameArray.map(word => word[0].toUpperCase()).join('');
            return initials;
        }
    }
    function checkIsAdmin(data) {
        var val = true;
        admins.map((value) => {
            if (value._id === data) {
                val = false;
            }
        });
        return val;
    }
    function checkIsMember(data) {
        var val = true;
        members.map((value) => {
            if (value._id === data) {
                val = false;
            }
        });
        return val;
    }
    const getUsers = () => {
        setId(props.data._id);
        setName(props.data.channelName);
        setMembers(props.data.members);
        setAdmins(props.data.admins);
        setProfileImage(props.data.image);
    };


    useEffect(() => {
        getUsers();
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

    useEffect(() => {
        if (openAlert) {
            const timer = setTimeout(() => {
                setOpenAlert(false);
            }, 4000);

            return () => {
                clearTimeout(timer); // Clear the timer if the component unmounts before the timeout
            };
        }
    }, [openAlert]); // Run the effect whenever openAlert changes

    return (
        <div className='popup-timesheet'>
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
            <div className='wrapper-timesheet' style={{ width: "50%", maxHeight: "90vh", overflow: "auto" }}>
                <button className="closeBtn2" onClick={handleClose}>&#10006;</button>
                <h2>Update Teams</h2>
                <hr />
                <Box sx={{ display: 'flex', justifyContent: 'center', width: "90%", flexDirection: "column", gap: "10px", marginTop: "10px", alignItems: 'center' }}>
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
                                props.data.image !== null ?
                                    <MuiAvatar sx={{ width: 80, height: 80, outline: "2px solid #868aba" }} src={profileImage} />

                                    :
                                    <MuiAvatar sx={{ bgcolor: '#868aba', color: "#fff", width: 80, height: 80, fontSize: "26px" }}>{getInitials(props.data.channelName)}</MuiAvatar>

                            }
                        </Badge>
                    </div>
                    <TextField
                        spellCheck='false'
                        label="Team Name"
                        size='small'
                        variant="outlined"
                        value={name}
                        onChange={handleChangeName}
                        helperText={nameError}
                        sx={{
                            '& .MuiFormHelperText-root': {
                                color: 'red', // Change the color of the helper text
                                margin: '0', // Change the padding of the helper text
                                marginLeft: '14px',
                                position: 'absolute',
                                bottom: '-20px'
                            },
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
                            marginBottom: "20px",
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
                    <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')} style={{ width: '100%' }}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon style={{ color: "#868aba" }} />}
                            aria-controls="panel1bh-content"
                            id="panel1bh-header"
                        >
                            <Typography sx={{ width: '33%', flexShrink: 0, color: "#6a7983", fontSize: "14px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1px" }}>
                                Add Admins
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>

                            <List >
                                {users.map((data) => (
                                    <>
                                        {data.name !== "" && checkIsAdmin(data._id) ?
                                            <>
                                                <ListItem
                                                    secondaryAction={
                                                        <Tooltip title="Click to Add Admin">
                                                            <IconButton edge="end" aria-label="delete" onClick={() => addAdmins(data._id)} style={{ marginRight: "10px" }}>
                                                                <PersonAddAlt1Icon style={{ color: "#868aba" }} />
                                                            </IconButton>
                                                        </Tooltip>
                                                    }
                                                    style={{ padding: "0px 20px" }}
                                                >
                                                    <ListItemText
                                                        primary={data.name}
                                                        primaryTypographyProps={{ style: { fontSize: "14px", color: "#6a7983" } }}
                                                        secondary={" (" + data.designation + ")"}
                                                        secondaryTypographyProps={{ style: { fontSize: "12px", color: "#a5abb3" } }}
                                                    />
                                                </ListItem>
                                            </>
                                            :
                                            <></>
                                        }
                                    </>
                                ))
                                }
                            </List>

                        </AccordionDetails>
                    </Accordion>
                    <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')} style={{ width: '100%' }}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon style={{ color: "#868aba" }} />}
                            aria-controls="panel2bh-content"
                            id="panel2bh-header"
                        >
                            <Typography sx={{ width: '33%', flexShrink: 0, color: "#6a7983", fontSize: "14px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1px" }}>Add Participants</Typography>
                        </AccordionSummary>
                        <AccordionDetails>

                            <List dense={dense}>
                                {users.map((data) => (
                                    <>
                                        {data.name !== "" && checkIsMember(data._id) ?
                                            <>
                                                <ListItem
                                                    secondaryAction={
                                                        <Tooltip title="Click to Add Participants">
                                                            <IconButton edge="end" aria-label="delete" onClick={() => addMembers(data._id)} style={{ marginRight: "10px" }}>
                                                                <PersonAddAlt1Icon style={{ color: "#868aba" }} />
                                                            </IconButton>
                                                        </Tooltip>
                                                    }
                                                    style={{ padding: "0px 20px" }}
                                                >
                                                    {/* <ListItemAvatar>
                                                <Avatar>
                                                    <FolderIcon />
                                                </Avatar>
                                            </ListItemAvatar> */}
                                                    <ListItemText
                                                        primary={data.name}
                                                        primaryTypographyProps={{ style: { fontSize: "14px", color: "#6a7983" } }}
                                                        secondary={" (" + data.designation + ")"}
                                                        secondaryTypographyProps={{ style: { fontSize: "12px", color: "#a5abb3" } }}
                                                    />
                                                </ListItem>
                                            </>
                                            : <></>}
                                    </>
                                ))
                                }
                            </List>

                        </AccordionDetails>
                    </Accordion>
                    <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')} style={{ width: '100%' }}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon style={{ color: "#868aba" }} />}
                            aria-controls="panel3bh-content"
                            id="panel3bh-header"
                        >
                            <Typography sx={{ width: '33%', flexShrink: 0, color: "#6a7983", fontSize: "14px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1px" }}>
                                Remove Admins
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>

                            <List dense={dense}>
                                {admins.map((data) => (
                                    <>
                                        {data._id !== userData._id ?
                                            <ListItem
                                                secondaryAction={
                                                    <Tooltip title="Remove">
                                                        <IconButton edge="end" aria-label="delete" onClick={() => removeAdmins(data._id)} style={{ marginRight: "10px" }}>
                                                            <DeleteIcon style={{ color: "#868aba" }} />
                                                        </IconButton>
                                                    </Tooltip>
                                                }
                                            >
                                                {/* <ListItemAvatar>
                                                <Avatar>
                                                    <FolderIcon />
                                                </Avatar>
                                            </ListItemAvatar> */}
                                                <ListItemText
                                                    primary={data.name}
                                                    primaryTypographyProps={{ style: { fontSize: "14px", color: "#6a7983" } }}
                                                />
                                            </ListItem>
                                            :
                                            <></>
                                        }
                                    </>
                                ))
                                }
                            </List>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')} style={{ width: '100%' }}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon style={{ color: "#868aba" }} />}
                            aria-controls="panel4bh-content"
                            id="panel4bh-header"
                        >
                            <Typography sx={{ width: '33%', flexShrink: 0, color: "#6a7983", fontSize: "14px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1px" }}>Remove Participants</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <List dense={dense}>
                                {members.map((data) => (
                                    <ListItem
                                        secondaryAction={
                                            <Tooltip title="Remove">
                                                <IconButton edge="end" aria-label="delete" onClick={() => removeMembers(data._id)} style={{ marginRight: "10px" }}>
                                                    <DeleteIcon style={{ color: "#868aba" }} />
                                                </IconButton>
                                            </Tooltip>
                                        }
                                    >
                                        <ListItemText
                                            primary={data.name}
                                            primaryTypographyProps={{ style: { fontSize: "14px", color: "#6a7983" } }}
                                        />
                                    </ListItem>
                                ))
                                }
                            </List>
                        </AccordionDetails>
                    </Accordion>
                </Box>

            </div>
            {dialogs &&
                <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.4)", zIndex: "5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ height: "480px", width: "430px", backgroundColor: "#fff", position: "relative" }}>
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

export default UpdateTeamsForm;
