class TutorialView {
    constructor(tutorial) {
        this.tutorial = tutorial;
        this.z = 20;

        this.visibleTop = 0;
        this.visibleBottom = 0;

        game.screen.add(this);

        this.texts = [
            ['Eating makes you longer.', '', 'Swipe to eat the donut.'],
            ['Soda makes you short again.', '', 'Swipe to drink the soda.'],
            ['Watch your moves.', '', 'Eat another donut.'],
            ['Consuming donuts and soda', 'of the same color adds moves.', 'Drink the soda.'],
            ['Well done!', '', 'Have fun playing.'],
        ];
    }

    show() {
        game.screen.addTween(this, 'visibleTop', {
            duration: 30,
            ease: 'inout',
            to: 1,
        }).then(() => {
            game.screen.addTween(this, 'visibleBottom', {
                duration: 30,
                ease: 'inout',
                to: 1,
            });
        });
    }

    hide() {
        game.screen.addTween(this, 'visibleTop', {
            duration: 20,
            ease: 'inout',
            to: 0,
        });
        game.screen.addTween(this, 'visibleBottom', {
            duration: 20,
            ease: 'inout',
            to: 0,
        });
    }

    draw(ctx) {
        const texts = this.texts[this.tutorial.step];

        ctx.save();

        ctx.globalAlpha = this.visibleTop;
        ctx.textAlign = 'center';
        ctx.fillText(texts[0], 50, 20);
        ctx.fillText(texts[1], 50, 30);

        ctx.globalAlpha = this.visibleBottom;
        ctx.fillText(texts[2], 50, 90);


        ctx.restore();
    }
}
