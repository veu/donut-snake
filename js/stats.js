class Stats {
    constructor() {
        this.view = new StatsView();
    }

    init() {
        game.state.moves = 8;
        game.state.score = 0;
    }
}
