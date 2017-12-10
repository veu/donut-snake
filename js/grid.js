class Grid {
    constructor() {
        this.grid = [];

        for(let i = 25; i--;){
            this.roll({x: i % 5, y: i / 5 | 0});
        }
    }

    get({x, y}) {
        const value = this.grid[x + y * 5];

        return {
            x,
            y,
            color: value % 4,
            isDonut: value < 4
        };
    }

    roll({x, y}) {
        this.grid[x+y*5] = this.getRandomColor(x, y)
    }

    *iterate() {
        for(let y = 5; y--;) {
            for(let x = 5; x--;) {
                const value = this.grid[x + y * 5];

                yield {
                    x,
                    y,
                    color: value % 4,
                    isDonut: value < 4
                }
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
                if ((x || y) && this.grid[index] !== undefined) {
                    neighbors.push(this.grid[index]);
                }
            }
        }

        return neighbors;
    }
}
