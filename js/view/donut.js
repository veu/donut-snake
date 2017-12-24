class DonutView {
    constructor(cell) {
        this.cell = cell;
        this.z = 4;

        this.scale = 0;
        game.screen.addTween(this, 'scale', {to: 1, ease: 'out', duration: 15});
    }

    createSprite(canvas, ctx) {
        for (let i = 2; i--;) {
            ctx.beginPath();
            ctx.arc(10, 10, 4.25, 0, 7, 0);
            ctx.lineWidth = 4 + i * 1.5;

            const gradient = game.screen.ctx.createRadialGradient(10, 10, 1, 10, 10, 8);
            gradient.addColorStop(0, i ? '#eb6' : ['#f22','#0c0','#22f','#aa0'][this.cell.color]);
            gradient.addColorStop(.5, i ? '#fc8' : ['#faa','#afa','#aaf','#ff8'][this.cell.color]);
            gradient.addColorStop(1, i ? '#eb6' : ['#f22','#0c0','#22f','#aa0'][this.cell.color]);
            ctx.strokeStyle = gradient;

            ctx.stroke()
        }

        this.sprite = canvas;
    }

    draw(ctx) {
        ctx.translate(this.cell.x * 20 + 10, this.cell.y * 20 + 10);
        ctx.scale(this.scale, this.scale);
        ctx.drawImage(this.sprite, -10, -10, 20, 20);
    }
}
