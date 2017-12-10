const grid = new Grid();
const snake = new Snake();
const input = new Input();

let moves = 8;
let score = 0;
const c = a.getContext('2d');

localStorage.hs2 = localStorage.hs2 || 0;

draw = e => {
    a.height = innerHeight;

    const scale = Math.min(innerWidth / 120, innerHeight / 180);
    a.width = 120 * scale;
    c.scale(scale, scale);
    document.documentElement.style.setProperty('--scale', scale);
    c.translate(10,10);

    for (const cell of grid.iterate()) {
        if (snake.isOccupied(cell)) continue;
        if (cell.isDonut) {
            drawDonut(cell.x, cell.y, cell.color);
        } else {
            drawDrink(cell.x, cell.y, cell.color);
        }
    }

    for (const part of snake.iterate()) {
        drawPart(part);
    }

    c.fillStyle = '#f6b';
    c.fillRect(-10, 110, 120, 200);

    c.font = '8px sans-serif';
    c.fillStyle = '#200';
    let offset = 125;

    for (const [key, value] of [['Moves', moves], ['Score', score], ['High Score', localStorage.hs2]]) {
        let leftWidth = c.measureText(key).width;
        let rightWidth = c.measureText(value).width;
        for (let i = 0; i < 96 - leftWidth - rightWidth; i += 2) {
            c.fillRect(3 + leftWidth + i, offset, 1, 1);
        }
        c.textAlign = 'left';
        c.fillText(key, 2, offset + 1);
        c.textAlign = 'right';
        c.fillText(value, 100, offset + 1);

        offset += 11;
    }
}

const drawPart = (part) => {
    c.save();
    c.translate(part.x * 20, part.y * 20);

    const from = part.prev && new Direction(
        part.prev.x - part.x,
        part.prev.y - part.y
    );

    const to = part.next && new Direction(
        part.next.x - part.x,
        part.next.y - part.y
    );

    if (part.isHead) {
        c.translate(10, 10);
        c.rotate(to.toAngle());
        c.scale(1.5,1);

        c.beginPath();
        c.arc(-3, 0, 8, Math.PI * .5 + .5, Math.PI * 1.5 - .5, 1);

        const gradient = c.createRadialGradient(
            0, 0, 1,
            0, 0, 9
        );
        gradient.addColorStop(0, '#fc8');
        gradient.addColorStop(1, '#eb6');
        c.fillStyle = gradient;
        c.fill();

        c.beginPath();
        c.ellipse(0, 4, 1.8, .8, -.3, 6, 3.8, 0);
        c.fillStyle = '#000';
        c.fill();

        c.beginPath();
        c.ellipse(0, -4, 1.8, .8, .3, 6.8, 2.5, 1);
        c.fillStyle = '#000';
        c.fill();
    } else if (part.isTail) {
        c.translate(10, 10);
        c.rotate(from.toAngle());
        c.scale(2, 1);

        c.beginPath();
        c.arc(-5, 0, 7, Math.PI * .5, Math.PI * 1.5, 1);

        const gradient = c.createRadialGradient(
            -5, 0, 1,
            -5, 0, 9
        );
        gradient.addColorStop(0, '#fc8');
        gradient.addColorStop(1, '#eb6');
        c.fillStyle = gradient;
        c.fill();

        if (part.prev.color !== undefined) {
            c.scale(.4, 1);
            c.beginPath();
            c.arc(-12.5, 0, 6, Math.PI * .5, Math.PI * 1.5, 1);

            const gradient = c.createRadialGradient(
                -12.5,
                0,
                0,
                -12.5,
                0,
                10
            );
            gradient.addColorStop(0, ['#faa','#afa','#aaf','#ff8'][part.prev.color]);
            gradient.addColorStop(1, ['#f22','#0c0','#22f','#aa0'][part.prev.color]);

            c.fillStyle = gradient;
            c.fill();
        }
    } else {
        drawCurve(c, part, from, to);
    }

    c.restore();
};

