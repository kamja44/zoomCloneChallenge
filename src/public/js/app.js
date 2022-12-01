const socket = io();

const welcome = document.querySelector("#welcome");
const form = welcome.querySelector("form");
const room = document.querySelector("#room");
room.hidden = true;

let roomName;
function addMessage(message){
    const ul = room.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = message;
    ul.appendChild(li);
}
function showRoom(){
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName}`;
    const form = room.querySelector("form");
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const input = room.querySelector("input");
        const value = input.value;
        socket.emit("new_message", input.value,roomName, () => {
            addMessage(`You: ${value}`);
        });
        input.value="";
    });
}
form.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = form.querySelector("input");
    // socket.emit("enter_room") <- 이라는 이벤트 생성
    socket.emit("enter_room", input.value, showRoom);
    roomName = input.value;
    input.value = ""
});


socket.on("welcome", () => {
    addMessage("Someone Joined!");
});
socket.on("bye", () => {
    addMessage("someone Left");
});
socket.on("new_message", addMessage);