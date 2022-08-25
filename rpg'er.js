//

var canvas = document.querySelector("canvas").getContext("2d");
var viewport = document.querySelector("#viewport");

var images = {
    player: init_image("images/player.png"),
    grass_tile: init_image("images/grass_tile.png")
};
var keys = {
    arrowUp: false,
    arrowDown: false,
    arrowLeft: false,
    arrowRight: false
};
var player = {
    x: 200,
    y: 200,
    width: 32,
    height: 32,
    speed: 5
};

var map = [[]];

function init_map() {
    for (let x = 0; x < 100; x++) {
        map[x] = [];
        for (let y = 0; y < 100; y++) {
            map[x][y] = {tile: 'grass_tile'};
        }
    }
}

function init_image(path) {
    let i = new Image();
    i.src = path;
    return i;
}

function clamp(num, min, max) {
    return Math.min(Math.max(num, min), max);
}
///////////////////////////////////////////////////////////////////////////



init_map();

addEventListener("keydown", function(e) {
    if (e.key == 'ArrowUp') {
        keys.arrowUp = true;
    }

    if (e.key == 'ArrowDown') {
        keys.arrowDown = true;
    }

    if (e.key == 'ArrowLeft') {
        keys.arrowLeft = true;
    }

    if (e.key == 'ArrowRight') {
        keys.arrowRight = true;
    }
});

addEventListener("keyup", function(e) {
    if (e.key == 'ArrowUp') {
        keys.arrowUp = false;
    }

    if (e.key == 'ArrowDown') {
        keys.arrowDown = false;
    }
    if (e.key == 'ArrowLeft') {
        keys.arrowLeft = false;
    }

    if (e.key == 'ArrowRight') {
        keys.arrowRight = false;
    }
});

setTimeout(function() {
    setInterval(function() {
        canvas.clearRect(0, 0, canvas.canvas.width, canvas.canvas.height);
    
        if (keys.arrowUp == true) {
            player.y -= player.speed;
        }
        if (keys.arrowDown == true) {
            player.y += player.speed;
        }
        if (keys.arrowLeft == true) {
            player.x -= player.speed;
        }
        if (keys.arrowRight == true) {
            player.x += player.speed;
        }
    
        ////////////////
    
        viewport.scrollTo(player.x - (640 / 2), player.y - (480 / 2));
    
        for (let x = clamp(parseInt((viewport.scrollLeft - (640 / 2)) / 32), 0, 100);
        x <= clamp(parseInt((viewport.scrollLeft + (640)) / 32), 0, 100);
        x++) {
            for (let y = clamp(parseInt((viewport.scrollTop - (480 / 2)) / 32), 0, 100);
            y <= clamp(parseInt((viewport.scrollTop + (480)) / 32), 0, 100);
            y++) {
                let b = map[x][y];
    
                if (b.tile != undefined && images[b.tile] != undefined) {
                    canvas.drawImage(images[b.tile], x * 32, y * 32, 32, 32);
                }
            }
        }
    
        canvas.drawImage(images.player, player.x - (player.width / 2), player.y - (player.height / 2), player.width, player.height);
    }, 20);
}, 20);
