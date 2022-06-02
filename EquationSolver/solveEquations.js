import newFraction from "../general/Fraction.js";
import Exponent from "../general/Exponent.js";
import GCD from "../general/Gcd.js";
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
      //Part 1. Combine like terms and put equation into format: _x = _

      //Step 0. Create Original Equation String
      let originalEquationString = this.createOriginalEquationString();
      work += originalEquationString;

      //Step 1. Split the equation by the equals sign
      let equation1Split = this.equation1.split("= ");
      let equation1 = new Equation(equation1Split[0], equation1Split[1]);

      //Step 2. Combine Like Terms of Equation with each side individually
      let expressionsCombinedLikeTerms = this.combineLikeTermsEquation(equation1);
      let leftX = expressionsCombinedLikeTerms[0];
      let leftNum = expressionsCombinedLikeTerms[1];
      let rightX = expressionsCombinedLikeTerms[2];
      let rightNum = expressionsCombinedLikeTerms[3];

      let expressionLeft = null;
      if (leftX.coefficient == 0) {
        expressionLeft = new Expression([leftNum]);
      } else if (leftNum == 0) {
        expressionLeft = new Expression([leftX]);
      } else {
        expressionLeft = new Expression([leftX, leftNum]);
      }

      let expressionRight = null;
      if (rightX.coefficient == 0) {
        expressionRight = new Expression([rightNum]);
      } else if (rightNum == 0) {
        expressionRight = new Expression([rightX]);
      } else {
        expressionRight = new Expression([rightX, rightNum]);
      }
      let combinedEquation = new Equation(expressionLeft, expressionRight);
      let equation1CombinedLikeTerms = `${combinedEquation.toString()}<br>`;
      if (equation1CombinedLikeTerms != originalEquationString) {
        work += equation1CombinedLikeTerms;
      }

      //Step 3. Combine Like Terms on Both Sides of the Equation
      let simplifiedEquationNum = rightNum - leftNum;
      let simplifiedEquationX = new Variable(leftX.coefficient - rightX.coefficient, "x");
      if (simplifiedEquationNum < 0 && simplifiedEquationX.coefficient < 0) {
        simplifiedEquationNum *= -1;
        simplifiedEquationX.coefficient *= -1;
      }
      let simplifiedEquation = new Equation(simplifiedEquationX, simplifiedEquationNum);
      let combinedBothSidesEquationString = `${simplifiedEquation.toString()}<br>`;
      if (equation1CombinedLikeTerms != combinedBothSidesEquationString) {
        work += combinedBothSidesEquationString;
      }
      work += `<br><br>`;

      //Part 2. Divide Constant by X's Coefficient to result in answer x = _
      let answer = "";
      //Step 1. No Solution Answers
      if (simplifiedEquationX.coefficient == 0 && simplifiedEquationNum != 0) {
        work += `No Solution <br> ${MathString(`0 \\ne ${simplifiedEquationNum}`)}`;
        answer = `No Solution <br> ${MathString(`0 \\ne ${simplifiedEquationNum}`)}`;
      }
      //Step 2. All Real Numbers Answers
      else if (simplifiedEquationX.coefficient == 0) {
        work += `x = ${MathString(`\\in \\mathbb{R}`)}`;
        answer = `x ${MathString(`\\in \\mathbb{R}`)}`;
      }
      //Step 3. All Integer Answers
      else if (simplifiedEquationX.coefficient == 1 || simplifiedEquationX.coefficient == -1) {
        if (simplifiedEquationX.coefficient == -1) {
          simplifiedEquationNum *= -1;
        }
        work += `x = ${simplifiedEquationNum}`;
        answer = `x = ${simplifiedEquationNum}`;
      }
      //Step 4. All Fraction/Decimal Answers
      else {
        //Step 4a. Fractions Reduceable to Integers Answers
        if (simplifiedEquationNum / simplifiedEquationX.coefficient == 0) {
          let ratio = simplifiedEquationNum / simplifiedEquationX.coefficient;
          simplifiedEquationNum /= ratio;
          work += `x = ${simplifiedEquationNum}`;
          answer = `x = ${simplifiedEquationNum}`;
        }
        else {
          //Step 4b. Simply Fractions
          if (GCD(simplifiedEquationNum, simplifiedEquationX.coefficient) != 0) {
            let ratio = GCD(simplifiedEquationNum, simplifiedEquationX.coefficient);
            simplifiedEquationNum /= ratio;
            simplifiedEquationX.coefficient /= ratio;
          }
          //Step 4c. New Integer Answers
          if (simplifiedEquationX.coefficient == 1 || simplifiedEquationX.coefficient == -1) {
            if (simplifiedEquationX.coefficient == -1) {
              simplifiedEquationNum *= -1;
            }
            work += `x = ${simplifiedEquationNum}`;
            answer = `x = ${simplifiedEquationNum}`;
          }
          //Step 4d. Non-Reduceable Fraction Answers
          else {
            let answerFraction = new newFraction(simplifiedEquationNum, simplifiedEquationX.coefficient);
            simplifiedEquationX.coefficient = 1;
            work += `x = ${MathString(answerFraction.toString())} <br>`;
            answer = `x = ${MathString(answerFraction.toString())} <br> or <br>x ${MathString(answerFraction.toDecimalString())}`;
          }
        }
      }

      //Display Work and Answers
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

  /*
  Create orginal equations for 1, 2, and/or 3 equations
  */
  createOriginalEquationString() {
    let equations = [this.equation1, this.equation2, this.equation3];
    let originalEquationString = "";
    let numVars = document.getElementById("numVars").value;
    for (let i = 0; i < numVars; i++) {
      let equationSplit = equations[i].split("");
      for (let index = 0; index < equationSplit.length; index++) {
        if (equationSplit[index] != "-") {
          originalEquationString += equationSplit[index];
        } else {
          if (index + 1 != " ") {
            originalEquationString += equationSplit[index];
            index += 1;
            originalEquationString += equationSplit[index];
          } else {
            index += 2;
            if (equationSplit[index].includes("x")) {
              let xSplit = equationSplit[index].split("x");
              if (equationSplit[index] != "x") {
                originalEquationString += `${-1 * parseInt(xSplit[1])}x`;
              } else {
                originalEquationString += `-x`;
              }
            } else if (equationSplit[index].includes("y")) {
              let ySplit = equationSplit[index].split("y");
              if (equationSplit[index] != "y") {
                originalEquationString += `${-1 * parseInt(ySplit[1])}y`;
              } else {
                originalEquationString += `-y`;
              }
            } else if (equationSplit[index].includes("z")) {
              let zSplit = equationSplit[index].split("z");
              if (equationSplit[index] != "z") {
                originalEquationString += `${-1 * parseInt(zSplit[1])}z`;
              } else {
                originalEquationString += `-z`;
              }
            } else {
              originalEquationString += -1 * equationSplit[index];
            }
          }
        }

      }
      originalEquationString += "<br>";
    }
    return originalEquationString;
  }

  /*
  Combine Like Terms of an Equation, both sides of the equation separately
  */
  combineLikeTermsEquation(equation1, equation2 = null, equation3 = null) {
    //Step 1. Format the left side of the Equation
    //Step 1a. Create array of variables and constants on left side
    let equations = [equation1, equation2, equation3];
    let numVars = document.getElementById("numVars").value;
    for (let i = 0; i < numVars; i++) {
      let equation1LeftSplit = equations[i].expression1.split(" ");
      equation1LeftSplit.pop();
      let expressionLeftArray = [];
      for (let index = 0; index < equation1LeftSplit.length; index++) {
        if (equation1LeftSplit[index] != " ") {
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
            } else {
              if (equation1LeftSplit[index] == "-") {
                if (equation1LeftSplit[index + 1].includes("x")) {
                  if (equation1LeftSplit[index + 1] == "x") {
                    let xVariableLeft = new Variable(-1, "x");
                    expressionLeftArray.push(xVariableLeft);
                    index += 2;
                  } else {
                    let xVariableLeft = new Variable(-1 * parseInt(equation1LeftSplit[index + 1].split("x")), "x");
                    expressionLeftArray.push(xVariableLeft);
                    index += 2;
                  }
                } else {
                  expressionLeftArray.push(-1 * parseInt(equation1LeftSplit[index + 1]));
                  index += 1;
                }
              } else {
                expressionLeftArray.push(parseInt(equation1LeftSplit[index]));
              }
            }
          }
        }
      }
      //Step 2b. Create separate arrays for variables and constants on left side
      let expressionLeftXArray = [];
      let expressionLeftNumArray = [];
      for (let index = 0; index < expressionLeftArray.length; index++) {
        if (expressionLeftArray[index].toString().includes("x")) {
          expressionLeftXArray.push(expressionLeftArray[index]);
        } else if (!expressionLeftArray[index].toString().includes("+")) {
          expressionLeftNumArray.push(expressionLeftArray[index]);
        }
      }
      //Step 2c. Create Variables for sum of variables and sum of constants on left side
      let leftXSum = 0;
      for (let index = 0; index < expressionLeftXArray.length; index++) {
        leftXSum += expressionLeftXArray[index].coefficient;
      }
      let expressionLeftX = new Variable(leftXSum, "x");
      let leftNumSum = 0;
      for (let index = 0; index < expressionLeftNumArray.length; index++) {
        leftNumSum += expressionLeftNumArray[index];
      }
      let expressionLeftNum = leftNumSum;

      //Step 3. Format the Right side of the Equation
      //Step 3a. Create array of variables and constants on right side
      let equation1RightSplit = equations[i].expression2.split(" ");
      let expressionRightArray = [];
      for (let index = 0; index < equation1RightSplit.length; index++) {
        if (equation1RightSplit[index] != " ") {
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
            } else {
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
                } else {
                  expressionRightArray.push(-1 * parseInt(equation1RightSplit[index + 1]));
                  index += 1;
                }
              } else {
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
      for (let index = 0; index < expressionRightArray.length; index++) {
        if (expressionRightArray[index].toString().includes("x")) {
          expressionRightXArray.push(expressionRightArray[index]);
        } else if (!expressionRightArray[index].toString().includes("+")) {
          expressionRightNumArray.push(expressionRightArray[index]);
        }
      }
      //Step 3c. Create Variables for sum of variables and sum of constants on left side
      let rightXSum = 0;
      for (let index = 0; index < expressionRightXArray.length; index++) {
        rightXSum += expressionRightXArray[index].coefficient;
      }
      let expressionRightX = new Variable(rightXSum, "x");
      let rightNumSum = 0;
      for (let index = 0; index < expressionRightNumArray.length; index++) {
        rightNumSum += expressionRightNumArray[index];
      }
      let expressionRightNum = rightNumSum;
      if (numVars == 1) {
        return [expressionLeftX, expressionLeftNum, expressionRightX, expressionRightNum];
      } else if (numVars == 2) {
        return [expressionLeftX, expressionLeftNum, expressionRightX, expressionRightNum];
      } else if (numVars == 3) {
        return [expressionLeftX, expressionLeftNum, expressionRightX, expressionRightNum];
      }
    }
  }
}

