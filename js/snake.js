class Snake {
    constructor() {
        this.bodyViews = [];
    }

    init() {
        game.state.snake = {
            colors: [],
            positions: [
                {x: 2, y: 2},
                {x: 2, y: 3},
                {x: 2, y: 4},
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
        this.bodyViews = [new SnakeBodyView(this.get(1))];
        this.tailView = new SnakeTailView(this.get(2));
    }

    load() {
        this.headView = new SnakeHeadView(this.get(0));
        this.tailView = new SnakeTailView(this.get(game.state.snake.positions.length - 1));

        for (const i in game.state.snake.colors) {
            this.bodyViews.push(new SnakeBodyView(this.get(+i + 1)));
        }

        this.bodyViews.push(new SnakeBodyView(this.get(game.state.snake.positions.length - 2)));
    }

    getNextPosition(dir) {
        return {
            x: (game.state.snake.positions[0].x + dir.x + 5) % 5,
            y: (game.state.snake.positions[0].y + dir.y + 5) % 5,
        };
    }

    move(to) {
        game.state.snake.positions.unshift({
            x: to.x,
            y: to.y,
        });

        game.state.snake.colors.unshift(to.color);
        this.bodyViews.push(new SnakeBodyView(this.get(1), true));

        this.headView.move(this.get(0));
        this.tailView.move(this.get(game.state.snake.positions.length - 1));
    }

    drink(to) {
        const result = this.digest(to.color);
        this.tailView.move(this.get(game.state.snake.positions.length - 1));
        return result;
    }

    digest(color) {
        const colorCount = game.state.snake.colors.filter(c => c === color).length - 1;
        const emptyCells = game.state.snake.positions.slice(3);

        game.state.snake.colors = [];
        game.state.snake.positions = game.state.snake.positions.slice(0, 3);

        for (const view of this.bodyViews) {
            game.screen.remove(view);
        }

        this.bodyViews = [new SnakeBodyView(this.get(1))]

        return {
            colorCount,
            emptyCells,
            digested: true,
        };
    }

    *iterate() {
        for (let i in game.state.snake.positions) {
            yield this.get(i);
        }
    }

    get(i) {
        const {colors, positions} = game.state.snake;
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
        const positions = game.state.snake.positions;
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
