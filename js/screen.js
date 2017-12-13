class Screen {
    constructor(game) {
        this.game = game;

        this.canvas = document.querySelector('.screen');
        this.ctx = this.canvas.getContext('2d');

        this.objects = [];
        this.tweens = [];

        setInterval(() => this.tick(), 1000 / 30);
    }

    resize() {
        this.scale = Math.min(innerWidth / 120, innerHeight / 180);

        this.canvas.width = 120 * this.scale;
        this.canvas.height = innerHeight;

        document.documentElement.style.setProperty('--scale', this.scale);

        this.ctx.scale(this.scale, this.scale);

        this.ctx.font = '8px sans-serif';
    }

    add(object) {
        this.objects.push(object);
    }

    remove(object) {
        this.objects = this.objects.filter(o => o !== object);
        this.removeTweens(object);
    }

    addTween(target, property, options) {
        this.tweens.push(new Tween(target, property, options));
    }

    removeTweens(target) {
        this.tweens = this.tweens.filter(tween => {
            if (tween.target !== target) {
                return true;
            }

            tween.end();

            return false;
        });
    }

    reset() {
        for (const tween in this.tweens) {
            tween.end();
        }
        this.tweens = [];
    }

    tick() {
        for (const tween of this.tweens) {
            tween.update();
        }

        this.tweens = this.tweens.filter(tween => tween.isAlive());

        this.draw();
    }

    draw() {
        if (!this.scale) {
            this.resize();
        }

        this.ctx.save();

        this.ctx.clearRect(0, 0, 120, 120);

        this.ctx.translate(10,10);

        this.objects.forEach(object => object.draw(this.ctx));
        this.drawStats(this.game.state.moves, this.game.state.score, this.game.state.highScore);

        this.ctx.restore();

        this.ctx.clearRect(0, 0, 120, 10);
        this.ctx.clearRect(0, 0, 10, 120);
        this.ctx.clearRect(0, 110, 120, 10);
        this.ctx.clearRect(110, 0, 10, 120);
    }

    drawStats(moves, score, highScore) {
        this.ctx.fillStyle = '#f6b';
        this.ctx.fillRect(-10, 110, 120, 200);
        this.ctx.fillStyle = '#200';
        let offset = 125;

        for (const [key, value] of [['Moves', moves], ['Score', score], ['High Score', highScore]]) {
            let leftWidth = this.ctx.measureText(key).width;
            let rightWidth = this.ctx.measureText(value).width;
            for (let i = 0; i < 96 - leftWidth - rightWidth; i += 2) {
                this.ctx.fillRect(3 + leftWidth + i, offset, 1, 1);
            }
            this.ctx.textAlign = 'left';
            this.ctx.fillText(key, 2, offset + 1);
            this.ctx.textAlign = 'right';
            this.ctx.fillText(value, 100, offset + 1);

            offset += 11;
        }
    }
}
