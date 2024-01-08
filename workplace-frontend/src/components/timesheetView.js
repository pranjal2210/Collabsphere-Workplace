import React, { useEffect, useState } from 'react';
import '../styles/timesheet.css';
import { postData } from '../FetchNodeServices';
import { TextField } from '@mui/material';
import Timeprogressbar from './timeprogressbar';

function TimesheetView(props) {
  // console.log("Props", props);

  const [pauseResume, setPauseResume] = useState([]);

  const handleClose = () => {
    props.onClose();
  };

  const fetchTimeSheet = () => {
    setPauseResume(props.data.pauseResume);
  };

  useEffect(() => {
    fetchTimeSheet();
  }, []);

  function secondsToHMS(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = remainingSeconds.toString().padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }

  return (
    <div className='popup-timesheet'>
      <div className='wrapper-timesheet'>
        <button className="closeBtn2" onClick={handleClose}>&#10006;</button>
        <h2>Timesheet</h2>
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
              size='small'
              variant="outlined"
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
            <Timeprogressbar data={props.data} />
          </div>

          <div style={{ display: 'flex', gap: '10px', margin: '10px 0' }}>
            <TextField
              spellCheck='false'
              disabled
              label="Overtime Hours"
              variant="outlined"
              size='small'
              value={props.data.overtime}
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
              size='small'
              label="Total Hours"
              variant="outlined"
              value={secondsToHMS(props.data.totalhours)}
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
        </div>
      </div>
    </div>
  );
}

export default TimesheetView;
