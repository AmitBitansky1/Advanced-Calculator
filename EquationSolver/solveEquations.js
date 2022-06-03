import Fraction from "../general/Fraction.js";
import Exponent from "../general/Exponent.js";
import GCD from "../general/Gcd.js";
import LCM from "../general/Gcd.js";
import Matrix from "../general/Matrix.js";
import Variable from "../general/Variable.js";
import Expression from "../general/Expression.js";
import Equation from "../general/Equation.js";

//Convert the String into a MathJax Valid String
function MathString(string) {
  return `\\(${string} \\)`;
}

class EquationSolver {
  //Constructor
  constructor(equation1, equation2, equation3) {
    this.equation1 = equation1;
    this.equation2 = equation2;
    this.equation3 = equation3;
  }
  
  //Solving the Equations
  solve() {
    console.log("Solving Equation...");

    let numVars = document.getElementById("numVars").value;
    let method = document.getElementById("methods").value;

    let work = "";

    /*
    Solving a 1 Variable Equation
    */
    if (numVars == 1) {
      //Step 0. Create Original Equation String
      let originalEquationString = this.createOriginalEquationString();
      work += originalEquationString;

      //Step 1. Split the equation by the equals sign
      let equation1Split = this.equation1.split("= ");
      let equation1 = new Equation(equation1Split[0], equation1Split[1]);

      //Step 2. Combine Like Terms of Equation with each side individually. Format: _x +/- _ = _x +/- _
      let combinedLikeTerms = this.combineLikeTerms(equation1);
      let leftX = combinedLikeTerms[0];
      let leftNum = combinedLikeTerms[1];
      let rightX = combinedLikeTerms[2];
      let rightNum = combinedLikeTerms[3];

      let expressionLeft = this.createCombinedTermsExpression([leftX, leftNum]);
      let expressionRight = this.createCombinedTermsExpression([rightX, rightNum]);
      let combinedEquation = new Equation(expressionLeft, expressionRight);
      
      let equation1CombinedLikeTerms = `${combinedEquation.toString()}<br>`;
      if (equation1CombinedLikeTerms != originalEquationString) {
        work += equation1CombinedLikeTerms;
      }

      //Step 3. Combine Like Terms on Both Sides of the Equation. Format: _x = _
      let simplifiedEquationNum = rightNum - leftNum;
      let simplifiedEquationX = new Variable(leftX.coefficient - rightX.coefficient, "x");
      if (simplifiedEquationX.coefficient < 0) {
        simplifiedEquationNum *= -1;
        simplifiedEquationX.coefficient *= -1;
      }
      let simplifiedEquation = new Equation(simplifiedEquationX, simplifiedEquationNum);
      let combinedBothSidesEquationString = `${simplifiedEquation.toString()}<br>`;
      if (equation1CombinedLikeTerms != combinedBothSidesEquationString) {
        work += combinedBothSidesEquationString;
      }
      work += `<br><br>`;
      
      //Step 4. Divide Constant by X's Coefficient to result in answer x = _ with proper formatting
      let answerStrings = this.createAnswerString(simplifiedEquationX.coefficient, simplifiedEquationNum, "x");
      work += answerStrings[0];
      let answer = answerStrings[1];
      
      //Step 5. Display Work and Answers
      document.getElementById("workVar1").innerHTML = work;
      document.getElementById("varX").innerHTML = answer;
      //Update MathJax on screen
      MathJax.typeset();

      console.log("solved");
    }

    /*
    Solving 2 Variable Equations
    Methods: Substitution, Elimination, Gaussian Elimination
    */
    else if (numVars == 2) {

      let variablesList = ["x", "y"];
      //Part 1. Combine like terms and put equation into format: _x +/- _y = _

      //Step 0. Create Original Equation String
      let originalEquationString = this.createOriginalEquationString();
      work += originalEquationString;

      //Step 1. Split the equation by the equals sign
      let equation1Split = this.equation1.split(" = ");
      let equation1 = new Equation(equation1Split[0], equation1Split[1]);
      let equation2Split = this.equation2.split(" = ");
      let equation2 = new Equation(equation2Split[0], equation2Split[1]);
      let equations = [equation1, equation2];
      /*
      //Step 2. Format the left side of the Equation
      //Step 2a. Create array of variables and constants on left side
      let equation1LeftSplit = newEquation1.expression1.split(" ");
      equation1LeftSplit.pop();
      let expressionLeftArray = [];
      for(let index = 0; index < equation1LeftSplit.length; index++){
        if(equation1LeftSplit[index] != " "){
          if(equation1LeftSplit[index] != "+"){
            if(equation1LeftSplit[index].includes("x")){
              let xVariableLeft = null;
              if(equation1LeftSplit[index] == "x"){
                xVariableLeft = new Variable(1, "x");
              }else if(equation1LeftSplit[index] == "-x"){
                xVariableLeft = new Variable(-1, "x");
              } else{
                xVariableLeft = new Variable(parseInt(equation1LeftSplit[index].split("x")), "x");
                xVariableLeft.isPositive = true;
              }
              expressionLeftArray.push(xVariableLeft);
            } else{
              if(equation1LeftSplit[index] == "-"){
                if(equation1LeftSplit[index + 1].includes("x")){
                  if(equation1LeftSplit[index + 1] == "x"){
                  let xVariableLeft = new Variable(-1, "x");
                  expressionLeftArray.push(xVariableLeft);
                    index += 2;
                }else{
                  let xVariableLeft = new Variable(-1*parseInt(equation1LeftSplit[index + 1].split("x")), "x");
                  expressionLeftArray.push(xVariableLeft);
                  index+=2;
                }
                }else{
                   expressionLeftArray.push(-1*parseInt(equation1LeftSplit[index + 1])); 
                  index+=1;
                } 
              }else{
                expressionLeftArray.push(parseInt(equation1LeftSplit[index]));
              }
            }
          }
        }
      }
      //Step 2b. Create separate arrays for variables and constants on left side
      let expressionLeftXArray = [];
      let expressionLeftNumArray = [];
      for(let index = 0; index < expressionLeftArray.length; index++){
        if(expressionLeftArray[index].toString().includes("x")){
          expressionLeftXArray.push(expressionLeftArray[index]);
        } else if(!expressionLeftArray[index].toString().includes("+")){
          expressionLeftNumArray.push(expressionLeftArray[index]);
        }
      }
      //Step 2c. Create Variables for sum of variables and sum of constants on left side
      let leftXSum = 0;
      for(let index = 0; index < expressionLeftXArray.length; index++){
        leftXSum += expressionLeftXArray[index].coefficient;
      }
      let expressionLeftX = new Variable(leftXSum, "x");
      let leftNumSum = 0;
      for(let index = 0; index < expressionLeftNumArray.length; index++){
        leftNumSum += expressionLeftNumArray[index];
      }
      let expressionLeftNum = leftNumSum;
      //Step 2d. Create a left side expression
      let expressionLeft = null;
      if(expressionLeftX.coefficient == 0){
        expressionLeft = new Expression([expressionLeftNum]);
      } else if(expressionLeftNum == 0){
        expressionLeft = new Expression([expressionLeftX]);
      } else{
        expressionLeft = new Expression([expressionLeftX, expressionLeftNum]);
      }

      //Step 3. Format the Right side of the Equation
      //Step 3a. Create array of variables and constants on right side
let equation1RightSplit = newEquation1.expression2.split(" ");
      let expressionRightArray = [];
      for(let index = 0; index < equation1RightSplit.length; index++){
        if(equation1RightSplit[index] != " "){
          if(equation1RightSplit[index] != "+"){
            if(equation1RightSplit[index].includes("x")){
              let xVariableRight = null;
              if(equation1RightSplit[index] == "x"){
                xVariableRight = new Variable(1, "x");
              }else if(equation1RightSplit[index] == "-x"){
                xVariableRight = new Variable(-1, "x");
              } else{
                xVariableRight = new Variable(parseInt(equation1RightSplit[index].split("x")), "x");
                xVariableRight.isPositive = true;
              }
              expressionRightArray.push(xVariableRight);
            } else{
              if(equation1RightSplit[index] == "-"){
                if(equation1RightSplit[index + 1].includes("x")){
                  if(equation1RightSplit[index + 1] == "x"){
                  let xVariableRight = new Variable(-1, "x");
                  expressionRightArray.push(xVariableRight);
                    index += 2;
                }else{
                  let xVariableRight = new Variable(-1*parseInt(equation1RightSplit[index + 1].split("x")), "x");
                  expressionRightArray.push(xVariableRight);
                  index+=2;
                }
                }else{
                   expressionRightArray.push(-1*parseInt(equation1RightSplit[index + 1])); 
                  index+=1;
                } 
              }else{
                expressionRightArray.push(parseInt(equation1RightSplit[index]));
              }
            }
          }
        }
      }
      //Step 3b. Create separate arrays for variables and constants on right side
      let tempExpressionRight = new Expression(expressionRightArray);
      let expressionRightXArray = [];
      let expressionRightNumArray = [];
      for(let index = 0; index < expressionRightArray.length; index++){
        if(expressionRightArray[index].toString().includes("x")){
          expressionRightXArray.push(expressionRightArray[index]);
        } else if(!expressionRightArray[index].toString().includes("+")){
          expressionRightNumArray.push(expressionRightArray[index]);
        }
      }
      //Step 3c. Create Variables for sum of variables and sum of constants on left side
      let rightXSum = 0;
      for(let index = 0; index < expressionRightXArray.length; index++){
        rightXSum += expressionRightXArray[index].coefficient;
      }
      let expressionRightX = new Variable(rightXSum, "x");
      let rightNumSum = 0;
      for(let index = 0; index < expressionRightNumArray.length; index++){
        rightNumSum += expressionRightNumArray[index];
      }
      let expressionRightNum = rightNumSum;
      //Step 3d. Create a right side expression
      let expressionRight = null;
      if(expressionRightX.coefficient == 0){
        expressionRight = new Expression([expressionRightNum]);
      } else if(expressionRightNum == 0){
        expressionRight = new Expression([expressionRightX]);
      } else{
        expressionRight = new Expression([expressionRightX, expressionRightNum]);
      }

      //Step 4. Format Entire Equation
      let simplifiedEquation = new Equation(expressionLeft, expressionRight);
      let combinedOneSideEquationString = `${simplifiedEquation.toString()}<br>`;
      if(combinedOneSideEquationString != originalEquationString){
        work += combinedOneSideEquationString;
      }
      /*
      //Step 4a. Combine all Variables to left side of the equation and constants to right side of the equation
      let simplifiedEquationNum = expressionRightNum - expressionLeftNum;
      let simplifiedEquationX = new Variable(expressionLeftX.coefficient - expressionRightX.coefficient, "x");
      if(simplifiedEquationNum < 0 && simplifiedEquationX.coefficient < 0){
        simplifiedEquationNum *= -1;
        simplifiedEquationX.coefficient *= -1;
      }
      simplifiedEquation = new Equation(simplifiedEquationX, simplifiedEquationNum);
      let combinedBothSidesEquationString = `${simplifiedEquation.toString()}<br>`;
      if(combinedOneSideEquationString != combinedBothSidesEquationString){
        work += combinedBothSidesEquationString;
      }
      work += `<br><br>`;

      
      
      /*
      let x1 = this.coefficientsMatrix[0][0];
      let y1 = this.coefficientsMatrix[0][1];
      let x2 = this.coefficientsMatrix[1][0];
      let y2 = this.coefficientsMatrix[1][1];
      let constant1 = this.constantsMatrix[0][0];
      let constant2 = this.constantsMatrix[1][0];
      
      work += `${x1}x ${toEquationString(y1)}y = ${constant1}<br>`;
      work += `${x2}x ${toEquationString(y2)}y = ${constant2}<br>`;

      y1 *= -1;
      work += "<br>";
      work += `${x1}x = ${constant1} ${toEquationString(y1)}y <br>`;

      let xEquationNumerator = constant1;
      let xEquationDenominator = x1;
      let xEquationFraction = new Fraction(xEquationNumerator, xEquationDenominator);
      let xEquationYNumerator = y1;
      let xEquationYFraction = new Fraction(xEquationYNumerator, xEquationDenominator);
      xEquationYFraction.isCoefficient = true;
      xEquationFraction.reduceIfEqualsOne();
      xEquationYFraction.reduceIfEqualsOne();

      let checkWorkString = xEquationFraction.toString() + xEquationYFraction.toString();
      work += `x = ${xEquationFraction.toString()}${xEquationYFraction.toEquationString()}y`;
      work += "<br>";
      work += "<br>";

      const xEquationFractionX = new Fraction(xEquationFraction.numerator, xEquationFraction.denominator);
      const xEquationFractionY = new Fraction(xEquationYFraction.numerator, xEquationYFraction.denominator);

      work += `${x2}(${xEquationFraction.toString()}${xEquationYFraction.toEquationString()}y) ${toEquationString(y2)}y = ${constant2}<br>`;

      xEquationFraction.multiplyNumber(x2);
      xEquationYFraction.multiplyNumber(x2);

      work += `${xEquationFraction.toString()}${xEquationYFraction.toEquationString()}y ${toEquationString(y2)}y = ${constant2}<br>`;

      let yEquationYFraction = new Fraction(y2 * xEquationYFraction.denominator, xEquationYFraction.denominator);
      let yEquationFraction = new Fraction(constant2 * xEquationFraction.denominator, xEquationFraction.denominator);
      yEquationFraction.isNotSingle = false;
      work += `${xEquationFraction.toString()}${xEquationYFraction.toEquationString()}y ${yEquationYFraction.toEquationString()}y = ${yEquationFraction.toString()}<br>`;
      yEquationYFraction.add(xEquationYFraction);
      yEquationFraction.substract(xEquationFraction);
      work += `${yEquationYFraction.toEquationString()}y = ${yEquationFraction.toString()}<br>`;

      yEquationFraction.divideFraction(yEquationYFraction);

      work += `y = ${yEquationFraction.toString()}<br>`;
      let yCheck = yEquationFraction.toString();
      yEquationFraction.reduce();
      if(yEquationFraction.toString() != yCheck){
        work += `y = ${yEquationFraction.toString()}<br>`;
      }
      work += "<br>";
      
      if(yEquationFraction.denominator != 1 && yEquationFraction.numerator != 0){
        let yDecimal = fractionToDecimal(yEquationFraction.numerator, yEquationFraction.denominator);
        let yAnswerString = `y = ${yEquationFraction.toString()}<br> or y ${yDecimal}`;
        document.getElementById("varY").innerHTML = yAnswerString;
      } else{
        let yAnswerString = `y = ${yEquationFraction.numerator}`;
        document.getElementById("varY").innerHTML = yAnswerString;
      }

      xEquationFraction = xEquationFractionX;
      xEquationYFraction = xEquationFractionY;
      
      work += `x = ${xEquationFraction.toString()}${xEquationYFraction.toEquationString()}(${yEquationFraction.toString()}) <br>`;

      xEquationYFraction.multiplyFraction(yEquationFraction);
      work += `x = ${xEquationFraction.toString()}${xEquationYFraction.toEquationString()}<br>`;
      checkWorkString = `x = ${xEquationFraction.toString()}${xEquationYFraction.toEquationString()}<br>`;

      if(xEquationYFraction.denominator % xEquationFraction.denominator == 0){
        let factor = xEquationYFraction.denominator / xEquationFraction.denominator;
        let factorFraction = new Fraction(factor, factor);
        xEquationFraction.multiplyFraction(factorFraction);
        if(`x = ${xEquationFraction.toString()}${xEquationYFraction.toEquationString()}<br>` != checkWorkString){
          work += `x = ${xEquationFraction.toString()}${xEquationYFraction.toEquationString()}<br>`;
        }
      } else if(xEquationFraction.denominator % xEquationYFraction.denominator == 0){
        let factor = xEquationFraction.denominator / xEquationYFraction.denominator;
        let factorFraction = new Fraction(factor, factor);
        xEquationYFraction.multiplyFraction(factorFraction);
        if(`x = ${xEquationFraction.toString()}${xEquationYFraction.toEquationString()}<br>` != checkWorkString){
          work += `x = ${xEquationFraction.toString()}${xEquationYFraction.toEquationString()}<br>`;
        }
        
      } else{
        let factor = lcm(xEquationFraction.denominator,  xEquationYFraction.denominator);
        let factorFraction = new Fraction(factor, factor);
        xEquationFraction.multiplyFraction(factorFraction);
        xEquationYFraction.multiplyFraction(factorFraction);

        if(`x = ${xEquationFraction.toString()}${xEquationYFraction.toEquationString()}<br>` != checkWorkString){
          work += `x = ${xEquationFraction.toString()}${xEquationYFraction.toEquationString()}<br>`;
        }
      }

      xEquationFraction.add(xEquationYFraction);
      xEquationFraction.isNotSingle = false;
      checkWorkString = `x = ${xEquationYFraction.toString()}<br>`;
      if(`x = ${xEquationFraction.toString()}<br>` != checkWorkString){
        work += `x = ${xEquationFraction.toString()}<br>`;
      }
      let checkX = xEquationFraction.toString();
      xEquationFraction.reduce();
      if(xEquationFraction.toString() != checkX){
        work += `x = ${xEquationFraction.toString()}<br>`;
      }
      if(xEquationFraction.denominator != 1 && xEquationFraction.numerator != 0){
        let xDecimal = fractionToDecimal(xEquationFraction.numerator, xEquationFraction.denominator);
        let xAnswerString = `x = ${xEquationFraction.toString()}<br> or x ${xDecimal}`;
        document.getElementById("varX").innerHTML = xAnswerString;
      } else{
        let xAnswerString = `x = ${xEquationFraction.numerator}`;
        document.getElementById("varX").innerHTML = xAnswerString;
      }
      */
      document.getElementById("workVar2").innerHTML = work;
      MathJax.typeset();

      console.log("solved");
    }
    /*
    Solving Equations for 3 Variables
    Methods: Elimination, Gaussian Elimination
    */
    else if (numVars == 3) {
      //Create Coefficients Matrix
      let x1 = this.coefficientsMatrix[0][0];
      let y1 = this.coefficientsMatrix[0][1];
      let z1 = this.coefficientsMatrix[0][2];
      let x2 = this.coefficientsMatrix[1][0];
      let y2 = this.coefficientsMatrix[1][1];
      let z2 = this.coefficientsMatrix[1][2];
      let x3 = this.coefficientsMatrix[2][0];
      let y3 = this.coefficientsMatrix[2][1];
      let z3 = this.coefficientsMatrix[2][2];
      //Create Constants Matrix
      let constant1 = this.constantsMatrix[0][0];
      let constant2 = this.constantsMatrix[1][0];
      let constant3 = this.constantsMatrix[2][0];

      //Display Equations
      work += `${x1}x ${toEquationString(y1)}y ${toEquationString(z1)}z = ${constant1}<br>`;
      work += `${x2}x ${toEquationString(y2)}y ${toEquationString(z2)}z = ${constant2}<br>`;
      work += `${x3}x ${toEquationString(y3)}y ${toEquationString(z3)}z = ${constant3}<br>`;

      //Display Coefficient and Constant Matrices
      work += matrixString(this.coefficientsMatrix, this.constantsMatrix);

      //Step 1: Matrix of Minors: Determinant of that values not in its row and column    
      let determinantVal = 0;
      this.matrixOfMinors = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
      for (let row = 0; row < 3; row++) {
        for (let column = 0; column < 3; column++) {
          if (row == 0) {
            var remainingRow1 = 1;
            var remainingRow2 = 2;
          } else if (row == 1) {
            var remainingRow1 = 0;
            var remainingRow2 = 2;
          } else {
            var remainingRow1 = 0;
            var remainingRow2 = 1;
          }
          if (column == 0) {
            var remainingColumn1 = 1;
            var remainingColumn2 = 2;
          } else if (column == 1) {
            var remainingColumn1 = 0;
            var remainingColumn2 = 2;
          } else {
            var remainingColumn1 = 0;
            var remainingColumn2 = 1;
          }
          let detA = this.coefficientsMatrix[remainingRow1][remainingColumn1];
          let detB = this.coefficientsMatrix[remainingRow1][remainingColumn2];
          let detC = this.coefficientsMatrix[remainingRow2][remainingColumn1];
          let detD = this.coefficientsMatrix[remainingRow2][remainingColumn2];
          determinantVal = ((detA * detD) - (detB * detC));
          this.matrixOfMinors[row][column] = determinantVal;
        }
      }
      work += `<br>`;
      work += matrixString(this.matrixOfMinors, this.constantsMatrix);

      //2. Matrix of Cofactors: Apply a checkerboard of negative signs
      this.matrixOfCofactors = [[this.matrixOfMinors[0][0], this.matrixOfMinors[0][1], this.matrixOfMinors[0][2]], [this.matrixOfMinors[1][0], this.matrixOfMinors[1][1], this.matrixOfMinors[1][2]], [this.matrixOfMinors[2][0], this.matrixOfMinors[2][1], this.matrixOfMinors[2][2]]];

      this.matrixOfCofactors[0][1] *= -1;
      this.matrixOfCofactors[1][0] *= -1;
      this.matrixOfCofactors[1][2] *= -1;
      this.matrixOfCofactors[2][1] *= -1;

      work += `<br>`;
      work += matrixString(this.matrixOfCofactors, this.constantsMatrix);

      //3. Adjugate (Swap Variables over the diagonal)
      this.adjugatedMatrixOfCofactors = [[this.matrixOfCofactors[0][0], this.matrixOfCofactors[0][1], this.matrixOfCofactors[0][2]], [this.matrixOfCofactors[1][0], this.matrixOfCofactors[1][1], this.matrixOfCofactors[1][2]], [this.matrixOfCofactors[2][0], this.matrixOfCofactors[2][1], this.matrixOfCofactors[2][2]]];
      let tempNum = this.adjugatedMatrixOfCofactors[0][1];
      this.adjugatedMatrixOfCofactors[0][1] = this.adjugatedMatrixOfCofactors[1][0];
      this.adjugatedMatrixOfCofactors[1][0] = tempNum;
      tempNum = this.adjugatedMatrixOfCofactors[0][2];
      this.adjugatedMatrixOfCofactors[0][2] = this.adjugatedMatrixOfCofactors[2][0];
      this.adjugatedMatrixOfCofactors[2][0] = tempNum;
      tempNum = this.adjugatedMatrixOfCofactors[1][2];
      this.adjugatedMatrixOfCofactors[1][2] = this.adjugatedMatrixOfCofactors[2][1];
      this.adjugatedMatrixOfCofactors[2][1] = tempNum;

      work += `<br>`;
      work += matrixString(this.adjugatedMatrixOfCofactors, this.constantsMatrix);

      //4. Get Inverse of the Matrix by Multiply by 1/determinant (Note: We can multiply original top row elements by the cofactor)
      let detRowOne = (this.coefficientsMatrix[0][0] * this.matrixOfCofactors[0][0]);
      let detRowTwo = (this.coefficientsMatrix[0][1] * this.matrixOfCofactors[0][1]);
      let detRowThree = (this.coefficientsMatrix[0][2] * this.matrixOfCofactors[0][2]);
      determinantVal = (detRowOne + detRowTwo + detRowThree);
      work += `<br>Determinant Value: ${determinantVal}<br>`;
      let determinantReciprocal = new Fraction(1, determinantVal);
      this.inverseCoefficientsMatrix = [[determinantReciprocal, determinantReciprocal, determinantReciprocal], [determinantReciprocal, determinantReciprocal, determinantReciprocal], [determinantReciprocal, determinantReciprocal, determinantReciprocal]];

      for (let row = 0; row < 3; row++) {
        for (let column = 0; column < 3; column++) {
          determinantReciprocal = new Fraction(1, determinantVal);
          this.inverseCoefficientsMatrix[row][column] = (determinantReciprocal.outputMultiplyNumber(this.adjugatedMatrixOfCofactors[row][column]));
        }
      }

      work += `<br>`;
      work += matrixFractionString(this.inverseCoefficientsMatrix, this.constantsMatrix);

      //Part 2: Multiply the Inverse of Coefficients Matrix by the Constants Matrix (Dot Product)
      /*(this.inverseCoefficientsMatrix[0][0].multiplyNumber(constant1)).add(this.inverseCoefficientsMatrix[0][1].multiplyNumber(constant2);
      let xRow2 = this.inverseCoefficientsMatrix[0][1].multiplyNumber(constant2);
      let xRow3 = this.inverseCoefficientsMatrix[0][2].multiplyNumber(constant3);
      xRow1.add(xRow2);
      console.log(xRow1);
      */

      this.inverseCoefficientsMatrix[0][0].multiplyNumber(constant1);
      this.inverseCoefficientsMatrix[0][1].multiplyNumber(constant2);
      this.inverseCoefficientsMatrix[0][2].multiplyNumber(constant3);
      this.inverseCoefficientsMatrix[1][0].multiplyNumber(constant1);
      this.inverseCoefficientsMatrix[1][1].multiplyNumber(constant2);
      this.inverseCoefficientsMatrix[1][2].multiplyNumber(constant3);
      this.inverseCoefficientsMatrix[2][0].multiplyNumber(constant1);
      this.inverseCoefficientsMatrix[2][1].multiplyNumber(constant2);
      this.inverseCoefficientsMatrix[2][2].multiplyNumber(constant3);

      this.answerMatrix = [[new Fraction(0, 1)], [new Fraction(0, 1)], [new Fraction(0, 1)]];
      //x answer
      this.answerMatrix[0][0] = this.inverseCoefficientsMatrix[0][0];
      this.answerMatrix[0][0].add(this.inverseCoefficientsMatrix[0][1]);
      this.answerMatrix[0][0].add(this.inverseCoefficientsMatrix[0][2]);
      this.answerMatrix[0][0].reduce();
      const x = this.answerMatrix[0][0].toString();
      //y answer
      this.answerMatrix[1][0] = this.inverseCoefficientsMatrix[1][0];
      this.answerMatrix[1][0].add(this.inverseCoefficientsMatrix[1][1]);
      this.answerMatrix[1][0].add(this.inverseCoefficientsMatrix[1][2]);
      this.answerMatrix[1][0].reduce();
      const y = this.answerMatrix[1][0].toString();
      //z answer
      this.answerMatrix[2][0] = this.inverseCoefficientsMatrix[2][0];
      this.answerMatrix[2][0].add(this.inverseCoefficientsMatrix[2][1]);
      this.answerMatrix[2][0].add(this.inverseCoefficientsMatrix[2][2]);
      this.answerMatrix[2][0].reduce();
      const z = this.answerMatrix[2][0].toString();

      work += `[${x.toString()}]<br>
               [${y.toString()}]<br>
               [${z.toString()}]<br>`;

      //Add Work to HTML page

      //x answer
      if (this.answerMatrix[0][0].denominator != 1 && this.answerMatrix[0][0].numerator != 0) {
        let xDecimal = fractionToDecimal(this.answerMatrix[0][0].numerator, this.answerMatrix[0][0].denominator);
        let xAnswerString = `x = ${this.answerMatrix[0][0].toString()}<br> or x ${xDecimal}`;
        document.getElementById("varX").innerHTML = xAnswerString;
      } else {
        let xAnswerString = `x = ${this.answerMatrix[0][0].numerator}`;
        document.getElementById("varX").innerHTML = xAnswerString;
      }
      //y answer
      if (this.answerMatrix[1][0].denominator != 1 && this.answerMatrix[1][0].numerator != 0) {
        let yDecimal = fractionToDecimal(this.answerMatrix[1][0].numerator, this.answerMatrix[1][0].denominator);
        let yAnswerString = `y = ${this.answerMatrix[1][0].toString()}<br> or y ${yDecimal}`;
        document.getElementById("varY").innerHTML = yAnswerString;
      } else {
        let yAnswerString = `y = ${this.answerMatrix[1][0].numerator}`;
        document.getElementById("varY").innerHTML = yAnswerString;
      }
      //z answer
      if (this.answerMatrix[2][0].denominator != 1 && this.answerMatrix[2][0].numerator != 0) {
        let zDecimal = fractionToDecimal(this.answerMatrix[2][0].numerator, this.answerMatrix[2][0].denominator);
        let zAnswerString = `z = ${this.answerMatrix[2][0].toString()}<br> or z ${zDecimal}`;
        document.getElementById("varZ").innerHTML = zAnswerString;
      } else {
        let zAnswerString = `z = ${this.answerMatrix[2][0].numerator}`;
        document.getElementById("varZ").innerHTML = zAnswerString;
      }
      document.getElementById("workVar3").innerHTML = work;
      console.log("solved");
    }
  }

