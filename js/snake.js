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
            game.screen.remove(this.headView);
        }

        this.updateTurn();
        this.headView = new SnakeHeadView(this.get(0));
    }

    load() {
        this.updateTurn();
        this.headView = new SnakeHeadView(this.get(0));
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

        let result;

        if (to.isDonut) {
            this.state.snake.colors.unshift(to.color);

            result = {digested: false};
        } else {
            result = this.digest(to.color);
        }

        this.updateTurn();
        this.headView.move(this.get(0));

        return result;
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
        const part = {
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

        if (part.isHead) {
            part.turn = this.turn;
        }

        return part;
    }

    updateTurn() {
        const positions = this.state.snake.positions;
        if (positions.length < 3) {
            this.turn = 0;
            return;
        }

        const to = new Direction(
            positions[1].x - positions[0].x,
            positions[1].y - positions[0].y
        );

        const to2 = new Direction(
            positions[2].x - positions[1].x,
            positions[2].y - positions[1].y
        );

        this.turn = to.isLeft(to2) ? -1 : to.isRight(to2) ? 1 : 0;
    }
}
