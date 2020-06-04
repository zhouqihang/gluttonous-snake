(function (window, undefined) {
    var directions = {
        LEFT: 'left',
        RIGHT: 'right',
        TOP: 'top',
        BOTTOM: 'bottom'
    }
    window.onload = function () {
        var canvas = this.document.getElementById('canvas');
        var WIDTH = canvas.width;
        var HEIGHT = canvas.height;
        var ctx = canvas.getContext('2d');

        var food = createFood();
        var snake = new Snake(ctx);
        var isGameOver = false;
        var eatted = 0;
        
        paint();

        var speed = 60, currentCount = 0;
        function main () {
            if (isGameOver) {
                return;
            }

            var temp = Math.floor(speed - eatted * 1.5);
            if (temp < 2) {
                temp = 2;
            }
            if (currentCount < temp) {
                currentCount++;
            }
            else {
                snake.move(function () {
                    if (this.bodys[0].position.toString() === food.position.toString()) {
                        this.grow();
                        food = createFood();
                        eatted += 1;
                        return;
                    }
                    if (
                        this.bodys[0].position.x < 0
                        || this.bodys[0].position.x >= WIDTH
                        || this.bodys[0].position.y >= HEIGHT
                        || this.bodys[0].position.y < 0
                    ) {
                        isGameOver = true;
                        alert('Game Over');
                        return;
                    }
                    for (var i = 1; i < this.bodys.length; i++) {
                        if (this.bodys[0].position.toString() === this.bodys[i].position.toString()) {
                            isGameOver = true;
                            alert('Game Over');
                            return;
                        }
                    }
                });
                paint();
                currentCount = 0;
            }
            requestAnimationFrame(main);
        }
        requestAnimationFrame(main)
        
        window.document.addEventListener('keydown', function (event) {
            var keyMap = {
                '37': directions.LEFT,
                '38': directions.TOP,
                '39': directions.RIGHT,
                '40': directions.BOTTOM,
            }
            var current = keyMap[event.keyCode];
            if (current === directions.LEFT || current === directions.RIGHT) {
                if (snake.direction === directions.LEFT || snake.direction === directions.RIGHT) {
                    return;
                }
            }
            else {
                if (snake.direction === directions.TOP || snake.direction === directions.BOTTOM) {
                    return;
                }
            }
            snake.direction = keyMap[event.keyCode];
        })
        function paint() {
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, WIDTH, HEIGHT);
            food.stroke(ctx);
            snake.stroke(ctx);
        }
        function createFood() {
            const x = getRandom(0, WIDTH / SnakeBody.WIDTH);
            const y = getRandom(0, HEIGHT / SnakeBody.HEIGHT);
            var body = new SnakeBody();
            body.position = new Position(x * SnakeBody.WIDTH, y * SnakeBody.HEIGHT);
            return body;
        }
        function getRandom(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min)) + min;
        }
    }

    function Snake(ctx, size) {
        this.ctx = ctx;
        var size = size || 3;
        this.position = new Position();
        this.direction = directions.LEFT;
        this.speed = 1;

        this.bodys = [];
        for (var i = 0; i < size; i++) {
            this.grow();
        }
    }
    Snake.prototype.grow = function () {
        var body = new SnakeBody();
        var length = this.bodys.length;
        if (length === 0) {
            body.direction = this.direction;
            body.position = new Position(100, 30);
        }
        else {
            var lastBody = this.bodys[length - 1];
            body.direction = lastBody.direction;
            this.setBodyPosition(body, lastBody);
        }

        this.bodys.push(body);
        return this;
    }
    Snake.prototype.setBodyPosition = function (body, referBody, symbol = 1) {
        if (body.direction === directions.LEFT) {
            body.position = new Position(referBody.position.x + SnakeBody.WIDTH * symbol, referBody.position.y);
        }
        else if (body.direction === directions.RIGHT) {
            body.position = new Position(referBody.position.x - SnakeBody.WIDTH * symbol, referBody.position.y);
        }
        else if (body.direction === directions.TOP) {
            body.position = new Position(referBody.position.x, referBody.position.y + SnakeBody.HEIGHT * symbol);
        }
        else if (body.direction === directions.BOTTOM) {
            body.position = new Position(referBody.position.x, referBody.position.y - SnakeBody.HEIGHT * symbol);
        }
        return this;
    }
    Snake.prototype.move = function (fn) {
        if (this.bodys.length === 0) {
            return;
        }
        var prevDirection = this.direction;
        for (var i = 0; i < this.bodys.length; i++) {
            var temp = this.bodys[i].direction;
            this.bodys[i].direction = prevDirection;
            prevDirection = temp;
            
            this.setBodyPosition(this.bodys[i], this.bodys[i], -1);
        }

        if (typeof fn === 'function') {
            fn.call(this);
        }
        return this;
    }
    Snake.prototype.clearBody = function (body) {
        this.ctx.clearRect(body.position.x, body.position.y, SnakeBody.WIDTH, SnakeBody.HEIGHT);
        return this;
    }
    Snake.prototype.stroke = function () {
        for (var i = 0; i < this.bodys.length; i++) {
            this.bodys[i].stroke(this.ctx);
        }
        return this;
    }

    function SnakeBody() {
        this.width = 8;
        this.height = 8;
        this.position = new Position();
        this.direction = directions.LEFT;
        this.color = 'green';
        this.strokeColor = '#000';
    }
    SnakeBody.WIDTH = 10;
    SnakeBody.HEIGHT = 10;
    SnakeBody.prototype.stroke = function (ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.position.x + 1, this.position.y + 1, this.width, this.height);
        ctx.strokeRect(this.position.x, this.position.y, this.width + 2, this.height + 2);
        return this;
    }

    function Position(x, y) {
        this.x = x || 0;
        this.y = y || 0;

        this.toString = function () {
            return 'x=' + this.x + 'y=' + this.y;
        }
    }

    
})(window, undefined);