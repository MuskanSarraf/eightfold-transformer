function setValue(obj, path, value) {

    const keys = path.split(".");

    let current = obj;

    while(keys.length > 1){

        const key = keys.shift();

        if(!current[key])
            current[key]={};

        current=current[key];

    }

    current[keys[0]]=value;

}

module.exports = setValue;