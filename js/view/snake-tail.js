class SnakeTailView {
    constructor(part) {
        this.x = part.x;
        this.y = part.y;
        this.z = 5;
        this.from = new Direction(
            part.prev.x - part.x,
            part.prev.y - part.y
        );
        this.part = part;

        game.screen.add(this);
    }

    move(part) {
        this.x = part.x;
        this.y = part.y;
        this.from = new Direction(
            part.prev.x - part.x,
            part.prev.y - part.y
        );
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x * 20, this.y * 20);

        ctx.translate(10, 10);
        ctx.rotate(this.from.toAngle() * Math.PI / 2);
        ctx.scale(2, 1);

        ctx.beginPath();
        ctx.arc(-5, 0, 6, Math.PI * .5, Math.PI * 1.5, 1);

        const gradient = ctx.createRadialGradient(
            -5, 0, 1,
            -5, 0, 9
        );
        gradient.addColorStop(0, '#fc8');
        gradient.addColorStop(1, '#eb6');
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.restore();
    }
}
