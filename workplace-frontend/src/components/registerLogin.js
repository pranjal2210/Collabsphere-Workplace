import React, { useEffect, useRef, useState } from "react";
import '../styles/registerLogin.css';
import { postData } from "../FetchNodeServices";
import { useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import { Button, InputAdornment, TextField } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

function RegisterLogin(props) {
    const [eid, setEid] = useState('');
    const [email, setEmail] = useState('');
    const [contact, setContact] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [openAlert, setOpenAlert] = React.useState(false);
    const [alertMsg, setAlertMsg] = React.useState("");
    const [alertType, setAlertType] = React.useState("success");
    const [EmailError, setEmailError] = useState('');
    const [PasswordError, setPasswordError] = useState('');
    const [eidError, setEidError] = useState('');
    const [nameError, setNameError] = useState('');
    const [EmailErrorReg, setEmailErrorReg] = useState('');
    const [contactError, setContactError] = useState('');
    const [PasswordErrorReg, setPasswordErrorReg] = useState('');
    const handleClickShowPassword = () => setLoginPassword((show) => !show);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    const handleClickShowPasswordReg = () => setPassword((show) => !show);
    const handleMouseDownPasswordReg = (event) => {
        event.preventDefault();
    };

    const navigate = useNavigate();

    const handleClose = () => {
        props.onClose();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            var body = { eid: eid, email: email, name: name, contact: contact, password: password };
            if (eid.length === 0) {
                setEidError('*EID cannot be empty');
            }
            else if (eid.length < 4) {
                setEidError('*must contain 4 characters');
            }
            else if (name.length === 0) {
                setNameError('*Name cannot be empty');
            }
            else if (email.length === 0) {
                setEmailErrorReg('*Email cannot be empty');
            }
            else if (!(/^[a-zA-Z0-9._%+-]+@[^.]+\.com$/.test(email))) {
                setEmailErrorReg('*enter valid email');
            }
            else if (contact.length === 0) {
                setContactError('*Contact cannot be empty');
            }
            else if (contact.length < 10) {
                setContactError('*Contact must contain 10 digits');
            }
            else if (password.length < 4 || password.length === 0) {
                setPasswordErrorReg('*Password must contain atleast 4 characters');
            }
            else {
                var result = await postData("users/insertuser", body);
                setAlertMsg(result.message);
                setAlertType(result.msgType);
                setOpenAlert(true);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            var body = { email: loginEmail, password: loginPassword };
            if (loginEmail.length === 0) {
                setEmailError('*Email cannot be empty');
            }
            else if (!(/^[a-zA-Z0-9._%+-]+@[^.]+\.com$/.test(loginEmail))) {
                setEmailError('*enter valid email');
            }
            else if (loginPassword.length < 4 || loginPassword.length === 0) {
                setPasswordError('*Password must contain atleast 4 characters');
            }
            else {
                var result = await postData("users/userlogin", body);
                setAlertMsg(result.message);
                setAlertType(result.msgType);
                setOpenAlert(true);
                if (result.message === "Login successful" && result.isAdmin === true) {
                    const timer = setTimeout(() => {
                        setOpenAlert(false);
                        navigate('/admin');
                        localStorage.setItem("userData", JSON.stringify(result));
                        localStorage.setItem("LoginTime", JSON.stringify(new Date().toTimeString().split(' ')[0]));
                    }, 1000);

                    return () => {
                        clearTimeout(timer); // Clear the timer if the component unmounts before the timeout
                    };
                }
                else if (result.message === "Login successful" && result.isAdmin === false) {
                    const timer = setTimeout(() => {
                        setOpenAlert(false);
                        navigate('/home');
                        localStorage.setItem("userData", JSON.stringify(result));
                        localStorage.setItem("LoginTime", JSON.stringify(new Date().toTimeString().split(' ')[0]));

                    }, 1000);

                    return () => {
                        clearTimeout(timer); // Clear the timer if the component unmounts before the timeout
                    };

                }
            }
        } catch (error) {
            console.log(error);
        }
    };


    const wrapperRef = useRef(null);
    const loginFormRef = useRef(null);
    const registerFormRef = useRef(null);
    const loginBtnRef = useRef(null);
    const regBtnRef = useRef(null);
    const btnRef = useRef(null);

    const loginFormBtnHandler = () => {
        const domWrapperRef = wrapperRef.current;
        const domElementLogin = loginFormRef.current;
        const domElementReg = registerFormRef.current;
        const domLoginBtn = loginBtnRef.current;
        const domRegBtn = regBtnRef.current;
        const domBtn = btnRef.current;

        if (domElementLogin && domElementReg && domBtn) {
            domWrapperRef.style.height = "312px";
            domElementLogin.style.left = "60px";
            domElementReg.style.left = "450px";
            domLoginBtn.style.color = "#fff";
            domRegBtn.style.color = "#000";
            domBtn.style.left = "0px";
        }
    };

    const registerFormBtnHandler = () => {
        const domWrapperRef = wrapperRef.current;
        const domElementLogin = loginFormRef.current;
        const domElementReg = registerFormRef.current;
        const domLoginBtn = loginBtnRef.current;
        const domRegBtn = regBtnRef.current;
        const domBtn = btnRef.current;

        if (domElementLogin && domElementReg && domBtn) {
            domWrapperRef.style.height = "510px";
            domElementLogin.style.left = "-350px";
            domElementReg.style.left = "60px";
            domLoginBtn.style.color = "#000";
            domRegBtn.style.color = "#fff";
            domBtn.style.left = "170px";
        }
    };

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

    const handleChangeEmail = (event) => {
        const inputValue = event.target.value;
        const isValidInput = /^[a-zA-Z0-9_@.]+$/.test(inputValue);
        if (inputValue === '' || isValidInput) {
            setLoginEmail(inputValue);
            setEmailError('');
            if (inputValue.length === 0) {
                setEmailError('*Email cannot be empty');
            }
        }
        else {
            setEmailError('*Email must contain only alphabets, ., _, @');
        }
    };

    const handleChangePassword = (event) => {
        const inputValue = event.target.value;
        setLoginPassword(inputValue);
        setPasswordError('');
        if (inputValue.length === 0) {
            setPasswordError('*Password cannot be empty');
        }
        else if (inputValue.length < 4) {
            setPasswordErrorReg('*Password must contain atleast 4 characters');
        }
    };

    const handleChangeEID = (event) => {
        const inputValue = event.target.value;
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
                setEidError('*EID must start with E or A (e.g. E403)');
            }
        }
    };

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

    const handleChangeEmailReg = (event) => {
        const inputValue = event.target.value;
        const isValidInput = /^[a-zA-Z0-9_@.]+$/.test(inputValue);
        if (inputValue === '' || isValidInput) {
            setEmail(inputValue);
            setEmailErrorReg('');
            if (inputValue.length === 0) {
                setEmailErrorReg('*Email cannot be empty');
            }
        }
        else {
            setEmailErrorReg('*Email must contain only alphabets, ., _, @');
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
                    setContactError('*Phone number cannot be empty');
                }
            }
            else {
                setContactError('*Phone number must contain 10 digits');
            }
        }
    };

    const handleChangePasswordReg = (event) => {
        const inputValue = event.target.value;
        setPassword(inputValue);
        setPasswordErrorReg('');
        if (inputValue.length === 0) {
            setPasswordErrorReg('*Password cannot be empty');
        }
        else if (inputValue.length < 4) {
            setPasswordErrorReg('*Password must contain atleast 4 characters');
        }
    };

    return (
        <div className="pop-up">
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
            <div className="wrapper" ref={wrapperRef} style={{ height: "312px", borderRadius: '4px' }}>
                <button className="closeBtn" onClick={handleClose}>&#10006;</button>

                <div className="slide-controls">
                    <button type="button" className="slide" onClick={loginFormBtnHandler} ref={loginBtnRef} >Sign in</button>
                    <button type="button" className="slide registerBtn" style={{ color: "#000" }} onClick={registerFormBtnHandler} ref={regBtnRef} >Sign up</button>

                    <div id="btn" ref={btnRef}></div>
                </div>

                <form className="login" id="login" ref={loginFormRef}>
                    <TextField
                        label="Email"
                        size="small"
                        spellCheck="false"
                        variant="outlined"
                        value={loginEmail}
                        onChange={handleChangeEmail}
                        helperText={EmailError}
                        sx={{
                            '& .MuiFormHelperText-root': {
                                color: 'red', // Change the color of the helper text
                                margin: '0', // Change the padding of the helper text
                                marginLeft: '14px',
                                position: 'absolute',
                                bottom: '-20px'
                            },
                            '& .MuiInputLabel-root': {
                                color: '#286767', // Default label color
                            },
                            '& .Mui-focused .MuiInputLabel-root': {
                                color: '#286767', // Label color when focused
                            },
                            '& .MuiInputBase-root': {
                                color: '#286767', // Label color when focused
                            },
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: '#286767', // Change the outline color
                                    borderRadius: "2px",
                                },
                                '&:hover fieldset': {
                                    borderColor: '#286767', // Change the outline color on hover
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#286767', // Change the outline color when focused
                                },
                                '& .MuiInputBase-input': {
                                    color: '#6a7983', // Change the text color inside the TextField
                                    borderRadius: "2px",
                                },
                            },
                            width: '100%',
                            marginTop: "26px"
                        }}
                    />
                    <TextField
                        label="Password"
                        spellCheck='false'
                        size="small"
                        variant="outlined"
                        onChange={handleChangePassword}
                        helperText={PasswordError}
                        sx={{
                            '& .MuiFormHelperText-root': {
                                color: 'red', // Change the color of the helper text
                                margin: '0', // Change the padding of the helper text
                                marginLeft: '14px',
                                position: 'absolute',
                                bottom: '-20px'
                            },
                            '& .MuiInputLabel-root': {
                                color: '#286767', // Default label color
                            },
                            '& .Mui-focused .MuiInputLabel-root': {
                                color: '#286767', // Label color when focused
                            },
                            '& .MuiInputBase-root': {
                                color: '#286767', // Label color when focused
                            },
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: '#286767', // Change the outline color
                                    borderRadius: "2px",
                                },
                                '&:hover fieldset': {
                                    borderColor: '#286767', // Change the outline color on hover
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#286767', // Change the outline color when focused
                                },
                                '& .MuiInputBase-input': {
                                    color: '#6a7983', // Change the text color inside the TextField
                                    borderRadius: "2px",
                                },
                            },
                            width: '100%',
                            marginTop: '26px'
                        }}
                        type={loginPassword ? 'password' : 'text'}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                        style={{ color: "#286767" }}
                                    >
                                        {!loginPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Button type="submit" variant="contained" size="small" sx={{ width: "150px", backgroundColor: "#286767", '&:hover': { backgroundColor: '#286767',color:'#000' }, height: "40px", marginTop: '26px' ,fontWeight:'bold',letterSpacing:"1px"}} onClick={handleLogin}>Sign In</Button>
                </form>

                <form className="signup" id="signup" ref={registerFormRef}>
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
                                color: '#286767', // Default label color
                            },
                            '& .Mui-focused .MuiInputLabel-root': {
                                color: '#286767', // Label color when focused
                            },
                            '& .MuiInputBase-root': {
                                color: '#286767', // Label color when focused
                            },
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: '#286767', // Change the outline color
                                    borderRadius: "2px",
                                },
                                '&:hover fieldset': {
                                    borderColor: '#286767', // Change the outline color on hover
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#286767', // Change the outline color when focused
                                },
                                '& .MuiInputBase-input': {
                                    color: '#6a7983', // Change the text color inside the TextField
                                    borderRadius: "2px",
                                },
                            },
                            width: '100%',
                            marginTop: "26px"
                        }}
                    />
                    <TextField
                        label="Full Name"
                        size="small"
                        spellCheck="false"
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
                                color: '#286767', // Default label color
                            },
                            '& .Mui-focused .MuiInputLabel-root': {
                                color: '#286767', // Label color when focused
                            },
                            '& .MuiInputBase-root': {
                                color: '#286767', // Label color when focused
                            },
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: '#286767', // Change the outline color
                                    borderRadius: "2px",
                                },
                                '&:hover fieldset': {
                                    borderColor: '#286767', // Change the outline color on hover
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#286767', // Change the outline color when focused
                                },
                                '& .MuiInputBase-input': {
                                    color: '#6a7983', // Change the text color inside the TextField
                                    borderRadius: "2px",
                                },
                            },
                            width: '100%',
                            marginTop: "26px"
                        }}
                    />
                    <TextField
                        label="Email Address"
                        size="small"
                        spellCheck="false"
                        variant="outlined"
                        value={email}
                        onChange={handleChangeEmailReg}
                        helperText={EmailErrorReg}
                        sx={{
                            '& .MuiFormHelperText-root': {
                                color: 'red', // Change the color of the helper text
                                margin: '0', // Change the padding of the helper text
                                marginLeft: '14px',
                                position: 'absolute',
                                bottom: '-20px'
                            },
                            '& .MuiInputLabel-root': {
                                color: '#286767', // Default label color
                            },
                            '& .Mui-focused .MuiInputLabel-root': {
                                color: '#286767', // Label color when focused
                            },
                            '& .MuiInputBase-root': {
                                color: '#286767', // Label color when focused
                            },
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: '#286767', // Change the outline color
                                    borderRadius: "2px",
                                },
                                '&:hover fieldset': {
                                    borderColor: '#286767', // Change the outline color on hover
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#286767', // Change the outline color when focused
                                },
                                '& .MuiInputBase-input': {
                                    color: '#6a7983', // Change the text color inside the TextField
                                    borderRadius: "2px",
                                },
                            },
                            width: '100%',
                            marginTop: "26px"
                        }}
                    />
                    <TextField
                        label="Phone Number"
                        size="small"
                        spellCheck="false"
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
                                color: '#286767', // Default label color
                            },
                            '& .Mui-focused .MuiInputLabel-root': {
                                color: '#286767', // Label color when focused
                            },
                            '& .MuiInputBase-root': {
                                color: '#286767', // Label color when focused
                            },
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: '#286767', // Change the outline color
                                    borderRadius: "2px",
                                },
                                '&:hover fieldset': {
                                    borderColor: '#286767', // Change the outline color on hover
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#286767', // Change the outline color when focused
                                },
                                '& .MuiInputBase-input': {
                                    color: '#6a7983', // Change the text color inside the TextField
                                    borderRadius: "2px",
                                },
                            },
                            width: '100%',
                            marginTop: "26px"
                        }}
                    />
                    <TextField
                        label="Password"
                        spellCheck='false'
                        size="small"
                        variant="outlined"
                        onChange={handleChangePasswordReg}
                        helperText={PasswordErrorReg}
                        sx={{
                            '& .MuiFormHelperText-root': {
                                color: 'red', // Change the color of the helper text
                                margin: '0', // Change the padding of the helper text
                                marginLeft: '14px',
                                position: 'absolute',
                                bottom: '-20px'
                            },
                            '& .MuiInputLabel-root': {
                                color: '#286767', // Default label color
                            },
                            '& .Mui-focused .MuiInputLabel-root': {
                                color: '#286767', // Label color when focused
                            },
                            '& .MuiInputBase-root': {
                                color: '#286767', // Label color when focused
                            },
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: '#286767', // Change the outline color
                                    borderRadius: "2px",
                                },
                                '&:hover fieldset': {
                                    borderColor: '#286767', // Change the outline color on hover
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#286767', // Change the outline color when focused
                                },
                                '& .MuiInputBase-input': {
                                    color: '#6a7983', // Change the text color inside the TextField
                                    borderRadius: "2px",
                                },
                            },
                            width: '100%',
                            marginTop: '26px'
                        }}
                        type={password ? 'password' : 'text'}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPasswordReg}
                                        onMouseDown={handleMouseDownPasswordReg}
                                        edge="end"
                                        style={{ color: "#286767" }}
                                    >
                                        {!password ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Button type="submit" variant="contained" size="small" sx={{ width: "150px", backgroundColor: "#286767", '&:hover': { backgroundColor: '#286767',color:'#000' }, height: "40px", marginTop: '26px' ,fontWeight:'bold',letterSpacing:"1px"}} onClick={handleSubmit}>Sign Up</Button>
                </form>

            </div>
        </div>
    );
}
export default RegisterLogin;
