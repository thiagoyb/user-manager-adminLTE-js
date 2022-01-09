class UserControlller{
    constructor(formId, formUpdate, tableId){
        this.maxPhotoSize = 2;//MB
        this.formEl = document.getElementById(formId);
        this.formUpdate = document.getElementById(formUpdate);
        this.tableEl = document.getElementById(tableId);
        this.onSubmit();
        this.onEditEvents();
    }

    onEditEvents(){
        document.querySelector('#box-user-update .btn-cancel').addEventListener('click', event=>{
            document.querySelector('#box-user-create').style.display = 'block';
            document.querySelector('#box-user-update').style.display = 'none';
        });

        this.formUpdate.addEventListener('submit', event=>{
            event.preventDefault();

            let btnSubmit = this.formUpdate.querySelector('[type=submit]');
            btnSubmit.disabled = true;

            let dataUser = this.getValues(this.formUpdate);
            let tr =  this.tableEl.rows[this.formUpdate.dataset.trIndex];

            tr.dataset.user = JSON.stringify(dataUser);
            this.editLine(tr, dataUser);

            this.formUpdate.reset();
            btnSubmit.disabled = false;

            this.updateStats();
            document.querySelector('#box-user-update .btn-cancel').click();
        });
        
    }

    onSubmit(){
        this.formEl.addEventListener('submit', event =>{
            event.preventDefault();

            let btnSubmit = this.formEl.querySelector('[type=submit]');
            btnSubmit.disabled = true;

            let values = this.getValues(this.formEl);
            this.loadPhoto().then(uriImage =>{
                if(values){
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

    getValues(formEl){
        let user = {};
        let isValid = true;

        Array.from(formEl.elements).forEach((e, i)=>{
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
        tr.dataset.user = JSON.stringify(dataUser);

        this.editLine(tr, dataUser);        
        this.tableEl.appendChild(tr);

        this.updateStats();        
    }

    editLine(tr, dataUser){
        let isAdmin = dataUser.admin===true||dataUser.admin==='true'  ? 'Sim' : 'Não';
        tr.innerHTML = `
            <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
            <td>${dataUser.name}</td>
            <td>${dataUser.email}</td>
            <td>${isAdmin}</td>
            <td>${Utils.dateFormat(dataUser.register)}</td>
            <td>
                <button type="button" class="btn btn-primary btn-xs btn-flat btn-edit">Editar</button>
                <button type="button" class="btn btn-danger btn-xs btn-flat btn-delete">Excluir</button>
            </td>`;

        tr.querySelector(".btn-edit").addEventListener('click', event =>{
            document.querySelector('#box-user-create').style.display = 'none';
            document.querySelector('#box-user-update').style.display = 'block';

            let jsonUser = JSON.parse(tr.dataset.user);
            this.formUpdate.dataset.trIndex = tr.sectionRowIndex;

            for(let name in jsonUser){             
                let field = this.formUpdate.querySelector('[name='+name.replace("_","")+']');
                if(field){
                    if(field.type=='file') continue;
                    switch(field.type){
                        case 'file':
                            continue;
                            break;
                        case 'radio':
                            field = this.formUpdate.querySelector('[name='+name.replace("_","")+'][value='+jsonUser[name]+']');
                            if(field) field.checked = true;
                            break;
                        case 'checkbox':
                            field.checked = jsonUser[name]==true||jsonUser[name]=='true';
                            break;
                        default:
                            field.value = jsonUser[name];
                            break;
                    }
                }
            }
        }); 
    }

    updateStats(){
        let countUsers = 0;
        let countAdmin = 0;

        Array.from(this.tableEl.children).forEach(tr =>{
            countUsers++;

            let user = JSON.parse(tr.dataset.user);
            if(user._admin=='true'||user._admin===true) countAdmin++;
        });

        document.querySelector('#count-users').innerHTML = countUsers;
        document.querySelector('#count-users-admin').innerHTML = countAdmin;
    }
}