class Fraction {
  constructor(numerator, denominator) {
    this.numerator = numerator;
    this.denominator = denominator;
    this.isCoefficient = false;
    this.isNotSingle = true;
  }

  setIsCoefficient() {
    isCoefficient = true;
  }

  toString() {
    if (this.isCoefficient) {
      if (this.numerator == 1 && this.denominator == 1) {
        return ``;
      }
    }
    if (this.numerator == 0 && this.isNotSingle) {
      return ``;
    }
    if (this.numerator == 0) {
      return `0`;
    }
    if (this.denominator < 0) {
      this.numerator *= -1;
      this.denominator *= -1;
    }
    if (this.denominator == 1) {
      return this.numerator;
    }
    let fractionString = `<sup>${this.numerator}</sup>&frasl;<sub>${this.denominator}</sub>`;
    return fractionString;
  }
  toEquationString() {
    let fractionEquationString = "";
    if (this.numerator < 0 && this.denominator < 0) {
      this.numerator *= -1;
      this.denominator *= -1;
      fractionEquationString = ` + ${this.toString(this.numerator, this.denominator)}`;
      this.numerator *= -1;
      this.denominator *= -1;
    } else if (this.numerator < 0) {
      this.numerator *= -1;
      fractionEquationString = ` - ${this.toString(this.numerator, this.denominator)}`;
      this.numerator *= -1;
    } else if (this.denominator < 0) {
      this.denominator *= -1;
      fractionEquationString = ` - ${this.toString(this.numerator, this.denominator)}`;
      this.denominator *= -1;
    } else {
      fractionEquationString = ` + ${this.toString(this.numerator, this.denominator)}`;
    }
    return fractionEquationString;
  }

