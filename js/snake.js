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

        if (this.bodyViews.length > 0) {
            for (const view of this.bodyViews) {
                game.screen.remove(view);
            }
        }

        this.bodyViews = [
            new SnakeHeadView(this.get(0)),
            new SnakeBodyView(this.get(1)),
            new SnakeTailView(this.get(2)),
        ];
    }

    load() {
        this.bodyViews.push(new SnakeHeadView(this.get(0)));
        for (const i in game.state.snake.colors) {
            this.bodyViews.push(new SnakeBodyView(this.get(+i + 1)));
        }

        this.bodyViews.push(new SnakeBodyView(this.get(game.state.snake.positions.length - 2)));
        this.bodyViews.push(new SnakeTailView(this.get(game.state.snake.positions.length - 1)));
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
        this.bodyViews.splice(1, 0, new SnakeBodyView(this.get(1), true));
        this.bodyViews[0].move(this.get(0));
    }

    drink(color) {
        const c = game.state.snake.colors.pop();

        if (c === undefined) {
            return;
        }

        const tailPos = this.get(-2);

        const isDrinkColor = game.state.snake.colors.length > 0 && c === color;
        const emptyCell = game.state.snake.positions.pop();

        const lastBodyPos = this.get(-1);
        const removedPos = this.get(-2);

        const bodyView = this.bodyViews.find(view => removedPos.x == view.x && removedPos.y == view.y);
        this.bodyViews = this.bodyViews.filter(view => view !== bodyView);
        bodyView.hide();

        const lastBodyView = this.bodyViews.find(view => lastBodyPos.x == view.x && lastBodyPos.y == view.y);
        lastBodyView.hide();
        this.bodyViews.splice(-2, 1, new SnakeBodyView(this.get(-2), true));
        this.bodyViews[this.bodyViews.length - 1].move(tailPos);

        return {
            isDrinkColor,
            emptyCell,
        };
    }

    closeEyes() {
        this.bodyViews[0].closeEyes();
    }

    *iterate() {
        for (let i in game.state.snake.positions) {
            yield this.get(i);
        }
    }

    get(i) {
        const {colors, positions} = game.state.snake;
        if (i < 0) {
            i = positions.length + i;
        }

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
