import http from "http";
import SocketIO from "socket.io";
import express from "express";

const app = express();
app.set("view engine", "pug");
app.set("views", __dirname+"/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.render("home"));
const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);
httpServer.listen(3000, () => console.log(`Listen on http://localhost:3000`));

wsServer.on("connection", socket => {
    socket.on("enter_room", (msg, done) => {
        console.log(msg);
        setTimeout(() => {
            done();
        }, 3000);
    });
});

/*
const wss = new WebSocket.Server({server});
const sockets = [];
wss.on("connection", (socket) => {
    sockets.push(socket);
    socket["nickname"] = "Anon";
    console.log("Connected to Browser");
    socket.on("close", () => console.log("Disconnected from Browser"));
    socket.on("message", (msg) => {
        const message = JSON.parse(msg);
        switch(message.type){
            case "new_message":
                sockets.forEach((aSocket) => {
                    console.log(message);
                    aSocket.send(`${socket.nickname} : ${message.payload}`);
                });
            case "nickname":
                socket["nickname"] = message.payload;
        }
        
    });
});
*/