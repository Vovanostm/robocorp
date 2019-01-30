import preferences from '@/lib/engine/preferences';

import Executor from '../../engine';
import Direction from '../../engine/direction';
import Position from '../../engine/position';

const cs = preferences.cellSize;

class Sprite {
  public pos: Position;
  public ctx: CanvasRenderingContext2D;
  public type: string;
  public canvas: HTMLCanvasElement;
  protected _gameObjects: Sprite[];
  protected _game: Executor;
  private _startPos: Position;
  private _targetPos: Position;
  private _speed: number;
  private _isMoving: boolean;
  private _moveStartTime: number;
  private _moveDeltaTime: number;
  private _color: string;
  constructor(
    game: Executor,
    x: number = 0,
    y: number = 0,
    color: string = 'orange',
    speed: number = 10
  ) {
    // Передаваемые параметры
    this._game = game;
    this.canvas = game.canvas;
    this.pos = new Position(x, y);
    this.type = 'sprite';
    this._speed = 10;
    this.speed = speed;
    // Инициализация
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    this._startPos = this.pos;
    this._targetPos = this.pos;
    this._isMoving = false;
    this._moveStartTime = 0;
    this._moveDeltaTime = 1000 / (cs * this._speed);
    this._color = color;
    this._gameObjects = game.gameObjects;
  }
  public async move(dir: Direction): Promise<boolean> {
    const pos = this.pos.clone().moveToDirection(dir, cs);
    if (!this.isCanMove(dir)) {
      return false;
    }
    const obj = this._gameObjects.find((o: any) => o.pos.equals(pos));
    if (obj) {
      obj.move(dir);
    }
    await this.moveTo(pos);
    return true;
  }

  public get speed() {
    return this._speed;
  }

  public set speed(val) {
    if (val > 0) {
      this._speed = val;
      this._moveDeltaTime = 1000 / (cs * this._speed);
    }
  }

  public draw() {
    const { pos } = this;
    this.ctx.fillStyle = this._color;
    this.ctx.fillRect(pos.x, pos.y, cs, cs);
  }

  public print() {
    return {
      type: this.type,
      x: this.pos.x,
      y: this.pos.y,
      color: this._color,
      speed: this._speed,
    };
  }

  public isCanMove(dir: Direction): boolean {
    const pos = this.pos.clone().moveToDirection(dir, cs);
    const obj = this._gameObjects.find((o: any) => o.pos.equals(pos));
    if (obj) {
      if (obj.type === 'wall') {
        return false;
      }
      if (obj.type === 'character') {
        obj.speed = this.speed;
        return obj.isCanMove(dir);
      }
    }
    return true;
  }

  private async moveTo(position: Position) {
    this._isMoving = true;
    this._moveStartTime = performance.now();
    this._startPos = this.pos;
    this._targetPos = position;
    this.physics();
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, this._moveDeltaTime + 100);
    });
  }

  private physics() {
    if (this._isMoving) {
      this._game.redraw();
      const { _moveStartTime, _moveDeltaTime, _startPos, _targetPos } = this;
      const start = _moveStartTime;
      const now = performance.now();
      const end = _moveStartTime + _moveDeltaTime;
      let dt = (now - start) / (end - start);
      dt = dt > 1 ? 1 : dt;
      const x = this.getValPosition(_startPos.x, _targetPos.x, dt);
      const y = this.getValPosition(_startPos.y, _targetPos.y, dt);
      this.pos = new Position(x, y);
      requestAnimationFrame(() => {
        this.physics();
      });
      if (dt >= 1) {
        this._isMoving = false;
        this.pos = this._targetPos;
      }
    }
  }

  private getValPosition(begin: number, end: number, p: number): number {
    return (end - begin) * p + begin;
  }
}

export default Sprite;
