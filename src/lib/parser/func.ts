import AstNode from './base/ast_node';
import Runable from './interfaces/runable';

class Func extends AstNode implements Runable {
  constructor(name: string) {
    super('function', name);
  }
  public async run() {
    for (const node of this.childNodes) {
      await (node as Runable).run();
    }
    return;
  }
}
export default Func;
