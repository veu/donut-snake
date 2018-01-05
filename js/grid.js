class Grid {
    init() {
        this.views = [];

        game.state.grid = [];
        game.state.sprinkles = null;

        for(let y = 5; y--;) {
            for(let x = 5; x--;) {
                this.roll({x, y});
            }
        }
    }

    load() {
        game.state.sprinkles = game.state.sprinkles || null;

        this.views = [];

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
        const value = game.state.grid[x + y * 5];

        if (value === null || value === undefined) {
            return;
        }

        return {
            x,
            y,
            color: value % 4,
            isDonut: value < 4,
            isSprinkled: game.state.sprinkles === x + y * 5
        };
    }

    set({x, y}, color) {
        game.state.grid[x + y * 5] = color;

        if (color !== undefined) {
            const cell = this.get({x, y});
            this.addView(cell);
        }
    }

    roll({x, y}, sprinkle = false) {
        const color = this.getRandomColor(x, y);
        game.state.grid[x + y * 5] = color;

        if (sprinkle && game.state.sprinkles === null && color < 4 && !game.powerUp.isActive() && Math.random() < .1) {
            game.state.sprinkles = x + y * 5;
        }

        const cell = this.get({x, y});
        this.addView(cell);
    }

    empty({x, y}) {
        const view = this.views[x + y * 5];
        game.screen.remove(view);

        game.state.grid[x + y * 5] = null;

        if (game.state.sprinkles === x + y * 5) {
            game.state.sprinkles = null;
        }
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
                if ((x || y) && game.state.grid[index] !== undefined) {
                    neighbors.push(game.state.grid[index]);
                }
            }
        }

        return neighbors;
    }

    addView(cell, animation='scale') {
        const view = cell.isDonut ? new DonutView(cell, animation) : new DrinkView(cell, animation);

        this.views[cell.x + cell.y * 5] = view;
        game.screen.add(view);
    }

    isOccupied({x, y}) {
        return game.state.grid[x + y * 5] === null;
    }

    togglePowerUp() {
        for (const view of this.views) {
            if (view) {
                view.fadeOut();
            }
        }

        this.views = [];

        for(let y = 5; y--;) {
            for(let x = 5; x--;) {
                const cell = this.get({x, y});

                if (cell) {
                    this.addView(cell, 'fadeIn');
                }
            }
        }
    }
}
