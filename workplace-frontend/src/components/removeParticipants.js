import React, { useEffect, useState } from 'react';
import '../styles/adminpage.css';
import { getData, postData } from '../FetchNodeServices';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import Tooltip from '@mui/material/Tooltip';
import { Box, Divider, List, ListItem, ListItemText } from '@mui/material';


function RemoveParticipants(props) {
  const [users, setUsers] = useState([]);
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [participants, setParticipants] = useState([]);
  const [openAlert, setOpenAlert] = React.useState(false);
  const [alertMsg, setAlertMsg] = React.useState("");
  const [alertType, setAlertType] = React.useState("success");
  const userData = JSON.parse(localStorage.getItem("userData"));
  const icon = <TaskAltIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;
  const [dense, setDense] = React.useState(false);
  const [isAdmin, setIsAdmin] = useState(true);

  //   function generate(element) {
  //     return users.map((value) =>
  //       React.cloneElement(element, {
  //         key: value,
  //       }),
  //     );
  //   }

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

  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  function checkIsAdmin(data) {
    var val = true;
    participants.admins !== undefined && participants.admins.map((value) => {
      if (value._id === data._id) {
        val = false;
      }
    });
    return val;
  }

  function checkIsMember(data) {
    var val = true;
    participants.members !== undefined && participants.members.map((value) => {
      if (value._id === data._id) {
        val = false;
      }
    });
    return val;
  }

  const getUsers = () => {
    setId(props.data._id);
    setName(props.data.channelName);
  };

  const fetchChannelByID = async (e) => {
    console.log("Users refreshed");
    const config = {
      headers: {
        Authorization: `Bearer ${userData.token}`,
      },
    };
   console.log(props.data._id)
    var result = await getData(`channel/displayChannelsById/${props.data._id}`, config);
    setParticipants(result);
  };

  useEffect(() => {
    getUsers();
    fetchUsers();
    fetchChannelByID();
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
    <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.4)", zIndex: "5", display: "flex", alignItems: "center", justifyContent: "center", zIndex: "1500" }}>
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
      <div style={{ maxHeight: "90vh", maxWidth: "520px", backgroundColor: "#fff", position: "relative", borderRadius: '4px', padding: "20px", textAlign: 'center', overflow: 'auto' }}>
        <button className="closeBtn2" onClick={handleClose}>&#10006;</button>
        <h2 style={{ fontSize: "22px", color: '#6a7983' }}>Remove Participant</h2>
        <hr style={{ borderBottom: '1px solid #00cacb', width: '20%', margin: '6px auto' }} />
        <List sx={{ padding: 0 }}>
          {users !== undefined && users.map((data) => (
            <>
              {data.name !== "" && !checkIsMember(data) && checkIsAdmin(data) ?
                <>
                  <ListItem>
                    <Tooltip title="Click to Remove Participants">
                      <IconButton edge="start" aria-label="delete" onClick={() => removeMembers(data._id)}>
                        <PersonRemoveIcon style={{ color: "#868aba" }} />
                      </IconButton>
                    </Tooltip>
                    <ListItemText
                      style={{ marginLeft: "20px", color: '#a5abba' }}
                      primary={data.name + "  (" + data.designation + ")"}
                    />
                  </ListItem>
                  <Divider style={{ width: "100%" }} />
                </>
                : <></>}
            </>
          ))
          }

        </List>
      </div>
    </div >
  );
}

export default RemoveParticipants;