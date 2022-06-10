import {Socket} from "phoenix"
let socket = new Socket("/socket", {params: {token: window.userToken}})

socket.connect()

const createSocket = (topicId) => {
  let channel = socket.channel(`comments:${topicId}`, {})
  channel.join()
    .receive("ok", resp => {
      renderComments(resp.comments);
    })
    .receive("error", resp => {
       console.log("Unable to join", resp) 
    })

  document.querySelector('button').addEventListener('click', () => {
    const content = document.querySelector('textarea').value;

    channel.push('comment:add', {content: content});
  });
}

function renderComments(comments) {
  if (document.querySelectorAll('.collection-item').length === 0) {
    const commentsUL = document.querySelector(".collection");
    for (let comment of comments) {
      const li = document.createElement("li");
 li.classList.add("collection-item");
 li.innerText = comment.content;
 commentsUL.append(li);
    }
  } else {
    const li = document.createElement("li")
 li.classList.add("collection-item")
 li.innerText = comments[comments.length -1 ].content
 document.querySelector('.collection').append(li)
 document.querySelector('textarea').value = ""
  }
}

window.createSocket = createSocket;