import {Point, Line, Triangle, FeminineTriangle2, MasculineTriangle2} from "./models.mjs";

function pointOnCircle(index, radius, centre) {
  let clock1Angle = index * 2*Math.PI / 12 - Math.PI / 2;
  let clock1X = radius * Math.cos(clock1Angle);
  let clock1Y = radius * Math.sin(clock1Angle);
  return new Point(centre.x  + clock1X, centre.y + clock1Y);
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

export class Stage0 extends BaseStage {
  constructor(two, revealTime, yantra) {
    super(two, revealTime);

    this.yantra = yantra;
    this.yantra.circle = two.makeCircle(this.yantra.centreX, this.yantra.centreY, this.yantra.circleRadius);
    this.yantra.circle.stroke = 'orangered';
    this.yantra.circle.linewidth = 5;
    this.yantra.circle.visible = false;
    // circle.fill = '#FF8000';
    // console.log("two.width: " + two.width);
    // console.log("two.height: " + two.height);
    // console.log("centreX: " + centreX);
    // console.log("centreY: " + centreY);
    // console.log("circleRadius: " + this.circleRadius);

    this.yantra.bindu = two.makeCircle(this.yantra.centreX, this.yantra.centreY, 3);
    this.yantra.bindu.stroke = 'black';
    this.yantra.bindu.linewidth = 3;
    this.yantra.bindu.visible = false;

    this.addRevealedShape(this.yantra.circle, 0);
    this.addRevealedShape(this.yantra.bindu, 50);
  }
}

export class Stage1 extends BaseStage {
  constructor(two, revealTime, yantra) {
    super(two, revealTime);

    this.yantra = yantra;

    let stage1GroupTemporary1 = two.makeGroup();
    stage1GroupTemporary1.visible = false;



    let clockPoints = [];
    for(let i= 0; i < 12; i++) {
      let point = pointOnCircle(i, this.yantra.circleRadius, this.yantra.centre);
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

    let xOffset = getCircleWidthForHeight(this.yantra.circleRadius, intersectionRight.y - this.yantra.centreY);
    let left = new Point(this.yantra.centreX - xOffset, intersectionRight.y);
    let right = new Point(this.yantra.centreX + xOffset, intersectionRight.y);

    this.yantra.femTriangle1 = Triangle.fromPoints(left, right, clockPoints[6]);

    // let stage1GroupPermanent= two.makeGroup(this.yantra.circle, this.yantra.bindu);
    let stage1GroupPermanent= two.makeGroup();
    stage1GroupPermanent.add(this.yantra.femTriangle1.draw(two));

    let stage1GroupTemporary2 = two.makeGroup();
    stage1GroupTemporary2.visible = false;

    let centreLine = Line.fromPoints(clockPoints[0], clockPoints[6]);
    stage1GroupTemporary2.add(centreLine.draw(two));

    let centreIntersection = new Point(this.yantra.centreX, intersectionRight.y);
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

    let xOffsetMasc = getCircleWidthForHeight(this.yantra.circleRadius, mascIntersectionRight.y + this.yantra.centreY);
    let leftMasc = new Point(this.yantra.centreX - xOffset, mascIntersectionRight.y);
    let rightMasc = new Point(this.yantra.centreX + xOffset, mascIntersectionRight.y);

    this.yantra.mascTriangle1 = Triangle.fromPoints(leftMasc, rightMasc, clockPoints[0]);

    stage1GroupPermanent.add(this.yantra.mascTriangle1.draw(two));

    this.addRevealedShape(stage1GroupTemporary1, 20);
    this.addHiddenShape(stage1GroupTemporary1, 200);
    this.addRevealedShape(stage1GroupTemporary2, 60);
    this.addHiddenShape(stage1GroupTemporary2, 200);

    this.addRevealedShape(stage1GroupPermanent, 100);

    // // stage1GroupPermanent.remove();
    //
    // return stage1GroupPermanent;
  }
}


function getCircleWidthForHeight(radius, height) {
  return Math.sqrt(Math.pow(radius, 2) - Math.pow(height, 2));
}

export class Stage2 extends BaseStage {
  constructor(two, revealTime, yantra) {
    super(two, revealTime);

    this.yantra = yantra;

    let stage2GroupPermanent= two.makeGroup();

    let stage2GroupTemporary1 = two.makeGroup();
    stage2GroupTemporary1.visible = false;



    // TODO - take point on fem1 on right
    // rotate it through PI / 6 - sin=0.5 clockwise
    // This will give a point on the circle radius away from the tri point
    // Do the same the other direction from masc 1

    let centreLine = Line.fromPoints(
        pointOnCircle(0, this.yantra.circleRadius, this.yantra.centre),
        pointOnCircle(6, this.yantra.circleRadius, this.yantra.centre)
    );
    stage2GroupTemporary1.add(centreLine.draw(two));

    // Bottom line
    let centre =  new Point(this.yantra.centreX, this.yantra.centreY);
    let bottomLineMarker = this.yantra.femTriangle1.two.rotate(Math.PI / 3, centre);
    stage2GroupTemporary1.add(this.yantra.femTriangle1.two.draw(two));
    stage2GroupTemporary1.add(bottomLineMarker.draw(two));
    let bottomChord = Line.fromPoints(this.yantra.femTriangle1.two, bottomLineMarker);
    stage2GroupTemporary1.add(bottomChord.draw(two));

    let xOffset = getCircleWidthForHeight(this.yantra.circleRadius, bottomLineMarker.y - this.yantra.centreY);

    let left = new Point(this.yantra.centreX - xOffset, bottomLineMarker.y);
    stage2GroupTemporary1.add(left.draw(two));
    let bottomLine = Line.fromPoints(bottomLineMarker, left);
    stage2GroupTemporary1.add(bottomLine.draw(two));


    // top line
    let topLineMarker = this.yantra.mascTriangle1.two.rotate(-Math.PI / 3, centre);
    stage2GroupTemporary1.add(this.yantra.mascTriangle1.two.draw(two));
    stage2GroupTemporary1.add(topLineMarker.draw(two));
    let topChord = Line.fromPoints(this.yantra.mascTriangle1.two, topLineMarker);
    stage2GroupTemporary1.add(topChord.draw(two));

    let xOffsetTop = getCircleWidthForHeight(this.yantra.circleRadius, topLineMarker.y - this.yantra.centreY);

    let leftTop = new Point(this.yantra.centreX - xOffsetTop, topLineMarker.y);
    stage2GroupTemporary1.add(leftTop.draw(two));
    let topLine = Line.fromPoints(topLineMarker, leftTop);
    stage2GroupTemporary1.add(topLine.draw(two));

    // Form fem 2 triangle sides to extend
    let fem2BottomPoint = new Point(this.yantra.centreX, bottomLineMarker.y);
    stage2GroupTemporary1.add(fem2BottomPoint.draw(two));

    let fem2LeftIntersect = this.yantra.mascTriangle1.leftLine.intersection(this.yantra.femTriangle1.horizontalLine);
    stage2GroupTemporary1.add(fem2LeftIntersect.draw(two));

    let fem2LeftLine = Line.fromPoints(
        fem2BottomPoint,
        fem2LeftIntersect
    );
    stage2GroupTemporary1.add(fem2LeftLine.draw(two));

    let fem2RightIntersect = this.yantra.mascTriangle1.rightLine.intersection(this.yantra.femTriangle1.horizontalLine);
    stage2GroupTemporary1.add(fem2RightIntersect.draw(two));

    let fem2RightLine = Line.fromPoints(
        fem2BottomPoint,
        fem2RightIntersect
    );
    stage2GroupTemporary1.add(fem2RightLine.draw(two));

    // Form masc 2 triangle sides to extend
    let masc2TopPoint = new Point(this.yantra.centreX, topLineMarker.y);
    stage2GroupTemporary1.add(masc2TopPoint.draw(two));

    let masc2LeftIntersect = this.yantra.femTriangle1.leftLine.intersection(this.yantra.mascTriangle1.horizontalLine);
    stage2GroupTemporary1.add(masc2LeftIntersect.draw(two));

    let masc2LeftLine = Line.fromPoints(
        masc2TopPoint,
        masc2LeftIntersect
    );
    stage2GroupTemporary1.add(masc2LeftLine.draw(two));

    let masc2RightIntersect = this.yantra.femTriangle1.rightLine.intersection(this.yantra.mascTriangle1.horizontalLine);
    stage2GroupTemporary1.add(masc2RightIntersect.draw(two));

    let masc2RightLine = Line.fromPoints(
        masc2TopPoint,
        masc2RightIntersect
    );
    stage2GroupTemporary1.add(masc2RightLine.draw(two));

    // Form masc 3 triangle
    let masc3TopPoint = new Point(this.yantra.centreX, this.yantra.femTriangle1.one.y);
    stage2GroupTemporary1.add(masc3TopPoint.draw(two));

    let masc3LeftIntersect = fem2LeftLine.intersection(this.yantra.mascTriangle1.horizontalLine);
    stage2GroupTemporary1.add(masc3LeftIntersect.draw(two));

    let masc3LeftLine = Line.fromPoints(
        masc3TopPoint,
        masc3LeftIntersect
    );
    stage2GroupTemporary1.add(masc3LeftLine.draw(two));

    let masc3RightIntersect = fem2RightLine.intersection(this.yantra.mascTriangle1.horizontalLine);
    let test = masc3RightIntersect.draw(two);
    test.stroke = 'green';
    stage2GroupTemporary1.add(test);

    let masc3RightLine = Line.fromPoints(
        masc3TopPoint,
        masc3RightIntersect
    );
    stage2GroupTemporary1.add(masc3RightLine.draw(two));

    let masc3BottomPoint = new Point(this.yantra.centreX, fem2BottomPoint.y);
    stage2GroupTemporary1.add(masc3BottomPoint.draw(two));


    let masc3LeftNewEnd = masc3LeftLine.extendToYPoint(masc3BottomPoint.y);
    stage2GroupTemporary1.add(masc3LeftNewEnd.draw(two));

    let masc3RightNewEnd = masc3RightLine.extendToYPoint(masc3BottomPoint.y);
    stage2GroupTemporary1.add(masc3RightNewEnd.draw(two));

    this.yantra.mascTriangle3 = Triangle.fromPoints(masc3TopPoint, masc3LeftLine.extendToYPoint(masc3BottomPoint.y), masc3RightLine.extendToYPoint(masc3BottomPoint.y));

    stage2GroupPermanent.add(this.yantra.mascTriangle3.draw(two));

    // Masc2 closing
    // fem 1 + masc3

    let masc3Fem1LeftIntersect = masc3LeftLine.intersection(this.yantra.femTriangle1.leftLine);
    stage2GroupTemporary1.add(masc3Fem1LeftIntersect.draw(two));

    let masc3Fem1RightIntersect = masc3RightLine.intersection(this.yantra.femTriangle1.rightLine);
    stage2GroupTemporary1.add(masc3Fem1RightIntersect.draw(two));

    let masc2LeftNewEnd = masc2LeftLine.extendToYPoint(masc3Fem1LeftIntersect.y);
    stage2GroupTemporary1.add(masc2LeftNewEnd.draw(two));

    let masc2RightNewEnd = masc2RightLine.extendToYPoint(masc3Fem1RightIntersect.y);
    stage2GroupTemporary1.add(masc2RightNewEnd.draw(two));


    this.yantra.mascTriangle2 = Triangle.fromPoints(masc2TopPoint, masc2LeftNewEnd, masc2RightNewEnd);
    stage2GroupPermanent.add(this.yantra.mascTriangle2.draw(two));

    //Form fem3 - fem1 and masc2 intersections cross
    let stage2GroupTemporary2 = two.makeGroup();
    stage2GroupTemporary2.visible = false;

    let masc2Fem1LeftBottomIntersect = masc2LeftLine.intersection(this.yantra.femTriangle1.leftLine);
    stage2GroupTemporary2.add(masc2Fem1LeftBottomIntersect.draw(two));

    let masc2Fem1RightBottomIntersect = masc2RightLine.intersection(this.yantra.femTriangle1.rightLine);
    stage2GroupTemporary2.add(masc2Fem1RightBottomIntersect.draw(two));

    let masc2Fem1LeftTopIntersect = masc2LeftLine.intersection(this.yantra.femTriangle1.horizontalLine);
    stage2GroupTemporary2.add(masc2Fem1LeftTopIntersect.draw(two));

    let masc2Fem1RightTopIntersect = masc2RightLine.intersection(this.yantra.femTriangle1.horizontalLine);
    stage2GroupTemporary2.add(masc2Fem1RightTopIntersect.draw(two));

    let fem2CrossLeft = Line.fromPoints(masc2Fem1LeftBottomIntersect, masc2Fem1RightTopIntersect);
    stage2GroupTemporary2.add(fem2CrossLeft.draw(two));

    let fem2CrossRight = Line.fromPoints(masc2Fem1RightBottomIntersect, masc2Fem1LeftTopIntersect);
    stage2GroupTemporary2.add(fem2CrossRight.draw(two));

    //fem2 and cross
    let fem2LeftCrossIntersect = fem2LeftLine.intersection(fem2CrossLeft);
    stage2GroupTemporary2.add(fem2LeftCrossIntersect.draw(two));

    let fem2RightrossIntersect = fem2RightLine.intersection(fem2CrossRight);
    stage2GroupTemporary2.add(fem2RightrossIntersect.draw(two));

    // let fem3HorizontalLine = Line.fromPoints(fem2LeftCrossIntersect, fem2RightrossIntersect);
    // stage2GroupTemporary2.add(fem3HorizontalLine.draw(two));

    this.yantra.mascTriangle4Horizontal = Line.fromPoints(fem2LeftCrossIntersect, fem2RightrossIntersect);
    stage2GroupPermanent.add(this.yantra.mascTriangle4Horizontal.draw(two));

    let fem3BottomPoint = new Point(centre.x, fem2LeftCrossIntersect.y);
    stage2GroupTemporary2.add(fem3BottomPoint.draw(two));

    let fem3LeftLine = Line.fromPoints(masc2Fem1LeftTopIntersect, fem3BottomPoint);
    stage2GroupTemporary2.add(fem3LeftLine.draw(two));

    let fem3RightLine = Line.fromPoints(masc2Fem1RightTopIntersect, fem3BottomPoint);
    stage2GroupTemporary2.add(fem3RightLine.draw(two));

    let fem3RightLineExtended= fem3RightLine.extendToY(topLineMarker.y);
    stage2GroupTemporary2.add(fem3RightLineExtended.draw(two));

    let fem3LeftLineExtended= fem3LeftLine.extendToY(topLineMarker.y);
    stage2GroupTemporary2.add(fem3LeftLineExtended.draw(two));

    this.yantra.femTriangle3 = Triangle.fromPoints(fem3BottomPoint, fem3LeftLineExtended.end, fem3RightLineExtended.end);
    stage2GroupPermanent.add(this.yantra.femTriangle3.draw(two));

    // masc1, fem3

    let fem2TopLeft = fem3LeftLineExtended.intersection(this.yantra.mascTriangle1.leftLine);
    stage2GroupTemporary2.add(fem2TopLeft.draw(two));

    let fem2TopRight = fem3RightLineExtended.intersection(this.yantra.mascTriangle1.rightLine);
    stage2GroupTemporary2.add(fem2TopRight.draw(two));

// fem2RightLine
    let fem2LeftLineExtended = fem2LeftLine.extendToY(fem2TopLeft.y);
    stage2GroupTemporary2.add(fem2LeftLineExtended.draw(two));

    let fem2RightLineExtended = fem2RightLine.extendToY(fem2TopRight.y);
    stage2GroupTemporary2.add(fem2RightLineExtended.draw(two));

    this.yantra.femTriangle2 = Triangle.fromPoints(fem2LeftLineExtended.start, fem2LeftLineExtended.end, fem2RightLineExtended.end);
    stage2GroupPermanent.add(this.yantra.femTriangle2.draw(two));

    this.addRevealedShape(stage2GroupTemporary1, 20);
    this.addHiddenShape(stage2GroupTemporary1, 150);
    this.addRevealedShape(stage2GroupTemporary2, 150);
    this.addHiddenShape(stage2GroupTemporary2, 200);

    this.addRevealedShape(stage2GroupPermanent, 100);
  }
}

export class Stage3 extends BaseStage {
  constructor(two, revealTime, yantra) {
    super(two, revealTime);

    this.yantra = yantra;

    let stage3GroupPermanent = two.makeGroup();

    let stage3GroupTemporary1 = two.makeGroup();
    stage3GroupTemporary1.visible = false;

    let masc4Top = new Point(this.yantra.centreX, this.yantra.femTriangle2.two.y);
    // stage3GroupTemporary1.add(masc4Top.draw(two));


    this.yantra.mascTriangle4 = Triangle.fromPoints(masc4Top, this.yantra.mascTriangle4Horizontal.start,  this.yantra.mascTriangle4Horizontal.end);
    stage3GroupPermanent.add(this.yantra.mascTriangle4.draw(two));

    // Fem4 - fem 3 masc 4

    let masc4Left = Line.fromPoints(masc4Top, this.yantra.mascTriangle4Horizontal.end);
    let masc4Right = Line.fromPoints(this.yantra.mascTriangle4.one, this.yantra.mascTriangle4.two);
        // Line.fromPoints(this.yantra.mascTriangle4Horizontal.start, masc4Top);
    stage3GroupTemporary1.add(masc4Right.draw(two));

    let fem4TopLeft = this.yantra.femTriangle3.leftLine.intersection(masc4Left);
    stage3GroupTemporary1.add(fem4TopLeft.draw(two));

    let fem4TopRight = this.yantra.femTriangle3.horizontalLine.intersection(masc4Right);
    stage3GroupTemporary1.add(fem4TopRight.draw(two));

    let fem4HorizontalLine = Line.fromPoints(fem4TopLeft, fem4TopRight);
    stage3GroupTemporary1.add(fem4HorizontalLine.draw(two));

    let fem4HorizontalLineLonger= fem4HorizontalLine.lengthen(2);
    stage3GroupTemporary1.add(fem4HorizontalLineLonger.draw(two));

    let fem4HorizontalLeft = fem4HorizontalLineLonger.intersection(this.yantra.mascTriangle2.leftLine);
    stage3GroupTemporary1.add(fem4HorizontalLeft.draw(two));

    let fem4HorizontalRight = fem4HorizontalLineLonger.intersection(this.yantra.mascTriangle2.horizontalLine);
    stage3GroupTemporary1.add(fem4HorizontalRight.draw(two));

    let fem4Bottom = new Point(this.yantra.centreX, this.yantra.mascTriangle2.two.y);
    stage3GroupTemporary1.add(fem4Bottom.draw(two));

    this.yantra.femTriangle4 = Triangle.fromPoints(fem4HorizontalLeft, fem4HorizontalRight, fem4Bottom);
    stage3GroupPermanent.add(this.yantra.femTriangle4.draw(two));


// fem2RightLine
//     let fem2LeftLineExtended = fem2LeftLine.extendToY(fem2TopLeft.y);
//     stage2GroupTemporary2.add(fem2LeftLineExtended.draw(two));


    this.addRevealedShape(stage3GroupTemporary1, 20);
    this.addHiddenShape(stage3GroupTemporary1, 150);

    this.addRevealedShape(stage3GroupPermanent, 100);
  }
}

export class FullStage extends BaseStage {
  constructor(two, revealTime, yantra) {
    super(two, revealTime);

    this.yantra = yantra;
    this.circleRadius = this.yantra.circleRadius;

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