  reduce() {
    let reduceFactor = 1;
    if (gcd(this.numerator, this.denominator) != 0 && gcd(this.numerator, this.denominator) != 1) {
      reduceFactor = gcd(this.numerator, this.denominator);
    } else if ((gcd(this.denominator, this.numerator) != 0 && gcd(this.denominator, this.numerator) != 1) && this.denominator != 1) {
      reduceFactor = gcd(this.denominator, this.numerator);
    }
    this.numerator /= reduceFactor;
    this.denominator /= reduceFactor;
  }
  reduceIfEqualsOne() {
    if (this.numerator / this.denominator == 1) {
      this.numerator = 1;
      this.denominator = 1;
    }
  }

  add(fraction) {
    this.numerator += fraction.numerator;
  }
  substract(fraction) {
    this.numerator -= fraction.numerator;
  }

  multiplyNumber(num) {
    this.numerator *= num;
  }
  outputMultiplyNumber(num) {
    this.multiplyNumber(num);
    return this;
  }
  multiplyFraction(fraction) {
    this.numerator *= fraction.numerator;
    this.denominator *= fraction.denominator;
  }
  divideFraction(fraction) {
    this.denominator = fraction.numerator;
  }
}

function createCoefficientsMatrix(equation1, equation2, equation3) {
  let newEquation1 = equation1;
  let numVars = document.getElementById("numVars").value;
  if (numVars == 1) {
    let equation1Split = newEquation1.split("=");
    let equation1 = new Equation(equation1Split[0], equation1Split[1]);
    equation1Split = newEquation1.split(" ");
    let coefficientsMatrix = [[0]];
    if (equation1Split[0] == "x") {
      coefficientsMatrix[0][0] = 1;
    } else {
      let xStringArray = equation1Split[0].split("");
      let xString = "";
      let xIndex = 0;
      while (xStringArray[xIndex] != "x") {
        xString += xStringArray[xIndex];
        xIndex++;
      }
      coefficientsMatrix[0][0] = xString;
    }
    return coefficientsMatrix;
  } else if (numVars == 2) {
    let coefficientsMatrix = [[0, 0], [0, 0]];

    //Equation 1
    let equation1Split = equation1.split(" ");
    //x1
    if (equation1Split[0] == "x") {
      coefficientsMatrix[0][0] = 1;
    } else {
      let x1StringArray = equation1Split[0].split("");
      let x1String = "";
      let x1Index = 0;
      while (x1StringArray[x1Index] != "x") {
        x1String += x1StringArray[x1Index];
        x1Index++;
      }
      coefficientsMatrix[0][0] = x1String;
    }
    //y1
    let y1String = 0;
    if (equation1Split[2] == "y") {
      y1String = 1;
    } else {
      let y1StringArray = equation1Split[2].split("");
      y1String = "";
      let y1Index = 0;
      while (y1StringArray[y1Index] != "y") {
        y1String += y1StringArray[y1Index];
        y1Index++;
      }
    }
    if (equation1Split[1] == "-") {
      y1String *= -1;
    }
    coefficientsMatrix[0][1] = y1String;

    //Equation 2
    let equation2Split = equation2.split(" ");
    //x2
    if (equation2Split[0] == "x") {
      coefficientsMatrix[1][0] = 1;
    } else {
      let x2StringArray = equation2Split[0].split("");
      let x2String = "";
      let x2Index = 0;
      while (x2StringArray[x2Index] != "x") {
        x2String += x2StringArray[x2Index];
        x2Index++;
      }
      coefficientsMatrix[1][0] = x2String;
    }
    //y2
    let y2String = 0;
    if (equation2Split[2] == "y") {
      y2String = 1;
    } else {
      let y2StringArray = equation2Split[2].split("");
      y2String = "";
      let y2Index = 0;
      while (y2StringArray[y2Index] != "y") {
        y2String += y2StringArray[y2Index];
        y2Index++;
      }
    }
    if (equation2Split[1] == "-") {
      y2String *= -1;
    }
    coefficientsMatrix[1][1] = y2String;
    return coefficientsMatrix;
  } else if (numVars == 3) {
    let coefficientsMatrix = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];

    //Equation 1
    let equation1Split = equation1.split(" ");
    //x1
    if (equation1Split[0] == "x") {
      coefficientsMatrix[0][0] = 1;
    } else {
      let x1StringArray = equation1Split[0].split("");
      let x1String = "";
      let x1Index = 0;
      while (x1StringArray[x1Index] != "x") {
        x1String += x1StringArray[x1Index];
        x1Index++;
      }
      coefficientsMatrix[0][0] = x1String;
    }
    //y1
    let y1String = 0;
    if (equation1Split[2] == "y") {
      y1String = 1;
    } else {
      let y1StringArray = equation1Split[2].split("");
      y1String = "";
      let y1Index = 0;
      while (y1StringArray[y1Index] != "y") {
        y1String += y1StringArray[y1Index];
        y1Index++;
      }
    }
    if (equation1Split[1] == "-") {
      y1String *= -1;
    }
    coefficientsMatrix[0][1] = y1String;
    //z1
    let z1String = 0;
    if (equation1Split[4] == "z") {
      z1String = 1;
    } else {
      let z1StringArray = equation1Split[4].split("");
      z1String = "";
      let z1Index = 0;
      while (z1StringArray[z1Index] != "z") {
        z1String += z1StringArray[z1Index];
        z1Index++;
      }
    }
    if (equation1Split[3] == "-") {
      z1String *= -1;
    }
    coefficientsMatrix[0][2] = z1String;

    //Equation 2
    let equation2Split = equation2.split(" ");
    //x2
    if (equation2Split[0] == "x") {
      coefficientsMatrix[1][0] = 1;
    } else {
      let x2StringArray = equation2Split[0].split("");
      let x2String = "";
      let x2Index = 0;
      while (x2StringArray[x2Index] != "x") {
        x2String += x2StringArray[x2Index];
        x2Index++;
      }
      coefficientsMatrix[1][0] = x2String;
    }
    //y2
    let y2String = 0;
    if (equation2Split[2] == "y") {
      y2String = 1;
    } else {
      let y2StringArray = equation2Split[2].split("");
      y2String = "";
      let y2Index = 0;
      while (y2StringArray[y2Index] != "y") {
        y2String += y2StringArray[y2Index];
        y2Index++;
      }
    }
    if (equation2Split[1] == "-") {
      y2String *= -1;
    }
    coefficientsMatrix[1][1] = y2String;

    //z2
    let z2String = 0;
    if (equation2Split[4] == "z") {
      z2String = 1;
    } else {
      let z2StringArray = equation2Split[4].split("");
      z2String = "";
      let z2Index = 0;
      while (z2StringArray[z2Index] != "z") {
        z2String += z2StringArray[z2Index];
        z2Index++;
      }
    }
    if (equation2Split[3] == "-") {
      z2String *= -1;
    }
    coefficientsMatrix[1][2] = z2String;

    //Equation 3
    let equation3Split = equation3.split(" ");
    //x3
    if (equation3Split[0] == "x") {
      coefficientsMatrix[2][0] = 1;
    } else {
      let x3StringArray = equation3Split[0].split("");
      let x3String = "";
      let x3Index = 0;
      while (x3StringArray[x3Index] != "x") {
        x3String += x3StringArray[x3Index];
        x3Index++;
      }
      coefficientsMatrix[2][0] = x3String;
    }
    //y3
    let y3String = 0;
    if (equation3Split[2] == "y") {
      y3String = 1;
    } else {
      let y3StringArray = equation3Split[2].split("");
      y3String = "";
      let y3Index = 0;
      while (y3StringArray[y3Index] != "y") {
        y3String += y3StringArray[y3Index];
        y3Index++;
      }
    }
    if (equation3Split[1] == "-") {
      y3String *= -1;
    }
    coefficientsMatrix[2][1] = y3String;

    //z3
    let z3String = 0;
    if (equation3Split[4] == "z") {
      z3String = 1;
    } else {
      let z3StringArray = equation3Split[4].split("");
      z3String = "";
      let z3Index = 0;
      while (z3StringArray[z3Index] != "z") {
        z3String += z3StringArray[z3Index];
        z3Index++;
      }
    }
    if (equation3Split[3] == "-") {
      z3String *= -1;
    }
    coefficientsMatrix[2][2] = z3String;
    return coefficientsMatrix;
  }
}
function createConstantsMatrix(equation1, equation2, equation3) {
  let numVars = document.getElementById("numVars").value;
  if (numVars == 1) {
    let equation1Split = equation1.split(" ");
    let constantsMatrix = [[equation1Split[2]]];
    return constantsMatrix;
  } else if (numVars == 2) {
    let constantsMatrix = [[0], [0]];
    let equation1Split = equation1.split(" ");
    constantsMatrix[0][0] = equation1Split[4];
    let equation2Split = equation2.split(" ");
    constantsMatrix[1][0] = equation2Split[4];
    return constantsMatrix;
  } else if (numVars == 3) {
    let constantsMatrix = [[0], [0], [0]];
    let equation1Split = equation1.split(" ");
    constantsMatrix[0][0] = equation1Split[6];
    let equation2Split = equation2.split(" ");
    constantsMatrix[1][0] = equation2Split[6];
    let equation3Split = equation3.split(" ");
    constantsMatrix[2][0] = equation3Split[6];
    return constantsMatrix;
  }
}

