class Tutorial {
    constructor() {
        this.step = 0;

        this.directions = [
            new Direction(1, 0),
            new Direction(0, 1),
            new Direction(-1, 0),
            new Direction(-1, 0),
        ];

        this.steps = [
            async () => {
                const cell = game.grid.get({x: 3, y: 2});
                game.snake.move(cell);
                -- game.state.moves;
                await game.screen.wait(10);
                game.grid.empty(cell);
                game.grid.set({x: 3, y: 3}, 5);
            },
            async () => {
                const cell = game.grid.get({x: 3, y: 3});
                game.snake.move(cell);
                -- game.state.moves;
                await game.screen.wait(10);
                game.grid.empty(cell);
                for (const result of game.snake.drink(2)) {
                    await game.screen.wait(10);
                }
                game.grid.set({x: 2, y: 3}, 2);
            },
            async () => {
                const cell = game.grid.get({x: 2, y: 3});
                game.snake.move(cell);
                -- game.state.moves;
                await game.screen.wait(10);
                game.grid.empty(cell);
                game.grid.set({x: 1, y: 3}, 6);
            },
            async () => {
                const cell = game.grid.get({x: 1, y: 3});
                game.snake.move(cell);
                -- game.state.moves;
                await game.screen.wait(10);
                game.grid.empty(cell);
                for (const result of game.snake.drink(2)) {
                    if (result.isDrinkColor) {
                        game.state.moves += 2;
                    }
                    await game.screen.wait(10);
                }
                game.snake.closeEyes();
            }
        ];
    }

    async init() {
        game.screen.reset();

        game.state.snake.positions = [
            {x: 2, y: 2},
            {x: 1, y: 2},
            {x: 0, y: 2}
        ];
        game.state.snake.colors = [];
        game.snake.load();

        game.state.grid = [];
        game.state.grid[13] = 0;
        game.grid.load();

        game.state.moves = 6;
        game.state.score = 0;
        game.stats.load();

        game.menu.load();

        this.view = new TutorialView(this);
        this.view.show();
        await game.screen.wait(60);
    }

    async move(dir) {
        if (this.step == 4) {
            game.load();
            return;
        }

        if (this.directions[this.step].equals(dir)) {
            await this.steps[this.step]();
            this.view.hide();
            await game.screen.wait(30);
            ++ this.step;
            this.view.show();
            await game.screen.wait(60);
        }
    }
}
