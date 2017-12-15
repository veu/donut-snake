class Game {
    constructor() {
        this.state = {};

        this.screen = new Screen(this);
    }

    init() {
        this.grid = new Grid();
        this.snake = new Snake();
    }

    start() {
        this.state.moves = 8;
        this.state.score = 0;

        this.grid.init();
        this.snake.init();

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
            let delta = 0;
            while (result = this.snake.drink(cell.color)) {
                this.grid.roll(result.emptyCell);
                delta += result.colorCount;
                await this.wait(5);
            }

            this.state.score += delta * (delta + 1) / 2;
            this.state.highScore = Math.max(this.state.score, this.state.highScore);
            this.state.moves += delta * 2;
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
