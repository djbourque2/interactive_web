function setup() {
    createCanvas(xbound, ybound);
    rectMode(CENTER);
    blendMode(BLEND);

    game_player = new Player(pSpawn_x, pSpawn_y);
    collectable1 = new Collectible(cSpawn_x, cSpawn_y, cSprite1);
    //collectable2 = new Collectible(cSpawn_x+120, cSpawn_y, cSprite2);
    spring1 = new Link(game_player.body, collectable1.body);
    //spring2 = new Link(collectable1.body, collectable2.body);


    // BUILDS THE MAP GEOMETRY, Main difference between each page
    game_phys_objects.push(
    new Platform(cloud_platform1, xbound/2, ybound/2, xbound/2), 
    new Platform(cloud_platform3, xbound*3/4, ybound*3/4, xbound/4),
    new Platform(cloud_platform2, xbound/4, ybound/4, xbound/2),
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
    //collectable2.show();
}