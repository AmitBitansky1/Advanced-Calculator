//Fraction Class for storing and using the numerator and denominator of a fraction, and creating a toString function for them
class newFraction{
  constructor(numerator, denominator){
    this.numerator = numerator;
    this.denominator = denominator;
    if(this.numerator > 0 || this.numerator.isPositive){
      this.isPositive = true;
    } else{
      this.isPositive = false;
    }
    this.isFraction = true;
  }
  toString(){
    return `\\frac{${this.numerator}}{${this.denominator}}`;
  }
  toDecimalString(){
    let numDecimalPlaces = 0;
    let answerSymbol = `≈`;
    if((this.numerator/this.denominator)*10000 % 1000 == 0){
      numDecimalPlaces = 1;
      answerSymbol = `=`;
    } else if((this.numerator/this.denominator)*10000 % 100 == 0){
      numDecimalPlaces = 2;
      answerSymbol = `=`;
    } else if((this.numerator/this.denominator)*10000 % 10 == 0){
      numDecimalPlaces = 3;
      answerSymbol = `=`;
    } else{
      numDecimalPlaces = 3;
    }
    return `${answerSymbol} ${(this.numerator/this.denominator).toFixed(numDecimalPlaces)}`;
  }
}

export default newFraction;