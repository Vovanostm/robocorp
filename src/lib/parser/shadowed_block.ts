import AstNode from './base/ast_node';
import Runable from './interfaces/runable';

class ShadowedBlock extends AstNode implements Runable {
  constructor(type: string) {
    super(type);
  }
  public getParent(): AstNode | null {
    if (this.parentNode) {
      return this.parentNode.parentNode;
    } else {
      throw new Error('Shadowed block must contain 2 level parents');
    }
  }

  public get firstParent(): AstNode | null {
    return this.parentNode;
  }

  public async run() {
    for (const node of this.childNodes) {
      await (node as Runable).run();
    }
    return;
  }
}
export default ShadowedBlock;