  //Create orginal equations for 1, 2, and/or 3 equations//
  createOriginalEquationString() {
    let equations = [this.equation1, this.equation2, this.equation3];
    let originalEquationString = "";
    let numVars = document.getElementById("numVars").value;
    for (let i = 0; i < numVars; i++) {
      let equationSplit = equations[i].split("");
      for (let index = 0; index < equationSplit.length; index++) {
        //If it isnt a minus sign, print it normally
        if (equationSplit[index] != "-") {
          originalEquationString += equationSplit[index];
        } 
        //If it is a minus sign
        else {
          //If the next element is not a space then print a minus sign then the next element
          if (index + 1 != " ") {
            originalEquationString += equationSplit[index];
            index += 1;
            originalEquationString += equationSplit[index];
          } 
          //If the next element is not a space then jump to next element
          else {
            index += 2;
            //If element is an x
            if (equationSplit[index].includes("x")) {
              let xSplit = equationSplit[index].split("x");
              if (equationSplit[index] != "x") {
                originalEquationString += `${-1 * parseInt(xSplit[1])}x`;
              } else {
                originalEquationString += `-x`;
              }
            } 
            //If element is a y
            else if (equationSplit[index].includes("y")) {
              let ySplit = equationSplit[index].split("y");
              if (equationSplit[index] != "y") {
                originalEquationString += `${-1 * parseInt(ySplit[1])}y`;
              } else {
                originalEquationString += `-y`;
              }
            } 
            //If element is a z
            else if (equationSplit[index].includes("z")) {
              let zSplit = equationSplit[index].split("z");
              if (equationSplit[index] != "z") {
                originalEquationString += `${-1 * parseInt(zSplit[1])}z`;
              } else {
                originalEquationString += `-z`;
              }
            } 
            //If element is a number
            else {
              originalEquationString += -1 * equationSplit[index];
            }
          }
        }

      }
      originalEquationString += "<br>";
    }
    return originalEquationString;
  }