function toEquationString(num) {
  let equationString = "";
  if (num > 0) {
    equationString = `+ ${num}`;
  } else if (num == 0) {
    equationString = ``;
  } else {
    equationString = `- ${-1 * num}`;
  }
  if (num == 1) {
    if (num >= 0) {
      equationString = `+ `;
    } else {
      equationString = `- `;
    }
  }
  return equationString;
}

function gcd(num1, num2) {
  if (!(num1 < 0 && num2 < 0)) {
    if (num1 < 0) {
      num1 *= -1;
    } else if (num2 < 0) {
      num2 *= -1;
    }
  }
  if (num1 / num2 == 1 || (num1 / num2 > 1 && Number.isInteger(num1 / num2))) {
    return num2;
  } else if (num2 == 0) {
    return 0;
  } else {
    return gcd(num2, num1 % num2);
  }
}
function lcm(num1, num2) {
  return num1 / gcd(num1, num2) * num2;
}

function fractionToDecimal(numerator, denominator) {
  let numDecimalPlaces = 0;
  let answerSymbol = `≈`;
  if ((numerator / denominator) * 10000 % 1000 == 0) {
    numDecimalPlaces = 1;
    answerSymbol = `=`;
  } else if ((numerator / denominator) * 10000 % 100 == 0) {
    numDecimalPlaces = 2;
    answerSymbol = `=`;
  } else if ((numerator / denominator) * 10000 % 10 == 0) {
    numDecimalPlaces = 3;
    answerSymbol = `=`;
  } else {
    numDecimalPlaces = 3;
  }
  return `${answerSymbol} ${(numerator / denominator).toFixed(numDecimalPlaces)}`;
}

