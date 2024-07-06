export class Yantra {
  constructor(name, year) {
    this.name = name;
    this.year = year;
  }

  draw(two) {
    var radius = 50;
    var x = two.width * 0.5;
    var y = two.height * 0.5 - radius * 1.25;
    var circle = two.makeCircle(x, y, radius);
  }
}
