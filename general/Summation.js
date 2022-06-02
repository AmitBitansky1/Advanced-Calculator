//Summation Class for storing and using the index, count, and expression of a summation function, and creating a toString function for them
class Summation{
  constructor(index, count, expression){
    this.index = index;
    this.count = count;
    this.expression = expression;
    this.isPositive = true;
  }
  toString(){
    return `\\sum_{${this.index}}^${this.count} ${this.expression}`;
  }
}

export default Summation;