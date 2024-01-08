import React, { useEffect, useState } from "react";
import { getData, postData } from '../FetchNodeServices';
import '../styles/createTeams.css';
import { Avatar as MuiAvatar, Alert, Autocomplete, Box, Button, Checkbox, Collapse, IconButton, TextField, Badge } from "@mui/material";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CloseIcon from '@mui/icons-material/Close';
import Avatar from "react-avatar-edit";

function CreateTeams() {

    const [users, setUsers] = useState([]);
    const [groupName, setGroupName] = useState('');
    const [members, setMembers] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [openAlert, setOpenAlert] = React.useState(false);
    const [alertMsg, setAlertMsg] = React.useState("");
    const [alertType, setAlertType] = React.useState("success");
    const [dialogs, setDialogs] = useState(false);
    const [croppedImage, setCroppedImage] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    const [nameError, setNameError] = useState('');
    const [memberError, setMemberError] = useState('');

    const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
    const checkedIcon = <CheckBoxIcon style={{ color: "#868aba" }} fontSize="small" />;
    const userData = JSON.parse(localStorage.getItem("userData"));

    const handleChangeName = (event) => {
        const inputValue = event.target.value; // Trim extra spaces
        const isValidInput = /^[a-zA-Z]*(?: [a-zA-Z0-9]*)?$/.test(inputValue);

        if (inputValue === '' || isValidInput) {
            // Capitalize the first letter of each word
            const formattedValue = inputValue
                .split(' ')
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(' ');
            setGroupName(formattedValue);
            setNameError('');

            if (inputValue.length === 0) {
                setNameError('*Name cannot be empty');
            }
        } else {
            setNameError('*enter valid name');
        }
    };

    const onCrop = (e) => {
        // console.log('onCrop', e);
        setCroppedImage(e);
    };

    const onClose = (e) => {
        setProfileImage(croppedImage);
        setDialogs(false);
    };

    const fetchUsers = async (e) => {
        console.log("Users refreshed");
        const config = {
            headers: {
                Authorization: `Bearer ${userData.token}`,
            },
        };

        const currentUserId = userData.eid;
        var result = await getData(`channel/displayUsers/${currentUserId}`, config);
        setUsers(result.data);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const currentUser_id = userData._id;
        try {
            var body = { channelName: groupName, members: members, admins: [...admins, currentUser_id], image: profileImage };
            if (groupName.length === 0) {
                setNameError('*Team name cannot be empty');
            }
            else if (members.length === 0) {
                setMemberError('*please select atleast one member to create team');
            }
            else {
                var result = await postData("channel/createChannelChat", body);
                setAlertMsg(result.message);
                setAlertType(result.msgType);
                setOpenAlert(true);
                setGroupName('');
                setCroppedImage(null);
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            }

        } catch (error) {
            console.error('Error sending data:', error);
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
                <div style={{ color: "#6a7983", letterSpacing: "1px", fontWeight: "bold", textTransform: "uppercase", fontSize: "18px" }}>Create Teams</div>
            </div>

            <div className="createTeamsContainer">
                <Box sx={{ display: 'flex', justifyContent: 'center', width: "60%", flexDirection: "column", gap: "40px" }} >
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
                            <MuiAvatar sx={{ bgcolor: '#868aba', width: 80, height: 80, outline: "2px solid #868aba" }} src={croppedImage} />

                        </Badge>
                    </div>
                    <TextField
                        spellCheck='false'
                        label="Team Name"
                        size="medium"
                        variant="outlined"
                        value={groupName}
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
                        }}
                    />
                    <Autocomplete
                        multiple
                        id="checkboxes-tags-demo"
                        options={users}
                        disableCloseOnSelect
                        getOptionLabel={(option) => option.name}
                        onChange={(e, value) => {
                            // Extract _id from selected objects and update the state
                            setMembers(value.map((item) => item._id));
                            setMemberError('');
                        }}
                        renderOption={(props, option, { selected }) => (
                            <>
                                {option.email !== "" ?
                                    <li {...props} style={{ fontSize: "13px" }}>
                                        <Checkbox
                                            icon={icon}
                                            checkedIcon={checkedIcon}
                                            checked={selected}
                                            sx={{ color: "#868aba" }}
                                        />
                                        {option.name} &nbsp; <small>({option.designation})</small>
                                    </li>
                                    :
                                    <></>
                                }
                            </>
                        )}
                        renderInput={(params) => (
                            <TextField {...params} label="Add Members" helperText={memberError} />
                        )}
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
                            '& .MuiAutocomplete-tag': {
                                backgroundColor: '#bcc7d7', // Background color of the selected tags
                                color: '#868aba', // Text color of the selected tags
                            },
                            '& .MuiAutocomplete-tag .MuiChip-deleteIcon': {
                                color: '#868aba', // Change this to the desired color for the clear button
                            },
                            '& .MuiAutocomplete-popupIndicator': {
                                color: '#868aba', // Change this to the desired color for the dropdown icon
                            },
                            '& .MuiAutocomplete-clearIndicator': {
                                color: '#868aba', // Change this to the desired color for the clear all button
                            },
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: '#868aba', // Change the outline color
                                    borderRadius: "2px",
                                },
                                '&:hover fieldset': {
                                    borderColor: '#868aba', // Change the outline color on hover
                                    borderRadius: "2px",
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#868aba', // Change the outline color when focused
                                    borderRadius: "2px",
                                },
                                '& .MuiInputBase-input': {
                                    color: '#6a7983', // Change the text color inside the TextField
                                    borderRadius: "2px",
                                },
                            },
                        }}
                    />
                    <Autocomplete
                        multiple
                        id="fixed-tags-demo"
                        options={users}
                        disableCloseOnSelect
                        getOptionLabel={(option) => option.name}
                        onChange={(e, value) => {
                            // Extract _id from selected objects and update the state
                            setAdmins(value.map((item) => item._id));
                        }}
                        renderOption={(props, option, { selected }) => (
                            <>
                                {option.email !== "" ?
                                    <li {...props} style={{ fontSize: "13px" }}>
                                        <Checkbox
                                            icon={icon}
                                            checkedIcon={checkedIcon}
                                            checked={selected}
                                            sx={{ color: "#868aba" }}
                                        />
                                        {option.name} &nbsp; <small>({option.designation})</small>
                                    </li>
                                    :
                                    <></>
                                }
                            </>
                        )}
                        renderInput={(params) => (
                            <TextField {...params} label="Add Admins" />
                        )}
                        sx={{
                            '& .MuiInputLabel-root': {
                                color: '#868aba', // Default label color
                            },
                            '& .Mui-focused .MuiInputLabel-root': {
                                color: '#868aba', // Label color when focused
                            },
                            '& .MuiAutocomplete-tag': {
                                backgroundColor: '#bcc7d7', // Background color of the selected tags
                                color: '#868aba', // Text color of the selected tags
                            },
                            '& .MuiAutocomplete-tag .MuiChip-deleteIcon': {
                                color: '#868aba', // Change this to the desired color for the clear button
                            },
                            '& .MuiAutocomplete-popupIndicator': {
                                color: '#868aba', // Change this to the desired color for the dropdown icon
                            },
                            '& .MuiAutocomplete-clearIndicator': {
                                color: '#868aba', // Change this to the desired color for the clear all button
                            },
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: '#868aba', // Change the outline color
                                    borderRadius: "2px",
                                },
                                '&:hover fieldset': {
                                    borderColor: '#868aba', // Change the outline color on hover
                                    borderRadius: "2px",
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#868aba', // Change the outline color when focused
                                    borderRadius: "2px",
                                },
                                '& .MuiInputBase-input': {
                                    color: '#6a7983', // Change the text color inside the TextField
                                    borderRadius: "2px",
                                },
                            },
                        }}
                    />
                </Box>
                <Button variant="contained" size="large" sx={{ width: "200px", backgroundColor: "#868aba", marginTop: "40px", '&:hover': { backgroundColor: '#868aba66' }, height: "50px" }} onClick={handleFormSubmit}>
                    Create
                </Button>
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
        </>
    );
};

export default CreateTeams;