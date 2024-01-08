import React, { useEffect, useState } from 'react';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { Avatar as MuiAvatar, Button, InputAdornment, List, ListItem, ListItemButton, ListItemIcon, ListItemText, TextField, Tooltip } from '@mui/material';
import { getData, postData } from '../FetchNodeServices';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
// import '../styles/userprofile.css';

function ProfileRightBar(props) {
  const [state, setState] = useState(false);
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [commonChannels, setCommonChannels] = useState([]);

  const userDataJson = JSON.parse(localStorage.getItem("userData"));

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

  function formatDate(inputDate) {
    const date = new Date(inputDate);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based, so we add 1.
    const year = date.getFullYear().toString();
    return `${day}-${month}-${year}`;
  }

  const handleChannelName = (data) => {
    props.handleChannelName(data);
  };

  function convertTimeFormat(inputTime) {
    // Split the input time string into hours, minutes, and AM/PM parts
    const [timePart, ampm] = inputTime.split(' ');
    const [hours, minutes] = timePart.split(':');

    // Format the time as HH:MM AM/PM
    const formattedTime = `${hours}:${minutes} ${ampm}`;

    return formattedTime;
  }


  useEffect(() => {
    setCommonChannels(props.commonChannels);
  }, [props]);

  const array = [1, 2, 3];

  return (
    <div style={{ height: "100%", backgroundColor: "#fff", position: "absolute", right: props.openProfile ? "0" : "-20rem", top: "0", zIndex: 4, width: "18rem", transition: "0.5s all ease" }}>
      <div className="user-info">
        <div className="userinfo-card">
          {props.profileData.image !== null ?
            <MuiAvatar variant="rounded" src={props.profileData.image} sx={{ width: "40px", height: "40px" }} />
            :
            <MuiAvatar sx={{ bgcolor: '#fff', color: "#868aba", width: 40, height: 40, fontSize: "16px" }} variant="rounded">{props.profileData.name ? getInitials(props.profileData.name) : <></>}</MuiAvatar>
          }
          {props.onlineUsers?.some((user) => user?.userId === props.profileData._id) ?
            <>
              <span class="blink-user blinker-user"></span>
              <span class="blink-user"></span>
            </>
            : <span class="blink-user" style={{ backgroundColor: "#f4da40" }}></span>}
          <div>
            <p>{props.profileData.name}</p>
            <p>{props.profileData.designation}</p>
          </div>
        </div>
        <div className="userinfo-more" onClick={props.handleOpenProfile}>
          <i class="fa-solid fa-xmark" style={{ transform: props.isPopupOpen ? "rotate(180deg)" : "rotate(0deg)" }}></i>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "20px", height: "100%", overflow: "auto", padding: "20px" }}>
        <div style={{ display: "flex", gap: "5px" }}>
          <div style={{ width: "35%", color: "#6a7983", display: "flex", flexDirection: "column", gap: "20px", fontWeight: "bold", fontSize: "16px" }}>
            <p>EID</p>
            <p>Email</p>
            <p>Contact</p>
            <p>Address</p>
          </div>
          <div style={{ width: "65%", color: "#a5abb3", display: "flex", flexDirection: "column", gap: "20px", fontSize: "16px" }}>
            <p>{props.profileData.eid}</p>
            <p>{props.profileData.email}</p>
            <p>{props.profileData.contact}</p>
            <p style={{ lineHeight: "1.5" }}>{props.profileData.address}, {props.profileData.city}, {props.profileData.state}, {props.profileData.country} - {props.profileData.pincode}</p>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ color: "#6a7983", fontSize: "15px", textTransform: "uppercase", letterSpacing: '1px', marginTop: "10px", fontWeight: "bold" }}>Channels in common</div>
          <List>
            {props.commonChannels.length > 0 && props.commonChannels.map((data) => (
              <ListItem style={{ marginTop: "10px", padding: 0 }} key={data._id} >
                <ListItemButton onClick={() => handleChannelName(data)} style={{ padding: "0", borderRadius: '4px' }} >
                  <ListItemIcon>
                    {
                      data.image !== null ?
                        <MuiAvatar variant="rounded" sx={{ width: 40, height: 40, cursor: "pointer" }} src={data.image} />

                        :
                        <MuiAvatar sx={{ bgcolor: '#868aba', color: "#fff", width: 40, height: 40, fontSize: "16px" }} variant="rounded">{data.channelName ? getInitials(data.channelName) : <></>}</MuiAvatar>

                    }
                  </ListItemIcon>
                  <ListItemText sx={{ color: "#6a7983", textAlign: "left" }} primary={data.channelName} secondaryTypographyProps={{ style: { fontSize: '12px' } }} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </div>
      </div>
    </div>
  );
}

export default ProfileRightBar;