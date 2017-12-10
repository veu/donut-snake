class Input {
    onDirection(callback) {
        let down;

        document.addEventListener('keydown', e => {
            if (37 <= e.keyCode && e.keyCode <= 40) {
                const dir = {
                    x: (e.keyCode - 38) % 2,
                    y: (e.keyCode - 39) % 2,
                };
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
                const dir = {
                    x: isX ? Math.sign(x) : 0,
                    y: isX ? 0 : Math.sign(y),
                };
                callback(dir);
            }
        });

        document.addEventListener('touchmove', e => {
            e.preventDefault();
        }, {passive: false});
    }

    onRedraw(callback) {
        onresize = () => { callback() };
    }

    onRestart(callback) {

        for (const element of [...document.querySelectorAll('.btn-restart')]) {
            element.addEventListener('click', () => { callback() });
        }
    }
}
