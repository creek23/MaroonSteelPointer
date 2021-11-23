import { Circle } from './circle.model'
import { Rect } from './rect.model'
import { distanceBetween, Point, Shape, Type } from './shape.model'

export class Line implements Shape {
  readonly center: Point;
  readonly endpoint: Point;
  readonly type: Type;

  constructor(x1: number, y1: number, x2: number, y2: number) {
    this.center   = <Point>{ x: x1, y: y1 };
    this.endpoint = <Point>{ x: x2, y: y2 };
    this.type = Type.LINE;
  }

  collides(other: Shape): boolean {
    switch (other.type) {
      case Type.CIRCLE:
        const otherShape = <Circle>(<any>other);
        let linePoint:Point = this.center;
        const looptyloop = distanceBetween(this.center, this.endpoint);
        let incrementX = (this.endpoint.x - this.center.x) / looptyloop;
        let incrementY = (this.endpoint.y - this.center.y) / looptyloop;
        for (var i:number = 0; i < looptyloop; ++i) {
          linePoint = <Point>{x: linePoint.x+incrementX, y: linePoint.y+incrementY};
          if (distanceBetween(linePoint, otherShape.center) <= otherShape.getRadius()) {
            console.log("line to circle returning true");
            return true;
          }
        }
        console.log("line to circle returning false");
        return false;
      case Type.RECT:
        const rect = <Rect>(<any>other);
        var lineA : Line = new Line(rect.center.x - rect.width/2, rect.center.y - rect.height/2, rect.center.x + rect.width/2, rect.center.y - rect.height/2);
        var lineB : Line = new Line(rect.center.x - rect.width/2, rect.center.y + rect.height/2, rect.center.x + rect.width/2, rect.center.y + rect.height/2);
        var lineC : Line = new Line(rect.center.x - rect.width/2, rect.center.y - rect.height/2, rect.center.x - rect.width/2, rect.center.y + rect.height/2);
        var lineD : Line = new Line(rect.center.x + rect.width/2, rect.center.y - rect.height/2, rect.center.x + rect.width/2, rect.center.y + rect.height/2);
        return this.isLineIntersected(this, lineA)
         || this.isLineIntersected(this, lineB)
         || this.isLineIntersected(this, lineC)
         || this.isLineIntersected(this, lineD);
      case Type.LINE:
        const otherLine = <Line>(<any>other);
        return this.isLineIntersected(this, otherLine);
      default:
        throw new Error(`Invalid shape type!`);
    }
  }

  // derived from https://stackoverflow.com/questions/563198/how-do-you-detect-where-two-line-segments-intersect
  // by iMalc https://stackoverflow.com/users/2058298/imalc
  isLineIntersected(pA:Line, pB:Line):boolean {
    var s02:Point, s_numer:number, t_numer:number, denom:number;
    var s10:Point = <Point> { x: pA.endpoint.x - pA.center.x, y: pA.endpoint.y - pA.center.y };
    var s32:Point = <Point> { x: pB.endpoint.x - pB.center.x, y: pB.endpoint.y - pB.center.y };

    denom = s10.x * s32.y - s32.x * s10.y;
    if (denom == 0) {
      console.log("line is true; collinear");
        return true; // Collinear
      }
    var denomPositive:boolean = denom > 0;

    var s02:Point = <Point> { x: pA.center.x - pB.center.x, y: pA.center.y - pB.center.y };
    s_numer = s10.x * s02.y - s10.y * s02.x;
    if ((s_numer < 0) == denomPositive)
        return false; // No collision

    t_numer = s32.x * s02.y - s32.y * s02.x;
    if ((t_numer < 0) == denomPositive)
        return false; // No collision

    if (((s_numer > denom) == denomPositive) || ((t_numer > denom) == denomPositive))
        return false; // No collision

    // Collision detected
      console.log("line is true");
    return true;
  }
}
