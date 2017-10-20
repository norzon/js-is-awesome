class StyleGen {
    constructor (settings) {
        this.styles = {};
        this.computed = {};
        this.output = '';
        this.lastError = {};
        this.errorLog = [];
        this.target = '';
        settings = settings || {};
        try {
            settings.init = typeof settings.init === 'boolean' ? settings.init : true;
            settings.materialistic = typeof settings.materialistic === 'boolean' ? settings.materialistic : true;
        } catch (e) {
            return this.error({ error: 'Invalid input, not an object', caught: e, input: settings });
        }
        this.settings = settings;
        this.init(settings);
    }

    init (settings) {
        if (settings.materialistic) this.materialistic();
    }

    error (obj) {
        console.error(`Error caught: ${obj.error}`);
        console.log(obj);
        obj.timestamp = new Date().toLocaleTimeString();
        this.lastError = obj;
        this.errorLog.push(obj);
        return this;
    }

    random (len = 10) {
        let result = '';
        for (var i = 0; i < len; i++) {
            result += Math.floor(Math.random()*10);
        }
        return result;
    }

    build (type) {
        for (var k in this.styles) {
            this.styles[k].build();
            this.computed = Object.assign(this.computed, this.styles[k].computed);
        }
        return this;
    }

    generate () {
        this.output = '';
        for (var k in this.computed) {
            this.output += k + '{\n';
            for (var p in this.computed[k]) {
                this.output += '\t' + p + ': ' + this.computed[k][p] + ';\n';
            }
            this.output += '}\n\n';
        }
        return this;
    }

    generateMin () {

    } 

    toHtml () {
        var elem;
        if (!this.target) {
            this.target = `generated-stylesheet-${new Date().toISOString()}-${this.random(10)}`;
            elem = document.createElement('style');
            elem.setAttribute('rel', 'stylesheet');
            elem.setAttribute('id', this.target);
            elem.innerHTML = this.output;
            document.head.appendChild(elem);
        } else {
            elem = document.getElementById(this.target);
            elem.innerHTML = this.output;
        }
    }

    materialistic () {
        this.styles.materialistic = {
            computed: {},
            loop: {
                start: 1,
                end: 24,
                step: 1,
            },
            formulas: {
                shadowSize (n) { return 2*n },
                offset (n) { return n > 5 ? { x: 0, y: (n / 2) + 1 } : { x: 0, y: (n / 2) } },
                alpha () { return 0.5-this.ambient_alpha },
                ambient () { return `0 0 ${this.ambient_size} 0 rgba(0, 0, 0, ${this.ambient_alpha})` },
                ambient_alpha: 0.15,
                ambient_size: '8px',
                size_type: 'px',
                transition: '0.15s',
            },
            templates: [
                { id: 'basic', active: true, name: '', pseudo: '', hasTransition: true },
                { id: 'hover', active: true, name: 'h', pseudo: ':hover', hasTransition: false },
                { id: 'focus', active: true, name: 'f', pseudo: ':focus', hasTransition: false },
                { id: 'active', active: true, name: 'a', pseudo: ':active', hasTransition: false },
                { id: 'visited', active: true, name: 'v', pseudo: ':visited', hasTransition: false },
            ],
            build () {
                let s = this.formulas.size_type;
                for (let i = this.loop.start; i <= this.loop.end; i += this.loop.step) {
                    for (let j = 0; j < this.templates.length; j++) {
                        let tmp = this.templates[j],
                            blur = this.formulas.shadowSize(i),
                            pos = this.formulas.offset(blur),
                            amb = this.formulas.ambient();
                        this.computed[`.dp-${i}${tmp.name}${tmp.pseudo}`] = {
                            'box-shadow': `${pos.x}${s} ${pos.y}${s} ${blur}${s} 0 rgba(0, 0, 0, ${this.formulas.alpha()}), ${amb}`,
                        };
                        if (tmp.hasTransition) {
                            this.computed[`.dp-${i}${tmp.name}`].transition = `box-shadow ${this.formulas.transition}`;
                        }
                    }
                }
            }
        };
    }
}
// var styles = new StyleGen();
// styles.build().generate().toHtml();