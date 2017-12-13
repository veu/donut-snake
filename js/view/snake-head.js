class SnakeHeadView {
    constructor(part) {
        this.x = part.x;
        this.y = part.y;
        this.turn = part.turn;
        this.to = new Direction(
            part.next.x - part.x,
            part.next.y - part.y
        );
        this.angle = this.to.toAngle();

        game.screen.add(this);
    }

    move(part) {
        game.screen.removeTweens(this);

        this.x = part.x;
        this.y = part.y;
        this.turn = part.turn;
        this.to = new Direction(
            part.next.x - part.x,
            part.next.y - part.y
        );

        game.screen.addTween(this, 'angle', {
            duration: 20,
            ease: 'inout',
            to: this.angle + this.getDifference(this.angle, this.to.toAngle()),
        });

        if (!this.turn) {
            game.screen.addTween(this, 'x', {
                duration: 20,
                ease: 'inout',
                from: this.x + this.to.x,
                to: this.x,
            });
            game.screen.addTween(this, 'y', {
                duration: 20,
                ease: 'inout',
                from: this.y + this.to.y,
                to: this.y,
            });
        }
    }

    getDifference(a, b) {
        const diff = b % 4 - a % 4;
        const distance = Math.abs(diff);
        return distance > 2 ? (2 - distance) * Math.sign(diff) : diff;
    }

    draw(ctx) {
        this.drawAt(ctx, this.x, this.y);

        if (this.y + this.to.y < -1 || this.y + this.to.y > 5) {
            this.drawAt(ctx, this.x, this.y - this.to.y * 5);
        }

        if (this.x + this.to.x < -1 || this.x + this.to.x > 5) {
            this.drawAt(ctx, this.x - this.to.x * 5, this.y);
        }
    }

    drawAt(ctx, x, y) {
        ctx.save();

        ctx.translate(x * 20 + 10 + this.to.x * 10, y * 20 + 10 + this.to.y * 10);

        const ref = this.turn ? this.turn > 0 ? this.to.ccw() : this.to.cw() : {x: 0, y: 0};
        ctx.translate(ref.x * 10, ref.y * 10);
        ctx.rotate((this.angle) * Math.PI / 2);
        if (this.turn) ctx.translate(0, -this.turn * 10);

        ctx.translate(10, 0);
        ctx.scale(1.5, 1);

        ctx.beginPath();
        ctx.arc(-3, 0, 8, Math.PI * .5 + .5, Math.PI * 1.5 - .5, 1);

        const gradient = ctx.createRadialGradient(
            0, 0, 1,
            0, 0, 9
        );
        gradient.addColorStop(0, '#fc8');
        gradient.addColorStop(1, '#eb6');
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.beginPath();
        ctx.ellipse(0, 4, 1.8, .8, -.3, 6, 3.8, 0);
        ctx.fillStyle = '#000';
        ctx.fill();

        ctx.beginPath();
        ctx.ellipse(0, -4, 1.8, .8, .3, 6.8, 2.5, 1);
        ctx.fillStyle = '#000';
        ctx.fill();

        ctx.restore();
    }
}
