class Tween {
    constructor(target, property, options) {
        this.target = target;
        this.property = property;

        this.from = options.from !== undefined ? options.from : this.target[this.property];
        this.to = options.to !== undefined ? options.to : 0;
        this.duration = options.duration !== undefined ? options.duration : 30;
        this.remove = options.remove !== undefined ? options.remove : false;

        this.step = 0;

        this.ease = {
            in: t => t * t,
            out: t => (2 - t) * t,
            inout: t => t < .5 ? t * t * 2 : (2 - t) * t * 2 - 1,
            linear: t => t,
        }[options.ease || 'in'];

        this.queued = [];
    }

    update() {
        if (++ this.step < this.duration) {
            const distance = this.to - this.from;
            this.target[this.property] = this.from + distance * this.ease(this.step / this.duration);
        } else {
            this.target[this.property] = this.to;
            this.queued.forEach(callback => callback());
        }
    }

    end() {
        this.target[this.property] = this.to;
    }

    isAlive() {
        return this.step < this.duration;
    }

    then(callback) {
        this.queued.push(callback);
    }
}

