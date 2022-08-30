//

var canvas = document.querySelector("canvas").getContext("2d");

canvas.imageSmoothingEnabled = false;

var viewport = document.querySelector("#viewport");
var viewportWidth = parseInt(viewport.style.width);
var viewportHeight = parseInt(viewport.style.height);

var images = {
    player_idle_up: init_image("images/player_idle_up.png"),
    player_idle_down: init_image("images/player_idle_down.png"),
    player_idle_left: init_image("images/player_idle_left.png"),
    player_idle_right: init_image("images/player_idle_right.png"),
    metal_tile: init_image("images/metal_tile.png"),
    oil_tile: init_image("images/oil_tile.png"),
    oil_patch: init_image("images/oil_patch.png"),
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
var animations = {
    player: {
        speed: 0,
        frames: [images.player_idle_down],
        currentFrame: 0
    }
};

var map = [[]];
var ticks = 1;

function init_map(premap = undefined) {
    if (premap == undefined) {
        for (let x = 0; x < 100; x++) {
            map[x] = [];
            for (let y = 0; y < 100; y++) {
                map[x][y] = {tile: {name: 'metal_tile', isWalkable: true}, object: {name: null, isWalkable: true}};
            }
        }
    }

    else {
        map = premap;
    }

    map[7][7].object = {name: 'oil_patch', isWalkable: false};
    map[4][7].tile = {name: 'oil_tile', isWalkable: false};
    map[5][5].tile = {name: 'oil_tile', isWalkable: false};
    map[5][7].tile = {name: 'oil_tile', isWalkable: false};
    map[99][99].tile = {name: 'oil_tile', isWalkable: false};
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
        //clear rect
        canvas.clearRect(0, 0, canvas.canvas.width, canvas.canvas.height);

        //ticks (for animation)
        ticks = ticks + 1;
        if (ticks > 2000000000) {
            ticks = 1;
        }

        //keyboard input
        if (keys.arrowUp == true) {
            animations.player.frames[0] = images.player_idle_up;
            for (let i = 0; i < player.speed; i++) {
                if (player.y <= 0) {
                    break;
                }

                let currentBlockX = clamp(parseInt(player.x / 32), 0, 99);
                let currentBlockY = clamp(parseInt(player.y / 32), 0, 99);

                if (player.y % 32 == 0) {
                    if (player.x % 32 == 0) {
                        let tile1 = map[clamp(currentBlockX, 0, 99)][clamp(currentBlockY - 1, 0, 99)];

                        if (tile1.tile.isWalkable != false && tile1.object.isWalkable != false) {
                            player.y -= 1;
                        }
                        else {
                            break;
                        }
                    }
                    else {
                        if (player.x / 32 > parseInt(player.x / 32)) {
                            let tile1 = map[clamp(currentBlockX, 0, 99)][clamp(currentBlockY - 1, 0, 99)];
                            let tile2 = map[clamp(currentBlockX + 1, 0, 99)][clamp(currentBlockY - 1, 0, 99)];

                            if (tile1.tile.isWalkable != false && tile2.tile.isWalkable != false && 
                                tile1.object.isWalkable != false & tile2.object.isWalkable != false) {
                                player.y -= 1;
                            }
                            else {
                                break;
                            }
                        }
                        else if (player.x / 32 < parseInt(player.x / 32)) {
                            let tile1 = map[clamp(currentBlockX, 0, 99)][clamp(currentBlockY - 1, 0, 99)];
                            let tile2 = map[clamp(currentBlockX - 1, 0, 99)][clamp(currentBlockY - 1, 0, 99)];

                            if (tile1.tile.isWalkable != false && tile2.tile.isWalkable != false && 
                                tile1.object.isWalkable != false & tile2.object.isWalkable != false) {
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
            animations.player.frames[0] = images.player_idle_down;
            for (let i = 0; i < player.speed; i++) {
                if (player.y >= 3200) {
                    break;
                }

                let currentBlockX = clamp(parseInt(player.x / 32), 0, 99);
                let currentBlockY = clamp(parseInt(player.y / 32), 0, 99);

                if (player.y % 32 == 0) {
                    if (player.x % 32 == 0) {
                        let tile1 = map[clamp(currentBlockX, 0, 99)][clamp(currentBlockY + 1, 0, 99)];

                        if (tile1.tile.isWalkable != false && tile1.object.isWalkable != false) {
                            player.y += 1;
                        }
                        else {
                            break;
                        }
                    }
                    else {
                        if (player.x / 32 > parseInt(player.x / 32)) {
                            let tile1 = map[clamp(currentBlockX, 0, 99)][clamp(currentBlockY + 1, 0, 99)];
                            let tile2 = map[clamp(currentBlockX + 1, 0, 99)][clamp(currentBlockY + 1, 0, 99)];

                            if (tile1.tile.isWalkable != false && tile2.tile.isWalkable != false && 
                                tile1.object.isWalkable != false & tile2.object.isWalkable != false) {
                                player.y += 1;
                            }
                            else {
                                break;
                            }
                        }
                        else if (player.x / 32 < parseInt(player.x / 32)) {
                            let tile1 = map[clamp(currentBlockX, 0, 99)][clamp(currentBlockY + 1, 0, 99)];
                            let tile2 = map[clamp(currentBlockX - 1, 0, 99)][clamp(currentBlockY + 1, 0, 99)];

                            if (tile1.tile.isWalkable != false && tile2.tile.isWalkable != false && 
                                tile1.object.isWalkable != false & tile2.object.isWalkable != false) {
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
            animations.player.frames[0] = images.player_idle_left;
            for (let i = 0; i < player.speed; i++) {
                if (player.x <= 0) {
                    break;
                }

                let currentBlockX = clamp(parseInt(player.x / 32), 0, 99);
                let currentBlockY = clamp(parseInt(player.y / 32), 0, 99);

                if (player.x % 32 == 0) {
                    if (player.y % 32 == 0) {
                        let tile1 = map[clamp(currentBlockX - 1, 0, 99)][clamp(currentBlockY, 0, 99)];

                        if (tile1.tile.isWalkable != false && tile1.object.isWalkable != false) {
                            player.x -= 1;
                        }
                        else {
                            break;
                        }
                    }
                    else {
                        if (player.y / 32 > parseInt(player.y / 32)) {
                            let tile1 = map[clamp(currentBlockX - 1, 0, 99)][clamp(currentBlockY, 0, 99)];
                            let tile2 = map[clamp(currentBlockX - 1, 0, 99)][clamp(currentBlockY + 1, 0, 99)];

                            if (tile1.tile.isWalkable != false && tile2.tile.isWalkable != false && 
                                tile1.object.isWalkable != false & tile2.object.isWalkable != false) {
                                player.x -= 1;
                            }
                            else {
                                break;
                            }
                        }
                        else if (player.y / 32 < parseInt(player.y / 32)) {
                            let tile1 = map[clamp(currentBlockX - 1, 0, 99)][clamp(currentBlockY, 0, 99)];
                            let tile2 = map[clamp(currentBlockX - 1, 0, 99)][clamp(currentBlockY - 1, 0, 99)];

                            if (tile1.tile.isWalkable != false && tile2.tile.isWalkable != false && 
                                tile1.object.isWalkable != false & tile2.object.isWalkable != false) {
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
            animations.player.frames[0] = images.player_idle_right;
            for (let i = 0; i < player.speed; i++) {
                if (player.x >= 3200) {
                    break;
                }

                let currentBlockX = clamp(parseInt(player.x / 32), 0, 99);
                let currentBlockY = clamp(parseInt(player.y / 32), 0, 99);

                if (player.x % 32 == 0) {
                    if (player.y % 32 == 0) {
                        let tile1 = map[clamp(currentBlockX + 1, 0, 99)][clamp(currentBlockY, 0, 99)];

                        if (tile1.tile.isWalkable != false && tile1.object.isWalkable != false) {
                            player.x += 1;
                        }
                        else {
                            break;
                        }
                    }
                    else {
                        if (player.y / 32 > parseInt(player.y / 32)) {
                            let tile1 = map[clamp(currentBlockX + 1, 0, 99)][clamp(currentBlockY, 0, 99)];
                            let tile2 = map[clamp(currentBlockX + 1, 0, 99)][clamp(currentBlockY + 1, 0, 99)];

                            if (tile1.tile.isWalkable != false && tile2.tile.isWalkable != false && 
                                tile1.object.isWalkable != false & tile2.object.isWalkable != false) {
                                player.x += 1;
                            }
                            else {
                                break;
                            }
                        }
                        else if (player.y / 32 < parseInt(player.y / 32)) {
                            let tile1 = map[clamp(currentBlockX + 1, 0, 99)][clamp(currentBlockY, 0, 99)];
                            let tile2 = map[clamp(currentBlockX + 1, 0, 99)][clamp(currentBlockY - 1, 0, 99)];

                            if (tile1.tile.isWalkable != false && tile2.tile.isWalkable != false && 
                                tile1.object.isWalkable != false & tile2.object.isWalkable != false) {
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

        //animations update
        for (let i in animations) {
            let anim = animations[i];

            if (anim.speed == null) {

            }

            else if (ticks % anim.speed == 0) {
                anim.currentFrame += 1;
                if (anim.currentFrame >= anim.frames.length) {
                    anim.currentFrame = 0;
                }
            }
        }

        //camera scrolling
        viewport.scrollTo((player.x + (player.width / 2)) - (viewportWidth / 2), (player.y + (player.height / 2)) - (viewportHeight / 2));
    
        //tilemap rendering
        for (let x = clamp(parseInt((viewport.scrollLeft - (viewportWidth / 2)) / 32), 0, 99);
        x <= clamp(parseInt((viewport.scrollLeft + (viewportWidth)) / 32), 0, 99);
        x++) {
            for (let y = clamp(parseInt((viewport.scrollTop - (viewportHeight / 2)) / 32), 0, 99);
            y <= clamp(parseInt((viewport.scrollTop + (viewportHeight)) / 32), 0, 99);
            y++) {
                let b = map[x][y];
    
                if (b.tile != undefined && images[b.tile.name] != undefined) {
                    canvas.drawImage(images[b.tile.name], x * 32, y * 32, 32, 32);
                }
                if (b.object != undefined && images[b.object.name] != undefined) {
                    canvas.drawImage(images[b.object.name], x * 32, y * 32, 32, 32);
                }
            }
        }

        //player draw
        canvas.drawImage(animations.player.frames[animations.player.currentFrame], player.x, player.y, player.width, player.height);
    }, 20);
}, 20);
