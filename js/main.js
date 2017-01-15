var GOLDEN_RATIO = 0.618033988749895;
var score;
var oldColor;
var time;
var isGameStarted = false;

var timer;

window.onload = function() {
    // TODO:: Do your initialization job

    // add eventListener for tizenhwkey
    document.addEventListener('tizenhwkey', function(e) {
        if (e.keyName === "back") {
            try {
                tizen.application.getCurrentApplication().exit();
            } catch (ignore) {}
        }
    });
    
    $("body").click(function() {
    	if (!isGameStarted) {
    		newGame();
    	} else if (((time % 1000 <= 10) && (time/1000 == score + 1))
                || ((time % 1000 >= 990) && (time/1000 == score))) {
            refreshScore();

        } else {
        	stopGame();
        }
    });
    
    oldColor = 195/360;
};

function refreshTime() {
	
}

function refreshScore() {
	
}

function newGame() {
	score = 0;
	time = 0;
	refreshTime();
	refreshScore();
	
	timer = setInterval(function() {
		refreshTime();
		if (time % 1000 == 0) {
			if (isGameStarted) {
				setTimeout(function() {
					var newRgbColor = HSVtoRGB(oldColor, 0.5, 0.8);
					$("body").css("background", "rgb(" + newRgbColor.r + "," + newRgbColor.g + "," + newRgbColor.b + ")");
					oldColor += GOLDEN_RATIO;
					if (oldColor > 1) oldColor -= 1;
					newRgbColor = HSVtoRGB(oldColor, 0.5, 0.8);
					$("#background").css("background", "rgb(" + newRgbColor.r + "," + newRgbColor.g + "," + newRgbColor.b + ")");
				}, 0);
				$("#background").css("width", "0%");
				$("#background").animate({"width": "+=100%"}, 1000);
			}
		}
		time+=10;
	}, 10);
	isGameStarted = true;
}

function stopGame() {
	clearInterval(timer);
	isGameStarted = false;
	$("#background").stop();
	refreshTime();
}

/* accepts parameters
 * h  Object = {h:x, s:y, v:z}
 * OR 
 * h, s, v
*/
function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}