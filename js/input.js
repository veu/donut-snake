class Input {
    constructor() {
        this.directionKeys = [
            [37, 74, 65, 81],
            [38, 73, 87, 90],
            [39, 76, 68],
            [40, 75, 83],
        ];
        this.clickEvents = {};
    }

    onDirection(callback) {
        let down;

        document.addEventListener('keydown', e => {
            const direction = this.getDirection(e.keyCode);
            if (direction !== undefined) {
                callback(new Direction(
                    (direction - 1) % 2,
                    (direction - 2) % 2
                ));
            }
        });

        document.addEventListener('touchstart', e => {
            down = e.changedTouches.item(0);
        });

        document.addEventListener('touchend', e => {
            e = e.changedTouches.item(0);
            const x = e.pageX - down.pageX;
            const y = e.pageY - down.pageY;

            if (Math.hypot(x, y) > 50) {
                const isX = x * x > y * y;
                const dir = new Direction(
                    isX ? Math.sign(x) : 0,
                    isX ? 0 : Math.sign(y)
                );
                callback(dir);
            }
        });

        document.addEventListener('touchmove', e => {
            e.preventDefault();
        }, {passive: false});
    }

    onRestart(callback) {
        this.clickEvents.restart = callback;
        document.addEventListener('keydown', e => {
            if (e.keyCode == 82 && !['Control', 'Meta'].some(key => event.getModifierState(key))) {
                e.preventDefault();
                callback();
            }
        }, {passive: false});
    }

    onHelp(callback) {
        this.clickEvents.help = callback;
        document.addEventListener('keydown', e => {
            if (e.keyCode == 72 && !['Control', 'Meta'].some(key => event.getModifierState(key))) {
                callback();
            }
        });
    }

    onResume(callback) {
        this.clickEvents.resume = callback;
        document.addEventListener('keydown', e => {
            if (e.keyCode == 27 && !['Control', 'Meta'].some(key => event.getModifierState(key))) {
                callback();
            }
        });
    }

    getDirection(key) {
        for (const i in this.directionKeys) {
            if (this.directionKeys[i].includes(key)) {
                return +i;
            }
        }
    }
}
