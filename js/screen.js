class Screen {
    constructor(game) {
        this.game = game;

        this.canvas = document.querySelector('.screen');
        this.ctx = this.canvas.getContext('2d');

        this.objects = [];
        this.tweens = [];
        this.waiting = [];
        this.clickAreas = {};

        this.innerHeight = this.innerWidth = 0;

        setInterval(() => this.tick(), 1000 / 30);

        this.canvas.addEventListener('click', e => {
            const x = e.offsetX / this.scale;
            const y = e.offsetY / this.scale;
            for (const action in this.clickAreas) {
                const area = this.clickAreas[action];

                if (x >= area.left && x <= area.right && y >= area.top && y <= area.bottom) {
                    input.clickEvents[action] && input.clickEvents[action]();
                    return;
                }
            }
        });
    }

    resize() {
        if (innerHeight == this.innerHeight && innerWidth == this.innerWidth) {
            return;
        }

        this.innerHeight = innerHeight;
        this.innerWidth = innerWidth;

        this.scale = Math.min(this.innerWidth / 120, this.innerHeight / 180);
        this.gridScale = ((this.scale * 10) | 0) / 10;

        this.canvas.width = 120 * this.scale;
        this.canvas.height = this.innerHeight;

        this.bottom = this.innerHeight / this.scale;

        this.ctx.font = '8px sans-serif';

        this.objects.forEach(object => this.createSprite(object));
    }

    add(object) {
        this.objects.push(object);
        this.objects.sort((a, b) => a.z - b.z);
        this.createSprite(object);
    }

    remove(object) {
        this.objects = this.objects.filter(o => o !== object);
        this.removeTweens(object);
    }

    addTween(target, property, options) {
        const tween = new Tween(target, property, options);
        this.tweens.push(tween);

        return tween;
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

    addClickArea(action, area) {
        this.clickAreas[action] = area;
    }

    reset() {
        for (const tween of this.tweens) {
            tween.end();
        }
        this.tweens = [];

        for (const waiting of this.waiting) {
            waiting.resolve();
        }
        this.waiting = [];

        this.objects = [];
        this.clickAreas = {};
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
        this.resize();

        this.clickAreas = {};

        this.ctx.save();

        this.ctx.scale(this.gridScale, this.gridScale);
        this.ctx.clearRect(0, 0, 120, 120);

        this.ctx.translate(10,10);

        this.objects.forEach(object => {
            if (object.z >= 10) return;

            this.ctx.save();

            object.draw(this.ctx);
            this.ctx.restore();
        });

        this.ctx.clearRect(-20, -20, 140, 20);
        this.ctx.clearRect(-20, -20, 20, 140);
        this.ctx.clearRect(-20, 100, 140, 20);
        this.ctx.clearRect(100, -20, 20, 140);

        this.ctx.restore();

        this.ctx.save();

        this.ctx.scale(this.scale, this.scale);

        this.objects.forEach(object => {
            if (object.z < 10) return;

            this.ctx.save();
            object.draw(this.ctx);
            this.ctx.restore();
        });

        this.ctx.restore();
    }

    createSprite(object) {
        if (!object.createSprite) {
            return;
        }

        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = this.scale * 20;
        const ctx = canvas.getContext('2d');
        ctx.scale(this.gridScale, this.gridScale);

        object.createSprite(canvas, ctx);
    }
}
