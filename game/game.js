/* TODO
Using p5:
    Render visuals
Using matter:
    Do the math for collision
*/

class GameObject {
    constructor(xp, yp, xb, yb){
        this.x_pos = xp;//tracks position, updates
        this.y_pos = yp;

        this.x_vel = 0;//tracks velocity, updates
        this.y_vel = 0;

        this.x_bound = xb;//tracks bounding box, usually does not update
        this.y_bound = yb;
    }
}

class Player extends GameObject {
    constructor(xp, yp, xb, yb){
        super(xp, yp, xb, yb);
        this.isGrounded;//boolean to tell if a player is grounded
    }

    player_phys(){}//handles collisions, physics, and actual movement.
    player_move(){}//handles movement inputs, used in phys
    player_jump(){}//handles jumping inputs, used in phys
}

class Collectible extends GameObject {//initially static object, follows player after being collected
    constructor(xp, yp, xb, yb){
        super(xp, yp, xb, yb);
        this.isCollected;
        this.angle; //when connected to the player, this object will trail behind
    }
}

class Brush extends GameObject {//completely static object, collides with player
    constructor(xp, yp, xb, yb){
        super(xp, yp, xb, yb);
    }
}


/* In setup, initialize all objects*/
function setup(){
    createCanvas(1200,800);
}

/* During draw, follow matter calcs until goal is reached, then open() next page */
function draw(){
    background(200);
}