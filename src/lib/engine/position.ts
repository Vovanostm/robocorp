import Direction from './direction';

class Position {
  public x: number;
  public y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  public add(x: number = 0, y: number = 0) {
    this.x += x;
    this.y += y;
    return this;
  }
  public diff(pos: Position) {
    return { x: this.x - pos.x, y: this.y - pos.y };
  }
  public clone() {
    return new Position(this.x, this.y);
  }
  public moveToDirection(dir: Direction, delta: number): Position {
    switch (dir) {
      case Direction.Up:
        this.add(0, -delta);
        break;
      case Direction.Down:
        this.add(0, delta);
        break;
      case Direction.Left:
        this.add(-delta, 0);
        break;
      case Direction.Right:
        this.add(delta, 0);
        break;
    }
    return this;
  }
  public equals(pos: Position): boolean {
    return !(this.x - pos.x || this.y - pos.y);
  }
}
export default Position;
