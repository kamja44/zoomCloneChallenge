const socket = io();

const welcome = document.querySelector("#welcome");
const form = welcome.querySelector("form");
const room = document.querySelector("#room");
room.hidden = true;

let roomName;

function showRoom(){
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName}`;
}

form.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = form.querySelector("input");
    // socket.emit("enter_room") <- 이라는 이벤트 생성
    socket.emit("enter_room", input.value, showRoom);
    roomName = input.value;
    input.value = ""
})