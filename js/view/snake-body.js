class SnakeBodyView {
    constructor(part) {
        this.x = part.x;
        this.y = part.y;
        this.color = part.color;

        this.from = new Direction(
            part.prev.x - part.x,
            part.prev.y - part.y
        );

        this.to = new Direction(
            part.next.x - part.x,
            part.next.y - part.y
        );

        game.screen.add(this);
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x * 20 + 10, this.y * 20 + 10);

        for (let i = 2; i--;) {
            const width = 6 + i;

            const isStraight = this.from.isOpposite(this.to);

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
                    this.to.x * 10 + this.to.cw().x * width,
                    this.to.y * 10 + this.to.cw().y * width
                );
            } else {
                ctx.quadraticCurveTo(
                    (this.from.ccw().x || this.to.cw().x) * width,
                    (this.from.ccw().y || this.to.cw().y) * width,
                    this.to.x * 10 + this.to.cw().x * width,
                    this.to.y * 10 + this.to.cw().y * width
                );
            }
            ctx.lineTo(
                this.to.x * 10 + this.to.ccw().x * width,
                this.to.y * 10 + this.to.ccw().y * width
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
