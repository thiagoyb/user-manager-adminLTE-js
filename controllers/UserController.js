class UserControlller{
    constructor(formId, formUpdate, tableId){
        this.maxPhotoSize = 2;//MB
        this.formEl = document.getElementById(formId);
        this.formUpdate = document.getElementById(formUpdate);
        this.tableEl = document.getElementById(tableId);
        this.onSubmit();
        this.onEditEvents();
        this.loadUsers();
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
            this.loadPhoto(this.formUpdate).then(uriImage =>{
                let oldImg = this.formUpdate.querySelector('img.current-photo').src;
                dataUser.photo = !uriImage ? oldImg : uriImage;

                let tr =  this.tableEl.rows[this.formUpdate.dataset.trIndex];
                let oldUser = JSON.parse(tr.dataset.user);
                let curUser = Utils.removeUnderline(dataUser);
                let newUser = new User(Object.assign({}, oldUser, curUser));

                newUser.save();
                this.editLine(tr, newUser);

                this.formUpdate.reset();
                btnSubmit.disabled = false;

                this.updateStats();
                document.querySelector('#box-user-update .btn-cancel').click();
            }, e =>{
                console.error(e);
            });
        });
        
    }

    onSubmit(){
        this.formEl.addEventListener('submit', event =>{
            event.preventDefault();

            let btnSubmit = this.formEl.querySelector('[type=submit]');
            btnSubmit.disabled = true;

            let values = this.getValues(this.formEl);
            this.loadPhoto(this.formEl).then(uriImage =>{
                if(values){
                    values.photo = uriImage;
                    values.save();
                    this.addLine(values);
                }

                this.formEl.reset();
                btnSubmit.disabled = false;
            }, e =>{
                console.error(e);
            });
        });
    }

    loadPhoto(form){        
        return new Promise((resolve, reject)=>{
            let photoFile = [...form.elements].filter(item =>{
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
                let img = form.id==this.formUpdate.id ? null :'dist/img/boxed-bg.jpg';
                resolve(img);
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

    loadUsers(){
        let users = User.getUsersStorage();
        users.forEach(dataUser =>{
            this.addLine(new User(dataUser));
        });
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

        this.editLine(tr, dataUser);        
        this.tableEl.appendChild(tr);

        this.updateStats();        
    }

    editLine(tr, dataUser){
        tr.dataset.user = JSON.stringify(Utils.removeUnderline(dataUser));

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

        tr.querySelector(".btn-delete").addEventListener('click', event =>{
            if(confirm(`Deseja realmente apagar ${dataUser.name}?`)){

                let user = new User(JSON.parse(tr.dataset.user));
                user.remove();
                tr.remove();
                this.updateStats();
            }
        });

        tr.querySelector(".btn-edit").addEventListener('click', event =>{
            document.querySelector('#box-user-create').style.display = 'none';
            document.querySelector('#box-user-update').style.display = 'block';

            let jsonUser = JSON.parse(tr.dataset.user);
            this.formUpdate.dataset.trIndex = tr.sectionRowIndex;

            for(let name in jsonUser){             
                let field = this.formUpdate.querySelector('[name='+name.replace("_","")+']');
                if(field){
                    switch(field.type){
                        case 'file':
                            this.formUpdate.querySelector('img.current-photo').src = jsonUser[name];
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
            if(user.admin=='true'||user.admin===true) countAdmin++;
        });

        document.querySelector('#count-users').innerHTML = countUsers;
        document.querySelector('#count-users-admin').innerHTML = countAdmin;
    }
}
