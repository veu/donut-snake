class SnakeTailView {
    constructor(part) {
        this.x = part.x;
        this.y = part.y;
        this.z = 5;
        this.turn = part.turn;
        this.from = new Direction(
            part.prev.x - part.x,
            part.prev.y - part.y
        );
        this.angle = this.from.toAngle();

        game.screen.add(this);
    }

    getDifference(a, b) {
        const diff = (b % 4 + 4) % 4 - (a % 4 + 4) % 4;
        const distance = Math.abs(diff);
        return distance > 2 ? (2 - distance) * Math.sign(diff) : diff;
    }

    move(part) {
        this.turn = part.turn;
        this.from = new Direction(
            part.prev.x - part.x,
            part.prev.y - part.y
        );

        this.wrapX = this.x == 4 && part.x == 0 || this.x == 0 && part.x == 4;
        this.wrapY = this.y == 4 && part.y == 0 || this.y == 0 && part.y == 4;

        if (this.turn) {
            this.x = part.x;
            this.y = part.y;
            game.screen.addTween(this, 'angle', {
                duration: 10,
                ease: 'inout',
                to: this.angle + this.getDifference(this.angle, this.from.toAngle()),
            });
        } else {
            game.screen.addTween(this, 'x', {
                duration: 10,
                ease: 'inout',
                from: part.x - this.from.x,
                to: part.x,
            });
            game.screen.addTween(this, 'y', {
                duration: 10,
                ease: 'inout',
                from: part.y - this.from.y,
                to: part.y,
            });
        }
    }

    draw(ctx) {
        this.drawAt(ctx, this.x, this.y);

        if (this.wrapY) {
            this.drawAt(ctx, this.x, this.y <= 0 ? this.y + 5 : this.y - 5);
        }

        if (this.wrapX) {
            this.drawAt(ctx, this.x <= 0 ? this.x + 5 : this.x - 5, this.y);
        }
    }

    drawAt(ctx, x, y) {
        ctx.save();

        ctx.translate(
            x * 20 + 10 + this.from.x * 10,
            y * 20 + 10 + this.from.y * 10
        );

        const ref = this.turn ? this.turn > 0 ? this.from.cw() : this.from.ccw() : {x: 0, y: 0};
        ctx.translate(ref.x * 10, ref.y * 10);

        ctx.rotate((this.angle) * Math.PI / 2);
        if (this.turn) ctx.translate(0, this.turn * 10);

        ctx.scale(2, 1);

        ctx.beginPath();
        ctx.arc(0, 0, 7, Math.PI * .5, Math.PI * 1.5, 1);

        const gradient = ctx.createRadialGradient(
            0, 0, 1,
            0, 0, 9
        );
        gradient.addColorStop(0, '#fc8');
        gradient.addColorStop(1, '#eb6');
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.restore();
    }
}
