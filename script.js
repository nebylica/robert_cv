// Animated skills donut charts


let Dial = function(container) {
    this.container = container;
    this.size = this.container.dataset.size;
    this.strokeWidth = this.size / 8;
    // this.radius = (this.size / 2) - (this.strokeWidth / 2);
    this.value = this.container.dataset.value;
    // this.direction = this.container.dataset.arrow;
    this.svg;
    this.defs;
    this.slice;
    this.overlay;
    this.text;
    this.create();
}

Dial.prototype.create = function() {
    this.createSvg();
    this.createDefs();
    this.createSlice();
    this.createOverlay();
    this.createText();
    this.container.appendChild(this.svg);
};

Dial.prototype.createSvg = function() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute('width', this.size + 'px');
    svg.setAttribute('height', this.size + 'px');
    this.svg = svg;
};

Dial.prototype.createDefs = function() {
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    const linearGradient = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
    linearGradient.setAttribute('id', 'gradient');
    const stop = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    stop.setAttribute('stop-color', '#F5E9DC');
    stop.setAttribute('offset', '0%');
    linearGradient.appendChild(stop);
    const linearGradientBackground = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
    linearGradientBackground.setAttribute('id', 'gradient-background');
    const stop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    stop1.setAttribute('stop-color', 'rgba(37, 54, 89, 0.3)');
    stop1.setAttribute('offset', '0%');
    linearGradientBackground.appendChild(stop1);
    defs.appendChild(linearGradient);
    defs.appendChild(linearGradientBackground);
    this.svg.appendChild(defs);
    this.defs = defs;
};

Dial.prototype.createSlice = function() {
    const slice = document.createElementNS("http://www.w3.org/2000/svg", "path");
    slice.setAttribute('fill', 'none');
    slice.setAttribute('stroke', 'url(#gradient)');
    slice.setAttribute('stroke-width', this.strokeWidth);
    slice.setAttribute('transform', 'translate(' + this.strokeWidth / 2 + ',' + this.strokeWidth / 2 + ')');
    slice.setAttribute('class', 'animate-draw');
    this.svg.appendChild(slice);
    this.slice = slice;
};

Dial.prototype.createOverlay = function() {
    const r = this.size - (this.size / 2) - this.strokeWidth / 2;
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute('cx', String(this.size / 2) );
    circle.setAttribute('cy', String(this.size / 2));
    circle.setAttribute('r', String(r));
    circle.setAttribute('fill', 'url(#gradient-background)');
    this.svg.appendChild(circle);
    this.overlay = circle;
};

Dial.prototype.createText = function() {
    const fontSize = this.size / 4.5;
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute('x', String((this.size / 2) + fontSize / 7.5));
    text.setAttribute('y',  String((this.size / 2) + fontSize / 4));
    text.setAttribute('font-family', 'Open Sans, sans-serif');
    text.setAttribute('font-size', String(fontSize));
    text.setAttribute('fill', '#F5E9DC');
    text.setAttribute('text-anchor', 'middle');
    const tspanSize = fontSize / 3;
    text.innerHTML = 0 + '<tspan font-size="' + tspanSize + '" dy="' + -tspanSize * 1.2 + '">%</tspan>';
    this.svg.appendChild(text);
    this.text = text;
};

Dial.prototype.animateStart = function() {
    let v = 0;
    const self = this;
    const intervalOne = setInterval(function() {
        const p = +(v / self.value).toFixed(2);
        const a = (p < 0.95) ? 2 - (2 * p) : 0.05;
        v += a;
        // Stop
        if(v >= +self.value) {
            v = self.value;
            clearInterval(intervalOne);
        }
        self.setValue(v);
    }, 10);
};

Dial.prototype.polarToCartesian = function(centerX, centerY, radius, angleInDegrees) {
    const angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;
    return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
    };
}

Dial.prototype.describeArc = function(x, y, radius, startAngle, endAngle){
    const start = this.polarToCartesian(x, y, radius, endAngle);
    const end = this.polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return [
        "M", start.x, start.y,
        "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");
}

Dial.prototype.setValue = function(value) {
    let c = (value / 100) * 360;
    if(c === 360)
        c = 359.99;
    const xy = this.size / 2 - this.strokeWidth / 2;
    const d = this.describeArc(xy, xy, xy, 180, 180 + c);
    this.slice.setAttribute('d', d);
    const tspanSize = (this.size / 3.5) / 3;
    this.text.innerHTML = Math.floor(value) + '<tspan font-size="' + tspanSize + '" dy="' + -tspanSize * 1.2 + '">%</tspan>';
};


const containers = document.getElementsByClassName("chart");
const triggerBottom = window.innerHeight / 4 * 3

let dial0 = new Dial(containers[0]);
let dial1 = new Dial(containers[1]);
let dial2 = new Dial(containers[2]);
let dial3 = new Dial(containers[3]);

window.addEventListener('scroll', skillsDonutChart)

function skillsDonutChart() {

    for (let i = 0; i < containers.length; i++) {
        const containersTop = containers[i].getBoundingClientRect().top

        if(containersTop < triggerBottom) {
            window.removeEventListener('scroll', skillsDonutChart)
            dial0.animateStart();
            dial1.animateStart();
            dial2.animateStart();
            dial3.animateStart();
        }
    }
}


// Experience fade effect

const expBox1 = document.getElementsByClassName("exp1");
const expBox2 = document.getElementsByClassName("exp2");
const expBox3 = document.getElementsByClassName("exp3");

window.addEventListener('scroll', () => {
    boxesFadeIn(expBox1[0])
})
window.addEventListener('scroll', () => {
    boxesFadeIn(expBox2[0])
})
window.addEventListener('scroll', () => {
    boxesFadeIn(expBox3[0])
})


function boxesFadeIn(element) {
    const boxesTop = element.getBoundingClientRect().top

    if(boxesTop < triggerBottom) {
        element.classList.add('fadeIn')
    }
}













