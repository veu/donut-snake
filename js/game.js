class Game {
    constructor() {
        this.state = {};

        this.screen = new Screen(this);
    }

    init() {
        this.grid = new Grid();
        this.snake = new Snake();
        this.stats = new Stats();
        this.menu = new MenuView();
        this.powerUp = new PowerUp();
    }

    start() {
        this.screen.reset();

        if (this.tutorial) {
            this.tutorial = undefined;
        }

        this.snake.init(this.state.plays > 4);
        this.grid.init();
        this.stats.init();
        this.menu.init();
        this.powerUp.init();

        for (const part of this.snake.iterate()) {
            this.grid.empty(part);
        }

        this.save();
    }

    async startTutorial() {
        if (this.tutorial) return;

        this.locked = true;

        this.tutorial = new Tutorial();
        await this.tutorial.init();

        this.locked = false;
    }

    save() {
        window.localStorage.setItem('save', JSON.stringify(this.state));
    };

    load() {
        this.screen.reset();

        if (this.tutorial) {
            this.tutorial = undefined;
        }

        let savedState;
        try {
            savedState = JSON.parse(window.localStorage.getItem('save'));
            for (const key in this.state) delete this.state[key];
            for (const key in savedState) this.state[key] = savedState[key];

            if (this.state.moves > 0) {
                this.grid.load();
                this.snake.load();
                this.stats.load();
                this.menu.load();
                this.powerUp.load();
                return;
            }
        } catch (e) { console.error(e); }

        for (const key in this.state) delete this.state[key];
        this.state.highScore = savedState && savedState.highScore || 0;
        this.state.plays = savedState && savedState.plays || 0;

        this.start();
    }

    async move(dir) {
        if (this.locked) return;
        this.locked = true;

        if (this.tutorial) {
            await this.tutorial.move(dir);
            this.locked = false;
            return;
        }

        const next = this.snake.getNextPosition(dir);

        if (this.state.moves == 0 || this.grid.isOccupied(next)) {
            this.locked = false;
            return;
        }

        const cell = this.grid.get(next);

        -- this.state.moves;

        this.snake.move(cell);

        await this.screen.wait(10);

        this.grid.empty(cell);

        if (cell.isDonut) {
            if (cell.isSprinkled) {
                this.powerUp.bump();
                if (this.powerUp.isActive()) {
                    this.grid.togglePowerUp();
                    this.snake.togglePowerUp();
                }

            }
        } else {
            let count = 0;
            let delta = 0;
            for (const result of this.snake.drink(cell.color)) {
                this.grid.roll(result.emptyCell, true);

                this.state.score += delta += ++ count;
                this.state.highScore = Math.max(this.state.score, this.state.highScore);

                if (result.isDrinkColor || game.powerUp.isActive()) {
                    this.state.moves += 2;
                }
                await this.screen.wait(10);
            }

            if (this.powerUp.isActive()) {
                this.powerUp.reset();
                this.grid.togglePowerUp();
            }
        }

        if (this.state.moves == 0) {
            this.snake.closeEyes();
            ++ this.state.plays;
        }

        this.save();

        this.locked = false;
    }
}
