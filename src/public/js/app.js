const socket = io();

const welcome = document.querySelector("#welcome");
const form = welcome.querySelector("form");

form.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = form.querySelector("input");
    // socket.emit("enter_room") <- 이라는 이벤트 생성
    socket.emit("enter_room", {
        paylaod: input.value
    }, () => {
        console.log("server is done!");
    });
    input.value = ""
})