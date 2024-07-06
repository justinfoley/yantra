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

    var fem2 = new FeminineTriangle(this.circleRadius*3/4, centreX, centreY-50);
    fem2.draw(two);

  }
}

class FeminineTriangle {
  constructor(sideLength, centreX, centreY) {
    this.sideLength = sideLength;
    this.centreX = centreX;
    this.centreY = centreY;

    this.left= [this.centreX - this.sideLength, this.centreY];
    this.right= [this.centreX + this.sideLength, this.centreY]
    this.bottom = [this.centreX, this.centreY + this.sideLength]
  }

    draw(two) {
      var top = two.makeLine(this.left[0], this.left[1], this.right[0], this.right[1]);
      var left = two.makeLine(this.left[0], this.left[1], this.bottom[0], this.bottom[1]);
      var right = two.makeLine(this.right[0], this.right[1], this.bottom[0], this.bottom[1]);
    }
}