  //Combine Like Terms of an Equation, both sides of the equation separately//
  combineLikeTerms(equation1, equation2 = null, equation3 = null) {
    let equations = [equation1, equation2, equation3];
    let numVars = document.getElementById("numVars").value;
    //Loop through all equations

    let expressionLeftX = 0;
    let expressionLeftY = 0;
    let expressionLeftZ = 0;
    let expressionLeftNum = 0;
    let expressionRightX = 0;
    let expressionRightY = 0;
    let expressionRightZ = 0;
    let expressionRightNum = 0;

    let expressions = [];
    
    for (let i = 0; i < numVars; i++) {
      //Step 1. Format the left side of the Equation
      
      //Step 1a. Create array of variables and constants on left side
      let equation1LeftSplit = equations[i].expression1.split(" ");
      equation1LeftSplit.pop();
      let expressionLeftArray = [];
      for (let index = 0; index < equation1LeftSplit.length; index++) {
        if (equation1LeftSplit[index] != "+") {
          if (equation1LeftSplit[index].includes("x")) {
            let xVariableLeft = null;
            if (equation1LeftSplit[index] == "x") {
              xVariableLeft = new Variable(1, "x");
            } else if (equation1LeftSplit[index] == "-x") {
              xVariableLeft = new Variable(-1, "x");
            } else {
              xVariableLeft = new Variable(parseInt(equation1LeftSplit[index].split("x")), "x");
              xVariableLeft.isPositive = true;
            }
            expressionLeftArray.push(xVariableLeft);
          } else if (equation1LeftSplit[index].includes("y")) {
            let yVariableLeft = null;
            if (equation1LeftSplit[index] == "y") {
              yVariableLeft = new Variable(1, "y");
            } else if (equation1LeftSplit[index] == "-y") {
              yVariableLeft = new Variable(-1, "y");
            } else {
              yVariableLeft = new Variable(parseInt(equation1LeftSplit[index].split("y")), "y");
              yVariableLeft.isPositive = true;
            }
            expressionLeftArray.push(yVariableLeft);
          } else if (equation1LeftSplit[index].includes("z")) {
            let zVariableLeft = null;
            if (equation1LeftSplit[index] == "z") {
              zVariableLeft = new Variable(1, "z");
            } else if (equation1LeftSplit[index] == "-z") {
              zVariableLeft = new Variable(-1, "z");
            } else {
              zVariableLeft = new Variable(parseInt(equation1LeftSplit[index].split("z")), "z");
              zVariableLeft.isPositive = true;
            }
            expressionLeftArray.push(zVariableLeft);
          } else {
            if (equation1LeftSplit[index] == "-") {
              if (equation1LeftSplit[index + 1].includes("x")) {
                if (equation1LeftSplit[index + 1] == "x") {
                  let xVariableLeft = new Variable(-1, "x");
                  expressionLeftArray.push(xVariableLeft);
                  index += 1;
                } else {
                  let xVariableLeft = new Variable(-1 * parseInt(equation1LeftSplit[index + 1].split("x")), "x");
                  expressionLeftArray.push(xVariableLeft);
                  index += 1;
                }
              } else if (equation1LeftSplit[index + 1].includes("y")) {
                if (equation1LeftSplit[index + 1] == "y") {
                  let yVariableLeft = new Variable(-1, "y");
                  expressionLeftArray.push(yVariableLeft);
                  index += 1;
                } else {
                  let yVariableLeft = new Variable(-1 * parseInt(equation1LeftSplit[index + 1].split("y")), "y");
                  expressionLeftArray.push(yVariableLeft);
                  index += 1;
                }
              } else if (equation1LeftSplit[index + 1].includes("z")) {
                if (equation1LeftSplit[index + 1] == "z") {
                  let zVariableLeft = new Variable(-1, "z");
                  expressionLeftArray.push(zVariableLeft);
                  index += 1;
                } else {
                  let zVariableLeft = new Variable(-1 * parseInt(equation1LeftSplit[index + 1].split("z")), "z");
                  expressionLeftArray.push(zVariableLeft);
                  index += 1;
                }
              } else{
                index += 1;
                expressionLeftArray.push(-1 * parseInt(equation1LeftSplit[index]));
              }
            } else {
              expressionLeftArray.push(parseInt(equation1LeftSplit[index]));
            }
          }
        }
      }
      //Step 1b. Create separate arrays for variables and constants on left side
      let expressionLeftXArray = [];
      let expressionLeftYArray = [];
      let expressionLeftZArray = [];
      let expressionLeftNumArray = [];
      for (let index = 0; index < expressionLeftArray.length; index++) {
        if (expressionLeftArray[index].toString().includes("x")) {
          expressionLeftXArray.push(expressionLeftArray[index]);
        } else if (expressionLeftArray[index].toString().includes("y")) {
          expressionLeftYArray.push(expressionLeftArray[index]);
        } else if (expressionLeftArray[index].toString().includes("z")) {
          expressionLeftZArray.push(expressionLeftArray[index]);
        } else if (!expressionLeftArray[index].toString().includes("+")) {
          expressionLeftNumArray.push(expressionLeftArray[index]);
        }
      }
      //Step 1c. Create Variables for sum of variables and sum of constants on left side
      let leftXSum = 0;
      for (let index = 0; index < expressionLeftXArray.length; index++) {
        leftXSum += expressionLeftXArray[index].coefficient;
      }
      expressionLeftX = new Variable(leftXSum, "x");
      let leftYSum = 0;
      for (let index = 0; index < expressionLeftYArray.length; index++) {
        leftYSum += expressionLeftYArray[index].coefficient;
      }
      expressionLeftY = new Variable(leftYSum, "y");
      let leftZSum = 0;
      for (let index = 0; index < expressionLeftZArray.length; index++) {
        leftZSum += expressionLeftZArray[index].coefficient;
      }
      expressionLeftZ = new Variable(leftZSum, "z");
      let leftNumSum = 0;
      for (let index = 0; index < expressionLeftNumArray.length; index++) {
        leftNumSum += expressionLeftNumArray[index];
      }
      expressionLeftNum = leftNumSum;

      //Step 2. Format the Right side of the Equation
      
      //Step 2a. Create array of variables and constants on right side
      let equation1RightSplit = equations[i].expression2.split(" ");
      let expressionRightArray = [];
      for (let index = 0; index < equation1RightSplit.length; index++) {
        if (equation1RightSplit[index] != "+") {
          if (equation1RightSplit[index].includes("x")) {
            let xVariableRight = null;
            if (equation1RightSplit[index] == "x") {
              xVariableRight = new Variable(1, "x");
            } else if (equation1RightSplit[index] == "-x") {
              xVariableRight = new Variable(-1, "x");
            } else {
              xVariableRight = new Variable(parseInt(equation1RightSplit[index].split("x")), "x");
              xVariableRight.isPositive = true;
            }
            expressionRightArray.push(xVariableRight);
          } else if (equation1RightSplit[index].includes("y")) {
            let yVariableRight = null;
            if (equation1RightSplit[index] == "y") {
              yVariableRight = new Variable(1, "y");
            } else if (equation1RightSplit[index] == "-y") {
              yVariableRight = new Variable(-1, "y");
            } else {
              yVariableRight = new Variable(parseInt(equation1RightSplit[index].split("y")), "y");
              yVariableRight.isPositive = true;
            }
            expressionRightArray.push(yVariableRight);
          } else if (equation1RightSplit[index].includes("z")) {
            let zVariableRight = null;
            if (equation1RightSplit[index] == "z") {
              zVariableRight = new Variable(1, "z");
            } else if (equation1RightSplit[index] == "-z") {
              zVariableRight = new Variable(-1, "z");
            } else {
              zVariableRight = new Variable(parseInt(equation1RightSplit[index].split("z")), "z");
              zVariableRight.isPositive = true;
            }
            expressionRightArray.push(zVariableRight);
          } else{
            if (equation1RightSplit[index] == "-") {
              if (equation1RightSplit[index + 1].includes("x")) {
                if (equation1RightSplit[index + 1] == "x") {
                  let xVariableRight = new Variable(-1, "x");
                  expressionRightArray.push(xVariableRight);
                  index += 2;
                } else {
                  let xVariableRight = new Variable(-1 * parseInt(equation1RightSplit[index + 1].split("x")), "x");
                  expressionRightArray.push(xVariableRight);
                  index += 2;
                }
              } else if (equation1RightSplit[index + 1].includes("y")) {
                if (equation1RightSplit[index + 1] == "y") {
                  let yVariableRight = new Variable(-1, "y");
                  expressionRightArray.push(yVariableRight);
                  index += 2;
                } else {
                  let yVariableRight = new Variable(-1 * parseInt(equation1RightSplit[index + 1].split("y")), "y");
                  expressionRightArray.push(yVariableRight);
                  index += 2;
                }
              } else if (equation1RightSplit[index + 1].includes("z")) {
                if (equation1RightSplit[index + 1] == "z") {
                  let zVariableRight = new Variable(-1, "z");
                  expressionRightArray.push(zVariableRight);
                  index += 2;
                } else {
                  let zVariableRight = new Variable(-1 * parseInt(equation1RightSplit[index + 1].split("z")), "z");
                  expressionRightArray.push(zVariableRight);
                  index += 2;
                }
              } else{
                expressionRightArray.push(-1 * parseInt(equation1RightSplit[index + 1]));
                index += 1;
              }
            } else {
              expressionRightArray.push(parseInt(equation1RightSplit[index]));
            }
          }
        }
      }
      //Step 2b. Create separate arrays for variables and constants on right side
      let expressionRightXArray = [];
      let expressionRightYArray = [];
      let expressionRightZArray = [];
      let expressionRightNumArray = [];
      for (let index = 0; index < expressionRightArray.length; index++) {
        if (expressionRightArray[index].toString().includes("x")) {
          expressionRightXArray.push(expressionRightArray[index]);
        } else if (expressionRightArray[index].toString().includes("y")) {
          expressionRightYArray.push(expressionRightArray[index]);
        } else if (expressionRightArray[index].toString().includes("z")) {
          expressionRightZArray.push(expressionRightArray[index]);
        } else if (!expressionRightArray[index].toString().includes("+")) {
          expressionRightNumArray.push(expressionRightArray[index]);
        }
      }
      //Step 2c. Create Variables for sum of variables and sum of constants on left side
      let rightXSum = 0;
      for (let index = 0; index < expressionRightXArray.length; index++) {
        rightXSum += expressionRightXArray[index].coefficient;
      }
      expressionRightX = new Variable(rightXSum, "x");
      let rightYSum = 0;
      for (let index = 0; index < expressionRightYArray.length; index++) {
        rightYSum += expressionRightYArray[index].coefficient;
      }
      expressionRightY = new Variable(rightYSum, "y");
      let rightZSum = 0;
      for (let index = 0; index < expressionRightZArray.length; index++) {
        rightZSum += expressionRightZArray[index].coefficient;
      }
      expressionRightZ = new Variable(rightZSum, "z");
      let rightNumSum = 0;
      for (let index = 0; index < expressionRightNumArray.length; index++) {
        rightNumSum += expressionRightNumArray[index];
      }
      expressionRightNum = rightNumSum;
      
      if (numVars == 1) {
        expressions.push([expressionLeftX, expressionLeftNum, expressionRightX, expressionRightNum]);
      } else if (numVars == 2) {
        expressions.push([expressionLeftX, expressionLeftY, expressionLeftNum, expressionRightX, expressionRightY, expressionRightNum]);
      } else if (numVars == 3) {
        expressions.push([expressionLeftX, expressionLeftY, expressionLeftZ, expressionLeftNum, expressionRightX, expressionRightY, expressionRightZ, expressionRightNum]);
      }
    }
    //Step 3 Output correct Variables
    if (numVars == 1) {
      return expressions[0];
    } else if (numVars == 2) {
      return [expressions[0], expressions[1]];
    } else if (numVars == 3) {
      return expressions;
    }
  }

