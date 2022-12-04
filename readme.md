------------------------- home.pug -------------------------
doctype html
html(lang="en")
head
meta(charset="UTF-8")
meta(http-equiv="X-UA-Compatible", content="IE=edge")
meta(name="viewport", content="width=device-width, initial-scale=1.0")
title Koom
link(rel="stylesheet", href="https://unpkg.com/mvp.css")
body
header
h1 Koom
main
div#welcome
form#chooseRoom
input(placeholder="room name", required, type="text")
button Enter Room
h4 Open Rooms:
ul
form#firstNickname
input(placeholder="Enter your nickname", type="text")
button Save
div#room
h3
ul
form#name
input(placeholder="nickname", required, type="text")
button Save
form#msg
input(placeholder="message", required, type="text")
button Send
script(src="/socket.io/socket.io.js")
script(src="/public/js/app.js")

------------------------------- app.js --------------------------------
const socket = io();
const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");
room.hidden = true;
const chooseRoom = document.getElementById("chooseRoom");
const firstNickname = document.getElementById("firstNickname");

let roomName;

function addMessage(message) {
const ul = room.querySelector("ul");
const li = document.createElement("li");
li.innerText = message;
ul.appendChild(li);
}
function handleMessageSubmit(event) {
event.preventDefault();
const input = room.querySelector("#msg input");
const value = input.value;
socket.emit("new_message", input.value, roomName, () => {
addMessage(`You: ${value}`);
});
input.value = "";
}
function handleNicknameSubmit(event) {
event.preventDefault();
const input = room.querySelector("#name input");
socket.emit("nickname", input.value);
}
function showRoom() {
welcome.hidden = true;
room.hidden = false;
const h3 = room.querySelector("h3");
h3.innerText = `Room ${roomName}`;
const msgForm = room.querySelector("#msg");
const nameForm = room.querySelector("#name");
msgForm.addEventListener("submit", handleMessageSubmit);
nameForm.addEventListener("submit", handleNicknameSubmit);
}
function handleRoomSubmit(event) {
event.preventDefault();
const input = form.querySelector("input");
socket.emit("enter_room", input.value, showRoom);
roomName = input.value;
input.value = "";
}
function handleFirstNickname(event) {
event.preventDefault();
const input = firstNickname.querySelector("input");
socket.emit("enter_first_Nickname", input.value);
input.value = "";
}

form.addEventListener("submit", handleRoomSubmit);
firstNickname.addEventListener("submit", handleFirstNickname);

socket.on("welcome", (user, newCount) => {
const h3 = room.querySelector("h3");
h3.innerText = `Room ${roomName} (${newCount})`;
addMessage(`${user} arrived!`);
});
socket.on("bye", (left, newCount) => {
const h3 = room.querySelector("h3");
h3.innerText = `Room ${roomName} (${newCount})`;
addMessage(`${left} left`);
});

socket.on("new_message", addMessage);
// socket.on("room_change", console.log); // === socket.on("room_change", msg => console.log(msg));
socket.on("room_change", (rooms) => {
const roomList = welcome.querySelector("ul");
roomList.innerHTML = "";
if (rooms.length === 0) {
roomList.innerHTML = "";
return;
}
rooms.forEach((room) => {
const li = document.createElement("li");
li.innerText = room;
roomList.append(li);
});
});

----------------------------- server.js -------------------------------
import http from "http";
import SocketIO from "socket.io";
import express from "express";
const app = express();
app.set("view engine", "pug");
app.set("views", **dirname + "/views");
app.use("/public", express.static(**dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/\*", (_, res) => res.redirect("/"));
const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);

wsServer.on("connection", (socket) => {
socket["nickname"] = "Anon";
socket.onAny((event) => {
console.log(`Socket Event: ${event}`);
});
socket.on("enter_first_Nickname", (nickname) => {
socket["nickname"] = nickname;
});
socket.on("enter_room", (roomName, done) => {
socket.join(roomName);
done();
socket.to(roomName).emit("welcome", socket.nickname);
});
socket.on("disconnecting", () => {
socket.rooms.forEach((room) =>
socket.to(room).emit("bye", socket.nickname)
);
});
socket.on("new_message", (msg, room, done) => {
socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`);
done();
});
socket.on("nickname", (nickname) => (socket["nickname"] = nickname));
});

/_
const wss = new WebSocket.Server({ server });
const sockets = [];
wss.on("connection", (socket) => {
sockets.push(socket);
socket["nickname"] = "Anon";
console.log("Connected to Browser ✅");
socket.on("close", onSocketClose);
socket.on("message", (msg) => {
const message = JSON.parse(msg);
switch (message.type) {
case "new_message":
sockets.forEach((aSocket) =>
aSocket.send(`${socket.nickname}: ${message.payload}`)
);
case "nickname":
socket["nickname"] = message.payload;
}
});
}); _/

const handleListen = () => console.log(`Listening on http://localhost:3000`);
httpServer.listen(3000, handleListen);

npm i -g localtunnel <- 서버를 전 세계와 공유

localtunnel설치 후 lt로 서버 호출

app.js의 makeConnection() 함수의 iceServers

- google에서 제공하는 stunServer
- stunServer = 공용주소를 알아내기 위해 사용(서로다른 네트워크 상에 있을 경우 사용)
