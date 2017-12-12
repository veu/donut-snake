class Grid {
    constructor(game) {
        this.state = game.state;
        this.screen = game.screen;

        this.views = [];
    }

    init() {
        for (const view of this.views) {
            this.screen.remove(view);
        }

        this.state.grid = [];
        this.views = [];

        for(let y = 5; y--;) {
            for(let x = 5; x--;) {
                if (x == 2 && (y == 2 || y == 3)) {
                    this.state.grid[x + y * 5] = null;

                    continue;
                }

                this.roll({x, y});
            }
        }
    }

    load() {
        for(let y = 5; y--;) {
            for(let x = 5; x--;) {
                const cell = this.get({x, y});

                if (cell) {
                    this.addView(cell);
                }
            }
        }
    }

    get({x, y}) {
        const value = this.state.grid[x + y * 5];

        if (value === null) {
            return;
        }

        return {
            x,
            y,
            color: value % 4,
            isDonut: value < 4
        };
    }

    roll({x, y}) {
        this.state.grid[x + y * 5] = this.getRandomColor(x, y);

        const cell = this.get({x, y});
        this.addView(cell);
    }

    empty({x, y}) {
        this.removeView({x, y});
        this.state.grid[x + y * 5] = null;
    }

    *iterate() {
        for(let y = 5; y--;) {
            for(let x = 5; x--;) {
                yield this.get({x, y});
            }
        }
    }

    getRandomColor(x, y) {
        const neighbors = this.getNeighbors(x, y);

        if (neighbors.length == 0) {
            return Math.random() * 8 | 0;
        }

        const filled = neighbors.filter(v => v < 4);

        return (Math.random() * 2 < filled.length / neighbors.length ? 4 : 0) | Math.random() * 4;
    }

    getNeighbors(midX, midY) {
        const neighbors = [];

        for (let x = -1; x < 2; x++) {
            for (let y = -1; y < 2; y++) {
                const index = (x + midX + 5) % 5 + (y + midY + 5) % 5 * 5;
                if ((x || y) && this.state.grid[index] !== undefined) {
                    neighbors.push(this.state.grid[index]);
                }
            }
        }

        return neighbors;
    }

    addView(cell) {
        const view = cell.isDonut ? new DonutView(cell) : new DrinkView(cell);

        this.views[cell.x + cell.y * 5] = view;
        this.screen.add(view);
    }

    removeView(cell) {
        const view = this.views[cell.x + cell.y * 5];

        this.screen.remove(view);
    }
}
