let form = document.querySelector('#form-user-create');
var user = {};

const addLine = (dataUser) =>{
    let tr = document.createElement("TR");
    tr.innerHTML = `
        <td><img src="dist/img/user1-128x128.jpg" alt="User Image" class="img-circle img-sm"></td>
        <td>${dataUser.name}</td>
        <td>${dataUser.email}</td>
        <td>${dataUser.admin}</td>
        <td>${dataUser.birth}</td>
        <td>
            <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
            <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
        </td>`;
        document.getElementById('tableUsers').appendChild(tr);
}

form.addEventListener('submit', event =>{
    event.preventDefault();
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
    addLine(user);
});

