class Errors {
    constructor() {
        this.errors = {};
    }

    has(field) {
        return !!this.errors[field];
    }

    any() {
        return !!Object.entries(this.errors).length
        
    }

    get(field) {
        return this.errors[field];
    }

    record(errors) {
        if (!Object.entries(errors).length) {
            console.log('You didnt send any errors to record!');
            return;
        }
        // Ispod je ukoliko zelimo da samo ubacimo nove errore bez da menjamo ceo errors objekat.
        // let keys = Object.keys(errors);
        // keys.forEach((error) => {
        //     this.errors[error] = errors[error];
        // });
        this.errors = errors;
    }

    clear(field) {
        if (field) {
            this.errors = {};
        }   else {
            delete(this.errors[field]);
        }
    }
}

class Form {
    constructor(data) {
        const keys = Object.keys(data);
        keys.forEach((element) => {
            this[element] = data[element];
        })
        this.errors = new Errors;
        this.originalData = data;
    }

    data() {
        let keys = Object.keys(this);
        let data = {}
        keys = keys.filter((key) => key !== 'errors' && key !== 'originalData')
        keys.forEach((key) => {
            data[key] = this[key];
        });
        
        return data;
    }

    reset() {
        const keys = Object.keys(this.originalData);
        keys.forEach((element) => {
            this[element] = this.originalData[element];
        })
        this.errors = new Errors;
    }

    async submit(requestType, url) {
        try {
            const response = await this.response(this.data())
            this.onSuccess(response);
        } catch (error) {
            let errors = JSON.parse(error.message);
            this.onFail(errors);
            console.log('Ispod se nalaze greske!');
            console.log(errors);
            return;
        }
    }

    response(requestData) {
        
        return new Promise((resolve, reject) => {
            setTimeout(() => {
            if (Math.random() < 0.5) {
                let data = { message: 'Uspesno Poslata Forma!'}
                resolve(data);
            } else {
                let errors = {} 
                Object.keys(requestData).forEach((key) => {
                    errors[key] = `Poruka za ${key}`;
                })
                reject(new Error(JSON.stringify(errors)));
            }
        }, 3000);
    });
    
    }

    onFail(errors) {
        this.errors.record(errors);
    }

    onSuccess(data) {
        alert(data.message);
    }
}

const podaci = {
    name: 'asfasf',
    age: 23,
    city: 'England'
}

const newForm = new Form(podaci);
newForm.submit();