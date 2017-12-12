class DrinkView {
    constructor(cell) {
        this.cell = cell;

        this.scale = 0;
        game.screen.addTween(this, 'scale', {to: 1, duration: 15});
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.cell.x * 20 + 10, this.cell.y * 20 + 10);
        ctx.scale(this.scale, this.scale);

        {
          const gradient = ctx.createRadialGradient(0, 0, 1, 0, 0, 8);
          gradient.addColorStop(.2, '#aaa');
          gradient.addColorStop(1, '#fff');
          ctx.fillStyle = gradient;

          ctx.beginPath();
          ctx.arc(0, 0, 5.5, 0, 7, 0);
          ctx.fill();
        }

        {
          const gradient = ctx.createRadialGradient(-4, -4, 6, -4, -4, 7);
          gradient.addColorStop(1, ['#e00','#0d0','#00e','#dd0'][this.cell.color]);
          gradient.addColorStop(0, ['#e55','#5e5','#55e','#ee5'][this.cell.color]);
          ctx.fillStyle = gradient;

          ctx.beginPath();
          ctx.arc(0, 0, 4.5, 0, 7, 0);
          ctx.fill();
        }

        ctx.lineWidth = .3;
        ctx.strokeStyle = '#ccc';
        ctx.beginPath();
        ctx.arc(0, 0, 5.5, 0, 7, 0);
        ctx.stroke();

        ctx.restore();
    }
}
