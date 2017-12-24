class MenuView {
    constructor() {
        this.z = 10;
    }

    init() {
        game.screen.add(this);

    }

    load() {
        game.screen.add(this);

    }

    draw(ctx) {
        ctx.save();

        ctx.fillStyle = 'white';
        ctx.font = '8px sans-serif';
        ctx.textBaseline = 'bottom';
        ctx.textAlign = 'left';

        {
            const text = game.tutorial ? 'Resume' : 'Help';
            const area = {
                left: 10,
                top: game.screen.bottom - 13,
                right: 10 + ctx.measureText(text).width,
                bottom: game.screen.bottom - 5
            };
            game.screen.addClickArea(game.tutorial ? 'resume' : 'help', area);
            ctx.fillText(text, 0, game.screen.bottom - 13);
        }

        ctx.textAlign = 'right';

        {
            const text = 'Restart';
            const area = {
                left: 110 - ctx.measureText(text).width,
                top: game.screen.bottom - 13,
                right: 110,
                bottom: game.screen.bottom - 5
            };
            game.screen.addClickArea('restart', area);
            ctx.fillText(text, 100, game.screen.bottom - 13);
        }



        ctx.restore();
    }
}
