import {Stage0, Stage1, Stage2, Stage3} from "./stages.mjs";

export class Yantra {
  constructor(circleRadius, two) {
    this.centreX = two.width * 0.5;
    this.centreY = two.height * 0.5;
    this.centre = new Point(this.centreX, this.centreY);
    this.circleRadius = 300;
    this.objects = []
    this.two = two;

    let revealTime = 50;
    this.stage0 = new Stage0(two, revealTime, this);

    revealTime += 50;
    this.stage1 = new Stage1(two, revealTime, this);

    revealTime += 200;
    this.stage2 = new Stage2(two, revealTime, this);

    revealTime += 200;
    this.stage3 = new Stage3(two, revealTime, this);

    // Hide everything at first - so we can layer animation on existing shapes
    this.two.scene.children.forEach(function(shape) {
      shape.visible = false;
    });
  }

  getCircleWidthForHeight(radius, height) {
    return Math.sqrt(Math.pow(radius, 2) - Math.pow(height, 2));
  }

  draw(two, frameCount) {
    this.stage0.update(frameCount);
    this.stage1.update(frameCount);
    this.stage2.update(frameCount);
    this.stage3.update(frameCount);
  }

}

export class Triangle {
  constructor(points) {
    this.points = points;
    this.one = new Point(points[0][0], points[0][1]);
    this.two = new Point(points[1][0], points[1][1]);
    this.three = new Point(points[2][0], points[2][1]);

    this.horizontalLine = new Line(this.points[0][0], this.points[0][1], this.points[1][0], this.points[1][1]);
    this.leftLine = new Line(this.points[0][0], this.points[0][1], this.points[2][0], this.points[2][1]);
    this.rightLine = new Line(this.points[1][0], this.points[1][1], this.points[2][0], this.points[2][1]);
  }

  static fromPoints(one, two, three) {
    return new Triangle([[one.x, one.y], [two.x, two.y], [three.x, three.y]]);
  }

  draw(two) {
    console.log("points: " + this.points);
    var top = two.makeLine(this.points[0][0], this.points[0][1], this.points[1][0], this.points[1][1]);
    var left = two.makeLine(this.points[0][0], this.points[0][1], this.points[2][0], this.points[2][1]);
    var right = two.makeLine(this.points[1][0], this.points[1][1], this.points[2][0], this.points[2][1]);
    let group = two.makeGroup(top, left, right);
    return group;
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

export class FeminineTriangle2 extends Triangle {
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

export class MasculineTriangle2 extends Triangle {
  constructor(centreX, centreY, radius, xOffset, yOffsetStart, yOffsetEnd) {
    let left= [centreX - xOffset, centreY + yOffsetStart];
    let right= [centreX + xOffset, centreY + yOffsetStart]
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

export class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  draw(two) {
    let circle = two.makeCircle(this.x, this.y, 3);
    circle.stroke = 'black';
    circle.linewidth = 3;
    return circle;
  }

  toString() {
    return `Point(${this.x}, ${this.y})`;
  }

  rotate(angle, centre) {
    return new Point(
        centre.x + (this.x - centre.x) * Math.cos(angle) - (this.y - centre.y) * Math.sin(angle),
        centre.y + (this.x - centre.x) * Math.sin(angle) + (this.y - centre.y) * Math.cos(angle)
    );
  }
}

export class Line {
  constructor(startX, startY, endX, endY) {
    this.startX = startX;
    this.startY = startY;
    this.endX = endX;
    this.endY = endY;

    this.start = new Point(startX, startY);
    this.end = new Point(endX, endY);
  }

  draw(two) {
    let line = two.makeLine(this.startX, this.startY, this.endX, this.endY);
    line.dashes = [3, 3];
    return line;
  }

  static fromPoints(start, end) {
    return new Line(start.x, start.y, end.x, end.y);
  }

  toString() {
    return `Line(${this.startX}, ${this.startY}, ${this.endX}, ${this.endY})`;
  }

  intersection(line){
        // Line AB represented as a1x + b1y = c1
        var a1 = this.endY - this.startY;
        var b1 = this.startX - this.endX;
        var c1 = a1*this.startX + b1*this.startY;

        // Line CD represented as a2x + b2y = c2
        var a2 = line.endY - line.startY;
        var b2 = line.startX - line.endX;
        var c2 = a2*line.startX + b2*line.startY;

        var determinant = a1*b2 - a2*b1;

        if (determinant === 0)
        {
            // The lines are parallel. This is simplified
            // by returning a pair of FLT_MAX
            return null;
        }
        else
        {
            var x = (b2*c1 - b1*c2)/determinant;
            var y = (a1*c2 - a2*c1)/determinant;
            return new Point(x, y);
        }
    }

  extendToYPoint(y) {
    let yLen = this.endY - this.startY;
    let xLen = this.endX - this.startX;
    let gradient = yLen / xLen;

    let angle = Math.atan2(yLen, xLen);
    // if(angle > Math.PI / 2) {
    angle = Math.PI / 2 - angle;
    // }

    let newX = this.startX + Math.tan(angle) * (y - this.startY);

    return new Point(newX, y);
  }

  extendToY(y) {
    let yLen = this.endY - this.startY;
    let xLen = this.endX - this.startX;
    let gradient = yLen / xLen;

    let angle = Math.atan2(yLen, xLen);
    // if(angle > Math.PI / 2) {
    angle = Math.PI / 2 - angle;
    // }

    let newX = this.startX + Math.tan(angle) * (y - this.startY);

    let start = new Point(this.startX, this.startY);
    if(Math.abs(y - this.endY) > Math.abs(y - this.startY)) {
      start = new Point(this.endX, this.endY);
    }

    return Line.fromPoints(start, new Point(newX, y));
  }

  lengthen(factor) {
    let yLen = this.endY - this.startY;
    let xLen = this.endX - this.startX;
    let gradient = yLen / xLen;

    let length = (factor / 2) * Math.sqrt(Math.pow(xLen, 2) + Math.pow(yLen, 2));

    let angle = Math.atan2(yLen, xLen);
    // if(angle > Math.PI / 2) {
    // angle = Math.PI / 2 - angle;
    // }

    // let newX = this.startX + Math.tan(angle) * (y - this.startY);
    //
    // let start = new Point(this.startX, this.startY);
    // if(Math.abs(y - this.endY) > Math.abs(y - this.startY)) {
    //   start = new Point(this.endX, this.endY);
    // }
    //
    // return Line.fromPoints(start, new Point(newX, y));

    let newStart = new Point(this.startX - length * Math.cos(angle), this.startY - length * Math.sin(angle));
    let newEnd = new Point(this.endX + length * Math.cos(angle), this.endY + length * Math.sin(angle));

    return Line.fromPoints(newStart, newEnd);
  }
}
