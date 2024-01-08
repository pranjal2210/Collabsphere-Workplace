import React, { useEffect, useState } from 'react';
import { getData } from '../FetchNodeServices';
import { Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';

function Conversation(props) {

  const [usersData, setUsersData] = useState("");

  const userDataJson = JSON.parse(localStorage.getItem("userData"));
  const currentUserID = userDataJson._id;
  const receiverId = props.chatData.members.find((id) => id !== currentUserID);
  console.log("Reciever", receiverId);

  const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
      backgroundColor: '#44b700',
      color: '#44b700',
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      '&::after': {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        animation: 'ripple 1.2s infinite ease-in-out',
        border: '1px solid currentColor',
        content: '""',
      },
    },
    '@keyframes ripple': {
      '0%': {
        transform: 'scale(.8)',
        opacity: 1,
      },
      '100%': {
        transform: 'scale(2.4)',
        opacity: 0,
      },
    },
  }));




  const getUserData = async () => {
    const otherUserID = props.chatData.members.find((id) => id !== currentUserID);
    const config = {
      headers: {
        Authorization: `Bearer ${userDataJson.token}`,
      },
    };

    try {
      const result = await getData(`channel/displayAUser/${otherUserID}`, config);
      // console.log("getUserData...", result.data.name);
      setUsersData(result);
    } catch (error) {
      console.log('error in getUserData', error);
    }
  };

  function getInitials(name) {
    if (name !== null && name !== undefined && name !== '') {
      const nameArray = name.split(' ');
      const initials = nameArray.map(word => word[0].toUpperCase()).join('');
      return initials;
    }
  }

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <>
      {props.onlineUsers?.some((user) => user?.userId === receiverId) ?
        <div key={props.chatData._id} style={{ display: "flex", alignItems: "center", gap: "12px", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {usersData.image === null ?
              <Avatar variant='rounded' sx={{ bgcolor: '#868aba', color: "#fff", width: 30, height: 30, fontSize: "16px" }}>{usersData.name ? getInitials(usersData.name) : <></>}</Avatar>
              :
              <Avatar sx={{ width: 30, height: 30 }} src={usersData.image} variant='rounded' />}
            <h3>{usersData.name}</h3>
          </div>
          <div class="blink-container">
            <span class="blink blinker"></span>
            <span class="blink"></span>
          </div>
        </div>
        :
        <div key={props.chatData._id} style={{ display: "flex", alignItems: "center", gap: "12px", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {usersData.image === null ?
              <Avatar variant='rounded' sx={{ bgcolor: '#868aba', color: "#fff", width: 30, height: 30, fontSize: "16px" }}>{usersData.name ? getInitials(usersData.name) : <></>}</Avatar>
              :
              <Avatar sx={{ width: 30, height: 30 }} src={usersData.image} variant='rounded' />}
            <h3>{usersData.name}</h3>
          </div>
          <div style={{ width: "8px", height: "8px", borderRadius: "8px", backgroundColor: "#f4da40" }}></div>
        </div>}
    </>
  );
}

export default Conversation;