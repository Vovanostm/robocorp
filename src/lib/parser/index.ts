import Executor from '../engine';
import Direction from '../engine/direction';
import Action from './action';
import AstNode from './base/ast_node';
import Block from './block';
import Cond from './cond';
import CycleFor from './cycle_for';
import CycleWhile from './cycle_while';
import Func from './func';
import TokensIterator from './tokensIterator';

class Parser {
  public context: AstNode | null;
  private text: string;
  private regexp: RegExp;
  private tokens: string[];
  private ex: Executor;
  constructor(text: string, ex: Executor) {
    this.text = text;
    this.regexp = /[\r\n\s]+/gm;
    this.tokens = [];
    this.ex = ex;
    this.context = new AstNode('base');
  }

  public parse() {
    this.tokens = this.text.trim().split(this.regexp);
    const iterator = new TokensIterator(this.tokens);
    let context = this.context as AstNode;
    while (!iterator.isDone) {
      context = this.parseToken(context, iterator);
    }
    return;
  }

  public getFunction(name: string): Func | null {
    if (!this.context) {
      return null;
    }
    const funcs = this.context.childNodes;
    return (
      (funcs.find((func) => (func as AstNode).name === name) as Func) || null
    );
  }

  private parseToken(context: AstNode, iterator: TokensIterator): AstNode {
    const { value, done } = iterator.next();
    if (done) {
      return context;
    }
    if (value === 'это') {
      const func = this.parseFunctionBegin(iterator);
      context.addNode(func);
      context = func;
    } else if (value === 'конец') {
      context = this.parseFunctionEnd(context);
    } else if (value === 'если') {
      const cond = this.parseСondBegin(iterator);
      context.addNode(cond);
      context = cond;
    } else if (value === 'иначе') {
      context = this.parseСondElse(context, iterator);
    } else if (value === 'повтори') {
      const ast = this.parseCycleFor(context, iterator);
      context.addNode(ast);
      context = ast;
    } else if (value === 'пока') {
      const ast = this.parseCycleWhile(context, iterator);
      context.addNode(ast);
      context = ast;
    } else if (value === '{') {
      const ast = this.parseBlockBegin();
      context.addNode(ast);
      context = ast;
    } else if (value === '}') {
      context = this.parseBlockEnd(context);
    } else {
      if (context) {
        context.addNode(new Action(this.getAction(value), value));
        if (context.type !== 'function' && context.type !== 'block') {
          context = context.getParent() as AstNode;
        }
      }
    }
    return context;
  }

  private parseFunctionBegin(itr: TokensIterator): AstNode {
    const name = itr.next().value;
    return new Func(name);
  }

  private parseFunctionEnd(context: AstNode): AstNode {
    if (context && context.getParent()) {
      return context.getParent() as AstNode;
    } else {
      throw new Error('Ошибка синтаксиса - есть конец, а начала нет');
    }
  }

  private parseBlockBegin(): AstNode {
    return new Block();
  }

  private parseBlockEnd(context: AstNode): AstNode {
    if (!context) {
      throw new Error('Ошибка! Найдена открывающая скобка');
    }
    const p = context.getParent() as AstNode;
    if (p.type === 'block' || p.type === 'function') {
      return context.getParent() as AstNode;
    } else if (p.getParent()) {
      return p.getParent() as AstNode;
    } else {
      throw new Error('Ошибка! Закрывающая скобка не на своём месте');
    }
  }

  private parseСondBegin(iterator: TokensIterator): AstNode {
    const where = iterator.next().value;
    const what = iterator.next().value;
    const to = iterator.next().value;
    const cond = new Cond(this.getCond(where, what));
    return cond;
  }

  private parseСondElse(context: AstNode, iterator: TokensIterator): AstNode {
    if (
      context &&
      context.lastChild &&
      context.lastChild.type === 'condition'
    ) {
      const cnd = context.lastChild as Cond;
      cnd.changeMode();
      return cnd;
    } else {
      throw new Error('Ошибка, иначе не на своём месте!');
    }
  }

  private parseCycleFor(context: AstNode, iterator: TokensIterator): AstNode {
    if (!context) {
      throw new Error('Ошибка! Условия могут быть только внутри функций');
    }
    const count = parseInt(iterator.next().value, 10);
    context = new CycleFor(count);
    return context;
  }

  private parseCycleWhile(context: AstNode, iterator: TokensIterator): AstNode {
    if (!context) {
      throw new Error('Ошибка! Условия могут быть только внутри функций');
    }
    const where = iterator.next().value;
    const what = iterator.next().value;
    context = new CycleWhile(this.getCond(where, what));
    return context;
  }

  private getAction(action: string): () => Promise<any> {
    if (action === 'вверх') {
      return () => this.ex.move(Direction.Up);
    }
    if (action === 'вниз') {
      return () => this.ex.move(Direction.Down);
    }
    if (action === 'влево') {
      return () => this.ex.move(Direction.Left);
    }
    if (action === 'вправо') {
      return () => this.ex.move(Direction.Right);
    }
    return () => {
      const func = this.getFunction(action);
      if (!func) {
        throw new Error('Функция с таким именем не найдена');
      }
      return func.run();
    };
  }

  private getCond(where: string, what: string) {
    return async () => await this.ex.check(where, what);
  }
}
export default Parser;
