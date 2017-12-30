class Snake {
    init(allowWrap) {
        game.state.snake = {
            colors: [],
            positions: [],
        };

        const x2 = allowWrap ? Math.random() * 5 | 0 : 2;
        const y2 = allowWrap ? Math.random() * 5 | 0 : 2;

        const x1 = (x2 + Math.random() * 3 + 4 | 0) % 5;
        const y1 = x1 != x2 ? y2 : (y2 + (Math.random() * 2 | 0) * 2 + 4) % 5;

        let x3, y3;
        do {
            x3 = (x2 + Math.random() * 3 + 4 | 0) % 5;
            y3 = x2 != x3 ? y2 : (y2 + (Math.random() * 2 | 0) * 2 + 4) % 5;
        } while (x1 == x3 && y1 == y3);

        game.state.snake.positions.push({x: x1, y: y1}, {x: x2, y: y2}, {x: x3, y: y3});

        this.bodyViews = [
            new SnakeHeadView(this.get(0)),
            new SnakeBodyView(this.get(1)),
            new SnakeTailView(this.get(2)),
        ];
    }

    load() {
        this.bodyViews = [new SnakeHeadView(this.get(0))];
        for (const i in game.state.snake.colors) {
            this.bodyViews.push(new SnakeBodyView(this.get(+i + 1)));
        }

        this.bodyViews.push(new SnakeBodyView(this.get(game.state.snake.positions.length - 2)));
        this.bodyViews.push(new SnakeTailView(this.get(game.state.snake.positions.length - 1)));
    }

    togglePowerUp() {
        for (const view of this.bodyViews) {
            game.screen.remove(view);
        }
        this.load();
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

    *drink(color) {
        let first = true;
        while (true) {
            const c = game.state.snake.colors.pop();

            if (c === undefined) {
                return;
            }

            const tailPos = this.get(-2);
            const emptyCell = game.state.snake.positions.pop();

            this.bodyViews.splice(-2, 1)[0].hide(first);
            this.bodyViews.splice(-2, 1, new SnakeBodyView(this.get(-2), true, first))[0].hide(first);

            this.bodyViews[this.bodyViews.length - 1].move(tailPos, first);

            yield {
                isDrinkColor: game.state.snake.colors.length > 0 && c === color,
                emptyCell,
            };

            first = false;
        }
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
