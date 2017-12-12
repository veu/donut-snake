class SnakeBodyView {
    constructor(part) {
        this.part = part;

        game.screen.add(this);
    }

    draw(ctx) {
        const part = this.part;

        const from = new Direction(
            part.prev.x - part.x,
            part.prev.y - part.y
        );

        const to = new Direction(
            part.next.x - part.x,
            part.next.y - part.y
        );

        ctx.save();
        ctx.translate(part.x * 20 + 10, part.y * 20 + 10);

        for (let i = 2; i--;) {
            const width = 6 + i;

            const isStraight = from.isOpposite(to);

            let gradient;
            if (isStraight) {
                gradient = ctx.createLinearGradient(
                    from.cw().x * 11,
                    from.cw().y * 11,
                    to.cw().x * 11,
                    to.cw().y * 11,
                );
            } else {
                gradient = ctx.createRadialGradient(
                    (from.x || to.x) * 10,
                    (from.y || to.y) * 10,
                    0,
                    (from.x || to.x) * 10,
                    (from.y || to.y) * 10,
                    20
                );
            }
            gradient.addColorStop(0, i ? '#eb6' : ['#f22','#0c0','#22f','#aa0'][part.color]);
            gradient.addColorStop(.5, i ? '#fc8' : ['#faa','#afa','#aaf','#ff8'][part.color]);
            gradient.addColorStop(1, i ? '#eb6' : ['#f22','#0c0','#22f','#aa0'][part.color]);

            ctx.fillStyle = gradient;

            ctx.beginPath();
            ctx.moveTo(
                from.x * 10 + from.ccw().x * width,
                from.y * 10 + from.ccw().y * width
            );
            if (isStraight) {
                ctx.lineTo(
                    to.x * 10 + to.cw().x * width,
                    to.y * 10 + to.cw().y * width
                );
            } else {
                ctx.quadraticCurveTo(
                    (from.ccw().x || to.cw().x) * width,
                    (from.ccw().y || to.cw().y) * width,
                    to.x * 10 + to.cw().x * width,
                    to.y * 10 + to.cw().y * width
                );
            }
            ctx.lineTo(
                to.x * 10 + to.ccw().x * width,
                to.y * 10 + to.ccw().y * width
            );
            if (isStraight) {
                ctx.lineTo(
                    from.x * 10 + from.cw().x * width,
                    from.y * 10 + from.cw().y * width
                );
            } else {
                ctx.quadraticCurveTo(
                    (from.cw().x || to.ccw().x) * width,
                    (from.cw().y || to.ccw().y) * width,
                    from.x * 10 + from.cw().x * width,
                    from.y * 10 + from.cw().y * width
                );
            }
            ctx.fill();

            if (part.color === undefined) break;
        }

        ctx.restore();
    }
}
