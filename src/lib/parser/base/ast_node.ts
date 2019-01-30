import Runable from '../interfaces/runable';

class AstNode {
  public parentNode: AstNode | null;
  public childNodes: Array<AstNode | Runable>;
  public type: string;
  private $name: string;
  constructor(type: string, name: string = '') {
    this.$name = name;
    this.type = type;
    this.parentNode = null;
    this.childNodes = [];
  }
  public addNode(node: AstNode) {
    node.setParent(this);
    this.childNodes.push(node);
  }
  public get name(): string {
    return this.$name;
  }
  public getParent(): AstNode | null {
    return this.parentNode;
  }
  public get lastChild(): AstNode | null {
    return this.childNodes[this.childNodes.length - 1] as AstNode;
  }
  private setParent(parent: AstNode) {
    this.parentNode = parent;
  }
}

export default AstNode;
