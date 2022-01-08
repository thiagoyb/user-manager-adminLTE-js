class UserControlller{
    constructor(formId, tableId){
        this.formEl = document.getElementById(formId);
        this.tableEl = document.getElementById(tableId);
        this.onSubmit();
    }

    onSubmit(){
        this.formEl.addEventListener('submit', event =>{
            event.preventDefault();
            this.addLine(this.getValues());
        });
    }

    getValues(){
        let user = {};
        Array.from(this.formEl.elements).forEach((e, i)=>{
            if(e.type=="radio"){
                if(e.checked) user[e.name] = e.value;
            } else{
                if(e.value!='') user[e.name] = e.value;            
            }
        });
    
        return new User(user);
    }

    addLine(dataUser){
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
        this.tableEl.appendChild(tr);
    }
}
