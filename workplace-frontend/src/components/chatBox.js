import React, { useEffect, useRef, useState } from "react";
import MessageSelf from "./messageSelf";
import MessageOthers from "./messageOthers";
import { getData, postData, postDataAndImage } from "../FetchNodeServices";
import InputEmoji from "react-input-emoji";
import { Avatar, Tooltip } from "@mui/material";
import ProfileRightBar from "./profileRightBar";

function ChatBox(props) {
    const [usersData, setUsersData] = useState("");
    const [messages, setMessages] = useState([]);
    const [commonChannels, setCommonChannels] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const userDataJson = JSON.parse(localStorage.getItem("userData"));
    const [imageUrls, setImageUrls] = useState([]);

    const sendProfileData = () => {
        props.handleOpenProfile(usersData);
        props.handleCommonChannels(commonChannels);
    };

    //fetching receivers
    console.log(props.chat, "CHATBOX");
    const userId = props.chat?.members?.find((id) => id !== props.currentUser);
    console.log(userId, "USERID");
    const getUserData = async () => {
        const config = {
            headers: {
                Authorization: `Bearer ${userDataJson.token}`,
            },
        };
        try {
            const result = await getData(`channel/displayAUser/${userId}`, config);
            const commonGroups = await getData(`channel/getCommonChannel/${userDataJson._id}/${userId}`, config);
            // console.log("getUserData...", result.data.name);
            setUsersData(result);
            setCommonChannels(commonGroups);
            // console.log(result);
        } catch (error) {
            console.log('error in getUserData', error);
        };

    };
    //fetching messages
    const fetchMessages = async () => {
        const config = {
            headers: {
                Authorization: `Bearer ${userDataJson.token}`,
            },
        };
        try {
            const data = await getData(`message/getMessages/${props.chat._id}`, config);
            setMessages(data);
            // console.log("MESSAGES :", data);
        }
        catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        if (props.chat !== null) {
            getUserData();
            fetchMessages();
        }
    }, [props]);

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
        const receiverId = props.chat.members.find((id) => id !== props.currentUser);
        props.setSendMessage({ ...messages, receiverId });

        //send message to database
        try {
            var body = {
                chatID: props.chat._id,
                senderID: props.currentUser,
                text: newMessage,
            };
            const data = await postData('message/addMessage', body);
            setMessages([...messages, data]);
            setNewMessage("");
        }
        catch (error) {
            console.log(error);
        };
    };
    useEffect(() => {
        // console.log("RECEIVED MESSAGE", props.receiveMessage, props.chat._id);
        if (props.receiveMessage !== null && props.receiveMessage.chatID === props.chat._id) {
            console.log("Data received in child chatbox: ", props.receiveMessage);
            setMessages([...messages, props.receiveMessage]);
        }
    }, []);

    // const [file, setFile] = useState(null);

    const handleFileChange = async (e) => {
        console.log('selected file', e.target.files[0]);
        // setFile(e.target.files[0]);
        try {
            const formData = new FormData();
            // formData.append('image', file);
            formData.append('image', e.target.files[0]);
            formData.append('chatID', props.chat._id);
            formData.append('senderID', props.currentUser);
            console.log('formData', formData);
            const response = await postDataAndImage('message/upload', formData);
            console.log(response);

        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    const messageContainerRef = useRef(null);

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

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await getData('message/showImages');
                setImageUrls(response);
            } catch (error) {
                console.error('Error fetching images:', error);
            }
        };

        fetchImages();
    }, []);

    // if(imageUrls!==undefined){
    //     console.log('asdas', imageUrls);
    // }

    useEffect(() => {
        // Scroll to the bottom of the container when messages change
        messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }, [messages]);

    return (
        <>
            {props.chat ?
                <>
                    {/* <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 10px" }}>
                        <div style={{ display: "flex", alignItems: "center",gap:"6px" }}>
                            {usersData.image === null ?
                                <Avatar sx={{ bgcolor: '#24305E', width: 40, height: 40, color: "#D1D7E0" }}>{usersData.name ? getInitials(usersData.name) : <></>}</Avatar>
                                :
                                <Avatar sx={{ bgcolor: '#D1D7E0', width: 40, height: 40, color: "#24305E",outline:"2px solid #24305E" }} src={usersData.image} />}
                            <div className="channelTitle" style={{ padding: 0, color: "#24305E" }}>{usersData.name}</div >
                        </div>
                        <div>
                            <ProfileRightBar userData={usersData} chatData={props.chat} commonChannels={commonChannels} onShowChannel={props.onShowChannel} />
                        </div>
                    </div> */}
                    <div className="middle-container chatbox">
                        {/* <ProfileRightBar userData={usersData} chatData={props.chat} commonChannels={commonChannels} onShowChannel={props.onShowChannel} /> */}
                        <Tooltip title="Profile">
                            {usersData.image === null ?
                                <Avatar onClick={sendProfileData} sx={{ bgcolor: '#fff', width: 40, height: 40, color: "#00cacb", cursor: "pointer" }} variant="rounded">{usersData.name ? getInitials(usersData.name) : <></>}</Avatar>
                                :
                                <Avatar onClick={sendProfileData} sx={{ bgcolor: '#D1D7E0', width: 40, height: 40, color: "#24305E", cursor: "pointer" }} src={usersData.image} variant="rounded" />
                            }
                        </Tooltip>

                        <p>{usersData.name}</p>
                    </div>
                    <div className="messageContainer" ref={messageContainerRef}>
                        {messages.map((msg) => {
                            return msg.senderID !== userDataJson._id ?
                                <MessageOthers key={msg._id} message={msg} name={usersData.name} />
                                :
                                <MessageSelf key={msg._id} message={msg} name={userDataJson.name} />;
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
export default ChatBox;