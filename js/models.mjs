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
    console.log("two.width: " + two.width);
    console.log("two.height: " + two.height);
    console.log("centreX: " + centreX);
    console.log("centreY: " + centreY);
    console.log("circleRadius: " + this.circleRadius);

    var bindu = two.makeCircle(centreX, centreY, 3);
    bindu.stroke = 'black';
    bindu.linewidth = 3;

    let yOffset = Math.sin(2 * Math.PI / 24) * this.circleRadius;
    let xOffset = Math.cos(2 * Math.PI / 24) * this.circleRadius;
    console.log("xOffset: " + xOffset);
    console.log("yOffset: " + yOffset);


    var fem1 = new FeminineTriangle2(centreX, centreY , this.circleRadius, xOffset, this.circleRadius * 18 / 24, this.circleRadius * -3 / 24);
    fem1.draw(two);

    let yOffset2 = Math.sin(2 * Math.PI / 12) * this.circleRadius;
    let xOffset2 = Math.cos(2 * Math.PI / 12) * this.circleRadius;
    console.log("xOffset2: " + xOffset2);
    console.log("yOffset2: " + yOffset2);

    let boxX = Math.cos(2 * Math.PI / 8) * this.circleRadius;

    let fem2 = new FeminineTriangle2(centreX, centreY , this.circleRadius - yOffset2, boxX, this.circleRadius * 12 / 24, this.circleRadius * -18 / 24);
    fem2.draw(two);

    let fem3 = new FeminineTriangle2(centreX, centreY , this.circleRadius - yOffset2, boxX, this.circleRadius * 7 / 24, this.circleRadius * -24 / 24);
    fem3.draw(two);

    let fem4 = new FeminineTriangle2(centreX, centreY , this.circleRadius - yOffset2, boxX, this.circleRadius * 4 / 24, this.circleRadius * -12 / 24);
    fem4.draw(two);

    let fem5 = new FeminineTriangle2(centreX, centreY , this.circleRadius - yOffset2, boxX, this.circleRadius * 1 / 24, this.circleRadius * -6 / 24);
    fem5.draw(two);

    // var masc1 = new MasculineTriangle(centreX, centreY , this.circleRadius, xOffset, this.circleRadius * 18 / 24);
    // masc1.draw(two);
    //
    // var masc2 = new MasculineTriangle(centreX, centreY , this.circleRadius, xOffset, this.circleRadius * 12 / 24);
    // masc2.draw(two);
    //
    // var masc3 = new MasculineTriangle(centreX, centreY , this.circleRadius, xOffset, this.circleRadius * 6 / 24);
    // masc3.draw(two);
    //
    // var masc4 = new MasculineTriangle(centreX, centreY , this.circleRadius, xOffset, this.circleRadius * 3 / 24);
    // masc4.draw(two);

  }
}

class Triangle {
  constructor(points) {
    this.points = points;
  }

  draw(two) {
    console.log("points: " + this.points);
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

class FeminineTriangle2 extends Triangle {
  constructor(centreX, centreY, radius, xOffset, yOffsetStart, yOffsetEnd) {
    let left= [centreX - xOffset, centreY - yOffsetStart];
    let right= [centreX + xOffset, centreY - yOffsetStart]
    let bottom = [centreX, centreY - yOffsetEnd]

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
