class Direction {
    constructor(x, y) {
        this.x = x == Math.sign(x) ? x : -Math.sign(x);
        this.y = y == Math.sign(y) ? y : -Math.sign(y);
    }

    cw(dir) {
        return new Direction(-this.y, this.x);
    };

    ccw(dir) {
        return new Direction(this.y, -this.x);
    };

    toAngle(dir) {
        return (this.x ? this.x + 1 : this.y + 2) * Math.PI / 2;
    }
}
