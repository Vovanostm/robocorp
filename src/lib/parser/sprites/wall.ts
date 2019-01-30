import Executor from '../../engine';
import Sprite from './sprite';

class Wall extends Sprite {
  constructor(game: Executor, x: number = 0, y: number = 0) {
    super(game, x, y, 'gray', 0);
    this.type = 'wall';
  }
}

export default Wall;
