class DonutView {
    constructor(cell) {
        this.cell = cell;

        this.scale = 0;
        game.screen.addTween(this, 'scale', {to: 1, duration: 15});
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.cell.x * 20 + 10, this.cell.y * 20 + 10);
        ctx.scale(this.scale, this.scale);

        for (let i = 2; i--;) {
            ctx.beginPath();
            ctx.arc(0, 0, 6 + i, 0, 7, 0);
            ctx.arc(0, 0, 2 - i * .5, 7, 0, 1);

            {
                const gradient = ctx.createRadialGradient(0, 0, 1, 0, 0, 8);
                gradient.addColorStop(0, i ? '#eb6' : ['#f22','#0c0','#22f','#aa0'][this.cell.color]);
                gradient.addColorStop(.5, i ? '#fc8' : ['#faa','#afa','#aaf','#ff8'][this.cell.color]);
                gradient.addColorStop(1, i ? '#eb6' : ['#f22','#0c0','#22f','#aa0'][this.cell.color]);
                ctx.fillStyle = gradient;
            }

            ctx.fill();
        }

        ctx.restore();
    }
}
