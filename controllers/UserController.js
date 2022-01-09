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

            let btnSubmit = this.formEl.querySelector('[type=submit]');
            btnSubmit.disabled = true;

            let values = this.getValues();
            this.loadPhoto().then(uriImage =>{
                if(values.length>=3){
                    values.photo = uriImage;
                    this.addLine(values);
                }

                this.formEl.reset();
                btnSubmit.disabled = false;
            }, e =>{
                console.error(e);
            });
        });
    }

    loadPhoto(){        
        return new Promise((resolve, reject)=>{
            let photoFile = [...this.formEl.elements].filter(item =>{
                if(item.type=='file'){
                    return item;
                }
            })[0].files[0];
    
            if(photoFile && this.validatePhoto(photoFile)){
                let reader = new FileReader();
                reader.onload = ()=>{
                    resolve(reader.result);
                };
                reader.onerror = (e)=>{
                    reject(e);
                };
                reader.readAsDataURL(photoFile);
            } else{
                resolve('dist/img/boxed-bg.jpg');
            }
        });
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
        let isValid = true;

        Array.from(this.formEl.elements).forEach((e, i)=>{
            if(['name','email','password'].indexOf(e.name)>-1 && !e.value){
                e.parentElement.classList.add('has-error');
                e.focus();
                isValid = false;
            }

            if(e.type=="radio"){
                if(e.checked) user[e.name] = e.value;
            } else if(e.type=="checkbox"){
                user[e.name] = e.checked;
            } else{
                if(e.value!='') user[e.name] = e.value;            
            }
        });
    
        return isValid ? new User(user) : {};
    }

    addLine(dataUser){
        let tr = document.createElement("TR");
        let isAdmin = dataUser.admin===true||dataUser.admin==='true'  ? 'Sim' : 'Não';
        tr.innerHTML = `
            <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
            <td>${dataUser.name}</td>
            <td>${dataUser.email}</td>
            <td>${isAdmin}</td>
            <td>${Utils.dateFormat(dataUser.register)}</td>
            <td>
                <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
                <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
            </td>`;
        this.tableEl.appendChild(tr);
    }
}
