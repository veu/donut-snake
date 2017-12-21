class Stats {
    init() {
        game.state.moves = 8;
        game.state.score = 0;

        this.view = new StatsView();
    }

    load() {
        this.view = new StatsView();
    }
}
