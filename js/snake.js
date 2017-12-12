class Snake {
    constructor(game) {
        this.state = game.state;

        this.view = new SnakeView(this);
    }

    init() {
        this.state.snake = {
            colors: [],
            positions: [
                {x: 2, y: 2},
                {x: 2, y: 3},
            ],
        };

        if (this.headView) {
            this.screen.remove(this.headView);
        }
        this.headView = new SnakeHeadView(this.get(0));
    }

    load() {
        this.headView = new SnakeHeadView(this.get(0));
    }

    isOccupied(pos) {
        return this.state.snake.positions.some(p => p.x == pos.x && p.y == pos.y);
    }

    getNextPosition(dir) {
        return {
            x: (this.state.snake.positions[0].x + dir.x + 5) % 5,
            y: (this.state.snake.positions[0].y + dir.y + 5) % 5,
        };
    }

    move(to) {
        this.state.snake.positions.unshift({
            x: to.x,
            y: to.y,
        });

        this.headView.update(this.get(0));

        if (to.isDonut) {
            this.state.snake.colors.unshift(to.color);

            return {digested: false};
        }

        return this.digest(to.color);
    }

    digest(color) {
        const colorCount = this.state.snake.colors.filter(c => c === color).length;
        const emptyCells = this.state.snake.positions.slice(2);

        this.state.snake.colors = [];
        this.state.snake.positions = this.state.snake.positions.slice(0, 2);

        return {
            colorCount,
            emptyCells,
            digested: true,
        };
    }

    *iterate() {
        for (let i in this.state.snake.positions) {
            yield this.get(i);
        }
    }

    get(i) {
        const {colors, positions} = this.state.snake;
        const prev = positions[i - 1];
        const next = positions[+i + 1];
        return {
            x: positions[i].x,
            y: positions[i].y,
            color: colors[i - 1],
            isHead: i == 0,
            isTail: i == positions.length - 1,
            prev: prev && {
                x: prev.x,
                y: prev.y,
                color: colors[i - 2],
            },
            next: next && {
                x: next.x,
                y: next.y,
                color: colors[i],
            },
        };
    }
}
