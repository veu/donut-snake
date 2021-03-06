class Direction {
    constructor(x, y) {
        this.x = x == Math.sign(x) ? x : -Math.sign(x);
        this.y = y == Math.sign(y) ? y : -Math.sign(y);
    }

    cw() {
        return new Direction(-this.y, this.x);
    };

    ccw() {
        return new Direction(this.y, -this.x);
    };

    isOpposite(dir) {
        return this.x == -dir.x && this.y == -dir.y;
    }

    isLeft(dir) {
        return -this.y == dir.x && this.x == dir.y;
    }

    isRight(dir) {
        return this.y == dir.x && -this.x == dir.y;
    }

    equals(dir) {
        return this.x == dir.x && this.y == dir.y;
    }

    toAngle() {
        return (this.x ? this.x + 1 : this.y + 2);
    }
}
