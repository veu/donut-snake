class Screen {
    constructor(game) {
        this.game = game;

        this.canvas = document.querySelector('.screen');
        this.ctx = this.canvas.getContext('2d');

        this.objects = [];
        this.tweens = [];
        this.waiting = [];

        setInterval(() => this.tick(), 1000 / 30);
    }

    resize() {
        this.scale = Math.min(innerWidth / 120, innerHeight / 180);

        this.canvas.width = 120 * this.scale;
        this.canvas.height = innerHeight;

        document.documentElement.style.setProperty('--scale', this.scale);

        this.scale = ((this.scale * 10) | 0) / 10;
        this.ctx.scale(this.scale, this.scale);

        this.ctx.font = '8px sans-serif';
    }

    add(object) {
        this.objects.push(object);
        this.objects.sort((a, b) => a.z - b.z);
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

        this.tweens = this.tweens.filter(tween => {
            if (tween.isAlive()) {
                return true;
            }

            if (tween.remove) {
                this.remove(tween.target);
            }

            return false;
        });

        this.waiting = this.waiting.filter(waiting => {
            -- waiting.ticks;

            if (waiting.ticks == 0) {
                waiting.resolve();

                return false;
            }

            return true;
        });

        this.draw();
    }

    wait(ticks) {
        return new Promise((resolve) => {
            this.waiting.push({ticks, resolve});
        });
    }

    draw() {
        if (!this.scale) {
            this.resize();
        }

        this.ctx.save();

        this.ctx.clearRect(0, 0, 120, 120);

        this.ctx.translate(10,10);

        this.objects.forEach(object => object.draw(this.ctx));

        this.ctx.restore();

        this.ctx.clearRect(-10, -10, 140, 20);
        this.ctx.clearRect(-10, -10, 20, 130);
        this.ctx.clearRect(-10, 110, 140, 10);
        this.ctx.clearRect(110, -10, 20, 130);
    }
}
