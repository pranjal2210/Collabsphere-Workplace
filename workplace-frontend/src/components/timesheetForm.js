import React, { useEffect, useState } from 'react';
import '../styles/timesheet.css';
import { postData } from '../FetchNodeServices';
import { Button, TextField } from '@mui/material';

function TimesheetForm(props) {
    // console.log("Props", props);
    const [overtime, setOvertime] = useState(0);
    const [totalhours, setTotalHours] = useState(0);
    const [pauseTime, setPauseTime] = useState('');
    const [isPaused, setIsPaused] = useState(false);
    const [pauseResume, setPauseResume] = useState([]);

    const userData = JSON.parse(localStorage.getItem("userData"));
    const loginTime = JSON.parse(localStorage.getItem("LoginTime"));

    const handlePause = () => {
        const currentTime = new Date().toTimeString().split(' ')[0];
        setPauseTime(currentTime);
        setIsPaused(true);
    };
    const handleResume = async () => {
        const currentTime = new Date().toTimeString().split(' ')[0];
        setIsPaused(false);
        try {
            var body = {
                id: props.data._id, eid: props.data.eid, date: props.data.date, day: props.data.day, month: props.data.month, clockin: props.data.clockin, overtime: overtime, totalhours: totalhours, pause: pauseTime, resume: currentTime
            };
            var result = await postData('timesheet/updateTimesheet', body);
            // console.log('Result Timesheet', result);
            setPauseResume([...pauseResume, { pause: pauseTime, resume: currentTime }]);
        }
        catch (error) {
            console.log(error);
        }

    };

    const handleClose = () => {
        props.onClose();
    };




    const fetchTimeSheet = () => {
        if (props.data.pauseResume[0].pause !== "00:00:00" && props.data.pauseResume[0].resume !== "00:00:00") {
            setPauseResume(props.data.pauseResume);
        }
    };

    useEffect(() => {
        fetchTimeSheet();
    }, []);


    return (
        <div className='popup-timesheet'>
            <div className='wrapper-timesheet'>
                {!isPaused ?
                    <button className="closeBtn2" onClick={handleClose}>&#10006;</button>
                    :
                    <></>
                }
                <h2>Timesheet ({props.data.date})</h2>
                <hr />
                <div style={{ display: 'flex', flexDirection: 'column', width: '80%' }}>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
                        <TextField
                            spellCheck='false'
                            disabled
                            size='small'
                            label="Date"
                            variant="outlined"
                            value={props.data.date}
                            sx={{
                                '& .MuiInputLabel-root.Mui-disabled': {
                                    color: '#868aba', // Default label color
                                },
                                '& .Mui-focused .MuiInputLabel-root': {
                                    color: '#868aba', // Label color when focused
                                },
                                '& .MuiInputBase-root.Mui-disabled': {
                                    color: '#868aba', // Label color when focused
                                    backgroundColor: '#fafafa',
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
                                        backgroundColor: "#fafafa",
                                        borderRadius: "2px",
                                    },
                                },
                                width: '100%',
                            }}
                        />
                        <TextField
                            spellCheck='false'
                            disabled
                            label="Day"
                            variant="outlined"
                            size='small'
                            value={props.data.day}
                            sx={{
                                '& .MuiInputLabel-root.Mui-disabled': {
                                    color: '#868aba', // Default label color
                                },
                                '& .Mui-focused .MuiInputLabel-root': {
                                    color: '#868aba', // Label color when focused
                                },
                                '& .MuiInputBase-root.Mui-disabled': {
                                    color: '#868aba', // Label color when focused
                                    backgroundColor: '#fafafa',
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
                                        backgroundColor: "#fafafa",
                                        borderRadius: "2px",
                                    },
                                },
                                width: '100%',
                            }}
                        />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "20px" }}>
                        <h3 style={{ color: "#6a7983" }}>Time Status</h3>
                        <div style={{ color: "green", display: "flex", gap: "10px" }}>&#x25C9; Clock In : <p style={{ color: "black" }}>{props.data.clockin === '—' ? loginTime : props.data.clockin}</p></div>
                        <div style={{ color: "red", display: "flex", gap: "10px" }}>&#x25C9; Pause :
                            {pauseResume.map((data, index) =>
                                <p style={{ color: "black" }}>{data.pause}</p>
                            )}
                        </div>
                        <div style={{ color: "blue", display: "flex", gap: "10px" }}>&#x25C9; Resume :
                            {pauseResume.map((data, index) =>
                                <p style={{ color: "black" }}>{data.resume}</p>
                            )}
                        </div>
                        <div style={{ color: "green", display: "flex", gap: "10px" }}>&#x25C9; Clock Out : <p style={{ color: "black" }}>{props.data.clockout}</p></div>
                        <div style={{ display: "flex", justifyContent: "center" }}>
                            {props.data.clockout === '—'
                                ?
                                <>
                                    {isPaused ?
                                        <Button style={{ backgroundColor: "#d63031", color: "white", marginRight: "20px", padding: "10px 15px", opacity: "0.5" }} disabled><i className="fa-solid fa-pause" style={{ marginRight: "10px" }}></i>Pause</Button>
                                        :
                                        <Button style={{ backgroundColor: "#d63031", color: "white", marginRight: "20px", padding: "10px 15px" }} onClick={() => handlePause()}><i className="fa-solid fa-pause" style={{ marginRight: "10px" }}></i>Pause</Button>
                                    }
                                    {!isPaused ?
                                        <Button style={{ backgroundColor: "#198754", color: "white", padding: "10px 15px", opacity: "0.5" }} disabled><i className="fa-solid fa-play" style={{ marginRight: "10px" }}></i>Resume</Button>
                                        :
                                        <Button style={{ backgroundColor: "#198754", color: "white", padding: "10px 15px" }} onClick={() => handleResume()}><i className="fa-solid fa-play" style={{ marginRight: "10px" }}></i>Resume</Button>
                                    }
                                </>
                                :
                                <></>}

                        </div>
                    </div>
                    {/* <div className="tfield">
                        <div className="btn-layer"></div>
                        <input type="submit" value="Submit" onClick={handleSubmit} />
                    </div> */}

                </div>
            </div>
        </div>
    );
}

export default TimesheetForm;
