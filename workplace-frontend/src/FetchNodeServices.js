import axios from "axios";
var ServerURL = "http://localhost:5000/";
//purpose is to read all data
const getData = async (url, config) => {
    try {
        var response = await fetch(`${ServerURL}${url}`, config);
        var result = await response.json({});
        //  console.log(config)
        return result;
    }
    catch (e) {
        console.log("Error:", e);
        return null;
    }
};
//used when queries contain parameters
const postData = async (url, body) => {
    try {
        //console.log(url);
        //console.log(body);
        var response = await fetch(`${ServerURL}${url}`, {
            method: "POST",
            mode: "cors",
            headers: { "Content-Type": "application/json;charset=utf-8" },
            body: JSON.stringify(body),
        });
        var result = await response.json();
        return result;

    }
    catch (e) {
        console.log("Error:", e);
        return null;
    }
};

const postDataAndImage = async (url, formData) => {
    try {
        var response = await axios.post(`${ServerURL}${url}`, formData, { headers: { "content-type": 'multipart/formData' } });
        var result = await response.data.result;
        return result;
    }
    catch (e) {
        console.log("Error:", e);
        return null;
    }
};

const postDataAndImageWithId = async (url, formData) => {
    try {
        var response = await axios.post(`${ServerURL}${url}`, formData, { headers: { "content-type": 'multipart/formData' } });
        var result = await response.data;
        return result;
    }
    catch (e) {
        console.log("Error:", e);
        return null;
    }
};
export { getData, postData, ServerURL, postDataAndImage, postDataAndImageWithId };