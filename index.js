const grid = new Grid();
const snake = new Snake();
const input = new Input();

let moves = 8;
let score = 0;
const c = a.getContext('2d');

localStorage.hs2 = localStorage.hs2 || 0;

draw = e => {
    a.width = innerWidth;
    a.height = innerHeight;

    const scale = Math.min(innerWidth / 120, innerHeight / 170);
    c.scale(scale, scale);
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

    c.font = '12px sans-serif';
    c.fillStyle = moves < 5 ? '#d00' : '#000';
    c.fillText('MOVES ' + moves, 2, 120);
    c.fillStyle = '#000';
    c.fillText('SCORE ' + score + ' / ' + localStorage.hs2, 2, 139);
}

const drawPart = (part) => {
    c.save();
    c.translate(part.x * 20, part.y * 20);

    const from = part.prev && {
        x: part.prev.x - part.x,
        y: part.prev.y - part.y,
    };

    const to = part.next && {
        x: part.next.x - part.x,
        y: part.next.y - part.y,
    };

    if (part.isHead) {
        c.translate(10, 10);
        c.rotate(toAngle(to));
        c.scale(1.5,1);

        c.beginPath();
        c.arc(-3, 0, 8, Math.PI * .5 + .5, Math.PI * 1.5 - .5, 1);

        const gradient = c.createRadialGradient(
            0, 0, 1,
            0, 0, 9
        );
        gradient.addColorStop(0, '#c73');
        gradient.addColorStop(1, '#a51');
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
        c.rotate(toAngle(from));
        c.scale(2, 1);

        c.beginPath();
        c.arc(-5, 0, 7, Math.PI * .5, Math.PI * 1.5, 1);

        const gradient = c.createRadialGradient(
            -5, 0, 1,
            -5, 0, 9
        );
        gradient.addColorStop(0, '#c73');
        gradient.addColorStop(1, '#a51');
        c.fillStyle = gradient;
        c.fill();
    } else {
        drawCurve(c, part, from, to);
    }

    c.restore();
};

const drawCurve = (c, part, from, to) => {
    for (let i = 2; i--;) {
        const width = 6 + i;

        const isStraight = cw(cw(from)).x == to.x;

        let gradient;
        if (isStraight) {
            gradient = c.createLinearGradient(
                cw(from).x * 11 + 10,
                cw(from).y * 11 + 10,
                cw(to).x * 11 + 10,
                cw(to).y * 11 + 10,
            );
        } else {
            gradient = c.createRadialGradient(
                (from.x || to.x) * 10 + 10,
                (from.y || to.y) * 10 + 10,
                0,
                (from.x || to.x) * 10 + 10,
                (from.y || to.y) * 10 + 10,
                20
            );
        }
        gradient.addColorStop(0, i ? '#a51' : ['#f22','#0c0','#22f','#aa0'][part.color]);
        gradient.addColorStop(.5, i ? '#c73' : ['#faa','#afa','#aaf','#ff8'][part.color]);
        gradient.addColorStop(1, i ? '#a51' : ['#f22','#0c0','#22f','#aa0'][part.color]);

        c.fillStyle = gradient;

        c.beginPath();
        c.moveTo(
            from.x * 10 + ccw(from).x * width + 10,
            from.y * 10 + ccw(from).y * width + 10
        );
        if (isStraight) {
            c.lineTo(
                to.x * 10 + cw(to).x * width + 10,
                to.y * 10 + cw(to).y * width + 10
            );
        } else {
            c.quadraticCurveTo(
                (ccw(from).x || cw(to).x) * width + 10,
                (ccw(from).y || cw(to).y) * width + 10,
                to.x * 10 + cw(to).x * width + 10,
                to.y * 10 + cw(to).y * width + 10
            );
        }
        c.lineTo(
            to.x * 10 + ccw(to).x * width + 10,
            to.y * 10 + ccw(to).y * width + 10
        );
        if (isStraight) {
            c.lineTo(
                from.x * 10 + cw(from).x * width + 10,
                from.y * 10 + cw(from).y * width + 10
            );
        } else {
            c.quadraticCurveTo(
                (cw(from).x || ccw(to).x) * width + 10,
                (cw(from).y || ccw(to).y) * width + 10,
                from.x * 10 + cw(from).x * width + 10,
                from.y * 10 + cw(from).y * width + 10
            );
        }
        c.fill();
    }
};

const cw = dir => ({x: -dir.y, y: dir.x});
const ccw = dir => ({x: dir.y, y: -dir.x});
const toAngle = dir => (dir.x ? dir.x + 1 : dir.y + 2) * Math.PI / 2;

const drawDonut = (x, y, color) => {
    c.save();
    c.translate(x * 20, y * 20);

    for (let i = 2; i--;) {
        c.beginPath();
        c.arc(10, 10, 6 + i, 0, 7, 0);
        c.arc(10, 10, 2 - i * .5, 7, 0, 1);

        {
            const gradient = c.createRadialGradient(10, 10, 1, 10, 10, 8);
            gradient.addColorStop(0, i ? '#a51' : ['#f22','#0c0','#22f','#aa0'][color]);
            gradient.addColorStop(.5, i ? '#c73' : ['#faa','#afa','#aaf','#ff8'][color]);
            gradient.addColorStop(1, i ? '#a51' : ['#f22','#0c0','#22f','#aa0'][color]);
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
      c.arc(10,10,6,0,7,0);
      c.fill();
    }

    {
      const gradient = c.createRadialGradient(6, 6, 6, 6, 6, 7);
      gradient.addColorStop(1, ['#e00','#0d0','#00e','#dd0'][color]);
      gradient.addColorStop(0, ['#e55','#5e5','#55e','#ee5'][color]);
      c.fillStyle = gradient;

      c.beginPath();
      c.arc(10,10,4,0,7,0);
      c.fill();
    }

    c.lineWidth = .3;
    c.strokeStyle = '#ccc';
    c.beginPath();
    c.arc(10,10,6,0,7,0);
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
