export class Yantra {
  constructor(circleRadius) {
    this.circleRadius = 300;
    this.objects = []
  }

  draw(two) {
    var centreX = two.width * 0.5;
    var centreY = two.height * 0.5; // - this.circleRadius * 1.25;
    var circle = two.makeCircle(centreX, centreY, this.circleRadius);
    circle.stroke = 'orangered';
    circle.linewidth = 5;
    // circle.fill = '#FF8000';

    var bindu = two.makeCircle(centreX, centreY, 3);
    bindu.stroke = 'black';
    bindu.linewidth = 3;

    var fem1 = new FeminineTriangle(this.circleRadius, centreX, centreY);
    fem1.draw(two);

    var masc1 = new MasculineTriangle(this.circleRadius, centreX, centreY);
    masc1.draw(two);

    var fem2 = new FeminineTriangle(this.circleRadius*3/4, centreX, centreY-50);
    fem2.draw(two);

  }
}

class Triangle {
  constructor(points) {
    this.points = points;
  }

  draw(two) {
    var top = two.makeLine(this.points[0][0], this.points[0][1], this.points[1][0], this.points[1][1]);
    var left = two.makeLine(this.points[0][0], this.points[0][1], this.points[2][0], this.points[2][1]);
    var right = two.makeLine(this.points[1][0], this.points[1][1], this.points[2][0], this.points[2][1]);
  }
}

class FeminineTriangle extends Triangle {
  constructor(sideLength, centreX, centreY) {
    let left= [centreX - sideLength, centreY];
    let right= [centreX + sideLength, centreY]
    let bottom = [centreX, centreY + sideLength]
    let points = [left, right, bottom];

    super(points);

    this.sideLength = sideLength;
    this.centreX = centreX;
    this.centreY = centreY;

    this.left = left;
    this.right = right;
    this.bottom = bottom;
  }
}

class MasculineTriangle extends Triangle {
  constructor(sideLength, centreX, centreY) {
    let left= [centreX - sideLength, centreY];
    let right= [centreX + sideLength, centreY]
    let top = [centreX, centreY - sideLength]
    let points = [left, right, top];

    super(points);

    this.sideLength = sideLength;
    this.centreX = centreX;
    this.centreY = centreY;

    this.left = left;
    this.right = right;
    this.top = top;
  }
}
