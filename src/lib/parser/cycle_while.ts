import AstNode from './base/ast_node';
import Runable from './interfaces/runable';

class CycleWhile extends AstNode implements Runable {
  private cond: Promise<any>;
  constructor(cond: any) {
    super('cycleWhile');
    this.cond = cond;
  }
  public async run(): Promise<any> {
    let res = await (await this.cond)();
    while (res) {
      for (const act of this.childNodes) {
        await ((act as any) as Runable).run();
      }
      res = await (await this.cond)();
    }
  }
}
export default CycleWhile;
