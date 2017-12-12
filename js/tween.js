class Tween {
    constructor(target, property, options) {
        this.target = target;
        this.property = property;

        this.from = options.from || this.target[this.property];
        this.to = options.to || 0;
        this.duration = options.duration || 30;

        this.step = 1;

        this.ease = {
            in: t => t * t,
            out: t => (2 - t) * t,
            inout: t => t < .5 ? t * t * 2 : (2 - t) * t * 2 - 1,
        }[options.ease || 'in'];
    }

    update() {
        if (++ this.step < this.duration) {
            const distance = this.to - this.from;
            this.target[this.property] = this.from + distance * this.ease(this.step / this.duration);
        } else {
            this.target[this.property] = this.to;
        }


        this.step ++;
    }

    end() {
        this.target[this.property] = this.to;
    }

    isAlive() {
        return this.step < this.duration;
    }
}

