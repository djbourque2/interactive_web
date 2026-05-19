//matter.js aliasing
var Engine = Matter.Engine,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Body = Matter.Body,
    Events = Matter.Events,
    Vector = Matter.Vector,
    Collision = Matter.Collision,
    Constraint = Matter.Constraint,
    Detector = Matter.Detector,
    Query = Matter.Query,
    Sleeping = Matter.Sleeping,
Composite = Matter.Composite;

//matter engine
var engine = Engine.create();
var runner = Runner.create();
Runner.run(runner,engine);

//map dimensions ------------------------------------------------
var xbound = 750,
ybound = 750;

//player parameters ---------------------------------------------
var game_player;
var pWidth = 60;
var pHeight = 60;
var pJump_Value = 23;
var pSpawn_x = 200;
var pSpawn_y = 650;

//collectable parameters ----------------------------------------
var cWidth = 60;
var cHeight = 60;
var cSpawn_x = 100;
var cSpawn_y = 100;

//lists of objects
var game_phys_objects = [];
var ground_collision_list = [];

// player's sprite
var player_sprite;

//map visuals
var background_img;
var cloud_platform1;
var cloud_platform2;
var cloud_platform3;

//collectible sprites
var cSprite1;
var cSprite2;
var cSprite3;

// constrait objects
var spring1;
var spring2;
var spring3;


//img loading
function preload(){
    player_sprite = loadImage('../img/interactive_game_assets_player.png');

    background_img = loadImage('../img/interactive_game_assets_background.png');

    cloud_platform1 = loadImage('../img/interactive_game_assets_cloud1.png');
    cloud_platform2 = loadImage('../img/interactive_game_assets_cloud2.png');
    cloud_platform3 = loadImage('../img/interactive_game_assets_cloud3.png');

    cSprite1 = loadImage('../img/interactive_game_assets_collectible1.png');
    cSprite2 = loadImage('../img/interactive_game_assets_collectible2.png');
    cSprite3 = loadImage('../img/interactive_game_assets_collectible3.png');
}

/*----------------------------------
Box that is controlled by the player
------------------------------------
-----Can jump and move around-------
----------------------------------*/
class Player {
    constructor(xSpawn, ySpawn){
        this.body = Bodies.rectangle(xSpawn, ySpawn, pWidth, pHeight, {inertia: Infinity}); //inertia is infinity to stop it from rotating
        this.body.friction = 0;
        Composite.add(engine.world, this.body);
        this.jump_time = 0;
        this.img = player_sprite;
    }
    movement(){ //function that handles player inputs
        let pos = this.body.position;
        for (let i = 0; i < ground_collision_list.length; i++) {
            if (Collision.collides(this.body, ground_collision_list[i]) != null){
                this.jump_time = pJump_Value;
                if (i != 0){
                    let temp = ground_collision_list[0];
                    ground_collision_list[0] = ground_collision_list[i];
                    ground_collision_list[i] = temp;
                }
                break;
            }
        }

        if (keyIsDown(LEFT_ARROW) && !keyIsDown(RIGHT_ARROW)){
            Body.setVelocity(this.body, Vector.create(-5, Body.getVelocity(this.body).y));
        } else if (keyIsDown(RIGHT_ARROW) && !keyIsDown(LEFT_ARROW)){
            Body.setVelocity(this.body, Vector.create(5, Body.getVelocity(this.body).y));
        } else {
            Body.setVelocity(this.body, Vector.create(Body.getVelocity(this.body).x * 0.9, Body.getVelocity(this.body).y))
        }
        
        if (keyIsDown(UP_ARROW) && (this.jump_time > 0)){
            if ((this.jump_time != pJump_Value) && (Body.getVelocity(this.body).y == 0)){
                this.jump_time = 0;
            }
            Body.setVelocity(this.body, Vector.create(Body.getVelocity(this.body).x, this.jump_time*-1));
        } else {
            this.jump_time -= Math.abs(this.jump_time);
        }
        
        if (this.jump_time == 0){
            Body.setVelocity(this.body, Vector.create(Body.getVelocity(this.body).x, 2));
        }
        
        this.jump_time -= 1;
    }
    show(){// uses p5 to handle rendering
        this.movement();
        let pos = this.body.position;
        let angle = this.body.angle;
        push();
        translate(pos.x, pos.y);
        rotate(angle);

        imageMode(CENTER);
        image(this.img, 0, 0, pWidth, pHeight);
        pop();
    }
}

