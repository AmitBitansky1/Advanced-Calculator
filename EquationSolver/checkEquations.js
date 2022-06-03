//Check if the equation/s are valid
function check(equation1, equation2, equation3){
  let isValid = false;
  let numVars = document.getElementById("numVars").value;
  if(numVars == 1){
    let equation1Split = equation1.split(" ");
    if(equation1Split.length < 2){
      return isValid;
    }
    let isX1Valid = variableCheck("x", equation1Split);
    let isEquals1Valid = equalsCheck(equation1Split[1]);
    let isConstant1Valid = constantCheck(equation1Split[2]);
    if(isX1Valid && isEquals1Valid && isConstant1Valid){
      isValid = true;
    }
  }else if(numVars == 2){
    let equation1Split = equation1.split(" ");
    if(equation1Split.length < 4){
      return isValid;
    }
    let isX1Valid = variableCheck("x", equation1Split);
    let isOperation1Valid = operationCheck(equation1Split[1]);
    let isY1Valid = variableCheck("y", equation1Split);
    let isEquals1Valid = equalsCheck(equation1Split[3]);
    let isConstant1Valid = constantCheck(equation1Split[4]);
    let isEquation1Valid = (isX1Valid && isOperation1Valid && isY1Valid && isEquals1Valid && isConstant1Valid);
    let equation2Split = equation2.split(" ");
    if(equation2Split.length < 4){
      return isValid;
    }
    let isX2Valid = variableCheck("x", equation2Split);
    let isOperation2Valid = operationCheck(equation2Split[1]);
    let isY2Valid = variableCheck("y", equation2Split);
    let isEquals2Valid = equalsCheck(equation2Split[3]);
    let isConstant2Valid = constantCheck(equation2Split[4]);
    let isEquation2Valid = (isX2Valid && isOperation2Valid && isY2Valid && isEquals2Valid && isConstant2Valid);
    if(isEquation1Valid && isEquation2Valid){
      isValid = true;
    }
  }else{
    //Equation 1
    let equation1Split = equation1.split(" ");
    if(equation1Split.length < 6){
      return isValid;
    }
    let isX1Valid = variableCheck("x", equation1Split);
    let isOperation1aValid = operationCheck(equation1Split[1]);
    let isY1Valid = variableCheck("y", equation1Split);
    let isOperation1bValid = operationCheck(equation1Split[3]);
    let isZ1Valid = variableCheck("z", equation1Split);
    let isEquals1Valid = equalsCheck(equation1Split[5]);
    let isConstant1Valid = constantCheck(equation1Split[6]);
    let isEquation1Valid = (isX1Valid && isOperation1aValid && isY1Valid && isOperation1bValid && isZ1Valid && isEquals1Valid && isConstant1Valid);
    //Equation 2
    let equation2Split = equation2.split(" ");
    if(equation2Split.length < 6){
      return isValid;
    }
    let isX2Valid = variableCheck("x", equation2Split);
    let isOperation2aValid = operationCheck(equation2Split[1]);
    let isY2Valid = variableCheck("y", equation2Split);
    let isOperation2bValid = operationCheck(equation2Split[3]);
    let isZ2Valid = variableCheck("z", equation2Split);
    let isEquals2Valid = equalsCheck(equation2Split[5]);
    let isConstant2Valid = constantCheck(equation2Split[6]);
    let isEquation2Valid = (isX2Valid && isOperation2aValid && isY2Valid && isOperation2bValid && isZ2Valid && isEquals2Valid && isConstant2Valid);
    //Equation 3
    let equation3Split = equation3.split(" ");
    if(equation3Split.length < 6){
      return isValid;
    }
    let isX3Valid = variableCheck("x", equation3Split);
    let isOperation3aValid = operationCheck(equation3Split[1]);
    let isY3Valid = variableCheck("y", equation3Split);
    let isOperation3bValid = operationCheck(equation3Split[3]);
    let isZ3Valid = variableCheck("z", equation3Split);
    let isEquals3Valid = equalsCheck(equation3Split[5]);
    let isConstant3Valid = constantCheck(equation3Split[6]);
    let isEquation3Valid = (isX3Valid && isOperation3aValid && isY3Valid && isOperation3bValid && isZ3Valid && isEquals3Valid && isConstant3Valid);
    if(isEquation1Valid && isEquation2Valid && isEquation3Valid){
      isValid = true;
    }
  }
  return isValid;
}

function variableCheck(variable, equationSplit){
  var num = 0;
  switch(variable){
    case "x": 
      num = 0;
      break;
    case "y": 
      num = 2;
      break;
    case "z": 
      num = 4;
      break;
  }
  let variableSplit = equationSplit[num].split("");
  let varString = "";
  let varIndex = 0;
  while (variableSplit[varIndex] != variable){
    varString += variableSplit[varIndex];
    varIndex++;
  }
  let isValidVariable = (equationSplit[num] == variable || (!isNaN(varString) && variableSplit[varIndex] == variable));
  return isValidVariable;
}

function operationCheck(operation){
  let isValidOperation = (operation == "+" || operation == "-");
  return isValidOperation;
}

function equalsCheck(equals){
  let isValidEquals = (equals == "=");
  return isValidEquals;
}

function constantCheck(constant){
  let isValidConstant = Number.isInteger(parseInt(constant));
  return isValidConstant;
}

export default check;