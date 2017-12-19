class StatsView {
    constructor() {
        this.z = 10;
        this.animationStep = 0;
        game.screen.add(this);
    }

    draw(ctx) {
        ++ this.animationStep;

        ctx.fillStyle = '#f6b';
        ctx.fillRect(-20, 110, 140, 200);
        ctx.fillStyle = '#200';
        let offset = 125;

        const {moves, score, highScore, snake} = game.state;
        const isInDanger = (moves + snake.colors.length < 5 || moves < 3) && moves > 0 && !game.locked;

        for (const [key, value] of [['Moves', moves], ['Score', score], ['High Score', highScore]]) {
            let leftWidth = ctx.measureText(key).width;
            let rightWidth = ctx.measureText(value).width;
            for (let i = 0; i < 96 - leftWidth - rightWidth; i += 2) {
                const elementOffset = key == 'Moves' && isInDanger ? offset + Math.sin(i + this.animationStep) / 3 : offset;
                ctx.fillRect(3 + leftWidth + i, elementOffset, 1, 1);
            }
            ctx.textAlign = 'left';
            ctx.fillText(key, 2, offset + 1);
            ctx.textAlign = 'right';
            ctx.fillText(value, 100, offset + 1);

            offset += 11;
        }
    }
}
