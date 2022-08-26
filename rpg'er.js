//

var canvas = document.querySelector("canvas").getContext("2d");
var viewport = document.querySelector("#viewport");

var images = {
    player: init_image("images/player.png"),
    metal_tile: init_image("images/metal_tile.png"),
    oil_tile: init_image("images/oil_tile.png")
};
var keys = {
    arrowUp: false,
    arrowDown: false,
    arrowLeft: false,
    arrowRight: false
};
var player = {
    x: 128,
    y: 128,
    width: 32,
    height: 32,
    speed: 5
};

var map = [[]];

function init_map() {
    for (let x = 0; x < 100; x++) {
        map[x] = [];
        for (let y = 0; y < 100; y++) {
            map[x][y] = {tile: {name: 'metal_tile', isWalkable: true}};
        }
    }

    map[5][5] = {tile: {name: 'oil_tile', isWalkable: false}};
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
            for (let i = 0; i < player.speed; i++) {
                let currentBlockX = clamp(parseInt(player.x / 32), 0, 99);
                let currentBlockY = clamp(parseInt(player.y / 32), 0, 99);

                if (player.y % 32 == 0) {
                    if (player.x % 32 == 0) {
                        if (map[clamp(currentBlockY, 0, 99)][clamp(currentBlockY - 1, 0, 99)].tile.isWalkable != false) {
                            player.y -= 1;
                        }
                        else {
                            break;
                        }
                    }
                    else {
                        if (player.x / 32 > parseInt(player.x / 32)) {
                            if (map[clamp(currentBlockX, 0, 99)][clamp(currentBlockY - 1, 0, 99)].tile.isWalkable != false &&
                            map[clamp(currentBlockX + 1, 0, 99)][clamp(currentBlockY - 1, 0, 99)].tile.isWalkable != false) {
                                player.y -= 1;
                            }
                            else {
                                break;
                            }
                        }
                        else if (player.x / 32 < parseInt(player.x / 32)) {
                            if (map[clamp(currentBlockX, 0, 99)][clamp(currentBlockY - 1, 0, 99)].tile.isWalkable != false &&
                            map[clamp(currentBlockX - 1, 0, 99)][clamp(currentBlockY - 1, 0, 99)].tile.isWalkable != false) {
                                player.y -= 1;
                            }
                            else {
                                break;
                            }
                        }
                        
                    }
                }
                else {
                    player.y -= 1;
                }
            }
        }
        if (keys.arrowDown == true) {
            for (let i = 0; i < player.speed; i++) {
                let currentBlockX = clamp(parseInt(player.x / 32), 0, 99);
                let currentBlockY = clamp(parseInt(player.y / 32), 0, 99);

                if (player.y % 32 == 0) {
                    if (player.x % 32 == 0) {
                        if (map[clamp(currentBlockY, 0, 99)][clamp(currentBlockY + 1, 0, 99)].tile.isWalkable != false) {
                            player.y += 1;
                        }
                        else {
                            break;
                        }
                    }
                    else {
                        if (player.x / 32 > parseInt(player.x / 32)) {
                            if (map[clamp(currentBlockX, 0, 99)][clamp(currentBlockY + 1, 0, 99)].tile.isWalkable != false &&
                            map[clamp(currentBlockX + 1, 0, 99)][clamp(currentBlockY + 1, 0, 99)].tile.isWalkable != false) {
                                player.y += 1;
                            }
                            else {
                                break;
                            }
                        }
                        else if (player.x / 32 < parseInt(player.x / 32)) {
                            if (map[clamp(currentBlockX, 0, 99)][clamp(currentBlockY + 1, 0, 99)].tile.isWalkable != false &&
                            map[clamp(currentBlockX - 1, 0, 99)][clamp(currentBlockY + 1, 0, 99)].tile.isWalkable != false) {
                                player.y += 1;
                            }
                            else {
                                break;
                            }
                        }
                        
                    }
                }
                else {
                    player.y += 1;
                }
            }
        }
        if (keys.arrowLeft == true) {
            for (let i = 0; i < player.speed; i++) {
                let currentBlockX = clamp(parseInt(player.x / 32), 0, 99);
                let currentBlockY = clamp(parseInt(player.y / 32), 0, 99);

                if (player.x % 32 == 0) {
                    if (player.y % 32 == 0) {
                        if (map[clamp(currentBlockX - 1, 0, 99)][clamp(currentBlockY, 0, 99)].tile.isWalkable != false) {
                            player.x -= 1;
                        }
                        else {
                            break;
                        }
                    }
                    else {
                        if (player.y / 32 > parseInt(player.y / 32)) {
                            if (map[clamp(currentBlockX - 1, 0, 99)][clamp(currentBlockY, 0, 99)].tile.isWalkable != false &&
                            map[clamp(currentBlockX - 1, 0, 99)][clamp(currentBlockY + 1, 0, 99)].tile.isWalkable != false) {
                                player.x -= 1;
                            }
                            else {
                                break;
                            }
                        }
                        else if (player.y / 32 < parseInt(player.y / 32)) {
                            if (map[clamp(currentBlockX - 1, 0, 99)][clamp(currentBlockY, 0, 99)].tile.isWalkable != false &&
                            map[clamp(currentBlockX - 1, 0, 99)][clamp(currentBlockY - 1, 0, 99)].tile.isWalkable != false) {
                                player.x -= 1;
                            }
                            else {
                                break;
                            }
                        }
                        
                    }
                }
                else {
                    player.x -= 1;
                }
            }
        }
        if (keys.arrowRight == true) {
            for (let i = 0; i < player.speed; i++) {
                let currentBlockX = clamp(parseInt(player.x / 32), 0, 99);
                let currentBlockY = clamp(parseInt(player.y / 32), 0, 99);

                if (player.x % 32 == 0) {
                    if (player.y % 32 == 0) {
                        if (map[clamp(currentBlockX + 1, 0, 99)][clamp(currentBlockY, 0, 99)].tile.isWalkable != false) {
                            player.x += 1;
                        }
                        else {
                            break;
                        }
                    }
                    else {
                        if (player.y / 32 > parseInt(player.y / 32)) {
                            if (map[clamp(currentBlockX + 1, 0, 99)][clamp(currentBlockY, 0, 99)].tile.isWalkable != false &&
                            map[clamp(currentBlockX + 1, 0, 99)][clamp(currentBlockY + 1, 0, 99)].tile.isWalkable != false) {
                                player.x += 1;
                            }
                            else {
                                break;
                            }
                        }
                        else if (player.y / 32 < parseInt(player.y / 32)) {
                            if (map[clamp(currentBlockX + 1, 0, 99)][clamp(currentBlockY, 0, 99)].tile.isWalkable != false &&
                            map[clamp(currentBlockX + 1, 0, 99)][clamp(currentBlockY - 1, 0, 99)].tile.isWalkable != false) {
                                player.x += 1;
                            }
                            else {
                                break;
                            }
                        }
                        
                    }
                }
                else {
                    player.x += 1;
                }
            }
        }
    
        ////////////////
    
        viewport.scrollTo((player.x + (player.width / 2)) - (640 / 2), (player.y + (player.height / 2)) - (480 / 2));
    
        for (let x = clamp(parseInt((viewport.scrollLeft - (640 / 2)) / 32), 0, 99);
        x <= clamp(parseInt((viewport.scrollLeft + (640)) / 32), 0, 99);
        x++) {
            for (let y = clamp(parseInt((viewport.scrollTop - (480 / 2)) / 32), 0, 99);
            y <= clamp(parseInt((viewport.scrollTop + (480)) / 32), 0, 99);
            y++) {
                let b = map[x][y];
    
                if (b.tile != undefined && images[b.tile.name] != undefined) {
                    canvas.drawImage(images[b.tile.name], x * 32, y * 32, 32, 32);
                }
            }
        }
    
        canvas.drawImage(images.player, player.x, player.y, player.width, player.height);
    }, 20);
}, 20);
