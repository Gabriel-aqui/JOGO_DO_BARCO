class Barco{
    constructor(x, y, width, height, barPos, boatAnimation) {
        this.body = Bodies.rectangle(x, y, width, height)
        this.width = width
        this.height = height
        this.barPos = barPos
        this.animation = boatAnimation
        this.speed = 0.3
        this.broken = false
        World.add(world, this.body);
    }
    display(){
        var angle = this.body.angle
        var pos = this.body.position;
        var index = floor(this.speed%this.animation.length)
        push();
        translate(pos.x, pos.y)
        rotate(angle)
        imageMode(CENTER);
        image(this.animation[index], 0, this.barPos, this.width, this.height);
        pop();
    }
    remove(index) {
        this.animation = brokenBoatAnimation
        this.speed = 8
        this.width = 300
        this.height = 300
        this.broken = true
        setTimeout(() => {
            Matter.World.remove(world, shipMatriz[index].body)
            delete shipMatriz[index]
        }, 2000);
    }
    animate() {
        this.speed += 0.3
    }
}