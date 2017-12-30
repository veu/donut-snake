class PowerUp {
    init() {
        game.state.powerUp = 0;
    }

    load() {
        game.state.powerUp = game.state.powerUp || 0;
    }

    bump() {
        ++ game.state.powerUp;
    }

    reset() {
        game.state.powerUp = 0;
    }

    isActive() {
        return game.state.powerUp == 4;
    }

    loaded() {
        return (game.state.powerUp + 1) / 4;
    }
}
