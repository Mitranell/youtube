var snow = function(dom, tool) {
    var c = {};
    c.c = document.getElementById("snowCanvas");
    c.ctx = c.c.getContext("2d");
    this.resize = function() {
        c.c.width = tool.get.ww();
        c.c.height = tool.get.wh();
    };
    //snowflake particles
    var mp = 50; //max particles
    var particles = [];
    for (var i = 0; i < mp; i++) {
        particles.push({
            x: Math.random() * c.c.width, //x-coordinate
            y: Math.random() * c.c.height, //y-coordinate
            r: Math.random() * 4 + 1, //radius
            d: Math.random() * mp //density
        });
    }
    var angle = 0;
    function update() {
        angle += 0.01;
        for (var i = 0; i < mp; i++) {
            var p = particles[i];
            p.y += Math.cos(angle + p.d) + 1 + p.r / 2;
            p.x += Math.sin(angle) * 2;
            if (p.x > c.c.width + 5 || p.x < -5 || p.y > c.c.height) {
                if (i % 3 > 0) //66.67% of the flakes
                {
                    particles[i] = {
                        x: Math.random() * c.c.width,
                        y: -10,
                        r: p.r,
                        d: p.d
                    };
                } else {
                    //If the flake is exitting from the right
                    if (Math.sin(angle) > 0) {
                        //Enter from the left
                        particles[i] = {
                            x: -5,
                            y: Math.random() * c.c.height,
                            r: p.r,
                            d: p.d
                        };
                    } else {
                        //Enter from the right
                        particles[i] = {
                            x: c.c.width + 5,
                            y: Math.random() * c.c.height,
                            r: p.r,
                            d: p.d
                        };
                    }
                }
            }
        }
    }
    this.render = function() {
        c.ctx.clearRect(0, 0, c.c.width, c.c.height);

        c.ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        c.ctx.beginPath();
        for (var i = 0; i < mp; i++) {
            var p = particles[i];
            c.ctx.moveTo(p.x, p.y);
            c.ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2, true);
        }
        c.ctx.fill();
        update();
    };
};
module.exports = snow;
