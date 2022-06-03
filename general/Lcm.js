//LCM class for finding the Least Common Multiple of 2 Numbers
import GCD from "./Gcd.js";
function LCM(num1, num2) {
  return num1 / GCD(num1, num2) * num2;
}

export default LCM;