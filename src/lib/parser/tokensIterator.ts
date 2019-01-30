class TokensIterator {
  public tokens: string[];
  public nextIndex: number;
  constructor(tokens: string[]) {
    this.tokens = tokens;
    this.nextIndex = 0;
  }

  public get isDone(): boolean {
    return this.nextIndex >= this.tokens.length;
  }

  public next() {
    return this.nextIndex < this.tokens.length
      ? { value: this.tokens[this.nextIndex++], done: false }
      : { value: '', done: true };
  }
  public prev() {
    return this.nextIndex < this.tokens.length
      ? { value: this.tokens[this.nextIndex--], done: false }
      : { value: '', done: true };
  }
}
export default TokensIterator;
