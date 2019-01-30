import Сharacter from '../parser/sprites/character';
import Player from '../parser/sprites/player';
import Sprite from '../parser/sprites/sprite';
import Wall from '../parser/sprites/wall';
import Direction from './direction';
import Position from './position';
import Preferences from './preferences';

const cs = Preferences.cellSize;

class Executor {
  public gameObjects: Sprite[];
  public canvas: HTMLCanvasElement;
  private position: Position;
  private startPosition: Position;
  private targetPosition: Position;
  private speed: number;
  private ctx: CanvasRenderingContext2D;
  private colors: any;
  private cellSize: number;
  private isMoving: boolean;
  private dTime: number;
  private moveStart: number;
  private _hlCellPosition: Position | null;
  private _player: Player;
  private _symbolRegexp: RegExp;

  constructor(
    canvas: HTMLCanvasElement,
    x: number = 0,
    y: number = 0,
    speed: number = 0.1
  ) {
    this.canvas = canvas;
    this.position = new Position(x, y);
    this.speed = speed;
    this.isMoving = false;
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    this._symbolRegexp = new RegExp(/\w+/g);
    this.dTime = 1000 / (Preferences.cellSize * speed);
    this.moveStart = 0;
    this.targetPosition = this.position;
    this.startPosition = this.position;
    this.cellSize = Preferences.cellSize;
    this.colors = {
      wall: '#d32f2f',
      symbol: '#F9A825',
    };
    this.gameObjects = [];
    this._player = new Player(this, x, y, 'rgba(255,255,255,0)', speed);
    this.gameObjects.push(new Сharacter('c', this, 40, 0));
    this.gameObjects.push(new Сharacter('d', this, 40, 40));
    this.ctx.scale(1, 1);
    this._hlCellPosition = null;
    this._initListeners();
    this.redraw();
  }

  public async move(dir: Direction) {
    const isMoved = await this._player.move(dir);
    if (!isMoved) {
      throw new Error('Не могу');
    }
  }

  public get player() {
    return this._player;
  }

  public debug() {
    return { x: this.position.x, y: this.position.y };
  }

  public async check(where: string, what: string): Promise<boolean> {
    return await this._player.check(where, what);
  }

  public printMap(): object {
    return {
      player: this._player.print(),
      gameObjects: this.gameObjects.map((o) => o.print()),
    };
  }

  public readMap(map: any) {
    const { player, gameObjects } = map;
    const pos = new Position(player.x, player.y);
    this._player.pos = pos;
    this.gameObjects.splice(0, this.gameObjects.length);
    for (const obj of this._parseGameObjects(gameObjects)) {
      this.gameObjects.push(obj);
    }
    this.redraw();
  }

  public redraw() {
    // clear canvas
    const { width, height } = this.canvas;
    this.ctx.clearRect(0, 0, width, height);

    this._drawGrid();

    if (this._hlCellPosition) {
      const { x, y } = this._hlCellPosition as Position;
      this.ctx.fillStyle = 'rgba(49, 180, 245, 0.7)';
      this.ctx.fillRect(x, y, Preferences.cellSize, Preferences.cellSize);
    }

    this.gameObjects.forEach((element: Sprite) => {
      element.draw();
    });

    this._player.draw();

    // {
    //   const { x, y } = this.position;
    //   this.ctx.fillStyle = 'black';
    //   const img = new Image();
    //   img.src = '/img/assets/sprites/robot-toy.png';
    //   this.ctx.drawImage(img, x, y, this.cellSize, this.cellSize);
    // }
  }

  private _drawGrid() {
    const { width, height } = this.canvas;
    this.ctx.strokeStyle = '#B4B4B4';
    this.ctx.lineWidth = 1;
    for (let i = 0; i <= height; i += Preferences.cellSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, i + 0.5);
      this.ctx.lineTo(width, i + 0.5);
      this.ctx.stroke();
    }
    for (let j = 0; j <= width; j += Preferences.cellSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(j + 0.5, 0);
      this.ctx.lineTo(j + 0.5, height);
      this.ctx.stroke();
    }
  }

  private _addWall(pos: Position) {
    this.gameObjects.push(new Wall(this, pos.x, pos.y));
    this.redraw();
  }

  private _getMousePosition(e: MouseEvent): Position {
    let { left, top } = this.canvas.getBoundingClientRect();
    const { clientX, clientY } = e;
    const { cellSize } = this;
    left = clientX - left;
    top = clientY - top;
    left = Math.floor(left / cellSize) * cellSize;
    top = Math.floor(top / cellSize) * cellSize;
    return new Position(left, top);
  }

  private _highlightCell(pos: Position | null) {
    this._hlCellPosition = pos;
    this.redraw();
  }

  private _initListeners() {
    this.canvas.addEventListener('click', (e) => {
      this._addWall(this._getMousePosition(e));
    });
    this.canvas.addEventListener('mousemove', (e) => {
      this._highlightCell(this._getMousePosition(e));
    });
    this.canvas.addEventListener('mouseleave', (e) => {
      this._highlightCell(null);
    });
    document.addEventListener('keydown', (e) => {
      const chr = e.key;
      if (chr.length !== 1 || !chr.match(this._symbolRegexp)) {
        return;
      }
      if (this._hlCellPosition) {
        const { x, y } = this._hlCellPosition;
        this.gameObjects.push(new Сharacter(chr, this, x, y));
      }
      this.redraw();
    });
  }
  private _parseGameObjects(arr: any): Sprite[] {
    const objects: Sprite[] = [];
    for (const obj of arr) {
      if (obj.type === 'character') {
        const { c, x, y, color, speed } = obj;
        objects.push(new Сharacter(c, this, x, y, color, speed));
      }
      if (obj.type === 'wall') {
        const { x, y } = obj;
        objects.push(new Wall(this, x, y));
      }
    }
    return objects;
  }
}

export default Executor;
