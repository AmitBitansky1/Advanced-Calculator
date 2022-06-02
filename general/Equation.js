//Equation Class for storing and using both sides of an equation and creating a toString function for them
class Equation{
  constructor(expression1, expression2){
    this.expression1 = expression1;
    this.expression2 = expression2;
  }
  toString(){
    return `${this.expression1.toString()} = ${this.expression2.toString()}`;
  }
}


export default Equation;