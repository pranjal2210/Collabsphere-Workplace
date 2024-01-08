import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { Avatar, Tooltip } from '@mui/material';
import { getData, postData } from '../FetchNodeServices';

function UserSidebar(props) {
  const [state, setState] = useState(false);
  const [users, setUsers] = useState([]);

  const userData = JSON.parse(localStorage.getItem("userData"));

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
    // console.log("RESULT:", result.data);
  };



  const handleCreateChat = async (data) => {
    try {
      var body = {
        senderID: userData._id,
        receiverID: data._id
      };
      const result = await postData('chat/createChat', body);
      setTimeout(() => {
        props.onShowChat(result);
      }, 250);
    }
    catch (error) {
      console.log(error);
    }
  };

  function getInitials(name) {
    if (name !== null && name !== undefined && name !== '') {
      const nameArray = name.split(' ');
      const initials = nameArray.map(word => word[0].toUpperCase()).join('');
      return initials;
    }
  }
  // console.log(users)
  const list = (anchor) => (
    <Box
      sx={{ width: 300, bgcolor: "#D1D7E0", height: "100%" }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        <h2 style={{ marginLeft: "20px", padding: "20px 0", color: "#24305E" }}>All Users</h2>
        {users.map((data) => (
          <div key={data._id}>
            {data.name !== '' ?
              <>
                <ListItem key={data._id} disablePadding>
                  <ListItemButton onClick={() => handleCreateChat(data)}>
                    <ListItemIcon>
                      {data.image === null ?
                        <Avatar sx={{ bgcolor: '#24305E', width: 40, height: 40, color: "#D1D7E0", cursor: "pointer" }}>{data.name ? getInitials(data.name) : <></>}</Avatar>
                        :
                        <Avatar sx={{ bgcolor: '#24305E', width: 40, height: 40, color: "#D1D7E0", cursor: "pointer",outline: "2px solid #24305e" }} src={data.image} />}
                    </ListItemIcon>
                    {/* <ListItemText sx={{ color: "#24305E" }} primary={data.name} />
                    <small>{data.designation}</small> */}
                    <ListItemText sx={{ color: "#24305E" }} primary={data.name} secondary={data.designation} secondaryTypographyProps={{ style: { fontSize: '12px' } }} />
                  </ListItemButton>
                </ListItem>
              </>
              :
              <>
              </>
            }
          </div>
        ))}
      </List>
    </Box>
  );

  useEffect(function () {
    fetchUsers();
  }, []);


  return (
    <div>
      <React.Fragment key={'left'}>
        <Tooltip title="Add Users">
          <Avatar sx={{ bgcolor: '#fff', width: 40, height: 40, color: "#6a7983", cursor: "pointer" }} onClick={toggleDrawer('left', true)}>
            <i style={{ fontSize: "26px" }} className="fa-solid fa-user-plus"></i>
          </Avatar>
        </Tooltip>

        <SwipeableDrawer
          anchor={'left'}
          open={state['left']}
          onClose={toggleDrawer('left', false)}
          onOpen={toggleDrawer('left', true)}
        >
          {list('left')}
        </SwipeableDrawer>
      </React.Fragment>
    </div>
  );
}

export default UserSidebar;