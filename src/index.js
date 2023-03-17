let comments = [];

const commentField = document.querySelector('.comment-field');
const button = document.querySelector(".btn");
const formElem = document.querySelector('.form');
const commentText = document.querySelector('.comment__body');
const commentName = document.querySelector('.comment__name');
const formDate = formElem.querySelector('.form-date');

//set Date


function setDate (elem) {
    let dateForm = document.querySelector('.comment__date');
    let date = new Date();
    let today = `${date.getFullYear()}-0${date.getMonth()+1}-${date.getDate()}`;
    if(dateForm.value) {
        let yesterday = `${date.getFullYear()}-0${date.getMonth()+1}-${date.getDate()-1}`;
        console.log(today === dateForm.value)
        if(dateForm.value === today) {
            elem.date = `today ${date.getHours()}:${date.getMinutes()}`;
            return;
        }
        if(dateForm.value === yesterday) {
            elem.date = `yesterday ${date.getHours()}:${date.getMinutes()}`;
            return;
        }
        elem.date = transformDate(dateForm.value);
        return;
    }
    elem.date = `today ${date.getHours()}:${date.getMinutes()}`;
}


//helper for converting time data
function transformDate(date) {
    let transformStr = date.split('-');
    let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${transformStr[2]} ${months[transformStr[1]-1]} ${transformStr[0]}`
}
// const timeConverter = (myDate) => {
//     let a = new Date(myDate*1000);
//     let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
//     let year = a.getFullYear();
//     let month = months[a.getMonth()];
//     let date = a.getDate();
//     let hour = a.getHours();
//     let min = a.getMinutes();
//     let time = `${date} ${month} ${year} ${hour}:${min}`;
//     return time;
// }

function getClass (item) {
    return item.liked ? 'fa-solid': 'fa-regular';
}
//set comment to list
function setData (data) {
    let commentHTML = '';
    data.map(element => {
        commentHTML += `
            <div class='comment__item' id='${data.indexOf(element)}'>
                <p class='text-time'>${element.date}</p>
                <p class='text-name'>${element.name}</p>
                <p class=text-body>${element.body}</p>
                <div class='action__icons'>
                    <i class='${getClass(element)} fa-heart fa-sz'></i>
                    <img class='delete-icon' src='./assets/delete.svg'>
                </div>
            </div>
        `
        commentField.innerHTML = commentHTML;
    });
    
}
loadData();

//resetForm 
function reset (name, body) {
    name.value = '';
    body.value = '';
} 
//save comment to Local Storage
function saveData (data) {
    localStorage.setItem('comment', JSON.stringify(data));
};

// load data
function loadData () {
    (!localStorage.comment)? comments = [] : comments = JSON.parse(localStorage.getItem('comment'));
    setData(comments);
}
//add event listener to submit form
formElem.addEventListener('submit', (evt) => {
    evt.preventDefault();
    let commentName = formElem.querySelector('.comment__name');
    let commentBody = formElem.querySelector('.comment__body');

    let comment = {
        name: commentName.value,
        body: commentBody.value,
        date: '',
        liked: false,
    }
    
    if(!validate()) {
        if(!document.querySelector('.error')) {
            createTemplateError();
        }
    }

    if(validate()) {
        setDate(comment);
        comments.push(comment);
        saveData(comments);
        setData(comments);
        reset(commentName, commentBody);
        if(document.querySelector('.error')) {
            document.querySelector('.error').remove();
        }
        
    }
    
    
})
//delete comment
commentField.addEventListener('click', (evt) => {
    if(evt.target.matches('.delete-icon')) {
        let id = evt.target.parentNode.parentNode.id;
        comments.splice(id, 1);
        saveData(comments);
        loadData(comments);
        return;
    }
})
//like comment
commentField.addEventListener('click', (evt) => {
    let target = evt.target;
    let id = evt.target.parentNode.parentNode.id;
    if(target.matches('.fa-heart')) {
       if(target.matches('.fa-regular')) {
        target.classList.remove('fa-regular');
        target.classList.add('fa-solid');
        comments[id].liked = true;
       } else {
        target.classList.remove('fa-solid');
        target.classList.add('fa-regular');
        comments[id].liked = false;
       }
    }
    saveData(comments);
})

//sbmit form by press enter
commentText.addEventListener('keydown', (evt) => {
    if(evt.which == 13 && !evt.shiftKey) {
        evt.preventDefault();
        const newEvent = new Event('submit', {cancelable: true});
        evt.target.form.dispatchEvent(newEvent);
    }
})
//validation form
function validate() {
    let passValidation=true;
    if(commentName.value =='' || commentText.value==''){
        return passValidation = false;
    }
    return passValidation;
}

//create Error
function createTemplateError() {
    let errorMessage = document.createElement('div');
    errorMessage.classList.add('error');
    errorMessage.innerHTML = 'Enter your comment and name';
    document.querySelectorAll('.form-group')[1].append(errorMessage);
}
//remove error message
formElem.addEventListener('input', (e) => {
    if(e.target.matches('.comment__name') || e.target.matches('.comment__body')) {
        if(document.querySelector('.error')) {
            document.querySelector('.error').remove();
        }
    }
})
//set max value in calendar
let currentDate = new Date();
let today = `${currentDate.getFullYear()}-0${currentDate.getMonth()+1}-${currentDate.getDate()}`;
document.querySelector('.comment__date').setAttribute('max', `${today}`)