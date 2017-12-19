class Game {
    constructor() {
        this.state = {};

        this.screen = new Screen(this);
    }

    init() {
        this.grid = new Grid();
        this.snake = new Snake();
        this.stats = new Stats();
    }

    start() {
        this.snake.init();
        this.grid.init();
        this.stats.init();

        for (const part of this.snake.iterate()) {
            this.grid.empty(part);
        }

        this.save();
    }

    save() {
        window.localStorage.setItem('save', JSON.stringify(this.state));
    };

    load() {
        let savedState;
        try {
            savedState = JSON.parse(window.localStorage.getItem('save'));
            for (const key in this.state) delete this.state[key];
            for (const key in savedState) this.state[key] = savedState[key];

            if (this.state.moves > 0) {
                this.grid.load();
                this.snake.load();
                return;
            }
        } catch (e) { console.error(e); }

        for (const key in this.state) delete this.state[key];
        this.state.highScore = savedState && savedState.highScore || 0;

        this.start();
    }

    async move(dir) {
        if (this.locked) return;
        this.locked = true;

        const next = this.snake.getNextPosition(dir);

        if (this.state.moves == 0 || this.grid.isOccupied(next)) {
            this.locked = false;
            return;
        }

        const cell = this.grid.get(next);

        -- this.state.moves;

        this.snake.move(cell);

        await this.wait(10);

        this.grid.empty(cell);

        if (!cell.isDonut) {
            let result;
            let colors = 0;
            let delta = 0;
            while (result = this.snake.drink(cell.color)) {
                this.grid.roll(result.emptyCell);
                if (result.isDrinkColor) {
                    this.state.score += delta += ++ colors;
                    this.state.highScore = Math.max(this.state.score, this.state.highScore);
                    this.state.moves += 2;
                }
                await this.wait(10);
            }
        }

        if (this.state.moves == 0) {
            this.snake.closeEyes();
        }

        this.save();

        this.locked = false;
    }

    wait(ticks) {
        return new Promise((resolve) => {
            setTimeout(resolve, 1000 / 30 * ticks);
        });
    }
}
