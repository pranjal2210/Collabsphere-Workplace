import React, { useEffect, useState } from 'react';
import '../styles/adminpage.css';
import { postData } from '../FetchNodeServices';
import CountryState from '../CountryState.json';
import { Button, FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

function AddUserForm(props) {
    const [eid, setEid] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [contact, setContact] = useState('');
    const [designation, setDesignation] = useState('');
    const [address, setAddress] = useState('');
    // const [city, setCity] = useState('');
    // const [state, setState] = useState('');
    // const [country, setCountry] = useState('');
    const [pincode, setPincode] = useState('');
    const [pancard, setPancard] = useState('');
    const [accountno, setAccountno] = useState('');
    const [ifsc, setIFSC] = useState('');
    const [spackage, setPackage] = useState(0);
    const [joining, setJoining] = useState('');
    const [openAlert, setOpenAlert] = React.useState(false);
    const [alertMsg, setAlertMsg] = React.useState("");
    const [alertType, setAlertType] = React.useState("success");

    const [countryID, setCountryID] = useState('');
    const [state, setState] = useState([]);
    const [city, setCity] = useState([]);

    const [countryName, setCountryName] = useState('');
    const [stateName, setStateName] = useState('');
    const [cityName, setCityName] = useState('');

    const [eidError, setEidError] = useState('');
    const [pincodeError, setPincodeError] = useState('');
    const [designationError, setDesignationError] = useState('');
    const [packageError, setPackageError] = useState('');
    const [joiningError, setJoiningError] = useState('');
    const [addressError, setAddressError] = useState('');
    const [countryError, setCountryError] = useState('');
    const [stateError, setStateError] = useState('');
    const [cityError, setCityError] = useState('');
    const [pancardError, setPancardError] = useState('');
    const [accError, setAccError] = useState('');
    const [ifscError, setIfscError] = useState('');

    const userData = JSON.parse(localStorage.getItem("userData"));

    // console.log('Country', CountryState);

    const handleClose = () => {
        props.onClose();
    };

    const handleCountry = (e) => {
        const getCountryID = e.target.value;
        setCountryID(getCountryID);
        setCountryName(CountryState[getCountryID].name);
        const getStateData = CountryState.find(country => country.id === parseInt(getCountryID)).states;
        // console.log(getStateData);
        setState(getStateData);
        setCountryError('');
    };

    const handleState = (e) => {
        const getStateID = e.target.value;
        // console.log(getStateID);
        const getStateData = CountryState.find(country => country.id === parseInt(countryID)).states;
        const getCityData = getStateData.find(state => state.id === parseInt(getStateID)).cities;
        setStateName(getStateData.find(state => state.id === parseInt(getStateID)).name);
        setCity(getCityData);
        setStateError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            var body = {
                eid: eid, name: name, email: email, password: password, contact: contact, designation: designation, address: address, city: cityName, state: stateName, country: countryName, pincode: pincode, pancard: pancard, accountno: accountno, ifsc: ifsc, package: spackage, joining: joining, image: null
            };
            if (eid.length === 0) {
                setEidError('*EID cannot be empty');
            }
            else if (eid.length < 4) {
                setEidError('*must contain 4 characters');
            }
            else if (pincode.length === 0) {
                setPincodeError('*Pincode cannot be empty');
            }
            else if (pincode.length < 6) {
                setPincodeError('*Pincode must contain 6 digits');
            }
            else if (designation.length === 0) {
                setDesignationError('*Please select a designation');
            }
            else if (spackage === 0) {
                setPackageError('*Package cannot be 0');
            }
            else if (joining.length === 0) {
                setJoiningError('*Please select joining date');
            }
            else if (address.length === 0) {
                setAddressError('*Address cannot be empty');
            }
            else if (countryName.length === 0) {
                setCountryError('*Please select a country');
            }
            else if (stateName.length === 0) {
                setStateError('*Please select a state');
            }
            else if (cityName.length === 0) {
                setCityError('*Please select a city');
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
                setAccError('*enter valid account number');
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
                var result = await postData('admin/insertUser', body);
                props.setAlertType(result.msgType);
                props.setAlertMsg(result.message);
                props.setOpenAlert(true);
                if (result.msgType === "success") {
                    props.showForm();
                    props.fetchUsers();
                }
            }
        }
        catch (error) {
            console.log(error);
        }
    };

    const handleChangeEID = (event) => {
        const inputValue = event.target.value.toUpperCase();
        const isValidInput = /^[EA][a-zA-Z0-9]*$/.test(inputValue);
        if (inputValue.length < 5) {
            if (inputValue === '' || isValidInput) {
                setEid(inputValue);
                setEidError('');
                if (inputValue.length === 0) {
                    setEidError('*EID cannot be empty');
                }
            }
            else {
                setEidError('*EID must start with E or A');
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

    const handleJoiningDateChange = (date) => {
        const formattedDate = dayjs(date).format('YYYY-MM-DD');
        setJoining(formattedDate);
        setJoiningError('');
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
            setAddressError('*Address contains only have alphabets, numbers, ,, -, (, )');
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
            <div className='wrapper-timesheet'>
                <button className="closeBtn2" onClick={handleClose}>&#10006;</button>
                <h2>Add Employee</h2>
                <hr />
                <div style={{ display: 'flex', flexDirection: 'column', width: '90%' }}>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
                        <TextField
                            label="Employee ID"
                            size="small"
                            spellCheck="false"
                            variant="outlined"
                            value={eid}
                            onChange={handleChangeEID}
                            helperText={eidError}
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
                        <TextField
                            spellCheck='false'
                            disabled
                            label="Name"
                            size='small'
                            variant="outlined"
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
                            disabled
                            label="Email"
                            size='small'
                            variant="outlined"
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
                            label="Password"
                            disabled
                            size='small'
                            variant="outlined"
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
                            disabled
                            label="Contact"
                            size='small'
                            variant="outlined"
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
                        <FormControl
                            size="small"
                            fullWidth
                            sx={{
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
                                onChange={(event) => {
                                    setDesignation(event.target.value);
                                    setDesignationError('');
                                }}
                            >
                                <MenuItem value="HR Executive">HR Executive</MenuItem>
                                <MenuItem value="Software Engineer">Software Engineer</MenuItem>
                                <MenuItem value="Data Analyst">Data Analyst</MenuItem>
                                <MenuItem value="Graduate Engineer Trainee">Graduate Engineer Trainee</MenuItem>
                                <MenuItem value="Senior Software Engineer">Senior Software Engineer</MenuItem>
                                <MenuItem value="Data Entry Specialist">Data Entry Specialist</MenuItem>
                            </Select>
                            {designationError.length !== 0 && <FormHelperText sx={{ color: 'red', margin: '0', marginLeft: '14px', position: 'absolute', bottom: '-20px' }}>{designationError}</FormHelperText>}
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

                        <div className='datePickerDiv'>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker className="datePickerContainer" label="Joining Date" format='DD/MM/YYYY' onChange={handleJoiningDateChange} value={joining} />
                                {joiningError.length !== 0 && <FormHelperText sx={{ color: 'red', margin: '0', marginLeft: '14px', position: 'absolute', bottom: '-20px' }}>{joiningError}</FormHelperText>}
                            </LocalizationProvider>
                        </div>
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
                            <InputLabel id="demo-select-small-label">Country</InputLabel>
                            <Select
                                labelId="demo-select-small-label"
                                id="demo-select-small"
                                label="Country"
                                onChange={(event) => handleCountry(event)}
                            >
                                {CountryState.map((getCountry, index) => (
                                    <MenuItem key={index} value={getCountry.id}>{getCountry.name}</MenuItem>
                                ))}
                            </Select>
                            {countryError.length !== 0 && <FormHelperText sx={{ color: 'red', margin: '0', marginLeft: '14px', position: 'absolute', bottom: '-20px' }}>{countryError}</FormHelperText>}
                        </FormControl>
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
                            <InputLabel id="demo-select-small-label">State</InputLabel>
                            <Select
                                labelId="demo-select-small-label"
                                id="demo-select-small"
                                label="State"
                                onChange={(event) => handleState(event)}
                            >
                                {state.map((getState, index) => (
                                    <MenuItem key={index} value={getState.id}>{getState.name}</MenuItem>
                                ))}
                            </Select>
                            {stateError.length !== 0 && <FormHelperText sx={{ color: 'red', margin: '0', marginLeft: '14px', position: 'absolute', bottom: '-20px' }}>{stateError}</FormHelperText>}
                        </FormControl>
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
                            <InputLabel id="demo-select-small-label">City</InputLabel>
                            <Select
                                labelId="demo-select-small-label"
                                id="demo-select-small"
                                label="City"
                                onChange={(event) => {
                                    setCityName(event.target.value);
                                    setCityError('');
                                }}
                            >
                                {city.map((getCity, index) => (
                                    <MenuItem key={index} value={getCity.name}>{getCity.name}</MenuItem>
                                ))}
                            </Select>
                            {cityError.length !== 0 && <FormHelperText sx={{ color: 'red', margin: '0', marginLeft: '14px', position: 'absolute', bottom: '-20px' }}>{cityError}</FormHelperText>}
                        </FormControl>

                    </div>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
                        <TextField
                            spellCheck='false'
                            label="Pancard"
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
}

export default AddUserForm;
