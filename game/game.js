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

//player dimensions
var pWidth = 60;
var pHeight = 60;
var pFloatVal = 23;

var game_phys_objects = [];
//var game_detector = Detector.create();
var ground_collision_list = [];

class Player {
    constructor(){
        this.body = Bodies.rectangle(200, 650, pWidth, pHeight, {inertia: Infinity, /*frictionAir: 0*/});
        Composite.add(engine.world, this.body);
        this.float = 0;
        //game_detector.bodies.push(this.body);
    }
    movement(){
        let pos = this.body.position;
        for (let i = 0; i < ground_collision_list.length; i++) {
            if (Collision.collides(this.body, ground_collision_list[i]) != null){
                this.float = pFloatVal;
                break;
                /*optimization oppertunity: 
                before setting i to length, swap ground_collision_list[0] with g_c_l[i] 
                to reduce number of loops when resting on a surface
                */
            }
        }

        if (keyIsDown(LEFT_ARROW) && !keyIsDown(RIGHT_ARROW)){
            Body.setVelocity(this.body, Vector.create(-5, Body.getVelocity(this.body).y));
        } else if (keyIsDown(RIGHT_ARROW) && !keyIsDown(LEFT_ARROW)){
            Body.setVelocity(this.body, Vector.create(5, Body.getVelocity(this.body).y));
        } else {
            Body.setVelocity(this.body, Vector.create(Body.getVelocity(this.body).x * 0.9, Body.getVelocity(this.body).y))
        }
        
        if (keyIsDown(UP_ARROW) && (this.float > 0)){
            if ((this.float != pFloatVal) && (Body.getVelocity(this.body).y == 0)){
                this.float = 0;
            }
            Body.setVelocity(this.body, Vector.create(Body.getVelocity(this.body).x, this.float*-1));
        } else {
            this.float -= Math.abs(this.float);
        }
        
        if (this.float == 0){
            Body.setVelocity(this.body, Vector.create(Body.getVelocity(this.body).x, 1));
        }
        
        this.float -= 1;
    }
    show(){
        this.movement();
        var pos = this.body.position;
        var angle = this.body.angle = 0;
        push();
        translate(pos.x, pos.y);
        rotate(angle);
        if (this.float > 0){
            fill(color(255,0,0));
        }
        rect(0, 0, 60, 60);
        pop();
    }
}
var game_player = new Player();

class Platform {
    constructor(player, x, y, w, h = 60){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.player = player;

        this.body = Bodies.rectangle(x, y, w, h, {isStatic: true});
        this.body2 = Bodies.rectangle(x, y-(h/2), w-2, 2, {isStatic: true});//Collision detection slice
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

// BUILDS THE MAP GEOMETRY
game_phys_objects.push(
    new Platform(game_player, xbound/2, ybound/2, xbound/2), 
    new Platform(game_player, xbound*3/4, ybound*3/4, xbound/4),
    new Platform(game_player, xbound/2, ybound+30, xbound, 60),//ground
);

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

function setup() {
    createCanvas(xbound, ybound);
    rectMode(CENTER);
    //create all objects
    //create world
    //add all bodies to the world
    //runner

    //test first
    var leftwall = Bodies.rectangle(0, 0, 20, 1500, { isStatic: true });
    var rightwall = Bodies.rectangle(xbound, 0, 20, 1500, { isStatic: true });
    Composite.add(engine.world, [leftwall, rightwall]);


}

function draw(){
    background(51);
    for (let i = 0; i < game_phys_objects.length; i++) {//showing all the objects in game_phys_objects
        game_phys_objects[i].show();
    }
    game_player.show();
}