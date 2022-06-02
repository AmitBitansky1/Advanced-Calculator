//Test class to test different aspects of the code

//Create a Valid String in MathJax
function MathString(string){
  return `\\(${string}\\)`;
}

import Fraction from "./Fraction.js";
import Exponent from "./Exponent.js";
import Logarithm from "./Logarithm.js";
import Summation from "./Summation.js";
import Matrix from "./Matrix.js";
import Variable from "./Variable.js";
import Expression from "./Expression.js";
import Equation from "./Equation.js";

class Tests{
  constructor(){
    
  }
  //Test for checking toString() methods and compatibility of General Math Classes
  testOne(){
    let equations = `When \\(a \\ne 0\\), there are two solutions to \\(ax^2 + bx + c = 0\\) and they are
  \\[x = {-b \\pm \\sqrt{b^2-4ac} \\over 2a}.\\]`;
    let x = new Fraction(1, 3);
    equations += `${MathString(x.toString())} `;
    let y = new Exponent(x, 3);
    equations += `${MathString(y.toString())} `;
    let xVar = new Variable(-1, "x");
    let z = new Exponent(xVar, 2);
    equations += `${MathString(z.toString())} `;
    let xx = new Exponent(x, x, true);
    equations += `${MathString(xx.toString())} `;
    let yy = new Matrix([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
    equations += `${MathString(yy.toString())} `;
    let zz = new Exponent(yy, -1);
    equations += `${MathString(zz.toString())} `;
    let xxx = new Expression([1, x, z]);
    equations += `${MathString(xxx.toString())} `;
    let yyy = new Expression([new Fraction(2, 5), new Variable(-3, "x")]);
    equations += `${MathString(yyy.toString())} `;
    let zzz = new Fraction(xxx, yyy);
    equations += `${MathString(zzz.toString())} `;
    let xxxx = new Equation(zzz, 0);
    equations += `${MathString(xxxx.toString())} `;
    let yyyy = new Logarithm(2, 5);
    equations += `${MathString(yyyy.toString())} `;
    let zzzz = new Summation("i = 0", "n", "i^2");
    equations += `${MathString(zzzz.toString())} `;
    let xxxxx = new Exponent(x, x);
    equations += `${MathString(xxxxx.toString(true))} `;
    document.getElementById("Work").innerHTML = equations;  
  }
}

export default Tests;