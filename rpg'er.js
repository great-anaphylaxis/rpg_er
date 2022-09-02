//

var canvas = document.querySelector("canvas").getContext("2d");

canvas.imageSmoothingEnabled = false;

var viewport = document.querySelector("#viewport");
var viewportWidth = parseInt(viewport.style.width);
var viewportHeight = parseInt(viewport.style.height);

var dialog = document.getElementById("dialog");
var dialog_text = dialog.childNodes[0];
var dialog_list = [];
var is_dialog_open = false;

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
    speed: 1,
    selectedTiles: []
};
var animations = {
    player: {
        speed: 0,
        frames: [images.player_idle_down],
        currentFrame: 0
    }
};

/*
tile: {
    tile: {name: <string>, isWalkable: <bool>},
    object: {name: <string>, isWalkable: <bool>, message: <array}
};
*/

var map = [[]];
var ticks = 1;

function init_map(premap = undefined) {
    if (premap == undefined) {
        for (let x = 0; x < 100; x++) {
            map[x] = [];
            for (let y = 0; y < 100; y++) {
                map[x][y] = {tile: {name: 'metal_tile', isWalkable: true}, object: {name: null, isWalkable: true, message: []}};
            }
        }
    }

    else {
        map = premap;
    }

    map[7][7].object = {name: 'oil_patch', isWalkable: false, message: ['hi', 'sapnap', 'tree', 'spill']};
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

function open_dialog(msg) {
    dialog_text.textContent = msg;
    dialog.style.display = 'block';
    is_dialog_open = true;
}

function close_dialog() {
    dialog.style.display = 'none';
    dialog_text.textContent = "";
    is_dialog_open = false;
}

function dialog_next() {
    let msg = dialog_list.shift();

    if (msg != undefined && msg != null) {
        open_dialog(msg);
    }
    else {
        close_dialog();
    }
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

addEventListener("keypress", function(e) {
    if (e.key == 'Enter') {
        if (is_dialog_open == false) {
            for (let i = 0; i < player.selectedTiles.length; i++) {
                if (player.selectedTiles[i].object != undefined && player.selectedTiles[i].object.message[0] != undefined) {
                    dialog_list.push(...player.selectedTiles[i].object.message);

                    open_dialog(dialog_list.shift());
                    break;
                }
            }
        }
        else if (is_dialog_open == true) {
            dialog_next();
        }
    }
});

document.getElementById("dialog-ok").addEventListener("click", function(e) {
    dialog_next();
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
                        let btile1 = map[clamp(currentBlockX, 0, 99)][clamp(currentBlockY - 2, 0, 99)];

                        player.selectedTiles = [tile1, btile1];

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
                            let btile1 = map[clamp(currentBlockX, 0, 99)][clamp(currentBlockY - 2, 0, 99)];
                            let btile2 = map[clamp(currentBlockX + 1, 0, 99)][clamp(currentBlockY - 2, 0, 99)];

                            player.selectedTiles = [tile1, tile2, btile1, btile2];

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
                            let btile1 = map[clamp(currentBlockX, 0, 99)][clamp(currentBlockY - 2, 0, 99)];
                            let btile2 = map[clamp(currentBlockX - 1, 0, 99)][clamp(currentBlockY - 2, 0, 99)];

                            player.selectedTiles = [tile1, tile2, btile1, btile2];

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
                    if (player.x % 32 == 0) {
                        let tile1 = map[clamp(currentBlockX, 0, 99)][clamp(currentBlockY - 1, 0, 99)];
                        let btile1 = map[clamp(currentBlockX, 0, 99)][clamp(currentBlockY - 2, 0, 99)];

                        player.selectedTiles = [tile1, btile1];
                    }
                    else {
                        if (player.x / 32 > parseInt(player.x / 32)) {
                            let tile1 = map[clamp(currentBlockX, 0, 99)][clamp(currentBlockY - 1, 0, 99)];
                            let tile2 = map[clamp(currentBlockX + 1, 0, 99)][clamp(currentBlockY - 1, 0, 99)];
                            let btile1 = map[clamp(currentBlockX, 0, 99)][clamp(currentBlockY - 2, 0, 99)];
                            let btile2 = map[clamp(currentBlockX + 1, 0, 99)][clamp(currentBlockY - 2, 0, 99)];

                            player.selectedTiles = [tile1, tile2, btile1, btile2];
                        }
                        else if (player.x / 32 < parseInt(player.x / 32)) {
                            let tile1 = map[clamp(currentBlockX, 0, 99)][clamp(currentBlockY - 1, 0, 99)];
                            let tile2 = map[clamp(currentBlockX - 1, 0, 99)][clamp(currentBlockY - 1, 0, 99)];
                            let btile1 = map[clamp(currentBlockX, 0, 99)][clamp(currentBlockY - 2, 0, 99)];
                            let btile2 = map[clamp(currentBlockX - 1, 0, 99)][clamp(currentBlockY - 2, 0, 99)];

                            player.selectedTiles = [tile1, tile2, btile1, btile2];
                        }
                    }

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
                        let btile1 = map[clamp(currentBlockX, 0, 99)][clamp(currentBlockY + 2, 0, 99)];

                        player.selectedTiles = [tile1, btile1];

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
                            let btile1 = map[clamp(currentBlockX, 0, 99)][clamp(currentBlockY + 2, 0, 99)];
                            let btile2 = map[clamp(currentBlockX + 1, 0, 99)][clamp(currentBlockY + 2, 0, 99)];

                            player.selectedTiles = [tile1, tile2, btile1, btile2];

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
                            let btile1 = map[clamp(currentBlockX, 0, 99)][clamp(currentBlockY + 2, 0, 99)];
                            let btile2 = map[clamp(currentBlockX - 1, 0, 99)][clamp(currentBlockY + 2, 0, 99)];

                            player.selectedTiles = [tile1, tile2, btile1, btile2];

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
                    if (player.x % 32 == 0) {
                        let tile1 = map[clamp(currentBlockX, 0, 99)][clamp(currentBlockY + 2, 0, 99)];
                        let btile1 = map[clamp(currentBlockX, 0, 99)][clamp(currentBlockY + 3, 0, 99)];

                        player.selectedTiles = [tile1, btile1];
                    }
                    else {
                        if (player.x / 32 > parseInt(player.x / 32)) {
                            let tile1 = map[clamp(currentBlockX, 0, 99)][clamp(currentBlockY + 2, 0, 99)];
                            let tile2 = map[clamp(currentBlockX + 1, 0, 99)][clamp(currentBlockY + 2, 0, 99)];
                            let btile1 = map[clamp(currentBlockX, 0, 99)][clamp(currentBlockY + 3, 0, 99)];
                            let btile2 = map[clamp(currentBlockX + 1, 0, 99)][clamp(currentBlockY + 3, 0, 99)];

                            player.selectedTiles = [tile1, tile2, btile1, btile2];
                        }
                        else if (player.x / 32 < parseInt(player.x / 32)) {
                            let tile1 = map[clamp(currentBlockX, 0, 99)][clamp(currentBlockY + 2, 0, 99)];
                            let tile2 = map[clamp(currentBlockX - 1, 0, 99)][clamp(currentBlockY + 2, 0, 99)];
                            let btile1 = map[clamp(currentBlockX, 0, 99)][clamp(currentBlockY + 3, 0, 99)];
                            let btile2 = map[clamp(currentBlockX - 1, 0, 99)][clamp(currentBlockY + 3, 0, 99)];

                            player.selectedTiles = [tile1, tile2, btile1, btile2];
                        }
                        
                    }

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
                        let btile1 = map[clamp(currentBlockX - 2, 0, 99)][clamp(currentBlockY, 0, 99)];

                        player.selectedTiles = [tile1, btile1];

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
                            let btile1 = map[clamp(currentBlockX - 2, 0, 99)][clamp(currentBlockY, 0, 99)];
                            let btile2 = map[clamp(currentBlockX - 2, 0, 99)][clamp(currentBlockY + 1, 0, 99)];

                            player.selectedTiles = [tile1, tile2, btile1, btile2];

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
                            let btile1 = map[clamp(currentBlockX - 2, 0, 99)][clamp(currentBlockY, 0, 99)];
                            let btile2 = map[clamp(currentBlockX - 2, 0, 99)][clamp(currentBlockY - 1, 0, 99)];

                            player.selectedTiles = [tile1, tile2, btile1, btile2];

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
                    if (player.y % 32 == 0) {
                        let tile1 = map[clamp(currentBlockX - 1, 0, 99)][clamp(currentBlockY, 0, 99)];
                        let btile1 = map[clamp(currentBlockX - 2, 0, 99)][clamp(currentBlockY, 0, 99)];

                        player.selectedTiles = [tile1, btile1];
                    }
                    else {
                        if (player.y / 32 > parseInt(player.y / 32)) {
                            let tile1 = map[clamp(currentBlockX - 1, 0, 99)][clamp(currentBlockY, 0, 99)];
                            let tile2 = map[clamp(currentBlockX - 1, 0, 99)][clamp(currentBlockY + 1, 0, 99)];
                            let btile1 = map[clamp(currentBlockX - 2, 0, 99)][clamp(currentBlockY, 0, 99)];
                            let btile2 = map[clamp(currentBlockX - 2, 0, 99)][clamp(currentBlockY + 1, 0, 99)];

                            player.selectedTiles = [tile1, tile2, btile1, btile2];
                        }
                        else if (player.y / 32 < parseInt(player.y / 32)) {
                            let tile1 = map[clamp(currentBlockX - 1, 0, 99)][clamp(currentBlockY, 0, 99)];
                            let tile2 = map[clamp(currentBlockX - 1, 0, 99)][clamp(currentBlockY - 1, 0, 99)];
                            let btile1 = map[clamp(currentBlockX - 2, 0, 99)][clamp(currentBlockY, 0, 99)];
                            let btile2 = map[clamp(currentBlockX - 2, 0, 99)][clamp(currentBlockY - 1, 0, 99)];

                            player.selectedTiles = [tile1, tile2, btile1, btile2];
                        }
                        
                    }
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
                        let btile1 = map[clamp(currentBlockX + 2, 0, 99)][clamp(currentBlockY, 0, 99)];

                        player.selectedTiles = [tile1, btile1];

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
                            let btile1 = map[clamp(currentBlockX + 2, 0, 99)][clamp(currentBlockY, 0, 99)];
                            let btile2 = map[clamp(currentBlockX + 2, 0, 99)][clamp(currentBlockY + 1, 0, 99)];

                            player.selectedTiles = [tile1, tile2, btile1, btile2];

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
                            let btile1 = map[clamp(currentBlockX + 2, 0, 99)][clamp(currentBlockY, 0, 99)];
                            let btile2 = map[clamp(currentBlockX + 2, 0, 99)][clamp(currentBlockY - 1, 0, 99)];

                            player.selectedTiles = [tile1, tile2, btile1, btile2];

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
                    if (player.y % 32 == 0) {
                        let tile1 = map[clamp(currentBlockX + 2, 0, 99)][clamp(currentBlockY, 0, 99)];
                        let btile1 = map[clamp(currentBlockX + 3, 0, 99)][clamp(currentBlockY, 0, 99)];

                        player.selectedTiles = [tile1, btile1];
                    }
                    else {
                        if (player.y / 32 > parseInt(player.y / 32)) {
                            let tile1 = map[clamp(currentBlockX + 2, 0, 99)][clamp(currentBlockY, 0, 99)];
                            let tile2 = map[clamp(currentBlockX + 2, 0, 99)][clamp(currentBlockY + 1, 0, 99)];
                            let btile1 = map[clamp(currentBlockX + 3, 0, 99)][clamp(currentBlockY, 0, 99)];
                            let btile2 = map[clamp(currentBlockX + 3, 0, 99)][clamp(currentBlockY + 1, 0, 99)];

                            player.selectedTiles = [tile1, tile2, btile1, btile2];
                        }
                        else if (player.y / 32 < parseInt(player.y / 32)) {
                            let tile1 = map[clamp(currentBlockX + 2, 0, 99)][clamp(currentBlockY, 0, 99)];
                            let tile2 = map[clamp(currentBlockX + 2, 0, 99)][clamp(currentBlockY - 1, 0, 99)];
                            let btile1 = map[clamp(currentBlockX + 3, 0, 99)][clamp(currentBlockY, 0, 99)];
                            let btile2 = map[clamp(currentBlockX + 3, 0, 99)][clamp(currentBlockY - 1, 0, 99)];

                            player.selectedTiles = [tile1, tile2, btile1, btile2];
                        }
                    }

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
