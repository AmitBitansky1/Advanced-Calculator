//Set default as showing only one variable
$(function(){
  $(".twoVar").hide();
  $(".threeVar").hide();
  $(".twoVarSteps").hide();
  $(".threeVarSteps").hide();
})

//Update numvars and clear answers
function updateNumVars(numVars) {
  document.getElementById("numVarsText").value = numVars;
  //Clear Answers
  const answersCollection = document.getElementsByClassName("answers");
  for(let i = 0; i < answersCollection.length; i++){
    let answerId = answersCollection[i].id;
    document.getElementById(answerId).innerHTML = "";
  }
  //Set which amount of variables to show
  if(numVars == 1){
    $(".oneVar").show();
    $(".twoVar").hide();
    $(".threeVar").hide();
    $(".workVar1").show();
    $(".workVar2").hide();
    $(".workVar3").hide();
    $(".oneVarSteps").show();
    $(".twoVarSteps").hide();
    $(".threeVarSteps").hide();
    document.getElementById("methods").value = "substitution";
  } else if(numVars == 2){
    $(".oneVar").show();
    $(".twoVar").show();
    $(".threeVar").hide();
    $(".workVar1").hide();
    $(".workVar2").show();
    $(".workVar3").hide();
    $(".oneVarSteps").hide();
    $(".twoVarSteps").show();
    $(".threeVarSteps").hide();
    document.getElementById("methods").value = "substitution";
  } else {
    $(".oneVar").show();
    $(".twoVar").show();
    $(".threeVar").show();
    $(".workVar1").hide();
    $(".workVar2").hide();
    $(".workVar3").show();
    $(".oneVarSteps").hide();
    $(".twoVarSteps").hide();
    $(".threeVarSteps").show();
    document.getElementById("methods").value = "gaussianElimination";
  }
}