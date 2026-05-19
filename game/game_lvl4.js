var pJump_Value = 30;

function setup() {
    createCanvas(xbound, ybound);
    rectMode(CENTER);
    blendMode(BLEND);

    game_player = new Player(pSpawn_x, pSpawn_y);
    collectable1 = new Collectible(pSpawn_x-60, pSpawn_y, cSprite1);
    collectable2 = new Collectible(pSpawn_x-90, pSpawn_y, cSprite2);
    collectable3 = new Collectible(pSpawn_x-105, pSpawn_y, cSprite3);
    spring1 = new Link(game_player.body, collectable1.body, true);
    spring2 = new Link(collectable1.body, collectable2.body, true);
    spring3 = new Link(collectable2.body, collectable3.body, true);


    // BUILDS THE MAP GEOMETRY, Main difference between each page
    game_phys_objects.push(
    new Platform(null, xbound/2, ybound+30, xbound, 60),// bottom ground
    );

    //map bounds
    var leftwall = Bodies.rectangle(0, ybound/2, 20, ybound, { isStatic: true });
    var rightwall = Bodies.rectangle(xbound, ybound/2, 20, ybound, { isStatic: true });
    var topwall = Bodies.rectangle(xbound/2, 0, xbound, 20, { isStatic: true });
    Composite.add(engine.world, [leftwall, rightwall, topwall]);
}

function draw(){
    background(background_img, 255);
    for (let i = 0; i < game_phys_objects.length; i++) {//showing all the objects in game_phys_objects
        game_phys_objects[i].show();
    }
    game_player.show();
    collectable1.show();
    collectable2.show();
    collectable3.show();
}