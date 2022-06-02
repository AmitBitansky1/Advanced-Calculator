//Expression Class for storing and using elements of an expression and creating a toString function for the expression
class Expression{
  constructor(expressionArray){
    this.expressionArray = expressionArray;
    if(expressionArray[0] >= 0 || expressionArray[0].isPostive){
      this.isPositive = true;
    }else{
      this.isPositive = false;
    }
  }
  toString(){
    let expressionString = ``;
    for(let index = 0; index < this.expressionArray.length; index++){
      //Print this element with a plus sign before it, if it's not the first element and it's positive
      if(this.expressionArray[index + 1] == 0){
        expressionString += "";
        index += 3;
      }
      else if(index != 0 && (this.expressionArray[index] > 0 || this.expressionArray[index].isPositive)){
        expressionString += `+ `;
      }
      expressionString += `${this.expressionArray[index].toString()}`;
      if(index != this.expressionArray.length - 1){
        expressionString += ` `;
      }
    }
    return expressionString;
  }
}

export default Expression;