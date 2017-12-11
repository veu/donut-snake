class Game {
    constructor() {
        this.state = {};

        this.screen = new Screen(this);

        this.grid = new Grid(this);
        this.snake = new Snake(this);
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
                return;
            }
        } catch (e) { console.error(e); }

        for (const key in this.state) delete this.state[key];
        this.state.highScore = savedState && savedState.highScore || 0;

        this.start();
    }

    move(dir) {
        if (this.state.moves == 0) return;

        const cell = this.grid.get(this.snake.getNextPosition(dir));

        if (this.snake.isOccupied(cell)) {
            return;
        }

        -- this.state.moves;

        this.grid.empty(cell);

        const result = this.snake.move(cell);

        if (result.digested) {
            result.emptyCells.forEach(cell => this.grid.roll(cell));

            const delta = result.colorCount;
            this.state.score += delta * (delta + 1) / 2;
            this.state.highScore = Math.max(this.state.score, this.state.highScore);
            this.state.moves += delta * 2;
        }

        this.save();
    }
}
