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
        c.fillStyle = c.strokeStyle = ['#f00','#0f0','#00f','#ee0'][cell.color];
        if (cell.isDonut) {
            drawDonut(cell.x, cell.y, cell.color);
        } else {
            drawDrink(cell.x, cell.y, cell.color);
        }
    }

    let lastPart;
    for (const part of snake.iterate()) {
        c.fillStyle = '#000';
        c.fillRect(part.x * 20 + 2, part.y * 20 + 2, 16, 16);

        c.save();
        c.translate(part.x * 20, part.y * 20)

        if (part.isHead) {
            c.strokeStyle = '#fff';
            c.strokeRect(5, 8, 4, 3);
            c.strokeRect(11, 8, 4, 3);
        } else {
            c.fillStyle = '#000';

            if (lastPart.x - part.x == 1) c.fillRect(17, 2, 6, 16);
            if (lastPart.x - part.x == -1) c.fillRect(-3, 2, 6, 16);
            if (lastPart.y - part.y == 1) c.fillRect(2, 17, 16, 6);
            if (lastPart.y - part.y == -1) c.fillRect(2, -3, 16, 6);
        }
        lastPart = part;

        c.restore();

        if (!part.isHead && !part.isTail) {
            drawDonut(part.x, part.y, part.color);
        }
    }

    c.font = '12px sans-serif';
    c.fillStyle = moves < 5 ? '#d00' : '#000';
    c.fillText('MOVES ' + moves, 2, 120);
    c.fillStyle = '#000';
    c.fillText('SCORE ' + score + ' / ' + localStorage.hs2, 2, 139);
}

const drawDonut = (x, y, color) => {
    c.save();
    c.translate(x * 20, y * 20);
    c.beginPath();
    c.arc(10,10,7,0,7,0);
    c.arc(10,10,2,7,0,1);

    {
        const gradient = c.createRadialGradient(10, 10, 1, 10, 10, 8);
        gradient.addColorStop(0, ['#f22','#2f2','#22f','#ee2'][color]);
        gradient.addColorStop(.5, ['#faa','#afa','#aaf','#ffa'][color]);
        gradient.addColorStop(1, ['#f22','#2f2','#22f','#ee2'][color]);
        c.fillStyle = gradient;
    }

    c.fill();

    c.strokeStyle = '#000';
    c.lineWidth = .3;
    c.beginPath();
    c.arc(10,10,7,0,7,0);
    c.stroke();
    c.beginPath();
    c.arc(10,10,2,7,0,1);
    c.stroke();

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
    c.strokeStyle = '#000';
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
