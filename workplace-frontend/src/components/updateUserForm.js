import React, { useEffect, useState } from 'react';
import '../styles/adminpage.css';
import { postData } from '../FetchNodeServices';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

function UpdateUserForm(props) {
    const [eid, setEid] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [contact, setContact] = useState('');
    const [designation, setDesignation] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [country, setCountry] = useState('');
    const [pincode, setPincode] = useState('');
    const [pancard, setPancard] = useState('');
    const [accountno, setAccountno] = useState('');
    const [ifsc, setIFSC] = useState('');
    const [spackage, setPackage] = useState(0);
    const [joining, setJoining] = useState('');
    const [image, setImage] = useState('');
    const [openAlert, setOpenAlert] = React.useState(false);
    const [alertMsg, setAlertMsg] = React.useState("");
    const [alertType, setAlertType] = React.useState("success");
    const userData = JSON.parse(localStorage.getItem("userData"));

    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [contactError, setContactError] = useState('');
    const [pincodeError, setPincodeError] = useState('');
    const [designationError, setDesignationError] = useState('');
    const [packageError, setPackageError] = useState('');
    const [addressError, setAddressError] = useState('');
    const [countryError, setCountryError] = useState('');
    const [stateError, setStateError] = useState('');
    const [cityError, setCityError] = useState('');
    const [pancardError, setPancardError] = useState('');
    const [accError, setAccError] = useState('');
    const [ifscError, setIfscError] = useState('');

    const handleClose = () => {
        props.onClose();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            var body = {
                eid: eid, name: name, email: email, password: password, contact: contact, designation: designation, address: address, city: city, state: state, country: country, pincode: pincode, pancard: pancard, accountno: accountno, ifsc: ifsc, package: spackage, joining: joining, image: image
            };
            if (name.length === 0) {
                setNameError('*Name cannot be empty');
            }
            else if (email.length === 0) {
                setEmailError('*Email cannot be empty');
            }
            else if (contact.length === 0) {
                setContactError('*Contact cannot be empty');
            }
            else if (contact.length < 10) {
                setContactError('*Contact must contain 10 digits');
            }
            else if (!(/^[a-zA-Z0-9._%+-]+@[^.]+\.com$/.test(email))) {
                setEmailError('*enter valid email');
            }
            else if (pincode.length === 0) {
                setPincodeError('*Pincode cannot be empty');
            }
            else if (pincode.length < 6) {
                setPincodeError('*Pincode must contain 6 digits');
            }
            else if (spackage === 0) {
                setPackageError('*Package cannot be 0');
            }
            else if (address.length === 0) {
                setAddressError('*Address cannot be empty');
            }
            else if (country.length === 0) {
                setCountryError('*Please enter a country');
            }
            else if (state.length === 0) {
                setStateError('*Please enter a state');
            }
            else if (city.length === 0) {
                setCityError('*Please enter a city');
            }
            else if (pancard.length === 0) {
                setPancardError('*PAN cannot be empty');
            }
            else if (pancard.length < 10) {
                setPancardError('*Please enter valid PAN');
            }
            else if (!(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pancard))) {
                setPancardError('*Please enter valid PAN');
            }
            else if (accountno.length === 0) {
                setAccError('*Account no. cannot be empty');
            }
            else if (accountno.length < 15) {
                setAccError('*Please enter valid account no.');
            }
            else if (ifsc.length === 0) {
                setIfscError('*IFSC cannot be empty');
            }
            else if (ifsc.length < 11) {
                setIfscError('*Please enter valid IFSC');
            }
            else if (!(/^[A-Z]{4}[0-9]{7}$/.test(ifsc))) {
                setIfscError('*Please enter valid IFSC');
            }
            else {
                var result = await postData(`admin/updateUser/${props.data._id}`, body);
                props.setAlertType(result.msgType);
                props.setAlertMsg(result.message);
                props.setOpenAlert(true);
                if (result.msgType === "success") {
                    props.showUpdateForm();
                    props.fetchUsers();
                }
            }
        }
        catch (error) {
            console.log(error);
        }
    };
    const getUsers = () => {
        setEid(props.data.eid);
        setName(props.data.name);
        setEmail(props.data.email);
        setContact(props.data.contact);
        setPincode(props.data.pincode);
        setPassword(props.data.password);
        setDesignation(props.data.designation);
        setPackage(props.data.package);
        setJoining(props.data.joining);
        setAddress(props.data.address);
        setAccountno(props.data.accountno);
        setCity(props.data.city);
        setState(props.data.state);
        setCountry(props.data.country);
        setIFSC(props.data.ifsc);
        setPancard(props.data.pancard);
        setImage(props.data.image);
    };

    useEffect(() => {
        getUsers();
    }, []);

    // const handleChangeName = (event) => {
    //     const inputValue = event.target.value;
    //     const isValidInput = /^[a-zA-Z\s]+$/.test(inputValue);
    //     if (inputValue === '' || isValidInput) {
    //         setName(inputValue);
    //         setNameError('');
    //         if (inputValue.length === 0) {
    //             setNameError('Name cannot be empty');
    //         }
    //     }
    //     else {
    //         setNameError('*Name must contain alphabets');
    //     }
    // };

    const handleChangeName = (event) => {
        const inputValue = event.target.value; // Trim extra spaces
        const isValidInput = /^[a-zA-Z]*(?: [a-zA-Z]*)?$/.test(inputValue);

        if (inputValue === '' || isValidInput) {
            // Capitalize the first letter of each word
            const formattedValue = inputValue
                .split(' ')
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(' ');
            setName(formattedValue);
            setNameError('');

            if (inputValue.length === 0) {
                setNameError('*Name cannot be empty');
            }
        } else {
            setNameError('*enter valid name');
        }
    };

    const handleChangeEmail = (event) => {
        const inputValue = event.target.value;
        const isValidInput = /^[a-zA-Z0-9_@.]+$/.test(inputValue);
        if (inputValue === '' || isValidInput) {
            setEmail(inputValue);
            setEmailError('');
            if (inputValue.length === 0) {
                setEmailError('*Email cannot be empty');
            }
        }
        else {
            setEmailError('*Email must contain only alphabets, ., _, @');
        }
    };

    const handleChangeContact = (event) => {
        const inputValue = event.target.value;
        const isValidInput = /^[0-9]*$/.test(inputValue);
        if (inputValue.length <= 10) {
            if (inputValue === '' || isValidInput) {
                setContact(inputValue);
                setContactError('');
                if (inputValue.length === 0) {
                    setContactError('*Contact cannot be empty');
                }
            }
            else {
                setContactError('*must contain 10 digits');
            }
        }
    };

    const handleChangePincode = (event) => {
        const inputValue = event.target.value;
        const isValidInput = /^[0-9]*$/.test(inputValue);
        if (inputValue.length <= 6) {
            if (inputValue === '' || isValidInput) {
                setPincode(inputValue);
                setPincodeError('');
                if (inputValue.length === 0) {
                    setPincodeError('*Pincode cannot be empty');
                }
            }
            else {
                setPincodeError('*Pincode must contain 6 digits');
            }
        }
    };

    const handleChangePackage = (event) => {
        const inputValue = event.target.value.replace(/^0+/, '');
        const isValidInput = /^[0-9]*$/.test(inputValue);
        const parsedValue = parseInt(inputValue);
        if (inputValue.length <= 7) {
            if (inputValue === 0 || isValidInput) {
                if (!isNaN(parsedValue)) {
                    setPackage(parsedValue);
                    setPackageError('');
                } else {
                    setPackage(0);
                    setPackageError('*Package cannot be 0');
                }
            }
            else {
                setPackageError('*Package must be integers');
            }
        }
    };

    const handleChangeAddress = (event) => {
        const inputValue = event.target.value;
        const isValidInput = /^[A-Za-z0-9,() \-]+$/.test(inputValue);
        if (inputValue === '' || isValidInput) {
            setAddress(inputValue);
            setAddressError('');
            if (inputValue.length === 0) {
                setAddressError('*Address cannot be empty');
            }
        }
        else {
            setAddressError('*Address contains only alphabets, numbers, ,, -, (, )');
        }
    };

    const handleChangeCountry = (event) => {
        const inputValue = event.target.value;
        const isValidInput = /^[a-zA-Z\s]+$/.test(inputValue);
        if (inputValue === '' || isValidInput) {
            setCountry(inputValue);
            setCountryError('');
            if (inputValue.length === 0) {
                setCountryError('*Country cannot be empty');
            }
        }
        else {
            setCountryError('*Country contains only alphabets');
        }
    };

    const handleChangeState = (event) => {
        const inputValue = event.target.value;
        const isValidInput = /^[a-zA-Z\s]+$/.test(inputValue);
        if (inputValue === '' || isValidInput) {
            setState(inputValue);
            setStateError('');
            if (inputValue.length === 0) {
                setStateError('*State cannot be empty');
            }
        }
        else {
            setStateError('*State contains only alphabets');
        }
    };

    const handleChangeCity = (event) => {
        const inputValue = event.target.value;
        const isValidInput = /^[a-zA-Z\s]+$/.test(inputValue);
        if (inputValue === '' || isValidInput) {
            setCity(inputValue);
            setCityError('');
            if (inputValue.length === 0) {
                setCityError('*City cannot be empty');
            }
        }
        else {
            setCityError('*City contains only have alphabets');
        }
    };

    const handleChangePancard = (event) => {
        const inputValue = event.target.value.toUpperCase();
        const isValidInput = /^[A-Za-z0-9]+$/.test(inputValue);
        if (inputValue.length <= 10) {
            if (inputValue === '' || isValidInput) {
                setPancard(inputValue);
                setPancardError('');
                if (inputValue.length === 0) {
                    setPancardError('*PAN cannot be empty');
                }
            }
            else {
                setPancardError('*Please enter valid PAN');
            }
        }
    };

    const handleChangeAcc = (event) => {
        const inputValue = event.target.value;
        const isValidInput = /^[0-9]+$/.test(inputValue);
        if (inputValue.length <= 15) {
            if (inputValue === '' || isValidInput) {
                setAccountno(inputValue);
                setAccError('');
                if (inputValue.length === 0) {
                    setAccError('*Account no. cannot be empty');
                }
            }
            else {
                setAccError('*Please enter valid account no.');
            }
        }
    };

    const handleChangeIfsc = (event) => {
        const inputValue = event.target.value.toUpperCase();
        const isValidInput = /^[A-Za-z0-9]+$/.test(inputValue);
        if (inputValue.length <= 11) {
            if (inputValue === '' || isValidInput) {
                setIFSC(inputValue);
                setIfscError('');
                if (inputValue.length === 0) {
                    setIfscError('*IFSC cannot be empty');
                }
            }
            else {
                setIfscError('*Please enter valid IFSC');
            }
        }
    };

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
            <div className='wrapper-timesheet'>
                <button className="closeBtn2" onClick={handleClose}>&#10006;</button>
                <h2>Update Employee</h2>
                <hr />
                <div style={{ display: 'flex', flexDirection: 'column', width: '90%' }}>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
                        <TextField
                            spellCheck='false'
                            disabled
                            label="Employee ID"
                            size='small'
                            variant="outlined"
                            value={eid}
                            onChange={(event) => (setEid(event.target.value))}
                            sx={{
                                '& .MuiInputLabel-root.Mui-disabled': {
                                    color: '#868aba', // Default label color
                                },
                                '& .Mui-focused .MuiInputLabel-root': {
                                    color: '#868aba', // Label color when focused
                                },
                                '& .MuiInputBase-root.Mui-disabled': {
                                    color: '#868aba', // Label color when focused
                                    backgroundColor: '#e5e5e57a',
                                    paddingRight: 0
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
                            }}
                        />
                        <TextField
                            spellCheck='false'
                            label="Name"
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
                                width: '100%',
                            }}
                        />
                        <TextField
                            spellCheck='false'
                            label="Email"
                            size='small'
                            variant="outlined"
                            value={email}
                            onChange={handleChangeEmail}
                            helperText={emailError}
                            type='email'
                            sx={{
                                '& .MuiFormHelperText-root': {
                                    color: 'red', // Change the color of the helper text
                                    margin: '0', // Change the padding of the helper text
                                    marginLeft: '14px',
                                    position: 'absolute',
                                    bottom: '-24px',
                                    lineHeight: 1
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
                                width: '100%',
                            }}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
                        <TextField
                            disabled
                            spellCheck='false'
                            label="Password"
                            size='small'
                            variant="outlined"
                            value={password}
                            onChange={(event) => (setPassword(event.target.value))}
                            sx={{
                                '& .MuiInputLabel-root.Mui-disabled': {
                                    color: '#868aba', // Default label color
                                },
                                '& .Mui-focused .MuiInputLabel-root': {
                                    color: '#868aba', // Label color when focused
                                },
                                '& .MuiInputBase-root.Mui-disabled': {
                                    color: '#868aba', // Label color when focused
                                    backgroundColor: '#e5e5e57a',
                                    paddingRight: 0
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
                            }}
                        />
                        <TextField
                            label="Contact"
                            spellCheck='false'
                            size='small'
                            variant="outlined"
                            value={contact}
                            onChange={handleChangeContact}
                            helperText={contactError}
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
                                width: '100%',
                            }}
                        />
                        <TextField
                            spellCheck='false'
                            label="Pincode"
                            size='small'
                            variant="outlined"
                            value={pincode}
                            onChange={handleChangePincode}
                            helperText={pincodeError}
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
                                width: '100%',
                            }}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
                        <FormControl size="small" fullWidth sx={{
                            '& .MuiSvgIcon-root': {
                                color: '#868aba', // Change the color as needed
                            },
                            width: '100%',
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
                        }}>
                            <InputLabel id="demo-select-small-label">Designation</InputLabel>
                            <Select
                                value={designation}
                                labelId="demo-select-small-label"
                                id="demo-select-small"
                                label="Designation"
                                onChange={(event) => (setDesignation(event.target.value))}

                            >
                                <MenuItem value="HR Executive">HR Executive</MenuItem>
                                <MenuItem value="Software Engineer">Software Engineer</MenuItem>
                                <MenuItem value="Data Analyst">Data Analyst</MenuItem>
                                <MenuItem value="Graduate Engineer Trainee">Graduate Engineer Trainee</MenuItem>
                                <MenuItem value="Senior Software Engineer">Senior Software Engineer</MenuItem>
                                <MenuItem value="Data Entry Specialist">Data Entry Specialist</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            spellCheck='false'
                            label="Package"
                            size='small'
                            variant="outlined"
                            value={spackage}
                            onChange={handleChangePackage}
                            helperText={packageError}
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
                                width: '100%',
                            }}
                        />
                        <TextField
                            spellCheck='false'
                            type='date'
                            disabled
                            label="Joining Date"
                            size='small'
                            variant="outlined"
                            value={joining}
                            sx={{
                                '& .MuiInputLabel-root.Mui-disabled': {
                                    color: '#868aba', // Default label color
                                },
                                '& .Mui-focused .MuiInputLabel-root': {
                                    color: '#868aba', // Label color when focused
                                },
                                '& .MuiInputBase-root.Mui-disabled': {
                                    color: '#868aba', // Label color when focused
                                    backgroundColor: '#e5e5e57a',
                                    paddingRight: 0
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
                            }}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
                        <TextField
                            spellCheck='false'
                            label="Address"
                            size='small'
                            variant="outlined"
                            value={address}
                            onChange={handleChangeAddress}
                            helperText={addressError}
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
                                width: '100%',
                            }}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
                        <TextField
                            spellCheck='false'
                            label="City"
                            size='small'
                            variant="outlined"
                            value={city}
                            onChange={handleChangeCity}
                            helperText={cityError}
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
                                width: '100%',
                            }}
                        />
                        <TextField
                            spellCheck='false'
                            label="State"
                            size='small'
                            variant="outlined"
                            value={state}
                            onChange={handleChangeState}
                            helperText={stateError}
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
                                width: '100%',
                            }}
                        />
                        <TextField
                            spellCheck='false'
                            label="Country"
                            size='small'
                            variant="outlined"
                            value={country}
                            onChange={handleChangeCountry}
                            helperText={countryError}
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
                                width: '100%',
                            }}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
                        <TextField
                            label="PAN Card"
                            spellCheck='false'
                            size='small'
                            variant="outlined"
                            value={pancard}
                            onChange={handleChangePancard}
                            helperText={pancardError}
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
                                width: '100%',
                            }}
                        />
                        <TextField
                            spellCheck='false'
                            label="Account Number"
                            size='small'
                            variant="outlined"
                            value={accountno}
                            onChange={handleChangeAcc}
                            helperText={accError}
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
                                width: '100%',
                            }}
                        />
                        <TextField
                            spellCheck='false'
                            label="IFSC Code"
                            size='small'
                            variant="outlined"
                            value={ifsc}
                            onChange={handleChangeIfsc}
                            helperText={ifscError}
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
                                width: '100%',
                            }}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '30px', justifyContent: "center" }}>
                        <Button variant="contained" size="small" sx={{ width: "200px", backgroundColor: "#868aba", '&:hover': { backgroundColor: '#868aba66' }, height: "40px" }} onClick={handleSubmit}>Submit</Button>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default UpdateUserForm;
