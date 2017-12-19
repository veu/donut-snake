class SnakeBodyView {
    constructor(part, animate=false, first=true) {
        this.x = part.x;
        this.y = part.y;
        this.z = 5;
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
        this.hiding = false;
        this.isStraight = this.from.isOpposite(this.to);
        if (animate) {
            game.screen.addTween(this, 'visible', {
                to: 1,
                ease: first ? 'inout' : 'linear',
                duration: 10
            });
        }

        this.createGradients();

        game.screen.add(this);
    }

    hide(first) {
        this.visible = 1;
        this.hiding = true;
        game.screen.addTween(this, 'visible', {
            to: 0,
            ease: first ? 'in' : 'linear',
            duration: 10,
            remove: true
        });

    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x * 20 + 10, this.y * 20 + 10);

        if (this.visible < 1) {
            ctx.beginPath();
            if(this.isStraight) {
                ctx.rotate(this.to.toAngle() * Math.PI / 2);
                ctx.rect(-10 + (this.hiding ? 1 - this.visible : 0) * 20, -10, this.visible * 20, 20);
                ctx.rotate(-this.to.toAngle() * Math.PI / 2);
            } else {
                ctx.save();
                ctx.translate(
                    (this.from.x || this.to.x) * 10,
                    (this.from.y || this.to.y) * 10
                );
                ctx.rotate((this.hiding ? 1 - this.visible : this.visible - 1) * this.turn * Math.PI / 2);
                ctx.rect(10 - (this.from.x || this.to.x) * 10, 10 - (this.from.y || this.to.y) * 10, -20, -20);
                ctx.restore();
            }
            ctx.clip();
        }

        for (let i = 2; i--;) {
            ctx.strokeStyle = this.gradients[i];
            ctx.lineWidth = i * 2 + 12;

            ctx.beginPath();
            ctx.moveTo(this.from.x * 10, this.from.y * 10);
            if (this.isStraight) {
                ctx.lineTo(this.to.x * 10, this.to.y * 10);
            } else {
                ctx.arcTo(0, 0, this.to.x * 10, this.to.y * 10, 10);
            }
            ctx.stroke();

            if (this.color === undefined) break;
        }

        ctx.restore();
    }

    createGradients() {
        this.gradients = [];

        for (let i = 2; i--;) {
            if (this.isStraight) {
                this.gradients[i] = game.screen.ctx.createLinearGradient(
                    this.from.cw().x * 11,
                    this.from.cw().y * 11,
                    this.to.cw().x * 11,
                    this.to.cw().y * 11,
                );
            } else {
                this.gradients[i] = game.screen.ctx.createRadialGradient(
                    (this.from.x || this.to.x) * 10,
                    (this.from.y || this.to.y) * 10,
                    0,
                    (this.from.x || this.to.x) * 10,
                    (this.from.y || this.to.y) * 10,
                    20
                );
            }
            this.gradients[i].addColorStop(0, i ? '#eb6' : ['#f22','#0c0','#22f','#aa0'][this.color]);
            this.gradients[i].addColorStop(.5, i ? '#fc8' : ['#faa','#afa','#aaf','#ff8'][this.color]);
            this.gradients[i].addColorStop(1, i ? '#eb6' : ['#f22','#0c0','#22f','#aa0'][this.color]);

            if (this.color === undefined) break;
        }
    }
}
