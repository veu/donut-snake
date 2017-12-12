class SnakeHeadView {
    constructor(part) {
        this.part = part;

        game.screen.add(this);
    }

    update(part) {
        this.part = part;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.part.x * 20 + 10, this.part.y * 20 + 10);

        const from = this.part.prev && new Direction(
            this.part.prev.x - this.part.x,
            this.part.prev.y - this.part.y
        );

        const to = this.part.next && new Direction(
            this.part.next.x - this.part.x,
            this.part.next.y - this.part.y
        );

        ctx.rotate(to.toAngle());
        ctx.scale(1.5,1);

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
