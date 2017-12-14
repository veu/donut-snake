class SnakeBodyView {
    constructor(part, animate=false) {
        this.x = part.x;
        this.y = part.y;
        this.color = part.color;
        this.turn = part.turn;

        this.from = new Direction(
            part.prev.x - part.x,
            part.prev.y - part.y
        );

        this.to = new Direction(
            part.next.x - part.x,
            part.next.y - part.y
        );

        this.visible = animate ? 0 : 1;
        if (animate) {
            game.screen.addTween(this, 'visible', {to: 1, ease: 'inout', duration: 10});
        }

        game.screen.add(this);
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x * 20 + 10, this.y * 20 + 10);

        const isStraight = this.from.isOpposite(this.to);

        if (this.visible < 1) {
            ctx.beginPath();
            if(isStraight) {
                ctx.rotate(this.to.toAngle() * Math.PI / 2);
                ctx.rect(-10, -10, this.visible * 20, 20);
                ctx.rotate(-this.to.toAngle() * Math.PI / 2);
            } else {
                ctx.save();
                ctx.translate(
                    (this.from.x || this.to.x) * 10,
                    (this.from.y || this.to.y) * 10
                );
                ctx.rotate((this.to.toAngle() * 0 - this.turn + this.visible * this.turn) * Math.PI / 2);
                ctx.rect(10 - (this.from.x || this.to.x) * 10, 10 - (this.from.y || this.to.y) * 10, -20, -20);
                ctx.restore();
            }
            ctx.clip();
        }

        for (let i = 2; i--;) {
            const width = 6 + i;
            const backWidth = this.color !== undefined ? width : width - 1;

            let gradient;
            if (isStraight) {
                gradient = ctx.createLinearGradient(
                    this.from.cw().x * 11,
                    this.from.cw().y * 11,
                    this.to.cw().x * 11,
                    this.to.cw().y * 11,
                );
            } else {
                gradient = ctx.createRadialGradient(
                    (this.from.x || this.to.x) * 10,
                    (this.from.y || this.to.y) * 10,
                    0,
                    (this.from.x || this.to.x) * 10,
                    (this.from.y || this.to.y) * 10,
                    20
                );
            }
            gradient.addColorStop(0, i ? '#eb6' : ['#f22','#0c0','#22f','#aa0'][this.color]);
            gradient.addColorStop(.5, i ? '#fc8' : ['#faa','#afa','#aaf','#ff8'][this.color]);
            gradient.addColorStop(1, i ? '#eb6' : ['#f22','#0c0','#22f','#aa0'][this.color]);

            ctx.fillStyle = gradient;

            ctx.beginPath();
            ctx.moveTo(
                this.from.x * 10 + this.from.ccw().x * width,
                this.from.y * 10 + this.from.ccw().y * width
            );
            if (isStraight) {
                ctx.lineTo(
                    this.to.x * 10 + this.to.cw().x * backWidth,
                    this.to.y * 10 + this.to.cw().y * backWidth
                );
            } else {
                ctx.quadraticCurveTo(
                    (this.from.ccw().x || this.to.cw().x) * width,
                    (this.from.ccw().y || this.to.cw().y) * width,
                    this.to.x * 10 + this.to.cw().x * backWidth,
                    this.to.y * 10 + this.to.cw().y * backWidth
                );
            }
            ctx.lineTo(
                this.to.x * 10 + this.to.ccw().x * backWidth,
                this.to.y * 10 + this.to.ccw().y * backWidth
            );
            if (isStraight) {
                ctx.lineTo(
                    this.from.x * 10 + this.from.cw().x * width,
                    this.from.y * 10 + this.from.cw().y * width
                );
            } else {
                ctx.quadraticCurveTo(
                    (this.from.cw().x || this.to.ccw().x) * width,
                    (this.from.cw().y || this.to.ccw().y) * width,
                    this.from.x * 10 + this.from.cw().x * width,
                    this.from.y * 10 + this.from.cw().y * width
                );
            }
            ctx.fill();

            if (this.color === undefined) break;
        }

        ctx.restore();
    }
}
