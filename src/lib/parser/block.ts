import AstNode from './base/ast_node';
import Runable from './interfaces/runable';

class Block extends AstNode implements Runable {
  constructor() {
    super('block');
  }
  public async run() {
    for (const node of this.childNodes) {
      await (node as Runable).run();
    }
    return;
  }
}
export default Block;
