class Snake {
    constructor(game) {
        this.state = game.state;

        this.bodyViews = [];
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
            game.screen.remove(this.tailView);
            for (const view of this.bodyViews) {
                game.screen.remove(view);
            }
        }

        this.headView = new SnakeHeadView(this.get(0));
        this.tailView = new SnakeTailView(this.get(1));
    }

    load() {
        this.headView = new SnakeHeadView(this.get(0));
        this.tailView = new SnakeTailView(this.get(this.state.snake.positions.length - 1));

        for (const i in this.state.snake.colors) {
            this.bodyViews.push(new SnakeBodyView(this.get(+i + 1)));
        }
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

        this.state.snake.colors.unshift(to.isDonut ? to.color : undefined);
        this.bodyViews.push(new SnakeBodyView(this.get(1), true));

        this.headView.move(this.get(0));
        this.tailView.move(this.get(this.state.snake.positions.length - 1));
    }

    drink(to) {
        const result = this.digest(to.color);
        this.tailView.move(this.get(this.state.snake.positions.length - 1));
        return result;
    }

    digest(color) {
        const colorCount = this.state.snake.colors.filter(c => c === color).length;
        const emptyCells = this.state.snake.positions.slice(2);

        this.state.snake.colors = [];
        this.state.snake.positions = this.state.snake.positions.slice(0, 2);

        for (const view of this.bodyViews) {
            game.screen.remove(view);
        }
        this.bodyViews = [];

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
            turn: this.getTurn(i)
        };

        return part;
    }

    getTurn(i) {
        const positions = this.state.snake.positions;
        if (i == 0) i++;
        if (!positions[i + 1]) {
            return 0;
        }

        const to = new Direction(
            positions[i].x - positions[i - 1].x,
            positions[i].y - positions[i - 1].y
        );

        const to2 = new Direction(
            positions[i + 1].x - positions[i].x,
            positions[i + 1].y - positions[i].y
        );

        return to.isLeft(to2) ? -1 : to.isRight(to2) ? 1 : 0;
    }
}