/*---------------------------------------------------
Floating objects that attach to and follow the player
---------------------------------------------------*/
class Collectible {
    constructor(xSpawn, ySpawn, img) {
        this.xSpawn = xSpawn;
        this.ySpawn = ySpawn;
        this.img = img;
        this.w = cWidth;
        this.h = cHeight;

        this.body = Bodies.rectangle(xSpawn, ySpawn, cWidth, cHeight, {mass: 0});
        Body.setAngularSpeed(this.body, random(-0.05,0.05));
        Body.setVelocity(this.body, Vector.create(random(-0.25,0.25),random(-0.25,0.25)));

        Events.on(engine, "beforeUpdate", ()=>{//neutralizes gravity
            Body.applyForce(this.body, this.body.position, { x: 0, y: -this.body.mass * engine.gravity.y * engine.gravity.scale });
        });

        Composite.add(engine.world, this.body);
    }
    show(){
        let pos = this.body.position;
        let angle = this.body.angle;

        push();
        translate(pos.x, pos.y);
        rotate(angle);

        //rect(0, 0, cWidth, cHeight);
        imageMode(CENTER);
        image(this.img, 0, 0, this.w, this.h);
        pop();
    }
}


/*-----------------------------------------
Invisible objects that act like chain links
-----------------------------------------*/
class Link {
    constructor(bodyA, bodyB, isActive = false){
        this.bodyA = bodyA;
        this.pointA = bodyA.position;
        this.bodyB = bodyB;
        this.isActive = isActive;
        this.stiffness = 0.001;

        this.constraint;

        // Instead of directly attaching the second object (referred to as "body" in matter.js), I attached one of them to a point that follows the first. 
        // This neutralizes the tug on the first object, which would interfere with the controls of the player character otherwise.

        if (this.isActive){
            this.constraint = Constraint.create({
                pointA: this.pointA,
                bodyB: this.bodyB,
                length: 60,
                stiffness: this.stiffness
            });
            Composite.add(engine.world, this.constraint);
        }

        Events.on(engine, "beforeUpdate", ()=>{
            if ((Collision.collides(this.bodyA, this.bodyB) != null) && (!this.isActive)){
                this.constraint = Constraint.create({
                    pointA: this.pointA,
                    bodyB: this.bodyB,
                    length: 120,
                    stiffness: this.stiffness
                });
                Composite.add(engine.world, this.constraint);
                
                this.isActive = true;
            }

            if (this.isActive) {
                this.pointA = bodyA.position;
            }
        });
    }
}

/*-----------------------------------------------------
-Objects that restore the player's jump when landed on.
-------------------------------------------------------
Actually made of 2 boxes, one to function as a surface, 
the other to restore the player's jump when in contact.
-----------------------------------------------------*/
class Platform {
    constructor(img, x, y, w, h = 60){
        this.img = img;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.y2 = y-(h/2);

        this.body = Bodies.rectangle(x, y, w, h, {isStatic: true, friction: 0});
        this.body2 = Bodies.rectangle(x, y-(h/2), w-2, 5, {isStatic: true});//Collision detection slice
        Composite.add(engine.world, this.body);
        Composite.add(engine.world, this.body2);
        ground_collision_list.push(this.body2);
        //game_detector.bodies.push(this.body2);


    }
    show(){
        if (this.img != null){
            var pos = this.body.position;
            var angle = this.body.angle;
            
            push();
            translate(pos.x, pos.y-(this.h/2));
            rotate(angle);
            //rect(0,0,this.w, this.h);
            imageMode(CENTER);
            image(this.img, 0, 0, this.w*1.5, this.w);
            pop();
        }
    }
}

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


    var leftwall = Bodies.rectangle(0, ybound/2, 20, ybound, { isStatic: true }); //map bounds
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