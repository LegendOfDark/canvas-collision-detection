const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particleArr = [];

//handle mouse
const mouse = {
    x: null,
    y: null,
    radius: 150
}

window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
    // console.log(mouse.x, mouse.y)
});


let Particle = (x, y, radius, color) => { 
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
}