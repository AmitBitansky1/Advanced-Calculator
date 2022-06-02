//Logarithm Class for storing and using the base and product of a logarithm, and creating a toString function for them
class Logarithm{
  constructor(base, product){
    this.base = base;
    this.product = product;
    this.isPositive = true;
  }
  toString(){
    return `\\log_${this.base.toString()} ${this.product.toString()}`;
  }
}

export default Logarithm;