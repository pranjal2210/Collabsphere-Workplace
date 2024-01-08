import React, { useEffect, useRef, useState } from "react";
import "../styles/homepage.css";
import ChatBox from "../components/chatBox";
import Conversation from "../components/conversation";
import { getData, postData } from "../FetchNodeServices";
import { useNavigate, useParams } from 'react-router-dom';
import { Alert, Collapse, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Avatar as MuiAvatar } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import io from 'socket.io-client';
import Timesheet from "../components/timesheet";
import UserSidebar from "../components/usersSidebar";
import ChannelChat from "../components/channelChat";
import Payroll from "../components/payroll";
import { Badge, Box, Button, TextField } from "@mui/material";
import Avatar from "react-avatar-edit";
import CloseIcon from '@mui/icons-material/Close';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ProfileRightBar from "../components/profileRightBar";
import InfoRightbar from "../components/infoRightBar";

function HomePage() {
  const [open, isOpen] = useState(false);
  const [openConvo, isOpenConvo] = useState(false);
  const [channel, setChannel] = useState([]);
  const [channelData, setChannelData] = useState(null);
  const [chats, setChats] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [timesheet, setTimesheet] = useState(false);
  const [payroll, setPayroll] = useState(false);
  const [sendMessage, setSendMessage] = useState(null);
  const [receiveMessage, setReceiveMessage] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [profileData, setProfileData] = useState([]);
  const [commonChannels, setCommonChannels] = useState([]);
  const [timesheetDataByDate, setTimesheetDataByDate] = useState([]);
  const [myData, setMyData] = useState([]);

  const [nameError, setNameError] = useState('');
  const [EmailError, setEmailError] = useState('');
  const [contactError, setContactError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [showEid, setShowEid] = useState('');
  const [showName, setShowName] = useState('');
  const [showEmail, setShowEmail] = useState('');
  const [showContact, setShowContact] = useState('');
  const [password, setPassword] = useState('');
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [dialogs, setDialogs] = useState(false);
  const [croppedImage, setCroppedImage] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  // const socket = useRef();
  const userData = JSON.parse(localStorage.getItem("userData"));

  const [openChat, setOpenChat] = useState(false);
  const [openChannel, setOpenChannel] = useState(false);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [collapseRightBar, setCollapseRightBar] = useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showMyPassword, setShowMyPassword] = useState('');
  const [openInfoRB, setInfoRB] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const HandleOpenInfoRB = () => {
    setInfoRB(!openInfoRB);
    setOpenProfile(false);
    setIsPopupOpen(false);
  };


  console.log("onlineUsers", onlineUsers);

  const onCrop = (e) => {
    // console.log('onCrop', e);
    setCroppedImage(e);
  };

  const onClose = (e) => {
    setProfileImage(croppedImage);
    setDialogs(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // console.log('profileImage', profileImage);
      var body = { eid: showEid, name: showName, email: showEmail, contact: showContact, password: showMyPassword, image: profileImage };
      if (showName.length > 0 && showEmail.length > 0 && showContact.length > 0 && setShowMyPassword.length > 0) {
        if (showContact.length < 10) {
          setContactError("*Phone number must contain 10 digits");
        }
        else if (showMyPassword.length < 4) {
          setPasswordError('*must contain atleast 4 characters');
        }
        else if (!(/^[a-zA-Z0-9._%+-]+@[^.]+\.com$/.test(showEmail))) {
          setEmailError('*enter valid email');
        }
        else {
          var result = await postData("users/updateuser", body);
          localStorage.setItem("userData", JSON.stringify(result));
          setOpenAlert(true);
          setAlertMsg(result.message);
          setAlertType(result.msgType);
          const timer = setTimeout(() => {
            setOpenAlert(false);
            localStorage.setItem("userData", JSON.stringify(result));
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

  const getProfile = () => {
    setShowEid(userData.eid);
    setShowName(userData.name);
    setShowEmail(userData.email);
    setShowContact(userData.contact);
    setProfileImage(userData.image);
  };

  function getRandomColor() {
    const colors = ["#7efff5", "#ffcccc", "#cd84f1", "#d1ccc0", "#ffda79", "#33d9b2", "#9AECDB", "#CAD3C8", "#FEA47F", "#BDC581", "#6a89cc", "#78e08f", "#c7ecee", "#535c68", "#BEADFA", "#f9ebae", "#f1d1b5", "#f2b7c0", "#f3a683", "#f8c291", "#6a0572", "#ab83a1", "#f50057", "#ff1e56", "#ffac41", "#ff355e", "#ffc3a0", "#ff7f50", "#f8c291", "#ffcccb", "#fad02e", "#ff4040", "#ff6666", "#ffb6b9", "#ffd700", "#ff8c00", "#ff4500", "#ffa07a", "#ff69b4", "#ffb6c1", "#ff6347", "#ff7f50", "#fa8072", "#ff9999", "#ffcccb", "#ffd700", "#ffe4b5", "#ffebcd", "#ffe4e1", "#f5deb3", "#faebd7", "#f0e68c", "#ffffe0", "#fffff0", "#f0fff0", "#add8e6", "#87cefa", "#87ceeb", "#00bfff", "#b0e0e6", "#5f9ea0", "#4682b4", "#afeeee", "#00ced1", "#e0ffff", "#afeeee", "#87cefa", "#87ceeb", "#00bfff", "#b0e0e6", "#5f9ea0", "#4682b4", "#afeeee", "#00ced1", "#e0ffff", "#98fb98", "#90ee90", "#00fa9a", "#00ff7f", "#3cb371", "#2e8b57", "#008000", "#006400", "#9acd32", "#32cd32", "#00ff00", "#7cfc00", "#7fff00", "#adff2f", "#556b2f", "#8fbc8f", "#006400", "#008000", "#228b22", "#00ff00", "#32cd32", "#3cb371", "#2e8b57", "#9acd32", "#7fff00"];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  }

  // useEffect(() => {
  //   socket.current = io('http://localhost:8800', {
  //     transports: ["websocket"],
  //     autoConnect: true
  //   });
  //   socket.current.emit("new-user-add", userData._id);
  //   socket.current.on('get-users', (users) => {
  //     setOnlineUsers(users);
  //   });
  // }, [users]);

  useEffect(() => {
    const newSocket = io("http://localhost:8800");
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [users]);

  useEffect(() => {
    if (socket === null) return;
    socket.emit("addNewUser", userData?._id);
    socket.on("getOnlineUsers", (res) => {
      setOnlineUsers(res);
    });
    return () => {
      socket.off("getOnlineUsers");
    };
  }, [socket]);

  //send message
  useEffect(() => {
    if (socket === null) return;
    const recipientId = currentChat?.members?.find((id) => id !== userData?._id);
    console.log(recipientId, "RECIPIENT ID");
    socket.emit("sendMessage", { ...sendMessage, recipientId });
  }, [sendMessage]);

  //receive message
  useEffect(() => {
    if (socket === null) return;
    socket.on("getMessage", res => {
      console.log(res);
      if (currentChat?._id !== res.chatID) return;
      setReceiveMessage(res);
    });
    return () => {
      socket.off("getMessage");
    };
  }, [socket, currentChat]);



  // //send message to the socket server
  // useEffect(() => {
  //   if (sendMessage !== null) {
  //     socket.current.emit('send-message', sendMessage);
  //   }
  // }, [sendMessage]);
  // //receive message from socket server
  // useEffect(() => {
  //   socket.current.on("receive-message", (data) => {
  //     setReceiveMessage(data);
  //   });
  // }, []);


  const nav = useNavigate();

  const fetchChannels = async (e) => {
    const config = {
      headers: {
        Authorization: `Bearer ${userData.token}`,
      },
    };
    var result = await getData(`channel/displayChannels/${userData._id}`, config);
    // console.log('result', result);
    setChannel(result);
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
  const fetchMyData = async (e) => {
    console.log("Users refreshed");
    const config = {
      headers: {
        Authorization: `Bearer ${userData.token}`,
      },
    };

    const userId = userData.eid;
    var result = await getData(`admin/displayUsersById/${userId}`, config);
    setMyData(result.data);
    setShowMyPassword(result.data[0].password);
    console.log("RESULT:", result.data);
  };
  function formatDate(inputDate) {
    const date = new Date(inputDate);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based, so we add 1.
    const year = date.getFullYear().toString();
    return `${day}-${month}-${year}`;
  }
  const fetchtimesheet = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${userData.token}`,
      },
    };
    try {
      const ID = userData.eid;
      const date = formatDate(new Date());
      var results = await getData(`timesheet/getTimesheetByDate/${ID}/${date}`, config);
      // console.log('getTimesheet', results);
      setTimesheetDataByDate(results);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChannelName = (data) => {
    setChannelData(data);
    setOpenChannel(true);
    setPayroll(false);
    setTimesheet(false);
    setOpenChat(false);
  };

  const handleSetCurrentChat = (chat) => {
    setCurrentChat(chat);
    setOpenChat(true);
    setTimesheet(false);
    setOpenChannel(false);
    setPayroll(false);
  };

  const showTimesheet = async () => {
    setTimesheet(true);
    setPayroll(false);
    setOpenChat(false);
    setCurrentChat(null);
  };

  const showPayroll = async () => {
    setPayroll(true);
    setTimesheet(false);
    setOpenChat(false);
    setCurrentChat(null);
  };

  const openPopup = () => {
    setIsPopupOpen(!isPopupOpen);
    setOpenProfile(false);
    setInfoRB(false);
  };

  const handleOpenProfile = (data) => {
    setOpenProfile(!openProfile);
    setProfileData(data);
    setInfoRB(false);
    setIsPopupOpen(false);
  };

  const handleCommonChannels = (data) => {
    setCommonChannels(data);
  };

  const closeRightBar = () => {
    setCollapseRightBar(!collapseRightBar);
    setOpenProfile(false);
    setIsPopupOpen(false);
    setInfoRB(false);
  };
  // console.log("DATAATTTTTT", timesheetDataByDate[0]);

  function getTimeDifferenceInSeconds(startTime, endTime) {
    const st = startTime.split(" ")[0];
    const en = endTime.split(" ")[0];
    const [startHours, startMinutes, startSeconds] = st.split(':').map(Number);
    const [endHours, endMinutes, endSeconds] = en.split(':').map(Number);

    const totalStartSeconds = (startHours * 60 + startMinutes + startSeconds / 60) * 60;
    const totalEndSeconds = (endHours * 60 + endMinutes + endSeconds / 60) * 60;

    const timeDifferenceInSeconds = totalEndSeconds - totalStartSeconds;

    return timeDifferenceInSeconds;
  }

  function getInitials(name) {
    if (name !== null && name !== undefined && name !== '') {
      const nameArray = name.split(' ');
      const initials = nameArray.map(word => word[0].toUpperCase()).join('');
      return initials;
    }
  }

  const handleCreateChat = async (data) => {
    try {
      var body = {
        senderID: userData._id,
        receiverID: data._id
      };
      const result = await postData('chat/createChat', body);
      setTimeout(() => {
        handleSetCurrentChat(result);
      }, 250);
    }
    catch (error) {
      console.log(error);
    }
  };


  const handleLogout = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${userData.token}`,
      },
    };
    try {
      const ID = userData.eid;
      const date = formatDate(new Date());
      var results = await getData(`timesheet/getTimesheetByDate/${ID}/${date}`, config);
      if (results[0] !== undefined && results[0] !== null) {
        try {
          const currentTime = new Date().toTimeString().split(' ')[0];
          const totalclockseconds = getTimeDifferenceInSeconds(results[0].clockin, currentTime);
          var pauseResumeSeconds = 0;
          results[0].pauseResume.map((data) => {
            var pauseResume = getTimeDifferenceInSeconds(data.pause, data.resume);
            pauseResumeSeconds = pauseResumeSeconds + pauseResume;
          });
          const totaltime = totalclockseconds - pauseResumeSeconds;
          // console.log("TOTAL TIME", totaltime);
          var overtime = 0;
          if (totaltime > 21600) {
            overtime = parseInt(totaltime) - 21600;
          }
          var body = {
            id: results[0]._id, clockout: currentTime, totalhours: totaltime, overtime: overtime
          };
          var result = await postData('timesheet/updateTimesheetLogout', body);
          // console.log("BODY UPDATED:", body);
          // console.log('Result Timesheet', result);
        }
        catch (error) {
          console.log(error);
        }
      }
      else {
        console.log('Error in getTimesheetByDate');
      }
    } catch (error) {
      console.log(error);
    }

    setTimeout(() => {
      localStorage.removeItem("userData");
      nav("/");
    }, 500);
  };

  const renderComponent = () => {
    if (timesheet) {
      return <Timesheet timesheetData={timesheetDataByDate} />;
    }
    else if (payroll) {
      return <Payroll />;
    }
    else if (openChat) {
      return <ChatBox currentUser={userData._id} chat={currentChat} setSendMessage={setSendMessage} receiveMessage={receiveMessage} onShowChannel={handleChannelName} handleOpenProfile={handleOpenProfile} handleCommonChannels={handleCommonChannels} />;
    }
    else if (openChannel) {
      return <ChannelChat currentUser={userData._id} channelData={channelData} setSendMessage={setSendMessage} receiveMessage={receiveMessage} onShowChat={handleSetCurrentChat} HandleOpenInfoRB={HandleOpenInfoRB} />;
    }
    else {
      return (
        <>
          <div className="middle-container">Welcome, {userData.name.split(' ')[0]}</div>
          <div className="chatLogo">
            <img src="/images/collabLogo2.png" alt="chatLogo" />
            CollabSphere
          </div>
        </>
      );
    }
  };

  useEffect(function () {
    const userData = JSON.parse(localStorage.getItem("userData"));

    fetchMyData();
    fetchChannels();
    fetchUsers();
    fetchtimesheet();
    getProfile();


    const getChats = async () => {
      const config = {
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      };

      try {
        const result = await getData(`chat/userChat/${userData._id}`, config);
        console.log('chats:', result);
        setChats(result);
      } catch (error) {
        console.log("error in getChats", error);
      }
    };
    getChats();
  }, []);

  const handleChangeName = (event) => {
    const inputValue = event.target.value; // Trim extra spaces
    const isValidInput = /^[a-zA-Z]*(?: [a-zA-Z]*)?$/.test(inputValue);

    if (inputValue === '' || isValidInput) {
      // Capitalize the first letter of each word
      const formattedValue = inputValue
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
      setShowName(formattedValue);
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
      setShowEmail(inputValue);
      setEmailError('');
      if (inputValue.length === 0) {
        setEmailError('*Email cannot be empty');
      }
    }
    else {
      setEmailError('*Email must contain alphabets, ., _, @');
    }
  };

  const handleChangeContact = (event) => {
    const inputValue = event.target.value;
    const isValidInput = /^[0-9]*$/.test(inputValue);
    if (inputValue.length <= 10) {
      if (inputValue === '' || isValidInput) {
        setShowContact(inputValue);
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

  const handleChangePassword = (event) => {
    const inputValue = event.target.value;
    setShowMyPassword(inputValue);
    setPasswordError('');
    if (inputValue.length === 0) {
      setPasswordError('*Password cannot be empty');
    }
    else if (inputValue.length < 4) {
      setPasswordError('*must contain atleast 4 characters');
    }
  };

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
      <div className="homepage">
        <div className="topbar">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
        <div className="container">

          <div className="sidebar">
            <div className="logo">
              <img src="/images/collabLogo.png" alt="sidebar" />
              CollabSphere
            </div>

            {/* <div className="userBar">
            <Tooltip title="Profile">
              <Avatar sx={{ bgcolor: '#fff', width: 50, height: 50, color: "#6a7983", cursor: "pointer" }} onClick={openPopup}>
                <i style={{ fontSize: "26px" }} className="fa-solid fa-user"></i>
              </Avatar>
            </Tooltip>
            <UserSidebar onShowChat={handleSetCurrentChat} />
            <Tooltip title="Logout">
              <Avatar sx={{ bgcolor: '#fff', width: 50, height: 50, color: "#6a7983", cursor: "pointer" }} onClick={handleLogout} >
                <i style={{ fontSize: "26px" }} className="fa-solid fa-arrow-right-from-bracket"></i>
              </Avatar>
            </Tooltip>
          </div > */}

            <div className="middle-wrapper">
              <div className="channels">
                <h3>All channels</h3>
                <div className="channel-list">
                  {channel.length === 0 ?
                    <div className="no-channel">
                      <div className="color-square" style={{ backgroundColor: getRandomColor() }}></div>
                      <p>No Channels</p>
                    </div>
                    :
                    <>
                      {channel.map((data) => (
                        <>
                          <div className="channel-map" onClick={() => handleChannelName(data)} key={data._id}>
                            <div className="color-square" style={{ backgroundColor: getRandomColor() }}></div>
                            <h3>#{data.channelName}</h3>
                          </div>
                        </>
                      ))}
                    </>
                  }
                </div>
              </div>

              <div className="timesheet" onClick={showTimesheet}>
                <h3>Timesheet</h3>
              </div>

              <div className="payroll" onClick={showPayroll}>
                <h3>Payroll</h3>
              </div>
            </div>

            <Tooltip title="Logout" placement="top-end">
              <div className="logout" onClick={handleLogout} >
                <i className="fa-solid fa-arrow-right-from-bracket"></i>
                <p>Exit CollabSphere</p>
              </div>
            </Tooltip>

          </div>

          <div className="middlebar">
            {renderComponent()}
          </div>

          <div className="openRB-div" onClick={closeRightBar} style={{ right: collapseRightBar ? "1rem" : "19rem" }}>
            {collapseRightBar ? <i className="fa-solid fa-arrow-left-long"></i> : <i className="fa-solid fa-arrow-right-long"></i>}
          </div>

          <div className="rightbar" style={{ width: collapseRightBar ? "0rem" : "18rem", opacity: collapseRightBar ? 0 : 1 }}>
            <div className="user-info">
              <div className="userinfo-card">
                <MuiAvatar variant="rounded" src={userData.image} sx={{ width: "40px", height: "40px" }} />
                <span class="blink-user blinker-user"></span>
                <span class="blink-user"></span>
                <div>
                  <p>{userData.name}</p>
                  <p>{userData.designation}</p>
                </div>
              </div>
              <div className="userinfo-more" onClick={openPopup}>
                <i class="fa-solid fa-bars-staggered" style={{ transform: isPopupOpen ? "rotate(180deg)" : "rotate(0deg)" }}></i>
              </div>
            </div>
            <div style={{ height: "-webkit-fill-available", overflow: 'auto', backgroundColor: "#fff", position: "absolute", right: isPopupOpen ? "0" : "-20rem", top: "88px", zIndex: 2, width: "18rem", transition: "0.5s all ease" }}>
              <Box component="form" sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
                <Badge
                  sx={{ cursor: "pointer" }}
                  overlap="circular"
                  anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                  onClick={() => setDialogs(true)}
                  badgeContent={
                    <i className="fa-solid fa-pencil" style={{ color: "#868aba", backgroundColor: "#fff", padding: "4px", borderRadius: "10px" }}></i>
                  }
                >
                  {
                    profileImage !== null ?
                      <MuiAvatar sx={{ width: 80, height: 80, outline: "2px solid #868aba" }} src={profileImage} />

                      :
                      <MuiAvatar sx={{ bgcolor: '#868aba', width: 80, height: 80, fontSize: "26px" }}>{getInitials(showName)}</MuiAvatar>

                  }
                </Badge>
                <TextField
                  spellCheck='false'
                  size="small"
                  disabled
                  label="Employee ID"
                  variant="outlined"
                  value={showEid}
                  sx={{
                    '& .MuiInputLabel-root.Mui-disabled': {
                      color: '#868aba', // Default label color
                    },
                    '& .Mui-focused .MuiInputLabel-root': {
                      color: '#868aba', // Label color when focused
                    },
                    '& .MuiInputBase-root.Mui-disabled': {
                      color: '#868aba', // Label color when focused
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
                        backgroundColor: "#e5e5e57a",
                        borderRadius: "2px",
                      },
                    },
                    width: '100%',
                    marginTop: '26px',
                  }}
                />
                <TextField
                  spellCheck='false'
                  size="small"
                  label="Name"
                  variant="outlined"
                  value={showName}
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
                    marginTop: '26px'
                  }}
                />
                <TextField
                  spellCheck='false'
                  size="small"
                  label="Email"
                  variant="outlined"
                  value={showEmail}
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
                    marginTop: '26px'
                  }}
                />
                <TextField
                  spellCheck='false'
                  label="Contact"
                  size="small"
                  variant="outlined"
                  value={showContact}
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
                    marginTop: '26px'
                  }}
                />
                <TextField
                  label="Password"
                  spellCheck='false'
                  size="small"
                  variant="outlined"
                  value={showMyPassword}
                  onChange={handleChangePassword}
                  helperText={passwordError}
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
                    marginTop: '26px'
                  }}
                  type={showPassword ? 'text' : 'password'}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          style={{ color: "#868aba" }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Button variant="contained" size="large" sx={{ width: "150px", backgroundColor: "#868aba", marginTop: '26px', '&:hover': { backgroundColor: '#868aba66' }, height: "40px" }} onClick={handleSubmit} >Update</Button>
              </Box>
            </div>

            <ProfileRightBar profileData={profileData} openProfile={openProfile} handleOpenProfile={handleOpenProfile} handleChannelName={handleChannelName} commonChannels={commonChannels} onlineUsers={onlineUsers} />

            <InfoRightbar channelData={channelData} onShowChat={handleSetCurrentChat} isOpenRB={openInfoRB} />

            <div className="convo-alluser" style={{ overflow: collapseRightBar ? "hidden" : "auto" }}>
              <div className="conversations">
                <h3>Chats</h3>
                <div className="convoWrapper">
                  {chats.length === 0 ?
                    <div style={{ cursor: "default" }}>
                      <p>No conversations</p>
                    </div>
                    :
                    <>
                      {chats.map((chat) => (
                        <div key={chat._id} onClick={() => handleSetCurrentChat(chat)}>
                          <Conversation key={chat._id} chatData={chat} onlineUsers={onlineUsers} />
                        </div>
                      ))}
                    </>
                  }
                </div>
              </div>

              <div className="conversations">
                <h3>All Chats</h3>
                <div className="convoWrapper">
                  {users.length === 0 ?
                    <div style={{ cursor: "default" }}>
                      <p>No Chats</p>
                    </div>
                    :
                    <>
                      {users.map((data) => (
                        data.email !== "" && <div key={data._id} onClick={() => handleCreateChat(data)}>
                          {onlineUsers?.some((user) => user?.userId === data._id) ?
                            <div key={data._id} className="all-map" style={{ justifyContent: "space-between" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                {data.image === null ?
                                  <MuiAvatar sx={{ bgcolor: '#868aba', color: "#fff", width: 30, height: 30, fontSize: "16px" }} variant="rounded">{data.name ? getInitials(data.name) : <></>}</MuiAvatar>
                                  :
                                  <MuiAvatar sx={{ width: 30, height: 30, fontSize: "16px" }} src={data.image} variant='rounded' />}
                                <h3>{data.name}</h3>
                              </div>
                              <div class="blink-container">
                                <span class="blink"></span>
                              </div>
                            </div>
                            :
                            <div key={data._id} className="all-map">
                              {data.image === null ?
                                <MuiAvatar sx={{ bgcolor: '#868aba', color: "#fff", width: 30, height: 30, fontSize: "16px" }} variant="rounded">{data.name ? getInitials(data.name) : <></>}</MuiAvatar>
                                :
                                <MuiAvatar sx={{ width: 30, height: 30, fontSize: "16px" }} src={data.image} variant='rounded' />}
                              <h3>{data.name}</h3>
                            </div>}
                        </div>
                      ))}
                    </>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
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
}
export default HomePage;;