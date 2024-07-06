// Make an instance of two and place it on the page.
// import Two from "two.js";
import {Yantra} from "./models.mjs";

var params = {
  fullscreen: true
};
var elem = document.body;


var two = new Two(params).appendTo(elem);

var yantra = new Yantra(1, 2);
yantra.draw(two);

// Two.js has convenient methods to make shapes and insert them into the scene.
// var radius = 50;
// var x = two.width * 0.5;
// var y = two.height * 0.5 - radius * 1.25;
// var circle = two.makeCircle(x, y, radius);

// y = two.height * 0.5 + radius * 1.25;
// var width = 100;
// var height = 100;
// var rect = two.makeRectangle(x, y, width, height);
//
// // The object returned has many stylable properties:
// circle.fill = '#FF8000';
// // And accepts all valid CSS color:
// circle.stroke = 'orangered';
// circle.linewidth = 5;
//
// rect.fill = 'rgb(0, 200, 255)';
// rect.opacity = 0.75;
// rect.noStroke();

// Don’t forget to tell two to draw everything to the screen
two.update();