// const io=require('socket.io')(8800,{
//     cors:{
//         origin:"http://localhost:3000"
//     }
// })
// let activeUsers=[]
// io.on("connection",(socket)=>{
//     //add new user
//     socket.on('new-user-add',(newUserId)=>{
//         if(!activeUsers.some((user)=>user.userId===newUserId)){
//             activeUsers.push({
//                 userId:newUserId,
//                 socketId:socket.id
//             })
//         }
//         console.log("Connected Users",activeUsers);
//         io.emit('get-users',activeUsers)
//     })


//     //send message
//     socket.on("send-message",(data)=>{
//         const {receiverId}=data;
//         const user=activeUsers.find((user)=>user.userId===receiverId);
//         console.log("Sending From Socket to:", receiverId);
//         console.log("Data : ",data);
//         if(user){
//             io.to(user.socketId).emit("reciever-message",data);
//         }
//     })


//     socket.on("disconnect",()=>{
//         activeUsers=activeUsers.filter((user)=>user.socketId!==socket.id)
//         console.log("User-disconnected",activeUsers);
//         io.emit('get-users',activeUsers);
//     })
// })

const { on } = require("nodemon");
const { Server } = require("socket.io");
const io = new Server({ cors: "http://localhost:3000" });
let onlineUsers = [];
io.on("connection", (socket) => {
    console.log("new connection", socket.id);

    // listen to a connection
    socket.on("addNewUser", (userId) => {
        !onlineUsers.some(user => user.userId === userId) &&
            onlineUsers.push({
                userId,
                socketId: socket.id,
            });

            console.log("onlineusers",onlineUsers)
            io.emit("getOnlineUsers",onlineUsers);
    });

    //add message
    socket.on("sendMessage",(message)=>{
        const user=onlineUsers.find(user=>user.userId === message.recipientId);
        console.log(user,"USERS")
        console.log(message,"MESSAGE");
        if(user){
            io.to(user.socketId).emit("getMessage",message);
        }
    })

    socket.on("disconnect",()=>{
        onlineUsers=onlineUsers.filter(user=>user.socketId!==socket.id)
        io.emit("getOnlineUsers",onlineUsers);
    })
});
io.listen(8800);