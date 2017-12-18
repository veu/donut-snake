class StatsView {
    constructor() {
        game.screen.add(this);
    }

    draw(ctx) {
        ctx.fillStyle = '#f6b';
        ctx.fillRect(-20, 110, 140, 200);
        ctx.fillStyle = '#200';
        let offset = 125;

        const {moves, score, highScore} = game.state;
        for (const [key, value] of [['Moves', moves], ['Score', score], ['High Score', highScore]]) {
            let leftWidth = ctx.measureText(key).width;
            let rightWidth = ctx.measureText(value).width;
            for (let i = 0; i < 96 - leftWidth - rightWidth; i += 2) {
                ctx.fillRect(3 + leftWidth + i, offset, 1, 1);
            }
            ctx.textAlign = 'left';
            ctx.fillText(key, 2, offset + 1);
            ctx.textAlign = 'right';
            ctx.fillText(value, 100, offset + 1);

            offset += 11;
        }
    }
}
