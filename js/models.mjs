export class Yantra {
  constructor(circleRadius, two) {
    this.circleRadius = 300;
    this.objects = []
    this.two = two;

    let revealTime = 50;
    this.stage0 = new Stage0(two, revealTime, this.circleRadius);

    revealTime += 50;
    this.stage1 = new Stage1(two, revealTime, this.circleRadius);

    revealTime += 1000;
    this.fullStage = new FullStage(two, revealTime);

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
    this.fullStage.update(frameCount);
  }

}

class Triangle {
  constructor(points) {
    this.points = points;
    this.one = new Point(points[0][0], points[0][1]);
    this.two = new Point(points[1][0], points[1][1]);
    this.three = new Point(points[2][0], points[2][1]);
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

class MasculineTriangle2 extends Triangle {
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

class Point {
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
}

class Line {
  constructor(startX, startY, endX, endY) {
    this.startX = startX;
    this.startY = startY;
    this.endX = endX;
    this.endY = endY;
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

}

class BaseStage {
  constructor(two, revealTime) {
    this.two = two;
    this.revealTime = revealTime;
    this.revealedShapes = new Map();
    this.hiddenShapes = new Map();
  }

  addRevealedShape(shape, time) {
    let shapes = this.revealedShapes.get(time);
    if (shapes) {
      shapes.push(shape);
    } else {
      shapes = [shape]
    }
    this.revealedShapes.set(time, shapes);
  }

  addHiddenShape(shape, time) {
    let shapes = this.hiddenShapes.get(time);
    if (shapes) {
      shapes.push(shape);
    } else {
      shapes = [shape]
    }
    this.hiddenShapes.set(time, shapes);
  }

  update(frameCount) {
    var that = this;
    this.revealedShapes.forEach((shapes, time) => {
      if(frameCount >= that.revealTime + time) {
        shapes.forEach(
            (shape)=> {
              shape.visible = true;
            }
        );
      }
    });

    this.hiddenShapes.forEach((shapes, time) => {
      if(frameCount >= that.revealTime + time) {
        shapes.forEach(
            (shape)=> {
              shape.visible = false;
            }
        );
      }
    });
  }
}

class Stage0 extends BaseStage {
  constructor(two, revealTime, circleRadius) {
    super(two, revealTime);

    var centreX = two.width * 0.5;
    var centreY = two.height * 0.5; // - this.circleRadius * 1.25;

    this.centreX = centreX;
    this.centreY = centreY;

    this.circleRadius = circleRadius;
    this.circle = two.makeCircle(centreX, centreY, this.circleRadius);
    this.circle.stroke = 'orangered';
    this.circle.linewidth = 5;
    this.circle.visible = false;
    // circle.fill = '#FF8000';
    // console.log("two.width: " + two.width);
    // console.log("two.height: " + two.height);
    // console.log("centreX: " + centreX);
    // console.log("centreY: " + centreY);
    // console.log("circleRadius: " + this.circleRadius);

    this.bindu = two.makeCircle(centreX, centreY, 3);
    this.bindu.stroke = 'black';
    this.bindu.linewidth = 3;
    this.bindu.visible = false;

    this.addRevealedShape(this.circle, 0);
    this.addRevealedShape(this.bindu, 50);
  }
}

class Stage1 extends BaseStage {
  constructor(two, revealTime, circleRadius) {
    super(two, revealTime);

    var centreX = two.width * 0.5;
    var centreY = two.height * 0.5; // - this.circleRadius * 1.25;

    this.centreX = centreX;
    this.centreY = centreY;

    this.circleRadius = circleRadius;

    let stage1GroupTemporary1 = two.makeGroup();
    stage1GroupTemporary1.visible = false;

    let clockPoints = [];
    for(let i= 0; i < 12; i++) {
      let point = this.pointOnCircle(i);
      clockPoints.push(point);
      stage1GroupTemporary1.add(point.draw(two));
    }

    let topLeftLine = Line.fromPoints(clockPoints[0], clockPoints[9]);
    stage1GroupTemporary1.add(topLeftLine.draw(two));

    let bottomLeftLine = Line.fromPoints(clockPoints[6], clockPoints[10]);
    stage1GroupTemporary1.add(bottomLeftLine.draw(two));

    let topRightLine = Line.fromPoints(clockPoints[0], clockPoints[3]);
    stage1GroupTemporary1.add(topRightLine.draw(two));

    let bottomRightLine = Line.fromPoints(clockPoints[2], clockPoints[6]);
    stage1GroupTemporary1.add(bottomRightLine.draw(two));

    let intersectionLeft= topLeftLine.intersection(bottomLeftLine);
    stage1GroupTemporary1.add(intersectionLeft.draw(two));
    let intersectionRight= topRightLine.intersection(bottomRightLine);
    stage1GroupTemporary1.add(intersectionRight.draw(two));

    let xOffset = getCircleWidthForHeight(this.circleRadius, intersectionRight.y - centreY);
    let left = new Point(centreX - xOffset, intersectionRight.y);
    let right = new Point(centreX + xOffset, intersectionRight.y);

    let femTriangle1 = Triangle.fromPoints(left, right, clockPoints[6]);

    let stage1GroupPermanent= two.makeGroup(this.circle, this.bindu);
    stage1GroupPermanent.add(femTriangle1.draw(two));

    let stage1GroupTemporary2 = two.makeGroup();
    stage1GroupTemporary2.visible = false;

    let centreLine = Line.fromPoints(clockPoints[0], clockPoints[6]);
    stage1GroupTemporary2.add(centreLine.draw(two));

    let centreIntersection = new Point(centreX, intersectionRight.y);
    let mascLineLeftLine = Line.fromPoints(clockPoints[8], centreIntersection);
    stage1GroupTemporary2.add(mascLineLeftLine.draw(two));

    let mascLineRightLine = Line.fromPoints(clockPoints[4], centreIntersection);
    stage1GroupTemporary2.add(mascLineRightLine.draw(two));

    let femTriangle1Left= Line.fromPoints(left, clockPoints[6]);
    let femTriangle1Right= Line.fromPoints(right, clockPoints[6]);
    //
    let mascIntersectionLeft= mascLineLeftLine.intersection(femTriangle1Left);
    stage1GroupTemporary2.add(mascIntersectionLeft.draw(two));
    let mascIntersectionRight= mascLineRightLine.intersection(femTriangle1Right);
    stage1GroupTemporary2.add(mascIntersectionRight.draw(two));

    let xOffsetMasc = getCircleWidthForHeight(this.circleRadius, mascIntersectionRight.y + centreY);
    let leftMasc = new Point(centreX - xOffset, mascIntersectionRight.y);
    let rightMasc = new Point(centreX + xOffset, mascIntersectionRight.y);

    let mascTriangle1 = Triangle.fromPoints(leftMasc, rightMasc, clockPoints[0]);

    stage1GroupPermanent.add(mascTriangle1.draw(two));

    this.addRevealedShape(stage1GroupTemporary1, 20);
    this.addHiddenShape(stage1GroupTemporary1, 200);
    this.addRevealedShape(stage1GroupTemporary2, 60);
    this.addHiddenShape(stage1GroupTemporary2, 200);

    this.addRevealedShape(stage1GroupPermanent, 100);

    // // stage1GroupPermanent.remove();
    //
    // return stage1GroupPermanent;
  }

  pointOnCircle(index) {
    let clock1Angle = index * 2*Math.PI / 12 - Math.PI / 2;
    let clock1X = this.circleRadius * Math.cos(clock1Angle);
    let clock1Y = this.circleRadius * Math.sin(clock1Angle);
    return new Point(this.centreX  + clock1X, this.centreY + clock1Y);
  }
}


function getCircleWidthForHeight(radius, height) {
  return Math.sqrt(Math.pow(radius, 2) - Math.pow(height, 2));
}

class FullStage extends BaseStage {
  constructor(two, revealTime) {
    super(two, revealTime);

    this.circleRadius = 300;

    let A = new Point(1, 1);
    let B = new Point(4, 4);
    let C = new Point(1, 8);
    let D = new Point(2, 4);

    let line1 = Line.fromPoints(A, B);
    let line2 = Line.fromPoints(C, D);

    console.log("intersection: " + line1.intersection(line2));

    var centreX = two.width * 0.5;
    var centreY = two.height * 0.5; // - this.circleRadius * 1.25;
    // var circle = two.makeCircle(centreX, centreY, this.circleRadius);
    // circle.stroke = 'orangered';
    // circle.linewidth = 5;
    // circle.fill = '#FF8000';
    console.log("two.width: " + two.width);
    console.log("two.height: " + two.height);
    console.log("centreX: " + centreX);
    console.log("centreY: " + centreY);
    console.log("circleRadius: " + this.circleRadius);

    // var bindu = two.makeCircle(centreX, centreY, 3);
    // bindu.stroke = 'black';
    // bindu.linewidth = 3;

    // let yOffset = Math.sin(2 * Math.PI / 24) * this.circleRadius;
    // let xOffset = Math.cos(2 * Math.PI / 24) * this.circleRadius;
    // console.log("xOffset: " + xOffset);
    // console.log("yOffset: " + yOffset);

    let topHeight1 = this.circleRadius * 18 / 24;
    let bottomHeight1 = this.circleRadius * -3 / 24;
    let decrement1 = this.circleRadius * 3 / 24;
    var fem1 = new FeminineTriangle2(centreX, centreY , this.circleRadius, getCircleWidthForHeight(this.circleRadius, topHeight1) - decrement1, topHeight1, bottomHeight1);
    fem1.draw(two);

    // let yOffset2 = Math.sin(2 * Math.PI / 12) * this.circleRadius;
    // let xOffset2 = Math.cos(2 * Math.PI / 12) * this.circleRadius;
    // console.log("xOffset2: " + xOffset2);
    // console.log("yOffset2: " + yOffset2);
    //
    // let boxX = Math.cos(2 * Math.PI / 8) * this.circleRadius;

    let topHeight2 = this.circleRadius * 12 / 24;
    let bottomHeight2 = this.circleRadius * -18 / 24;
    let decrement2 = this.circleRadius * 5 / 24;
    let fem2 = new FeminineTriangle2(centreX, centreY , this.circleRadius, getCircleWidthForHeight(this.circleRadius, topHeight2) - decrement2, topHeight2, bottomHeight2);
    fem2.draw(two);

    let topHeight3 = this.circleRadius * 7 / 24;
    let bottomHeight3 = this.circleRadius * -24 / 24;
    let decrement3 = 0;
    let fem3 = new FeminineTriangle2(centreX, centreY , this.circleRadius, getCircleWidthForHeight(this.circleRadius, topHeight3) - decrement3, topHeight3, bottomHeight3);
    fem3.draw(two);

    let topHeight4 = this.circleRadius * 4 / 24;
    let bottomHeight4 = this.circleRadius * -12 / 24;
    let decrement4 = this.circleRadius * 16 / 24;
    let fem4 = new FeminineTriangle2(centreX, centreY , this.circleRadius, getCircleWidthForHeight(this.circleRadius, topHeight4) - decrement4, topHeight4, bottomHeight4);
    // let fem4 = new FeminineTriangle2(centreX, centreY , this.circleRadius - yOffset2, boxX, this.circleRadius * 4 / 24, this.circleRadius * -12 / 24);
    fem4.draw(two);

    let topHeight5 = this.circleRadius * 1 / 24;
    let bottomHeight5 = this.circleRadius * -6 / 24;
    let decrement5 = this.circleRadius * 18 / 24;
    let fem5 = new FeminineTriangle2(centreX, centreY , this.circleRadius, getCircleWidthForHeight(this.circleRadius, topHeight5) - decrement5, topHeight5, bottomHeight5);
    // let fem5 = new FeminineTriangle2(centreX, centreY , this.circleRadius - yOffset2, boxX, this.circleRadius * 1 / 24, this.circleRadius * -6 / 24);
    fem5.draw(two);

    // var masc1 = new MasculineTriangle(centreX, centreY , this.circleRadius, this.circleRadius * 18 / 24);
    // masc1.draw(two);

    let topHeight6 = this.circleRadius * 18 / 24;
    let bottomHeight6 = this.circleRadius * 7 / 24;
    let decrement6 = this.circleRadius * 3 / 24;
    var masc1 = new MasculineTriangle2(centreX, centreY , this.circleRadius, getCircleWidthForHeight(this.circleRadius, topHeight6) - decrement6, topHeight6, bottomHeight6);
    masc1.draw(two);

    let topHeight7 = this.circleRadius * 12 / 24;
    let bottomHeight7 = this.circleRadius * 18 / 24;
    let decrement7 = this.circleRadius * 4 / 24;
    var masc2 = new MasculineTriangle2(centreX, centreY , this.circleRadius, getCircleWidthForHeight(this.circleRadius, topHeight7) - decrement7, topHeight7, bottomHeight7);
    masc2.draw(two);

    let topHeight8 = this.circleRadius * 6 / 24;
    let bottomHeight8 = this.circleRadius * 24 / 24;
    let decrement8 = 0;
    var masc3 = new MasculineTriangle2(centreX, centreY , this.circleRadius, getCircleWidthForHeight(this.circleRadius, topHeight8) - decrement8, topHeight8, bottomHeight8);
    masc3.draw(two);

    let topHeight9 = this.circleRadius * 3 / 24;
    let bottomHeight9 = this.circleRadius * 12 / 24;
    let decrement9 = this.circleRadius * 16 / 24;
    var masc4 = new MasculineTriangle2(centreX, centreY , this.circleRadius, getCircleWidthForHeight(this.circleRadius, topHeight9) - decrement9, topHeight9, bottomHeight9);
    masc4.draw(two);

    let lineFem3Left = new Line(fem3.left[0], fem3.left[1], fem3.bottom[0], fem3.bottom[1]);
    let line1Masc3Left = new Line(masc3.bottom[0], masc3.bottom[1], masc3.left[0], masc3.left[1]);

    let intersect1 = lineFem3Left.intersection(line1Masc3Left);
    console.log("fem3 L masc3 L intersection: " + intersect1);

    var testC = two.makeCircle(intersect1.x, intersect1.y, 3);
    testC.stroke = 'red';
    testC.linewidth = 3;

    // var masc2 = new MasculineTriangle(centreX, centreY , this.circleRadius, xOffset, this.circleRadius * 12 / 24);
    // masc2.draw(two);
    //
    // var masc3 = new MasculineTriangle(centreX, centreY , this.circleRadius, xOffset, this.circleRadius * 6 / 24);
    // masc3.draw(two);
    //
    // var masc4 = new MasculineTriangle(centreX, centreY , this.circleRadius, xOffset, this.circleRadius * 3 / 24);
    // masc4.draw(two);
  }

  update(frameCount) {
    if(frameCount === this.revealTime) {
      this.two.scene.children.forEach(function (shape) {
        shape.visible = true;
      });
    }
  }
}