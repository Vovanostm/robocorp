import AstNode from './base/ast_node';
import Runable from './interfaces/runable';

class CycleFor extends AstNode implements Runable {
  private count: number;
  constructor(count: number) {
    super('cycleFor');
    this.count = count;
  }
  public async run(): Promise<any> {
    for (let i: number = 0; i < this.count; i++) {
      for (const act of this.childNodes) {
        await ((act as any) as Runable).run();
      }
    }
  }
}
export default CycleFor;
