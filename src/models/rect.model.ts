import { Circle } from './circle.model'
import { Line } from './line.model'
import { distanceBetween, Point, Shape, Type } from './shape.model'

export class Rect implements Shape {
  readonly center: Point;
  readonly width: number;
  readonly height: number;
  readonly type: Type;

  constructor(x: number, y: number, width: number, height: number) {
    this.center = <Point>{ x, y };
    this.type = Type.RECT;
    this.width = width;
    this.height = height;
  }

  collides(other: Shape): boolean {
    switch (other.type) {
      case Type.CIRCLE:
        console.log('rect to is circle: ');
        const otherShape = <Circle>(<any>other);
        return otherShape.collides(this);
        /*/// MY IMPLEMENTATION but using circle.model's Circle+Rect collision instead :)
        const otherShape = <Circle>(<any>other);
        //get C (distance)
        const distance = distanceBetween(this.center, otherShape.center); //distance is C
        //get A from B and C (distance)
        const AAA = distance - otherShape.radius; // C - B thus A
        //get E and F from circle center and this center
        const EF: Point = <Point>{
          x: Math.abs(otherShape.center.x - this.center.x),
          y: Math.abs(otherShape.center.y - this.center.y),
        };
        //get ANGLE from E and F
        const ANGLE = Math.atan2(EF.y, EF.x);
        //get new XY from SOH/CAH
        const XY: Point = <Point>{
          x: Math.cos(ANGLE) * AAA, //Cos ANGLE = XXX / AAA or Cos ANGLE * AAA = XXX 
          y: Math.sin(ANGLE) * AAA, //Sin ANGLE = YYY / AAA or Sin ANGLE * AAA = YYY
        };
        //check XY inside RECT
        console.log('rect to is circle: ');

        return this.isPointInsideRect(<Point>{
          x: Math.abs(this.center.x + XY.x),
          y: Math.abs(this.center.y - XY.y),
        });//*/
        
      case Type.RECT:
        const rect: Rect = Rect.fromShape(other);
        console.log('rect to is rect: ');
        return this.isPointInsideRect(<Point>{
          x: Math.abs(rect.center.x - rect.width/2),
          y: Math.abs(rect.center.y - rect.height/2),
        }) || this.isPointInsideRect(<Point>{
          x: Math.abs(rect.center.x + rect.width/2),
          y: Math.abs(rect.center.y - rect.height/2),
        }) || this.isPointInsideRect(<Point>{
          x: Math.abs(rect.center.x + rect.width/2),
          y: Math.abs(rect.center.y + rect.height/2),
        }) || this.isPointInsideRect(<Point>{
          x: Math.abs(rect.center.x - rect.width/2),
          y: Math.abs(rect.center.y + rect.height/2),
        });

      case Type.LINE:
        console.log('rect to is line: ');
        const otherLine = <Line>(<any>other);
        return otherLine.collides(this);
      default:
        throw new Error(`Invalid shape type!`);
    }
  }

  /**
   * Typecasts a Shape object into this Shape type
   * @param other the Shape object
   * @returns a Rect object
   */
  static fromShape(other: Shape): Rect {
    const polymorph = <any>other;
    if (!polymorph.width || !polymorph.height) {
      throw new Error('Shape is invalid! Cannot convert to a Rectangle');
    }

    return new Rect(
      polymorph.center.x,
      polymorph.center.y,
      polymorph.width,
      polymorph.height,
    );
  }

  isPointInsideRect(p_point:Point) : boolean {
    if (p_point.x >= this.center.x -  this.width/2 && p_point.x <= this.center.x +  this.width/2 &&
        p_point.y >= this.center.y - this.height/2 && p_point.x <= this.center.y + this.height/2
      ) {
        console.log("rect collision returning true");
      return true;
    }
    console.log("rect collision returning false");
    return false;
  }
}
