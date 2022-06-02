import EquationSolver from "./solveEquations.js";
import check from "./checkEquations.js";

function solve(equation1, equation2, equation3){
  /*let isValid = check(equation1, equation2, equation3);
  let isValid = true;
  if(!isValid){
    alert(`Invalid Equation/s \nExample Format: 3x - 2y = 7`);
    return;
  }*/
  //Solving Methods
  let equationSolver = new EquationSolver(equation1, equation2, equation3);
  console.log(`Valid Equation`);
  equationSolver.solve();
}

export default solve;