const drawCurve = (c, part, from, to) => {
    c.save();
    c.translate(10, 10);

    for (let i = 2; i--;) {
        const width = 6 + i;

        const isStraight = from.isOpposite(to);

        let gradient;
        if (isStraight) {
            gradient = c.createLinearGradient(
                from.cw().x * 11,
                from.cw().y * 11,
                to.cw().x * 11,
                to.cw().y * 11,
            );
        } else {
            gradient = c.createRadialGradient(
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

        c.fillStyle = gradient;

        c.beginPath();
        c.moveTo(
            from.x * 10 + from.ccw().x * width,
            from.y * 10 + from.ccw().y * width
        );
        if (isStraight) {
            c.lineTo(
                to.x * 10 + to.cw().x * width,
                to.y * 10 + to.cw().y * width
            );
        } else {
            c.quadraticCurveTo(
                (from.ccw().x || to.cw().x) * width,
                (from.ccw().y || to.cw().y) * width,
                to.x * 10 + to.cw().x * width,
                to.y * 10 + to.cw().y * width
            );
        }
        c.lineTo(
            to.x * 10 + to.ccw().x * width,
            to.y * 10 + to.ccw().y * width
        );
        if (isStraight) {
            c.lineTo(
                from.x * 10 + from.cw().x * width,
                from.y * 10 + from.cw().y * width
            );
        } else {
            c.quadraticCurveTo(
                (from.cw().x || to.ccw().x) * width,
                (from.cw().y || to.ccw().y) * width,
                from.x * 10 + from.cw().x * width,
                from.y * 10 + from.cw().y * width
            );
        }
        c.fill();
    }

    c.restore();
};

const drawDonut = (x, y, color) => {
    c.save();
    c.translate(x * 20, y * 20);

    for (let i = 2; i--;) {
        c.beginPath();
        c.arc(10, 10, 6 + i, 0, 7, 0);
        c.arc(10, 10, 2 - i * .5, 7, 0, 1);

        {
            const gradient = c.createRadialGradient(10, 10, 1, 10, 10, 8);
            gradient.addColorStop(0, i ? '#eb6' : ['#f22','#0c0','#22f','#aa0'][color]);
            gradient.addColorStop(.5, i ? '#fc8' : ['#faa','#afa','#aaf','#ff8'][color]);
            gradient.addColorStop(1, i ? '#eb6' : ['#f22','#0c0','#22f','#aa0'][color]);
            c.fillStyle = gradient;
        }

        c.fill();
    }

    c.restore();
}

const drawDrink = (x, y, color) => {
    c.save();
    c.translate(x * 20, y * 20);

    {
      const gradient = c.createRadialGradient(10, 10, 1, 10, 10, 8);
      gradient.addColorStop(.2, '#aaa');
      gradient.addColorStop(1, '#fff');
      c.fillStyle = gradient;

      c.beginPath();
      c.arc(10,10,5.5,0,7,0);
      c.fill();
    }

    {
      const gradient = c.createRadialGradient(6, 6, 6, 6, 6, 7);
      gradient.addColorStop(1, ['#e00','#0d0','#00e','#dd0'][color]);
      gradient.addColorStop(0, ['#e55','#5e5','#55e','#ee5'][color]);
      c.fillStyle = gradient;

      c.beginPath();
      c.arc(10,10,4.5,0,7,0);
      c.fill();
    }

    c.lineWidth = .3;
    c.strokeStyle = '#ccc';
    c.beginPath();
    c.arc(10,10,5.5,0,7,0);
    c.stroke();

    c.restore();
}

draw();

input.onRedraw(draw);

input.onDirection(dir => {
    if (moves == 0) return;

    const cell = grid.get(snake.getNextPosition(dir));

    if (snake.isOccupied(cell)) {
        return;
    }

    -- moves;

    const result = snake.move(cell);

    if (result.digested) {
        result.emptyCells.forEach(cell => grid.roll(cell));

        const delta = result.colorCount;
        score += delta * (delta + 1) / 2;
        if (score > localStorage.hs2) localStorage.hs2 = score;
        moves += delta * 2;
    }

    draw();
});

input.onRestart(() => console.log('restart'));
