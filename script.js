const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

var today = new Date();
var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
console.log(time);

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//handle mouse
const mouse = {
    x: null,
    y: null,
    radius: 150
}

function rotate(velocity, angle) {
    const rotatedVelocities = {
        x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
        y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
    };

    return rotatedVelocities;
}

function resolveCollision(particle, otherParticle) {
    const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
    const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;

    const xDist = otherParticle.x - particle.x;
    const yDist = otherParticle.y - particle.y;

    // Prevent accidental overlap of particles
    if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {

        // Grab angle between the two colliding particles
        const angle = -Math.atan2(otherParticle.y - particle.y, otherParticle.x - particle.x);

        // Store mass in var for better readability in collision equation
        const m1 = particle.mass;
        const m2 = otherParticle.mass;

        // Velocity before equation
        const u1 = rotate(particle.velocity, angle);
        const u2 = rotate(otherParticle.velocity, angle);

        // Velocity after 1d collision equation
        const v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
        const v2 = { x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m1 / (m1 + m2), y: u2.y };

        // Final velocity after rotating axis back to original location
        const vFinal1 = rotate(v1, -angle);
        const vFinal2 = rotate(v2, -angle);

        // Swap particle velocities for realistic bounce effect
        particle.velocity.x = vFinal1.x;
        particle.velocity.y = vFinal1.y;

        otherParticle.velocity.x = vFinal2.x;
        otherParticle.velocity.y = vFinal2.y;
    }
}


window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
    // console.log(mouse.x, mouse.y)
});

let random_boolean = () => Math.random() < 0.5;

function random(min, max, minus) {
    let res = Math.floor(Math.random() * (max - min) + min)
    if (minus) { 
      negation = Math.random() < 0.5 ? -1 : 1
      return res * negation
    }
    return res
  }


// calculate the distance between two objects
let dstnc = (x1, y1, x2, y2) => {
    dstnc_x = x2 - x1;
    dstnc_y = y2 - y1;
    return Math.hypot(dstnc_x, dstnc_y);
}

// make a particle
function Particle(x, y, radius, color){ 
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.mass = 1 // random(1, 4, random_boolean());
    this.velocity = {
        x: random(1, 4, random_boolean()),
        y: random(1, 4, random_boolean()),
    }

    this.update = particleArr => {
        for(let i = 0; i < particleArr.length; i++){
            if (this === particleArr[i]) continue;
            if (dstnc(this.x, this.y , particleArr[i].x, particleArr[i].y) < radius * 2){
                resolveCollision(this, particleArr[i]);
            }
        }

        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.draw();


        if (this.x - this.radius < 0 || this.x + this.radius > canvas.width) this.velocity.x = -this.velocity.x;
        if (this.y - this.radius < 0 || this.y + this.radius > canvas.height) this.velocity.y = -this.velocity.y;
    }

    this.draw = () => {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.strokeStyle = this.color;
        c.stroke();
        c.closePath();
    }

}

let particleArr = [];

let init = () => {
    particleArr = [];

    let particle_num = 100;
    for (let i = 0; i < particle_num; i++){
        const radius = 15;
        let x = random(radius, canvas.width - radius, false);
        let y = random(radius, canvas.height - radius, false);
        const color = 'blue';

        // never spawn the balls in same place
        if (i !== 0){
            for (let j = 0; j < particleArr.length; j++){
                if (dstnc(x, y, particleArr[j].x, particleArr[j].y) - radius * 2 < 0){
                    x = random(radius, canvas.width - radius, false);
                    y = random(radius, canvas.height - radius, false);
                    j = -1;
                }

            }
        }


        particleArr.push(new Particle(x, y, radius, color));
    }

}

let animate = () => {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);
    particleArr.forEach(particle => particle.update(particleArr));
}
init();
animate();