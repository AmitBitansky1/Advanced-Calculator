//Limit Class for storing and using the variable, limitEnd and base of a limit
class Limit{
  constructor(variable, limitEnd, base){
    this.variable = variable;
    this.limitEnd = limitEnd;
    this.base = base;
    this.isPositive = true;
  }
  toString(){
    return `\\lim\\limits_{${this.variable} \\to ${this.limitEnd}} ${this.base.toString()}`;
  }
}

export default Limit;