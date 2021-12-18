let form = document.querySelector('#form-user-create');
var user = {};
form.querySelector('[type=submit]').addEventListener('mouseover', ()=>{
    form.querySelectorAll('[name]').forEach((e, i)=>{
        if(e.type=="radio"){
            if(e.checked) user[e.name] = e.value;
        } else{
            if(e.value!='') user[e.name] = e.value;
            /*else{
                alert('Preeencha o campo '+e.name);
                e.focus();
                return;
            }*/
        }
    });
    return false;
});

form.addEventListener('submit', event =>{
    event.preventDefault();
    console.log(user);
});

