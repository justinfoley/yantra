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

    let yOffset = Math.sin(2 * Math.PI / 24) * this.circleRadius;
    let xOffset = Math.cos(2 * Math.PI / 24) * this.circleRadius;
    let topFem1 = [centreX, centreY - yOffset];
    // let topFem1 = [centreX, centreY];

    let bottomMasc1 = [centreX, centreY + yOffset];

    // var fem1 = new FeminineTriangle2(xOffset, topFem1[0], topFem1[1], this.circleRadius);
    var fem1 = new FeminineTriangle(centreX, centreY , this.circleRadius, xOffset, yOffset);
    fem1.draw(two);

    var masc1 = new MasculineTriangle(centreX, centreY , this.circleRadius, xOffset, yOffset);
    masc1.draw(two);

    // var fem2 = new FeminineTriangle(centreX, centreY , this.circleRadius, xOffset, yOffset);
    // fem2.draw(two);

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
  constructor(centreX, centreY, radius, xOffset, yOffset) {
    let left= [centreX - xOffset, centreY - yOffset];
    let right= [centreX + xOffset, centreY - yOffset]
    let bottom = [centreX, centreY + radius]

    let points = [left, right, bottom];

    super(points);

    this.left = left;
    this.right = right;
    this.bottom = bottom;
  }
}

class MasculineTriangle extends Triangle {
  constructor(centreX, centreY, radius, xOffset, yOffset) {
    let left= [centreX - xOffset, centreY + yOffset];
    let right= [centreX + xOffset, centreY + yOffset]
    let bottom = [centreX, centreY - radius]

    let points = [left, right, bottom];

    super(points);

    this.left = left;
    this.right = right;
    this.bottom = bottom;
  }
}
