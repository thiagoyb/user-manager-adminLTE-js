class UserControlller{
    constructor(formId, tableId){
        this.maxPhotoSize = 2;//MB
        this.formEl = document.getElementById(formId);
        this.tableEl = document.getElementById(tableId);
        this.onSubmit();
    }

    onSubmit(){
        this.formEl.addEventListener('submit', event =>{
            event.preventDefault();

            let values = this.getValues();
            this.loadPhoto(uriImage =>{
                values.photo = uriImage;
                this.addLine(values);
            });
        });
    }

    loadPhoto(returnPhoto){        
        let photoFile = [...this.formEl.elements].filter(item =>{
            if(item.type=='file'){
                return item;
            }
        })[0].files[0];

        if(this.validatePhoto(photoFile)){
            let reader = new FileReader();
            reader.onload = ()=>{
                returnPhoto(reader.result);
            };
            reader.readAsDataURL(photoFile);
        }
    }

    validatePhoto(file){
        let mime_types = [ 'image/png','image/jpeg','image/jpg' ];
        if(mime_types.indexOf(file.type) == -1) {
            console.error("Error: O arquivo " + file.name + " não permitido");
            return false;
        }

        if(file.size > this.maxPhotoSize *1024*1024) {
            console.error("Error:" + file.name + " ultrapassou limite de "+this.maxPhotoSize+"MB");
            return false;
        }

        return true;
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
            <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
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
