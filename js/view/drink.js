class DrinkView {
    constructor(cell, animation) {
        this.cell = cell;
        this.z = 4;

        if (animation == 'scale') {
            this.scale = 0;
            game.screen.addTween(this, 'scale', {to: 1, ease: 'out', duration: 15});
        } else {
            this.scale = 1;
        }

        if (animation == 'fadeIn') {
            this.opacity = 0;
            game.screen.addTween(this, 'opacity', {to: 1, ease: 'out', duration: 15});
        } else {
            this.opacity = 1;
        }
    }

    fadeOut() {
        game.screen.addTween(this, 'opacity', {to: 0, ease: 'in', duration: 15, remove: true});
    }

    createSprite(canvas, ctx) {
        ctx.beginPath();
        ctx.arc(10, 10, 5.5, 0, 7, 0);

        {
            const gradient = game.screen.ctx.createRadialGradient(10, 10, 1, 10, 10, 8);
            gradient.addColorStop(.2, '#aaa');
            gradient.addColorStop(1, '#fff');
            ctx.fillStyle = gradient;
        }
        ctx.fill();

        ctx.beginPath();
        ctx.arc(10, 10, 4.5, 0, 7, 0);

        {
            const gradient = game.screen.ctx.createRadialGradient(6, 6, 6, 6, 6, 7);
            gradient.addColorStop(1, game.powerUp.isActive() ? '#d0a' : ['#e00','#0d0','#00e','#dd0'][this.cell.color]);
            gradient.addColorStop(0, game.powerUp.isActive() ? '#e5b' : ['#e55','#5e5','#55e','#ee5'][this.cell.color]);
            ctx.fillStyle = gradient;
        }
        ctx.fill();

        ctx.lineWidth = .3;
        ctx.strokeStyle = '#ccc';
        ctx.beginPath();
        ctx.arc(10, 10, 5.5, 0, 7, 0);
        ctx.stroke();

        this.sprite = canvas;
    }

    draw(ctx) {
        ctx.translate(this.cell.x * 20 + 10, this.cell.y * 20 + 10);
        ctx.scale(this.scale, this.scale);
        ctx.drawImage(this.sprite, -10, -10, 20, 20);
    }
}
