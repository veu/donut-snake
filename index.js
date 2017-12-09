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
        if (cell.isDonut) c.fillRect(cell.x * 20 + 5, cell.y * 20 + 5, 10, 10);
        else c.strokeRect(cell.x * 20 + 4, cell.y * 20 + 4, 12, 12);
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
        } else if (!part.isTail) {
            c.fillStyle = ['#f00','#0f0','#00f','#ee0'][part.color];
            c.fillRect(5, 5, 10, 10);
        }

        if (lastPart) {
            c.fillStyle = '#000';

            if (lastPart.x - part.x == 1) c.fillRect(17, 2, 6, 16);
            if (lastPart.x - part.x == -1) c.fillRect(-3, 2, 6, 16);
            if (lastPart.y - part.y == 1) c.fillRect(2, 17, 16, 6);
            if (lastPart.y - part.y == -1) c.fillRect(2, -3, 16, 6);
        }
        lastPart = part;

        c.restore();
    }

    c.font = '12px sans-serif';
    c.fillStyle = moves < 5 ? '#d00' : '#000';
    c.fillText('MOVES ' + moves, 2, 120);
    c.fillStyle = '#000';
    c.fillText('SCORE ' + score + ' / ' + localStorage.hs2, 2, 139);
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
