//matter aliasing
var Engine = Matter.Engine,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Body = Matter.Body,
    Vector = Matter.Vector,
    Collision = Matter.Collision,
    Detector = Matter.Detector,
    Query = Matter.Query,
Composite = Matter.Composite;

//matter engine
var engine = Engine.create();
var runner = Runner.create();
Runner.run(runner,engine);

//univeral alliasing
var xbound = 750,
ybound = 750;

//player parameters
var game_player;
var pWidth = 60;
var pHeight = 60;
var pJump_Value = 23;
var pSpawn_x = 200;
var pSpawn_y = 650;

var game_phys_objects = [];
var ground_collision_list = [];

var background_img;

//img loading
function preload(){
    background_img = loadImage('../img/interactive_game_assets_background.png');
    var player;
    var platform;
}

class Player {
    constructor(xSpawn, ySpawn){
        this.body = Bodies.rectangle(xSpawn, ySpawn, pWidth, pHeight, {/*inertia: Infinity*/});
        this.body.friction = 0;
        Composite.add(engine.world, this.body);
        this.jump_time = 0;
    }
    movement(){
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
    show(){
        this.movement();
        var pos = this.body.position;
        var angle = this.body.angle = 0;
        push();
        translate(pos.x, pos.y);
        rotate(angle);

        //debug
        /*
        if (this.jump_time >= -1){
            fill(color(255,0,0));
        }
        */

        rect(0, 0, pWidth, pHeight);
        pop();
    }
}

class Platform {
    constructor(x, y, w, h = 60){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        this.body = Bodies.rectangle(x, y, w, h, {isStatic: true, friction: 0});
        this.body2 = Bodies.rectangle(x, y-(h/2), w-2, 5, {isStatic: true});//Collision detection slice
        Composite.add(engine.world, this.body);
        Composite.add(engine.world, this.body2);
        ground_collision_list.push(this.body2);
        //game_detector.bodies.push(this.body2);


    }
    show(){
        var pos = this.body.position;
        var angle = this.body.angle;

        push();
        translate(pos.x, pos.y);
        rotate(angle);
        rect(0, 0, this.w, this.h);
        pop();
    }
}

class Collectible {
    constructor() {

    }
}

/*tests
class Box {
    constructor(x, y, w, h){
    this.body = Bodies.rectangle(x, y, w, h);
    this.w = w;
    this.h = h;
    Composite.add(engine.world, this.body);
    }
    show(){
        var pos = this.body.position;
        var angle = this.body.angle;

        push();
        translate(pos.x, pos.y);
        rotate(angle);
        rect(0, 0, this.w, this.h);
        pop();
    }

}

function mouseDragged() {
    game_phys_objects.push(new Box(mouseX, mouseY, 20,20));
}*/

var game_player = new Player(pSpawn_x, pSpawn_y);

function setup() {
    createCanvas(xbound, ybound);
    rectMode(CENTER);

    // BUILDS THE MAP GEOMETRY, Main difference between each page
    game_phys_objects.push(
    new Platform(xbound/2, ybound/2, xbound/2), 
    new Platform(xbound*3/4, ybound*3/4, xbound/4),
    new Platform(xbound/4, ybound/4, xbound/2),
    new Platform(xbound/2, ybound+30, xbound, 60),// bottom ground
    );


    var leftwall = Bodies.rectangle(0, 0, 20, 1500, { isStatic: true }); //map bounds
    var rightwall = Bodies.rectangle(xbound, 0, 20, 1500, { isStatic: true });
    Composite.add(engine.world, [leftwall, rightwall]);


}

function draw(){
    background(background_img, 255);
    for (let i = 0; i < game_phys_objects.length; i++) {//showing all the objects in game_phys_objects
        game_phys_objects[i].show();
    }
    game_player.show();
}