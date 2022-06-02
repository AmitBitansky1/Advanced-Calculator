import Tests from "./general/Tests.js";
import solve from "./EquationSolver/equationSolver.js";

//Tests
let tests = new Tests();
//tests.testOne();
//MathJax.typeset();

//Choose Function based off title

switch(document.getElementById("title").innerHTML) {
  case "Equation Solver":
    document.getElementById("solve").onclick = function(){solve(document.getElementById("equation1").value, document.getElementById("equation2").value, document.getElementById("equation3").value)};
    break;
}