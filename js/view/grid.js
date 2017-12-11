class GridView {
    constructor(screen, grid) {
        this.grid = grid;

        screen.add(this);
    }

    draw(ctx) {
        for (const cell of this.grid.iterate()) {
            if (!cell) continue;

            ctx.save();
            ctx.translate(cell.x * 20, cell.y * 20);

            if (cell.isDonut) {
                this.drawDonut(ctx, cell.color);
            } else {
                this.drawDrink(ctx, cell.color);
            }

            ctx.restore();
        }
    }

    drawDonut(ctx, color) {
        for (let i = 2; i--;) {
            ctx.beginPath();
            ctx.arc(10, 10, 6 + i, 0, 7, 0);
            ctx.arc(10, 10, 2 - i * .5, 7, 0, 1);

            {
                const gradient = ctx.createRadialGradient(10, 10, 1, 10, 10, 8);
                gradient.addColorStop(0, i ? '#eb6' : ['#f22','#0c0','#22f','#aa0'][color]);
                gradient.addColorStop(.5, i ? '#fc8' : ['#faa','#afa','#aaf','#ff8'][color]);
                gradient.addColorStop(1, i ? '#eb6' : ['#f22','#0c0','#22f','#aa0'][color]);
                ctx.fillStyle = gradient;
            }

            ctx.fill();
        }
    }

    drawDrink(ctx, color) {
        {
          const gradient = ctx.createRadialGradient(10, 10, 1, 10, 10, 8);
          gradient.addColorStop(.2, '#aaa');
          gradient.addColorStop(1, '#fff');
          ctx.fillStyle = gradient;

          ctx.beginPath();
          ctx.arc(10,10,5.5,0,7,0);
          ctx.fill();
        }

        {
          const gradient = ctx.createRadialGradient(6, 6, 6, 6, 6, 7);
          gradient.addColorStop(1, ['#e00','#0d0','#00e','#dd0'][color]);
          gradient.addColorStop(0, ['#e55','#5e5','#55e','#ee5'][color]);
          ctx.fillStyle = gradient;

          ctx.beginPath();
          ctx.arc(10,10,4.5,0,7,0);
          ctx.fill();
        }

        ctx.lineWidth = .3;
        ctx.strokeStyle = '#ccc';
        ctx.beginPath();
        ctx.arc(10,10,5.5,0,7,0);
        ctx.stroke();
    }
}
