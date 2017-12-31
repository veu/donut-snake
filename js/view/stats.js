class StatsView {
    constructor() {
        this.z = 10;
        this.animationStep = 0;
        game.screen.add(this);
    }

    draw(ctx) {
        ++ this.animationStep;

        ctx.fillStyle = '#f6b';
        ctx.fillRect(-10, 120, 140, 200);
        ctx.fillStyle = '#200';
        let offset = 125;

        const {moves, score, highScore, snake} = game.state;
        const isInDanger = (moves + snake.colors.length < 5 || moves < 3) && moves > 0 && !game.locked;

        for (const [key, value] of [['Moves', moves < 20 ? moves : 'MAX'], ['Score', score], ['High Score', highScore]]) {
            let leftWidth = ctx.measureText(key).width;
            let rightWidth = ctx.measureText(value).width;
            for (let i = 0; i < 98 - leftWidth - rightWidth; i += 2) {
                const elementOffset = key == 'Moves' && isInDanger ? offset + Math.sin(i - this.animationStep) / 3 + 9 : offset + 9;
                ctx.fillRect(11 + leftWidth + i, elementOffset, 1, 1);
            }
            ctx.textAlign = 'left';
            ctx.fillText(key, 10, offset + 10);
            ctx.textAlign = 'right';
            ctx.fillText(value, 110, offset + 10);

            offset += 11;
        }
    }
}