function matrixString(coefficientsMatrix, constantsMatrix) {
  //Create Coefficients Matrix
  let x1 = coefficientsMatrix[0][0];
  let y1 = coefficientsMatrix[0][1];
  let z1 = coefficientsMatrix[0][2];
  let x2 = coefficientsMatrix[1][0];
  let y2 = coefficientsMatrix[1][1];
  let z2 = coefficientsMatrix[1][2];
  let x3 = coefficientsMatrix[2][0];
  let y3 = coefficientsMatrix[2][1];
  let z3 = coefficientsMatrix[2][2];
  //Create Constants Matrix
  let constant1 = constantsMatrix[0][0];
  let constant2 = constantsMatrix[1][0];
  let constant3 = constantsMatrix[2][0];

  let work = "";

  work += `[${x1}, ${y1}, ${z1}]  [${constant1}]<br>
           [${x2}, ${y2}, ${z2}]  [${constant2}]<br>
           [${x3}, ${y3}, ${z3}]  [${constant3}]<br>`;
  return work;
}
function matrixFractionString(coefficientsMatrix, constantsMatrix) {
  //Create Coefficients Matrix
  let x1 = coefficientsMatrix[0][0];
  let y1 = coefficientsMatrix[0][1];
  let z1 = coefficientsMatrix[0][2];
  let x2 = coefficientsMatrix[1][0];
  let y2 = coefficientsMatrix[1][1];
  let z2 = coefficientsMatrix[1][2];
  let x3 = coefficientsMatrix[2][0];
  let y3 = coefficientsMatrix[2][1];
  let z3 = coefficientsMatrix[2][2];
  //Create Constants Matrix
  let constant1 = constantsMatrix[0][0];
  let constant2 = constantsMatrix[1][0];
  let constant3 = constantsMatrix[2][0];

  let work = "";

  work += `[${x1.toString()}, ${y1.toString()}, ${z1.toString()}]  [${constant1}]<br>
           [${x2.toString()}, ${y2.toString()}, ${z2.toString()}]  [${constant2}]<br>
           [${x3.toString()}, ${y3.toString()}, ${z3.toString()}]  [${constant3}]<br>`;
  return work;
}

export default EquationSolver;