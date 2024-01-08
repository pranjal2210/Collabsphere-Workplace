import React, { useEffect, useState } from "react";
import MessageSelf from "./messageSelf";
import MessageOthers from "./messageOthers";
import InputEmoji from "react-input-emoji";
import { getData, postData, postDataAndImage } from "../FetchNodeServices";
import InfoRightbar from "./infoRightBar";
import { Avatar, Tooltip } from "@mui/material";


function ChannelChat(props) {

  // console.log('prpops', props);
  const [data, setData] = useState("");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const userDataJson = JSON.parse(localStorage.getItem("userData"));

  const handleChange = (newMessage) => {
    setNewMessage(newMessage);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    const config = {
      headers: {
        Authorization: `Bearer ${userDataJson.token}`,
      },
    };

    //send message to socket server
    // const receiverId = props.channelData.members.find((id) => id !== props.currentUser);
    // props.setSendMessage({ ...messages, receiverId });

    //send message to database
    try {
      var body = {
        channelChatID: props.channelData._id,
        senderID: props.currentUser,
        text: newMessage,
      };
      const data = await postData('channel/addMessage', body);
      setMessages([...messages, data]);
      setNewMessage("");
    }
    catch (error) {
      console.log(error);
    };
  };

  const fetchMessages = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${userDataJson.token}`,
      },
    };
    try {
      const data = await getData(`channel/getMessages/${props.channelData._id}`, config);
      setMessages(data);
      // console.log("MESSAGES :", data);
    }
    catch (error) {
      console.log(error);
    }
  };

  const HandleOpenInfoRB = () => {
    props.HandleOpenInfoRB(props.channelData);
  };

  function getInitials(name) {
    if (name !== null && name !== undefined && name.trim() !== '') {
      const nameArray = name.trim().split(' ');
      if (nameArray.length > 1) {
        const initials = nameArray.map(word => word[0].toUpperCase()).join('');
        return initials;
      } else {
        // If there's only one name, return the initial of that name
        return nameArray[0][0].toUpperCase();
      }
    }
  }

  const handleFileChange = async (e) => {
    console.log('selected file', e.target.files[0]);
    // setFile(e.target.files[0]);
    try {
      const formData = new FormData();
      // formData.append('image', file);
      formData.append('image', e.target.files[0]);
      formData.append('chatID', props.channelData._id);
      formData.append('senderID', props.currentUser);
      console.log('formData', formData);
      const response = await postDataAndImage('message/upload', formData);
      console.log(response);

    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  useEffect(() => {
    if (props.chat !== null) {
      fetchMessages();
    }
  }, [props]);

  return (
    <>
      {props.channelData ?
        <>
          {/* <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 10px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div className="channelTitle" style={{ padding: 0, color: "#24305E" }}>#{props.channelData.channelName}</div >
            </div>
            <div>
              <InfoRightbar channelData={props.channelData} onShowChat={props.onShowChat} />
            </div>
          </div> */}

          <div className="middle-container chatbox">
            {/* <InfoRightbar channelData={props.channelData} onShowChat={props.onShowChat} /> */}
            <Tooltip title="Info">
              {props.channelData.image === null ?
                <Avatar onClick={HandleOpenInfoRB} sx={{ bgcolor: '#fff', width: 40, height: 40, color: "#00cacb", cursor: "pointer" }} variant="rounded">{props.channelData.channelName ? getInitials(props.channelData.channelName) : <></>}</Avatar>
                :
                <Avatar onClick={HandleOpenInfoRB} sx={{ width: 40, height: 40, cursor: 'pointer' }} src={props.channelData.image} variant="rounded" />}
            </Tooltip>
            <p>{props.channelData.channelName}</p>
          </div>

          <div className="messageContainer">
            {messages.map((msg) => {
              return msg.senderID !== userDataJson._id ?
                <MessageOthers key={msg._id} message={msg} />
                :
                <MessageSelf key={msg._id} message={msg} />;
            }
            )}
          </div>
          <div className="textbox">
            <label className="paperclip">
              <input type="file" accept=".jpg, .jpeg, .png, .pdf, .doc, .docx, .txt, .ppt, .xls" style={{ display: "none" }} onChange={handleFileChange} />
              <i className="fa-solid fa-paperclip"></i>
            </label>
            <div className="textarea">
              <InputEmoji value={newMessage} onChange={handleChange} borderRadius="0px" theme="dark" />
            </div>
            <div className="sendMessage" onClick={handleSend}>
              <i className="fa-solid fa-paper-plane" ></i>
            </div>
          </div>
        </>
        :
        <div className="chatLogo">
          Welcome, {userDataJson.name.split(' ')[0]}
          <img src="/images/collabLogo.png" alt="chatLogo" />
          CollabSphere
        </div>
      }
    </>
  );
}

export default ChannelChat;