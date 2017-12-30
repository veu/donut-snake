class DonutView {
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

        for (let i = 2; i--;) {
            ctx.beginPath();
            ctx.arc(10, 10, 4.25, 0, 7, 0);
            ctx.lineWidth = 4 + i * 1.5;

            const gradient = game.screen.ctx.createRadialGradient(10, 10, 1, 10, 10, 8);
            gradient.addColorStop(0, i ? '#eb6' : game.powerUp.isActive() ? '#a08' : ['#f22','#0c0','#22f','#aa0'][this.cell.color]);
            gradient.addColorStop(.5, i ? '#fc8' : game.powerUp.isActive() ? '#f8c' : ['#faa','#afa','#aaf','#ff8'][this.cell.color]);
            gradient.addColorStop(1, i ? '#eb6' : game.powerUp.isActive() ? '#a08' : ['#f22','#0c0','#22f','#aa0'][this.cell.color]);
            ctx.strokeStyle = gradient;

            ctx.stroke()
        }

        if (this.cell.isSprinkled) {
            const colors = ['#f22','#0c0','#22f','#ff8'];
            colors.splice(this.cell.color, 1);

            for (let i = 24 * game.powerUp.loaded() | 0; i--;) {
                const angle = i / 24 * Math.PI * 2;

                ctx.save();
                ctx.fillStyle = colors[i % 3];
                ctx.translate(
                    10 + Math.cos(angle) * 4.25 - 1 + i * i % 2 % 1.5,
                    10 + Math.sin(angle) * 4.25 - 1 + i * i % 1.5
                );
                ctx.rotate(i**3);
                ctx.fillRect(-.2, -.5, .4, 1);
                ctx.restore();
            }

        }

        this.sprite = canvas;
    }

    draw(ctx) {
        if (this.opacity < 1) {
            ctx.globalAlpha = this.opacity;
        }
        ctx.translate(this.cell.x * 20 + 10, this.cell.y * 20 + 10);
        ctx.scale(this.scale, this.scale);
        ctx.drawImage(this.sprite, -10, -10, 20, 20);
    }
}
