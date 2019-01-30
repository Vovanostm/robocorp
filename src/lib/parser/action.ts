import AstNode from './base/ast_node';
import Runable from './interfaces/runable';

class Action extends AstNode implements Runable {
  private action: () => Promise<any>;
  constructor(action: () => Promise<any>, name: string = '') {
    super('action', name);
    this.action = action;
  }
  public async run(): Promise<any> {
    return await this.action();
  }
}
export default Action;
