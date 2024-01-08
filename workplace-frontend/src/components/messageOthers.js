import React, { useEffect, useState } from "react";
import '../styles/message.css';
import { Avatar, Tooltip } from "@mui/material";
import { getData } from "../FetchNodeServices";

function MessageOthers(props) {
    const [usersData, setUsersData] = useState([]);
    const [imageURL, setImageURL] = useState(null);
    const [isOpenPopup, setIsOpenPopup] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const userDataJson = JSON.parse(localStorage.getItem("userData"));

    // console.log('usersData', usersData);

    const getUserData = async () => {
        const config = {
            headers: {
                Authorization: `Bearer ${userDataJson.token}`,
            },
        };
        try {
            // console.log('senderID', props.message.senderID);
            const result = await getData(`channel/displayAUser/${props.message.senderID}`, config);
            // console.log("result", result);
            setUsersData(result);
        } catch (error) {
            console.log('error in getUserData', error);
        };

    };

    const fetchImage = async (imageName) => {
        const config = {
            headers: {
                Authorization: `Bearer ${userDataJson.token}`,
            },
        };
        try {
            const result = await getData(`message/showAnImage/${imageName}`, config);
            setImageURL(result.imageUrl);
        } catch (error) {
            console.log('error in getUserData', error);
        };
    };


    function getInitials(name) {
        if (name !== null && name !== undefined) {
            const nameArray = name.split(' ');
            const initials = nameArray.map(word => word[0].toUpperCase()).join('');
            return initials;
        }
    }

    function getFname(name) {
        if (name !== null && name !== undefined) {
            const fname = usersData.name.split(' ');
            return fname[0];
        }
    }

    function convertTimeFormat(inputTime) {
        // Split the input time string into hours, minutes, and AM/PM parts
        const [timePart, ampm] = inputTime.split(' ');
        const [hours, minutes] = timePart.split(':');

        // Format the time as HH:MM AM/PM
        const formattedTime = `${hours}:${minutes} ${ampm}`;

        return formattedTime;
    }

    function handleIsOpenPopup() {
        setIsOpenPopup(!isOpenPopup);
    }

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const handleDownload = () => {
        const imageUrl = imageURL;
        fetch(imageUrl)
            .then((response) => response.blob())
            .then((blob) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = props.message.name;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            });
    };

    const getFileIcon = (fileType) => {
        switch (fileType) {
            case ".pdf":
                return <i style={{ fontSize: "24px", color: "#7b7eae" }} className="fa-solid fa-file-pdf"></i>;
            case ".doc":
                return <i style={{ fontSize: "24px", color: "#7b7eae" }} className="fa-solid fa-file-word"></i>;
            case ".docx":
                return <i style={{ fontSize: "24px", color: "#7b7eae" }} className="fa-solid fa-file-word"></i>;
            case ".txt":
                return <i style={{ fontSize: "24px", color: "#7b7eae" }} className="fa-solid fa-file-lines"></i>;
            case ".ppt":
                return <i style={{ fontSize: "24px", color: "#7b7eae" }} className="fa-solid fa-file-powerpoint"></i>;
            case ".xls":
                return <i style={{ fontSize: "24px", color: "#7b7eae" }} className="fa-solid fa-file-excel"></i>;
            default:
                return <i style={{ fontSize: "24px", color: "#7b7eae" }} className="fa-solid fa-file"></i>;
        }
    };

    useEffect(() => {
        if (props.message !== null) {
            getUserData();
        }
    }, [props]);

    useEffect(() => {
        if (props.message.name) {
            fetchImage(props.message.name);
        }
    }, [props]);


    return (
        <>
            <div className="messageDiv" >
                {usersData.image === null ?
                    <Avatar sx={{ bgcolor: '#24305E', width: 40, height: 40 }} variant="rounded">{usersData.name ? getInitials(usersData.name) : <></>}</Avatar>
                    :
                    <Avatar sx={{ bgcolor: '#24305E', width: 40, height: 40 }} src={usersData.image} variant="rounded" />}
                <div className="msgWrapper msgother" style={{ width: "100%" }}>
                    {/* <p className="sender">{getFname(usersData.name)}</p> */}
                    {props.message.text ?
                        <div className="message">
                            <p className="msgText">
                                {props.message.text}
                            </p>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <p className="sender">{getFname(usersData.name)}</p>
                                <p className="msgTime">{convertTimeFormat(new Date(props.message.createdAt).toLocaleTimeString())}</p>
                            </div>
                        </div>
                        :
                        imageURL?.split('.')[1] === 'png' || imageURL?.split('.')[1] === 'jpg' || imageURL?.split('.')[1] === 'jpeg' ?
                            <>
                                <div className="imageContainer" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                                    <img src={imageURL} alt="IMAGE" onClick={handleIsOpenPopup} />
                                    {isHovered &&
                                        <Tooltip title="Download">
                                            <i style={{ position: "absolute", zIndex: "10", top: 0, right: 0, fontSize: "16px", backgroundColor: "#fff", padding: "10px", color: "#7b7eae", cursor: "pointer" }} className="fa-solid fa-download" onClick={handleDownload}></i>
                                        </Tooltip>
                                    }
                                </div>
                            </>
                            : <>
                                <div style={{ display: "flex", justifyContent: "center", flexDirection: "column", gap: "10px", padding: "10px", maxWidth: "300px", backgroundColor: "#fff", borderRadius: "2px", cursor: "pointer" }} onClick={handleDownload}>
                                    <div style={{ display: "flex", gap: "5px" }}>
                                        {getFileIcon(props.message.type)}
                                        <p style={{ color: "#24305e", fontSize: "16px" }}>{props.message.name ? props.message.name.split('-')[1] : <>document.pdf</>}</p>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                        <p className="sender">{getFname(usersData.name)}</p>
                                        <p className="msgTime">{convertTimeFormat(new Date(props.message.createdAt).toLocaleTimeString())}</p>
                                    </div>
                                </div>
                            </>
                    }

                </div>
            </div>
            {isOpenPopup ?
                <div style={{ backgroundColor: "rgba(0,0,0,0.7)", position: "fixed", zIndex: "4", top: 0, left: 0, width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={handleIsOpenPopup}>
                    <div style={{ height: "80%" }}>
                        {imageURL !== null ?
                            <img style={{ width: "100%", height: "100%" }} src={imageURL} alt="IMAGE" />
                            : <></>
                        }
                    </div>
                </div>
                : <></>
            }
        </>
    );
}
export default MessageOthers;