document.addEventListener("DOMContentLoaded", (event) => {
  const game = new TetrisGame();

  document.querySelector('#textInput').addEventListener('keypress', (e) => {
    var key = e.which || e.keyCode;
    if (key === 13) { //handle enter key press
      game.clearGameMap();
      game.readInput(e.target.value);
    }
  });
});


class TetrisGame {
  constructor(){
     this.setupBoard();
  }

  setupBoard(){
     this.gameMap = 
      [[0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0]];

    this.tetrisObjects = {
      I: [[1,1,1,1]],
      Q: [[1,1],[1,1]],
      S: [[1,1,0],[0,1,1]],
      Z: [[0,1,1],[1,1,0]],
      T: [[0,1,0],[1,1,1]],
      L: [[1,1],[1,0],[1,0]],
      J: [[1,1],[0,1],[0,1]],
    }
    
    this.blankRow = [0,0,0,0,0,0,0,0,0,0];
    this.factor = 30;

    //setup the canvas
    const canvas = document.getElementById('canvas');
    canvas.height = this.factor * 10;
    canvas.width = this.factor * 10;

    if (canvas.getContext){
      this.ctx = canvas.getContext('2d');
      this.ctx.strokeStyle = "#cbd8ef";
      this.ctx.fillStyle = "#357bff";
 
    }
  } 

  clearGameMap(){
    const newMap = this.gameMap.map( (x) => x.map(x => 0));
    this.gameMap = newMap;
  }

  drawSquare(x,y){
      this.ctx.strokeRect(x * this.factor,y * this.factor,this.factor,this.factor);
      this.ctx.fillRect(x * this.factor, y * this.factor,this.factor,this.factor);
  }

  readInput(inputString){
    const inputArr = inputString.split(",");

    for (let i of inputArr){
      this.renderBlocks(i);
    }
    const finalHeight = this.obliterateFullRows();
    document.getElementById('height').innerHTML = finalHeight;
  }

  renderBlocks(shapeString){
    const position = parseInt(shapeString.substr(1,2));
    const letter = shapeString.substr(0,1);
    const shape = this.tetrisObjects[letter];
    let lastFitIndex = null;

    if (shape){
        for (let index = 0; index < this.gameMap.length; index++) {
          if (this.canInsertShape(position, shape, index)){
             lastFitIndex = index;
           } 
           else {
             if (lastFitIndex){ //if the next row doesn't fit, break out of the loop
                break;
             }
           }
        }
      if (lastFitIndex){
         this.drawShape(position, shape, lastFitIndex);
         this.redraw();
      }
    }
  }

   drawShape(position, shape, bottomRow){
    for (let i = 0; i < shape.length; i++){
      const shapeRow = shape[i];
      const rowNumber = bottomRow - i;
      if (shapeRow !== null && shapeRow !== undefined){
          this.insertInRow(position, shapeRow, rowNumber);
      }
    }
  }

  canInsertShape(position, shape, bottomRow){
    let insertCount = 0;

    for (let i = 0; i < shape.length; i++){
      const shapeRow = shape[i];
      const rowNumber = bottomRow - i;
      if (shapeRow !== null && shapeRow !== undefined){
         insertCount += this.canInsertShapeRow(position, shapeRow, rowNumber);
       }
     }
    return (insertCount === shape.length);
  }

    canInsertShapeRow(position, shapeRow, rowNumber){
    const gameMapRow = this.gameMap[rowNumber];
    if (gameMapRow == null && gameMapRow == undefined && rowNumber < 0){
      return 0;
    }
    return this.checkIfRowIsEmpty(position, shapeRow, gameMapRow) ? 1 : 0;
  }

  insertInRow(position, shapeRow, rowNumber){
    const gameMapRow = this.gameMap[rowNumber];
    if (gameMapRow == null && gameMapRow == undefined && rowNumber < 0){
      return;
    }
    const originalLength = gameMapRow.length;

    const end = position + shapeRow.length;
    const gameMapRowCopy = gameMapRow.slice(position, end);
    const newRow = gameMapRowCopy.map((x, index) => {
      return x | shapeRow[index];
    });

    gameMapRow.splice(position, shapeRow.length, ...newRow);
    const diff = gameMapRow.length - originalLength;
     if (diff > 0){  //truncate the new row if it's longer than original gameMapRow
       gameMapRow.splice(originalLength - 1, diff);
     }
  }

  checkIfRowIsEmpty(position, shapeRow, gameMapRow){
    const end = position + shapeRow.length;
    let shapeRowIndex = 0;
    for (let j = position; j < end; j++){
      if (gameMapRow[j] & shapeRow[shapeRowIndex]){ 
        return false;
      }
      shapeRowIndex++;
    }
    return gameMapRow;
  }

  obliterateFullRows() {
    let finalHeight = 0;

    for (let i = this.gameMap.length - 1; i > -1; i--){
      const gameRow = this.gameMap[i];
      const sum = gameRow.reduce((sum, x) => {
        return sum + x;
      });
      if (sum === this.gameMap.length){
        this.gameMap.splice(i,1);
        this.gameMap.unshift(this.blankRow);
      }
      if (sum > 0){
        finalHeight = this.gameMap.length - i;
      }
    }
    this.redraw();
    
    return finalHeight;
  }

  redraw(){
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.gameMap.map((row, rowIndex) => {
      row.map((row, colIndex) => {
        if (row === 1){
          this.drawSquare(colIndex, rowIndex);
        }
      });
    });
    console.log(this.gameMap);
  }
}








