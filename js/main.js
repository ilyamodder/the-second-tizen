var GOLDEN_RATIO = 0.618033988749895;
var score;
var oldColor;
var time;
var isGameStarted = false;
var highscores;
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
    
    $("#main").click(function() {
    	if (!isGameStarted) {
    		newGame();
    	} else if (((time % 1000 <= 15) && (Math.floor(time/1000) == score + 1))
                || ((time % 1000 >= 985) && (Math.floor(time/1000) == score))) {
    		score++;
            refreshScore();

        } else {
        	stopGame();
        }
    });
    $("#highscores").hide();
    $("#tap-to-restart").hide();
    $('.modal').modal();
    
    oldColor = Math.random();
    getHighscores();
};

function refreshTime() {
	var minutes = Math.floor(time / 60000);
	var seconds = (Math.floor(time / 1000) % 60);
	var millis = (Math.floor(time / 10) % 100);
	if (minutes < 10) minutes = "0" + minutes;
	if (seconds < 10) seconds = "0" + seconds;
	if (millis < 10) millis = "0" + millis;
	$("#timer").text(minutes + ":" + seconds + ":" + millis);
}

function refreshScore() {
	$("#score").text(score);
}

function getHighscores() {
	highscores = localStorage.getItem("highscores");
	if (typeof highscores != "undefined") {
		highscores = JSON.parse(highscores);
	} else {
		highscores = [];
	}
	
}

function isHighscore() {
	return score > 0 && (highscores.length == 0 || highscores[highscores.length-1].score < score);
}

function putToHighscores(name) {
	var item = {
			"name": name,
			"score": score
	};
	
	highscores.push(item);
	highscores.sort(function(a, b) {
		if (a.score > b.score) {
			return -1;
		}
		if (a.score < b.score) {
			return 1;
		}
		return 0;
	});
	highscores = highscores.slice(0, 4);
	localStorage.setItem("highscores", JSON.stringify(highscores));
}

function newGame() {
	score = 0;
	time = 0;
	refreshTime();
	refreshScore();
	$("#tap-to-start").hide();
	$("#highscores").hide();
	$("#tap-to-restart").hide();
	$("#highscore").hide();
	
	timer = setInterval(function() {
		if (time % 1000 == 0) {
			if (isGameStarted) {
				setTimeout(function() {
					var newRgbColor = HSVtoRGB(oldColor, 0.5, 0.75);
					$("body").css("background", "rgb(" + newRgbColor.r + "," + newRgbColor.g + "," + newRgbColor.b + ")");
					oldColor += GOLDEN_RATIO;
					if (oldColor > 1) oldColor -= 1;
					newRgbColor = HSVtoRGB(oldColor, 0.5, 0.75);
					$("#background").css("background", "rgb(" + newRgbColor.r + "," + newRgbColor.g + "," + newRgbColor.b + ")");
				}, 0);
				$("#background").stop().css("width", "0%").animate({"width": "+=100%"}, 1000);
			}
		}
		time+=10;
	}, 10);
	isGameStarted = true;
	requestAnimationFrame(onNewFrame);
}

function onNewFrame() {
	refreshTime();
	if (isGameStarted) {
		requestAnimationFrame(onNewFrame);
	}
}

function stopGame() {
	clearInterval(timer);
	isGameStarted = false;
	$("#background").stop();
	$("#highscores").show();
	$("#tap-to-restart").show();
	refreshTime();
	if (isHighscore()) {
		$("#modal1").modal("open");
	}
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