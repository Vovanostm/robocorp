import AstNode from './base/ast_node';
import Runable from './interfaces/runable';

class Cond extends AstNode implements Runable {
  private cond: Promise<any>;
  private ifNodes: Array<AstNode | Runable>;
  private elseNodes: Array<AstNode | Runable>;
  private mode: boolean;
  constructor(cond: any) {
    super('condition');
    this.cond = cond;
    this.ifNodes = [];
    this.elseNodes = [];
    this.mode = true;
  }

  public addNode(node: AstNode) {
    if (this.mode) {
      this.ifNodes.push(node);
    } else {
      this.elseNodes.push(node);
    }
    super.addNode(node);
  }

  public changeMode() {
    this.mode = !this.mode;
  }

  public async run(): Promise<any> {
    const res = await (await this.cond)();
    const { ifNodes, elseNodes } = this;
    if (res) {
      for (const node of ifNodes) {
        await (node as Runable).run();
      }
    } else {
      for (const node of elseNodes) {
        await (node as Runable).run();
      }
    }
  }
}
export default Cond;
