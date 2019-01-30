import preferences from '@/lib/engine/preferences';

import Executor from '../../engine';
import Sprite from './sprite';

const cs = preferences.cellSize;

class Сharacter extends Sprite {
  public chr: string;
  constructor(
    c: string,
    game: Executor,
    x: number = 0,
    y: number = 0,
    color: string = 'orange',
    speed: number = 10
  ) {
    super(game, x, y, color, speed);
    this.chr = c;
    this.type = 'character';
  }

  public print() {
    return {
      ...super.print(),
      c: this.chr,
    };
  }

  public draw() {
    super.draw();
    const { chr, pos } = this;
    this.ctx.fillStyle = 'black';
    this.ctx.font = 'normal 18px sans-serif';
    this.ctx.textBaseline = 'top';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(chr, pos.x + cs / 2 + 0.5, pos.y);
  }
}

export default Сharacter;
