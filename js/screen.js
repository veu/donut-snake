class Screen {
    constructor(game) {
        this.game = game;

        this.canvas = document.querySelector('.screen');
        this.ctx = this.canvas.getContext('2d');
    }

    resize() {
        this.scale = Math.min(innerWidth / 120, innerHeight / 180);

        this.canvas.width = 120 * this.scale;
        this.canvas.height = innerHeight;

        document.documentElement.style.setProperty('--scale', this.scale);

        this.ctx.scale(this.scale, this.scale);
        this.ctx.translate(10,10);

        this.ctx.font = '8px sans-serif';
    }

    draw() {
        this.ctx.save();

        this.ctx.clearRect(0, 0, 120, 120);

        this.drawGrid(this.game.grid, this.game.snake);
        this.game.snake.view.draw(this.ctx);
        this.drawStats(this.game.state.moves, this.game.state.score, this.game.state.highScore);

        this.ctx.restore();
    }

    drawGrid(grid, snake) {
        for (const cell of grid.iterate()) {
            if (snake.isOccupied(cell)) continue;
            if (cell.isDonut) {
                this.drawDonut(cell.x, cell.y, cell.color);
            } else {
                this.drawDrink(cell.x, cell.y, cell.color);
            }
        }
    }

    drawStats(moves, score, highScore) {
        this.ctx.fillStyle = '#f6b';
        this.ctx.fillRect(-10, 110, 120, 200);
        this.ctx.fillStyle = '#200';
        let offset = 125;

        for (const [key, value] of [['Moves', moves], ['Score', score], ['High Score', highScore]]) {
            let leftWidth = this.ctx.measureText(key).width;
            let rightWidth = this.ctx.measureText(value).width;
            for (let i = 0; i < 96 - leftWidth - rightWidth; i += 2) {
                this.ctx.fillRect(3 + leftWidth + i, offset, 1, 1);
            }
            this.ctx.textAlign = 'left';
            this.ctx.fillText(key, 2, offset + 1);
            this.ctx.textAlign = 'right';
            this.ctx.fillText(value, 100, offset + 1);

            offset += 11;
        }
    }

    drawDonut(x, y, color) {
        this.ctx.save();
        this.ctx.translate(x * 20, y * 20);

        for (let i = 2; i--;) {
            this.ctx.beginPath();
            this.ctx.arc(10, 10, 6 + i, 0, 7, 0);
            this.ctx.arc(10, 10, 2 - i * .5, 7, 0, 1);

            {
                const gradient = this.ctx.createRadialGradient(10, 10, 1, 10, 10, 8);
                gradient.addColorStop(0, i ? '#eb6' : ['#f22','#0c0','#22f','#aa0'][color]);
                gradient.addColorStop(.5, i ? '#fc8' : ['#faa','#afa','#aaf','#ff8'][color]);
                gradient.addColorStop(1, i ? '#eb6' : ['#f22','#0c0','#22f','#aa0'][color]);
                this.ctx.fillStyle = gradient;
            }

            this.ctx.fill();
        }

        this.ctx.restore();
    }

    drawDrink(x, y, color) {
        this.ctx.save();
        this.ctx.translate(x * 20, y * 20);

        {
          const gradient = this.ctx.createRadialGradient(10, 10, 1, 10, 10, 8);
          gradient.addColorStop(.2, '#aaa');
          gradient.addColorStop(1, '#fff');
          this.ctx.fillStyle = gradient;

          this.ctx.beginPath();
          this.ctx.arc(10,10,5.5,0,7,0);
          this.ctx.fill();
        }

        {
          const gradient = this.ctx.createRadialGradient(6, 6, 6, 6, 6, 7);
          gradient.addColorStop(1, ['#e00','#0d0','#00e','#dd0'][color]);
          gradient.addColorStop(0, ['#e55','#5e5','#55e','#ee5'][color]);
          this.ctx.fillStyle = gradient;

          this.ctx.beginPath();
          this.ctx.arc(10,10,4.5,0,7,0);
          this.ctx.fill();
        }

        this.ctx.lineWidth = .3;
        this.ctx.strokeStyle = '#ccc';
        this.ctx.beginPath();
        this.ctx.arc(10,10,5.5,0,7,0);
        this.ctx.stroke();

        this.ctx.restore();
    }
}