  //Create Expressions based off the values of the combined terms
  createCombinedTermsExpression(combinedExpressionArray){
    let newExpressionArray = [];
    for(let i = 0; i < combinedExpressionArray.length; i++){
      if(combinedExpressionArray[i] != 0){
        newExpressionArray.push(combinedExpressionArray[i]);
      }
    }
    return new Expression(newExpressionArray);
  }

  //Create Answer String
  createAnswerString(coefficient, num, variable){
    let work = "";
    let answer = "";

    //Step 1. No Solution Answers
    if (coefficient == 0 && num != 0) {
      work += `No Solution <br> ${MathString(`0 \\ne ${num}`)}`;
      answer = `No Solution <br> ${MathString(`\\text{${variable} = }\\varnothing`)}`;
    }
    //Step 2. All Real Numbers Answers
    else if (coefficient == 0) {
      work += `${variable} = ${MathString(`\\in \\mathbb{R}`)}`;
      answer = `${variable} ${MathString(`\\in \\mathbb{R}`)}`;
    }
    //Step 3. Integer Answers
    else if (coefficient == 1 || coefficient == -1 || num == 0) {
      if (coefficient == -1) {
        num *= -1;
      }
      work += `${variable} = ${num}`;
      answer = `${variable} = ${num}`;
    }
    //Step 4. Fraction/Decimal Answers
    else {
      //Step 4a. Fractions Reduceable to Integers Answers
      if (num % coefficient == 0) {
        num /= coefficient;
        work += `${variable} = ${num}`;
        answer = `${variable} = ${num}`;
      }
      else {
        //Step 4b. Simply Fractions
        if (GCD(num, coefficient) != 0) {
          let ratio = GCD(num, coefficient);
          num /= ratio;
          coefficient /= ratio;
        }
        //Step 4c. New Integer Answers
        if (coefficient == 1 || coefficient == -1) {
          if (coefficient == -1) {
            num *= -1;
          }
          work += `${variable} = ${num}`;
          answer = `${variable} = ${num}`;
        }
        //Step 4d. Non-Reduceable Fraction Answers
        else {
          let answerFraction = new Fraction(num, coefficient);
          coefficient = 1;
          work += `x = ${MathString(answerFraction.toString())} <br>`;
          answer = `x = ${MathString(answerFraction.toString())} <br> or <br>x ${MathString(answerFraction.toDecimalString())}`;
        }
      }
    }
  
    return [work, answer];
  }

  //Create Coefficients Matrix
  createCoefficientsMatrix(equation1, equation2, equation3) {
    
  }

  //Create Constants Matrix
  createConstantsMatrix(equation1, equation2, equation3) {
    
  }
}

export default EquationSolver;