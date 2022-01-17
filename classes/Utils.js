class Utils{

    static dateFormat(date){
        return new Date(date).toLocaleString("pt-BR");
    }

    static removeUnderline(o){
        let object = {};
        if(typeof o =='string'){
            return o.replace('_','');
        }
        else if(typeof o == 'object'){
            for(let [key, val] of Object.entries(o)){
                object[key.replace('_','')] = val;
            }
            return object;
        }
    }
}