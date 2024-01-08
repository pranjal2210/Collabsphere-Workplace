import React, { useEffect, useState } from "react";
import '../styles/message.css';
import { getData } from "../FetchNodeServices";
import { Tooltip } from "@mui/material";

function MessageSelf(props) {
    const [imageURL, setImageURL] = useState(null);
    const [isOpenPopup, setIsOpenPopup] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const userDataJson = JSON.parse(localStorage.getItem("userData"));

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
        if (props.message.name) {
            fetchImage(props.message.name);
        }
    }, [props]);

    return (
        <>
            <div className="messageDiv2">
                <div className="msgWrapper msgself">
                    {props.message.text ?
                        <div className="message" style={{ minWidth: "0px" }}>
                            <p className="msgText">
                                {props.message.text}
                            </p>
                            <p className="msgTime">{convertTimeFormat(new Date(props.message.createdAt).toLocaleTimeString())}</p>
                        </div>
                        :
                        imageURL?.split('.')[1] === 'png' || imageURL?.split('.')[1] === 'jpg' || imageURL?.split('.')[1] === 'jpeg' ?
                            <>
                                <div className="imageContainer" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                                    <img src={imageURL} alt="IMAGE" onClick={handleIsOpenPopup} />
                                    {isHovered &&
                                        <Tooltip title="Download">
                                            <i style={{ position: "absolute", zIndex: "10", top: 0, left: 0, fontSize: "16px", backgroundColor: "#fff", padding: "10px",color: "#7b7eae", cursor: "pointer" }} className="fa-solid fa-download" onClick={handleDownload}></i>
                                        </Tooltip>
                                    }
                                </div>
                            </>
                            : <>
                                <div style={{ display: "flex", justifyContent: "center",flexDirection:"column", gap: "10px", padding: "15px", maxWidth: "300px", backgroundColor: "#f2f6fb", borderRadius: "2px", cursor: "pointer" }} onClick={handleDownload}>
                                    <div style={{ display: "flex", gap: "5px" }}>
                                        {getFileIcon(props.message.type)}
                                        <p style={{ color: "#6a7983", fontSize: "16px" }}>{props.message.name ? props.message.name.split('-')[1] : <>document.pdf</>}</p>
                                    </div>
                                    <p className="msgTime">{convertTimeFormat(new Date(props.message.createdAt).toLocaleTimeString())}</p>
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
export default MessageSelf;