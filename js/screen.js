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

        for (const cell of this.game.grid.iterate()) {
            if (this.game.snake.isOccupied(cell)) continue;
            if (cell.isDonut) {
                this.drawDonut(cell.x, cell.y, cell.color);
            } else {
                this.drawDrink(cell.x, cell.y, cell.color);
            }
        }

        for (const part of this.game.snake.iterate()) {
            this.drawPart(part);
        }

        this.ctx.fillStyle = '#f6b';
        this.ctx.fillRect(-10, 110, 120, 200);
        this.ctx.fillStyle = '#200';
        let offset = 125;

        for (const [key, value] of [['Moves', this.game.state.moves], ['Score', this.game.state.score], ['High Score', this.game.state.highScore]]) {
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

        this.ctx.restore();
    }

    drawPart(part) {
        this.ctx.save();
        this.ctx.translate(part.x * 20, part.y * 20);

        const from = part.prev && new Direction(
            part.prev.x - part.x,
            part.prev.y - part.y
        );

        const to = part.next && new Direction(
            part.next.x - part.x,
            part.next.y - part.y
        );

        if (part.isHead) {
            this.ctx.translate(10, 10);
            this.ctx.rotate(to.toAngle());
            this.ctx.scale(1.5,1);

            this.ctx.beginPath();
            this.ctx.arc(-3, 0, 8, Math.PI * .5 + .5, Math.PI * 1.5 - .5, 1);

            const gradient = this.ctx.createRadialGradient(
                0, 0, 1,
                0, 0, 9
            );
            gradient.addColorStop(0, '#fc8');
            gradient.addColorStop(1, '#eb6');
            this.ctx.fillStyle = gradient;
            this.ctx.fill();

            this.ctx.beginPath();
            this.ctx.ellipse(0, 4, 1.8, .8, -.3, 6, 3.8, 0);
            this.ctx.fillStyle = '#000';
            this.ctx.fill();

            this.ctx.beginPath();
            this.ctx.ellipse(0, -4, 1.8, .8, .3, 6.8, 2.5, 1);
            this.ctx.fillStyle = '#000';
            this.ctx.fill();
        } else if (part.isTail) {
            this.ctx.translate(10, 10);
            this.ctx.rotate(from.toAngle());
            this.ctx.scale(2, 1);

            this.ctx.beginPath();
            this.ctx.arc(-5, 0, 7, Math.PI * .5, Math.PI * 1.5, 1);

            const gradient = this.ctx.createRadialGradient(
                -5, 0, 1,
                -5, 0, 9
            );
            gradient.addColorStop(0, '#fc8');
            gradient.addColorStop(1, '#eb6');
            this.ctx.fillStyle = gradient;
            this.ctx.fill();

            if (part.prev.color !== undefined) {
                this.ctx.scale(.4, 1);
                this.ctx.beginPath();
                this.ctx.arc(-12.5, 0, 6, Math.PI * .5, Math.PI * 1.5, 1);

                const gradient = this.ctx.createRadialGradient(
                    -12.5,
                    0,
                    0,
                    -12.5,
                    0,
                    10
                );
                gradient.addColorStop(0, ['#faa','#afa','#aaf','#ff8'][part.prev.color]);
                gradient.addColorStop(1, ['#f22','#0c0','#22f','#aa0'][part.prev.color]);

                this.ctx.fillStyle = gradient;
                this.ctx.fill();
            }
        } else {
            this.drawCurve(part, from, to);
        }

        this.ctx.restore();
    };

    drawCurve(part, from, to) {
        this.ctx.save();
        this.ctx.translate(10, 10);

        for (let i = 2; i--;) {
            const width = 6 + i;

            const isStraight = from.isOpposite(to);

            let gradient;
            if (isStraight) {
                gradient = this.ctx.createLinearGradient(
                    from.cw().x * 11,
                    from.cw().y * 11,
                    to.cw().x * 11,
                    to.cw().y * 11,
                );
            } else {
                gradient = this.ctx.createRadialGradient(
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

            this.ctx.fillStyle = gradient;

            this.ctx.beginPath();
            this.ctx.moveTo(
                from.x * 10 + from.ccw().x * width,
                from.y * 10 + from.ccw().y * width
            );
            if (isStraight) {
                this.ctx.lineTo(
                    to.x * 10 + to.cw().x * width,
                    to.y * 10 + to.cw().y * width
                );
            } else {
                this.ctx.quadraticCurveTo(
                    (from.ccw().x || to.cw().x) * width,
                    (from.ccw().y || to.cw().y) * width,
                    to.x * 10 + to.cw().x * width,
                    to.y * 10 + to.cw().y * width
                );
            }
            this.ctx.lineTo(
                to.x * 10 + to.ccw().x * width,
                to.y * 10 + to.ccw().y * width
            );
            if (isStraight) {
                this.ctx.lineTo(
                    from.x * 10 + from.cw().x * width,
                    from.y * 10 + from.cw().y * width
                );
            } else {
                this.ctx.quadraticCurveTo(
                    (from.cw().x || to.ccw().x) * width,
                    (from.cw().y || to.ccw().y) * width,
                    from.x * 10 + from.cw().x * width,
                    from.y * 10 + from.cw().y * width
                );
            }
            this.ctx.fill();
        }

        this.ctx.restore();
    };

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
