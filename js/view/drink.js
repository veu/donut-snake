class DrinkView {
    constructor(cell) {
        this.cell = cell;
        this.z = 4;

        this.scale = 0;
        game.screen.addTween(this, 'scale', {to: 1, ease: 'out', duration: 15});

        this.createGradients();
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.cell.x * 20 + 10, this.cell.y * 20 + 10);
        ctx.scale(this.scale, this.scale);

        ctx.beginPath();
        ctx.arc(0, 0, 5.5, 0, 7, 0);
        ctx.fillStyle = this.gradients[0];
        ctx.fill();

        ctx.beginPath();
        ctx.arc(0, 0, 4.5, 0, 7, 0);
        ctx.fillStyle = this.gradients[1];
        ctx.fill();

        ctx.lineWidth = .3;
        ctx.strokeStyle = '#ccc';
        ctx.beginPath();
        ctx.arc(0, 0, 5.5, 0, 7, 0);
        ctx.stroke();

        ctx.restore();
    }

    createGradients() {
        this.gradients = [];
        {
            const gradient = game.screen.ctx.createRadialGradient(0, 0, 1, 0, 0, 8);
            gradient.addColorStop(.2, '#aaa');
            gradient.addColorStop(1, '#fff');
            this.gradients[0] = gradient;
        }

        {
            const gradient = game.screen.ctx.createRadialGradient(-4, -4, 6, -4, -4, 7);
            gradient.addColorStop(1, ['#e00','#0d0','#00e','#dd0'][this.cell.color]);
            gradient.addColorStop(0, ['#e55','#5e5','#55e','#ee5'][this.cell.color]);
            this.gradients[1] = gradient;
        }
    }
}
