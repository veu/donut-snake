class SnakeTailView {
    constructor(part) {
        this.part = part;

        game.screen.add(this);
    }

    move(part) {
        this.part = part;
    }

    draw(ctx) {
        const part = this.part;

        ctx.save();
        ctx.translate(part.x * 20, part.y * 20);

        const from = part.prev && new Direction(
            part.prev.x - part.x,
            part.prev.y - part.y
        );

        const to = part.next && new Direction(
            part.next.x - part.x,
            part.next.y - part.y
        );

        ctx.translate(10, 10);
        ctx.rotate(from.toAngle() * Math.PI / 2);
        ctx.scale(2, 1);

        ctx.beginPath();
        ctx.arc(-5, 0, 7, Math.PI * .5, Math.PI * 1.5, 1);

        const gradient = ctx.createRadialGradient(
            -5, 0, 1,
            -5, 0, 9
        );
        gradient.addColorStop(0, '#fc8');
        gradient.addColorStop(1, '#eb6');
        ctx.fillStyle = gradient;
        ctx.fill();

        if (part.prev.color !== undefined) {
            ctx.scale(.4, 1);
            ctx.beginPath();
            ctx.arc(-12.5, 0, 6, Math.PI * .5, Math.PI * 1.5, 1);

            const gradient = ctx.createRadialGradient(
                -12.5,
                0,
                0,
                -12.5,
                0,
                10
            );
            gradient.addColorStop(0, ['#faa','#afa','#aaf','#ff8'][part.prev.color]);
            gradient.addColorStop(1, ['#f22','#0c0','#22f','#aa0'][part.prev.color]);

            ctx.fillStyle = gradient;
            ctx.fill();
        }

        ctx.restore();
    }
}
