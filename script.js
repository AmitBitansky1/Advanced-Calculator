import Tests from "./general/Tests.js";
import solve from "./EquationSolver/equationSolver.js";

//Tests
let tests = new Tests();
//tests.testMathString();
//MathJax.typeset();

//Choose Function based off title
switch(document.getElementById("title").innerHTML) {
  case "Equation Solver":
    document.getElementById("solve").onclick = function(){
      let equation1 = document.getElementById("equation1").value;
      let equation2 = document.getElementById("equation2").value;
      let equation3 = document.getElementById("equation3").value;
      solve(equation1, equation2, equation3);
    };
    break;
}