//GCM class for finding the Greatest Common Denominator of 2 Numbers
function GCD(num1, num2){
  if(!(num1<0 && num2<0)){
    if(num1 < 0){
      num1 *= -1;
    } else if(num2 < 0){
      num2 *= -1;
    }
  }
  if(num1/num2 == 1 || (num1/num2 > 1 && Number.isInteger(num1/num2))){
    return num2;
  } else if(num2 == 0){
    return 0;
  } else{
    return GCD(num2, num1%num2);
  } 
}

export default GCD;