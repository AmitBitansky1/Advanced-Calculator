//Exponent Class for storing and using the base and power of a number/variable, and creating a toString function for them
class Exponent{
  constructor(base, power){
    this.base = base;
    this.power = power;
    this.isBaseFraction = base.isFraction;
    this.isPowerFraction = power.isFraction;
    if(base >= 0 || base.isPositive){
      this.isPositive = true;
    }else{
      this.isPositive = false;
    }
  }
  toString(radical = false){
    //Check if the exponent is a fraction and if the string should be created in radical form
    if(radical && this.isPowerFraction){
      let exponent = this.power.numerator;
      let root = this.power.denominator;
      //if exponent numerator is 1, don't print it
      if(this.power.numerator == 1){
        exponent = "";
      }
      //if exponent denominator is 2, don't print it
      if(this.power.denominator == 2){
        root = "";
      }
      //if the base is a fraction, and the exponent numerator is not 1, print the fraction with parentheses, else print them normally
      if(this.isBaseFraction && exponent != ""){
        return `\\sqrt[${root}]{{\\left(${(this.base.toString())}\\right)}^${this.power.numerator}}`
    }else{
        return `\\sqrt[${root}]{${this.base.toString()}}^{${exponent}}`;
      }
    }
    //if the base is a fraction and the exponent is not one, print the fraction with parentheses
    if(this.isBaseFraction && this.power != 1){
      return `{\\left(${(this.base.toString())}\\right)}^${this.power}`
    } 
    //If exponent is 1, print base by itself
    else if(this.power != 1){
      return this.base.toString()
    }
    //print exponent normally
    return `{${this.base.toString()}}^{${this.power}}`;
  }
}

export default Exponent;