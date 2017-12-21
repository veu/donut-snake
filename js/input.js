class Input {
    onDirection(callback) {
        let down;

        document.addEventListener('keydown', e => {
            if (37 <= e.keyCode && e.keyCode <= 40) {
                const dir = new Direction(
                    (e.keyCode - 38) % 2,
                    (e.keyCode - 39) % 2
                );
                callback(dir);
            }
        });

        document.addEventListener('touchstart', e => {
            down = e.changedTouches.item(0);
        });

        document.addEventListener('touchend', e => {
            e = e.changedTouches.item(0);
            const x = e.pageX - down.pageX;
            const y = e.pageY - down.pageY;

            if (x|y) {
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

    onResize(callback) {
        onresize = () => { callback() };
    }

    onRestart(callback) {
        for (const element of [...document.querySelectorAll('.btn-restart')]) {
            element.addEventListener('click', () => { callback() });
        }

        document.addEventListener('keydown', e => {
            if (e.keyCode == 82 && !['Control', 'Meta'].some(key => event.getModifierState(key))) {
                callback();
            }
        });
    }

    onHelp(callback) {
        document.querySelector('.btn-help').addEventListener('click', e => { callback(); });
        document.addEventListener('keydown', e => {
            if (e.keyCode == 72 && !['Control', 'Meta'].some(key => event.getModifierState(key))) {
                callback();
            }
        });
    }

    onResume(callback) {
        document.querySelector('.btn-resume').addEventListener('click', e => { callback(); });
        document.addEventListener('keydown', e => {
            if (e.keyCode == 27 && !['Control', 'Meta'].some(key => event.getModifierState(key))) {
                callback();
            }
        });
    }
}
