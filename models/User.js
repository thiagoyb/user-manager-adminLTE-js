class User{
    constructor(user){
        for(let [key, val] of Object.entries(user)){
            eval(`this._${key} = '${val}';`);
        }
        this._register = new Date();
        
        console.log(this);
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

}