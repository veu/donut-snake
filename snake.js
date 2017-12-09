class Snake {
    constructor() {
        this.colors = [];
        this.positions = [
            {x: 2, y: 2},
            {x: 2, y: 3},
        ];
    }

    isOccupied(pos) {
        return this.positions.some(p => p.x == pos.x && p.y == pos.y);
    }

    getNextPosition(dir) {
        return {
            x: (this.positions[0].x + dir.x + 5) % 5,
            y: (this.positions[0].y + dir.y + 5) % 5,
        };
    }

    move(to) {
        snake.positions.unshift({
            x: to.x,
            y: to.y,
        });

        if (to.isDonut) {
            snake.colors.unshift(to.color);

            return {digested: false};
        }

        return this.digest(to.color);
    }

    digest(color) {
        const colorCount = this.colors.filter(c => c === color).length;
        const emptyCells = snake.positions.slice(2);

        snake.colors = [];
        snake.positions = snake.positions.slice(0, 2);

        return {
            colorCount,
            emptyCells,
            digested: true,
        };
    }

    *iterate() {
        for (let i in this.positions) {
            yield {
                x: this.positions[i].x,
                y: this.positions[i].y,
                color: this.colors[i - 1],
                isHead: i == 0,
                isTail: i == this.positions.length - 1,
                prev: this.positions[i - 1],
                next: this.positions[+i + 1],
            };
        }
    }
}
