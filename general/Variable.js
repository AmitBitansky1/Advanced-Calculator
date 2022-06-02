//Variable Class for storing and using the coefficient and variable/value of a variable, and creating a toString function for them
class Variable{
  constructor(coefficient, variable){
    this.coefficient = coefficient;
    this.variable = variable;
    if(coefficient >= 0 || coefficient.isPositive){
      this.isPositive = true;
    } else{
      this.isPositive = false;
    }
  }
  toString(){
    if(this.coefficient == 0){
      return 0;
    }
    if(this.coefficient == 1){
      return this.variable.toString();
    }
    if(this.coefficient == -1){
      return `-${this.variable.toString()}`;
    }
    else{
      return `${this.coefficient}${this.variable}`;
    }
  }
}

export default Variable;