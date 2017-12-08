const grid = new Grid();

const snake = {
    colors: [],
    positions: [{x: 2, y: 2}, {x: 2, y: 3}]
};

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
    for (const i in snake.positions) {
        const part = snake.positions[i];
        c.fillStyle = '#000';
        c.fillRect(part.x*20+2,part.y*20+2,16,16);

        if (i == 0) {
            c.strokeStyle = '#fff';
            c.strokeRect(part.x*20+5, part.y*20+8, 4, 3);
            c.strokeRect(part.x*20+11, part.y*20+8, 4, 3);
        } else if (i < snake.positions.length - 1) {
            c.fillStyle = ['#f00','#0f0','#00f','#ee0'][snake.colors[i - 1]];
            c.fillRect(part.x*20+5,part.y*20+5,10,10);
        }

        if (lastPart) {
            c.fillStyle = '#000';
            if (lastPart.x - part.x == 1) c.fillRect(part.x*20+17, part.y*20+2, 6, 16);
            if (lastPart.x - part.x == -1) c.fillRect(part.x*20-3, part.y*20+2, 6, 16);
            if (lastPart.y - part.y == 1) c.fillRect(part.x*20+2, part.y*20+17, 16, 6);
            if (lastPart.y - part.y == -1) c.fillRect(part.x*20+2, part.y*20-3, 16, 6);
        }
        lastPart = part;
    }

    c.font = '12px Arial';
    c.fillStyle = moves < 5 ? '#d00' : '#000';
    c.fillText('MOVES ' + moves, 2, 120);
    c.fillStyle = '#000';
    c.fillText('SCORE ' + score + ' / ' + localStorage.hs2, 2, 139);
}

draw();

onresize = () => draw();

onkeydown = e => {
  if (37 <= e.keyCode && e.keyCode <= 40) {
      move(e.keyCode - 37);
  }
}

ontouchstart = e => {
    down = e.changedTouches.item(0)
}

ontouchend = e => {
    e = e.changedTouches.item(0);
    const s = e.pageX - down.pageX;
    const t = e.pageY - down.pageY;
    if (s|t) move(s*s > t*t ? (s>0)*2 : (t>0)*2+1);
}

document.addEventListener('touchmove', e => {
    e.preventDefault();
}, {passive: false});

move = async key => {
    if (moves == 0) return;

    -- moves;

    if (key === 0) dir = {x: -1, y: 0};
    if (key === 1) dir = {x: 0, y: -1};
    if (key === 2) dir = {x: 1, y: 0};
    if (key === 3) dir = {x: 0, y: 1};

    const part = {
        x: (snake.positions[0].x + dir.x + 5) % 5,
        y: (snake.positions[0].y + dir.y + 5) % 5,
    };

    if (isOccupied(part)) {
        return;
    }

    const cell = grid.get(part);

    snake.positions.unshift(part);

    if (cell.isDonut) {
        snake.colors.unshift(cell.color);
        grid.roll(part);
    } else {
        snake.positions.pop();
        const delta = digest(cell.color);
        score += delta * (delta + 1) / 2;
        if (score > localStorage.hs2) localStorage.hs2 = score;
        moves += delta * 2;
    }

    draw();
}

digest = color => {
    if (snake.positions.length < 2) return false;

    const count = removeColor(color);

    removeColor((color + 1) % 4);
    removeColor((color + 2) % 4);
    removeColor((color + 3) % 4);

    return count;
}

isOccupied = pos => {
    for (p of snake.positions) {
        if (p.x == pos.x && p.y == pos.y) {
            return true;
        }
    }
    return false;
}

removeColor = color => {
    const numColors = snake.colors.length;

    snake.colors = snake.colors.filter(c => c != color);

    const numRemoved = numColors - snake.colors.length;

    for (let k = numRemoved; k--;) {
        grid.roll(snake.positions.pop());
    }

    return numRemoved;
}

const sleep = s => {
    return new Promise(resolve => setTimeout(resolve, s));
}
