import axios from "axios";

const addCommentForm = document.getElementById("jsAddComment");
const commentList = document.getElementById("jsCommentList");
const commentNumber = document.getElementById("jsCommentNumber");
const deleteCommentBtn = document.getElementsByClassName("deleteComment");

const increaseNumber = num => {
  commentNumber.innerHTML = parseInt(commentNumber.innerHTML, 10) + num;
};

const addComment = (comment, commentId) => {
  const li = document.createElement("li");
  const span1 = document.createElement("span");
  const span2 = document.createElement("span");
  span1.innerHTML = comment;
  span2.innerHTML = '<i class="fas fa-backspace"></i>';
  span2.classList.add("deleteComment");
  span2.id = commentId;
  li.appendChild(span1);
  li.appendChild(span2);
  commentList.prepend(li);
  increaseNumber(1);
  init();
};

const sendComment = async comment => {
  const videoId = window.location.href.split("/videos/")[1];
  const response = await axios({
    url: `/api/${videoId}/comment`,
    method: "POST",
    data: { comment }
  });
  if (response.status === 200) {
    const { commentId } = response.data;
    addComment(comment, commentId);
  }
};

const handleSubmit = event => {
  event.preventDefault();
  const commentInput = addCommentForm.querySelector("input");
  const comment = commentInput.value;
  sendComment(comment);
  commentInput.value = "";
};

const deleteComment = id => {
  document.getElementById(id).parentElement.remove();
  increaseNumber(-1);
};

const handleDelete = async e => {
  const videoId = window.location.href.split("/videos/")[1];
  const targetParent = e.target.parentElement;
  const response = await axios({
    url: `/api/${videoId}/comment/${targetParent.id}/delete`,
    method: "POST"
  });

  if (response.status === 200) {
    deleteComment(targetParent.id);
  }
};

function init() {
  addCommentForm.addEventListener("submit", handleSubmit);
  for (let i = 0; i < deleteCommentBtn.length; i++) {
    deleteCommentBtn[i].addEventListener("click", handleDelete);
  }
}

if (addCommentForm) {
  init();
}
