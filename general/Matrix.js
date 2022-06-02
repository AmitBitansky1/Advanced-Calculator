//Matrix Class for storing and using the elements of any sized matrix, and creating a toString function for them
class Matrix{
  constructor(matrix){
    this.matrix = matrix;
  }
  toString(){
    let matrixString = ``;
    //loop through matrix elements and display as matrix
    for(let row = 0; row < this.matrix.length; row++){
      for(let col = 0; col < this.matrix[row].length; col++){
        matrixString += this.matrix[row][col];
        if(col != this.matrix[row].length - 1){
          matrixString += ` & `; //next column
        }
      }
      if(row != this.matrix.length - 1){
        matrixString += `\\\\`; //next row
      }
    }
    return `\\begin{bmatrix}${matrixString}\\end{bmatrix}`;
  }
}

export default Matrix;