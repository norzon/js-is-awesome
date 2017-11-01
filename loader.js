class Loader {
    constructor (settings = {}) {
        this.settings = {};
        this.queue = [];
        this.counter = 0;
        this.finished = false;
        this.syncronous = true;
    }

    // reset (settings = {}) {}

    add (func, params) {
        this.queue.push({func: func, params: params});
    }

    run () {
        let i = this.counter
        let q = this.queue
        if (i >= q.length) {
            return this;
        }
        var parent = this
        new Promise(function(resolve, reject){
            debugger;
            resolve(q[i].func(q[i].params))
        }).then(function(){
            debugger;
            parent.run()
        });
        this.counter++
    }
}

/*
new Promise(function(resolve, reject){
	var result = test();
	if(!result.toLowerCase().includes('error')){
		resolve({result: result, success: true});
	} else {
		reject({result: result, success: false});
	}
}).then(function(input){
	console.log('Resolved promise with return: ', input)
}).catch(function(input){
	console.log('Rejected promise with return: ', input)
})
*/