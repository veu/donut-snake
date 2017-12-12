class SnakeView {
    constructor(snake) {
        this.snake = snake;

        game.screen.add(this);
    }

    draw(ctx) {
        for (const part of this.snake.iterate()) {
            this.drawPart(ctx, part);
        }
    }

    drawPart(ctx, part) {
        if (part.isHead) return;

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

        if (part.isTail) {
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
        } else {
            this.drawCurve(ctx, part, from, to);
        }

        ctx.restore();
    }

    drawCurve(ctx, part, from, to) {
        ctx.save();
        ctx.translate(10, 10);

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
        }

        ctx.restore();
    }
}
