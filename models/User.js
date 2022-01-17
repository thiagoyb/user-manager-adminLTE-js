class User{
    constructor(user){
        for(let [key, val] of Object.entries(user)){
            eval(`this._${key} = '${val}';`);
        }
        this._register = new Date().toISOString().substring(0,19).replace('T',' ');
        this._id;

        console.log(this);
    }

    get id(){
        return this._id;
    }

    get register(){
        return this._register;
    }
    get name(){
        return this._name;
    }
    get gender(){
        return this._gender;
    }
    get birth(){
        return this._birth;
    }
    get country(){
        return this._country;
    }
    get email(){
        return this._email;
    }
    get photo(){
        return this._photo
    }
    set photo(val){
        this._photo = val;
    }

    get password(){
        return this._password;
    }
    get admin(){
        return this._admin;
    }

    static getUsersStorage(p=true){
        let users = [];
        if(!p && sessionStorage.getItem('sessionUsers')){
            users = JSON.parse(sessionStorage.getItem('sessionUsers'));
        }
        if(p && localStorage.getItem('localUsers')){
            users = JSON.parse(localStorage.getItem('localUsers'));
        }
        return users;
    }

    getNewId(){
        if(!window.id) window.id = 0;
        window.id = window.id +1;
        return window.id;
    }

    save(p=true){
        let users = User.getUsersStorage(p);

        if(this.id > 0){
            users.map(u=>{
                if(u.id == this.id){
                    Object.assign(u, Utils.removeUnderline(this));
                }
            });

        } else{
            this._id = this.getNewId();
            users.push(Utils.removeUnderline(this));
        }

        if(!p){
            sessionStorage.setItem('sessionUsers', JSON.stringify(users));
        } else{
            localStorage.setItem('localUsers', JSON.stringify(users));
        }
    }

}