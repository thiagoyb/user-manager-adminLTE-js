class User{
    constructor(user){
        for(let [key, val] of Object.entries(user)){
            eval(`this.${key} = '${val}';`);
        }
        
        console.log(this);
    }
}