import elements from '@/lib/engine/elements';
import preferences from '@/lib/engine/preferences';

import Executor from '../../engine';
import Sprite from './sprite';

const cs = preferences.cellSize;

class Player extends Sprite {
  private _inventory: Map<string, object>;
  private _img: HTMLImageElement;
  private _imgSrc: string;
  constructor(
    game: Executor,
    x: number = 0,
    y: number = 0,
    color: string = 'rgba(255,255,255,0)',
    speed: number = 10,
    imgSrc: string = '/img/assets/sprites/robot-toy.png'
  ) {
    super(game, x, y, color, speed);
    this.type = 'player';
    this._imgSrc = imgSrc;
    this._img = new Image();
    this._img.onload = () => {
      this._game.redraw();
    };
    this._img.src = this._imgSrc;
    this._inventory = new Map();
  }

  public async check(where: string, what: string): Promise<boolean> {
    const pos = this.pos.clone();
    if (where === 'слева') {
      pos.add(-cs, 0);
    }
    if (where === 'справа') {
      pos.add(cs, 0);
    }
    if (where === 'сверху') {
      pos.add(0, -cs);
    }
    if (where === 'снизу') {
      pos.add(0, cs);
    }

    let obj = null;
    if (what === 'свободно') {
      obj = this._gameObjects.find((o: any) => o.pos.equals(pos));
      return !obj;
    } else {
      const element = Object.values(elements).find(
        ({ title }) => title === what
      );
      if (element) {
        obj = this._gameObjects.find(
          (o: any) => o.pos.equals(pos) && o.type === element.type
        );
      }
      return !!obj;
    }
  }

  public print() {
    return { ...super.print(), imgSrc: this._imgSrc };
  }

  public draw() {
    super.draw();
    const { x, y } = this.pos;
    this.ctx.drawImage(this._img, x, y, cs, cs);
  }
}

export default Player;
