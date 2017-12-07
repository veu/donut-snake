const getNeighbors = (midX, midY) => {
    const neighbors = [];

    for (let x = -1; x < 2; x++) {
        for (let y = -1; y < 2; y++) {
            if ((x || y) && grid[x + midX + (y + midY) * 6] !== undefined) {
                neighbors.push(grid[x + midX + (y + midY) * 6]);
            }
        }
    }

    return neighbors;
};

const getRandomColor = (x, y) => {
    const neighbors = getNeighbors(x, y);

    if (neighbors.length == 0) {
        return Math.random() * 8 | 0;
    }

    const filled = neighbors.filter(v => v < 4);

    return (Math.random() * 2 < filled.length / neighbors.length ? 4 : 0) | Math.random() * 4;
};

const grid = [];
for(i = 6 * 8; i--;){
  grid[i] = getRandomColor(i % 6, i / 6 | 0);
}

const snake = {
    colors: [],
    positions: [{x: 5, y: 6}, {x: 5, y: 7}]
};

grid[41] = grid[47] = 0;

let moves = 8;
let score = 0;
const c = a.getContext('2d');

localStorage.hs = localStorage.hs || 0;

draw = e => {
    a.width = innerWidth;
    a.height = innerHeight;

    const scale = Math.min(innerWidth / 140, innerHeight / 220);
    c.scale(scale, scale);
    c.translate(10,10);

    for(y=8;y--;)
        for(x=6;x--;) {
            const value = grid[x + y * 6];
            c.fillStyle = c.strokeStyle = ['#f00','#0f0','#00f','#ee0'][value % 4];
            if (value < 4) c.fillRect(x*20+5,y*20+5,10,10);
            else c.strokeRect(x*20+4,y*20+4,12,12);
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
    c.fillText('MOVES ' + moves, 2, 180);
    c.fillStyle = '#000';
    c.fillText('SCORE ' + score + ' / ' + localStorage.hs, 2, 199);
}

draw();

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
        x: snake.positions[0].x + dir.x,
        y: snake.positions[0].y + dir.y,
    };

    if (0 > part.x || part.x > 5 || 0 > part.y || part.y > 7 || isOccupied(part)) {
        return;
    }

    const value = grid[part.x + part.y * 6];

    snake.positions.unshift(part);

    if (value < 4) {
        snake.colors.unshift(value);
        grid[part.x + part.y * 6] = getRandomColor(part.x, part.y);
    } else {
        snake.positions.pop();
        const delta = digest(value % 4);
        score += delta * (delta + 1) / 2;
        if (score > localStorage.hs) localStorage.hs = score;
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
        const pos = snake.positions.pop();
        grid[pos.x + pos.y * 6] = getRandomColor(pos.x, pos.y);
    }

    return numRemoved;
}

const sleep = s => {
    return new Promise(resolve => setTimeout(resolve, s));
}
