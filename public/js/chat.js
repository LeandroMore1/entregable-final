const socket = io()

const chat = document.getElementById('chat')
let chatUser = document.getElementById('chatUser')
let user = chatUser.textContent
chatUser.style.display = 'none'


chat.addEventListener('keyup',evt=>{
        if(evt.key === "Enter"){
            if(chat.value.trim().length>0){
                socket.emit("message", {user: user,message: chat.value})
                chat.value = ""
            }
        }
    })

socket.emit('message', "me conecte al sv!")


socket.on('chatMessages', data=>{
    let log = document.getElementById('chatMessages')
    let messages = ""
    data.forEach(message => {
        if(message){
            messages = messages + `${message.user} dice: ${message.message} </br>`
        }
        
    });
    log.innerHTML =messages
})

