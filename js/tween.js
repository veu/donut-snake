class Tween {
    constructor(target, property, options) {
        this.target = target;
        this.property = property;

        this.from = options.from || this.target[this.property];
        this.to = options.to || 0;
        this.duration = options.duration || 30;

        this.step = 1;
    }

    tick() {
        const distance = this.to - this.from;

        this.target[this.property] = this.from + (distance / this.duration * this.step);

        this.step ++;
    }

    end() {
        this.target[this.property] = this.to;
    }

    isAlive() {
        return this.step < this.duration;
    }
}
