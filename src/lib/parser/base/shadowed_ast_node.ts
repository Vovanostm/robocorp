import AstNode from './ast_node';

class ShadowedAstNode extends AstNode {
  public get parent(): AstNode | null {
    if (this.parentNode) {
      return this.parentNode.parentNode;
    } else {
      throw new Error('Shadowed Ast must contain 2 parents');
    }
  }
}

export default ShadowedAstNode;
