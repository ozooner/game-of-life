
var opts = {
  boardWidth: 400,
  boardHeight: 300,
  squareSize: 10,
  squareColor: 'blue',
  aliveProbability: 0.3, //likelyhood of cell being alive on initialization
  tickSpeed: 100, //in milliseconds
}

var canvas, cols, rows;
var gameMap = [];

function createCanvas(){
  var cnv = document.createElement('canvas');
  cnv.width = opts.boardWidth;
  cnv.height = opts.boardHeight;
  cnv.style.border = '1px solid black';
  document.body.appendChild(cnv);
  canvas = new fabric.StaticCanvas(cnv, {renderOnAddRemove: false});
}

function fillGame(){
  var cols = canvas.width / opts.squareSize;
  var rows = canvas.height / opts.squareSize;
  var left = 0;
  var top = 0;
  for(var i = 0; i < rows; i++){
    gameMap[i] = [];
    left = 0;
    for(var j = 0; j < cols; j++){
      rect = createRect(left, top, opts.squareColor, opts.squareSize, opts.aliveProbability)
      gameMap[i][j] = rect;
      left += opts.squareSize;
    }
    top += opts.squareSize;
  }
  canvas.renderAll();
}

function createRect(left, top, color, squareSize, prob){
  var rect = new fabric.Rect({
    left: left,
    top: top,
    fill: color,
    width: squareSize,
    height: squareSize,
    visible: Math.random() < prob,
  });
  canvas.add(rect);
  return rect;
}

function getLiveNeighbourCount(i, j){
  var liveCount = 0;
  for(var row = -1; row < 2; row++){
    for(var col = -1; col < 2; col++){
      if(col === 0 && row === 0){
        continue;  //not checking itself
      }
      var rowCheck = i + row;
      var colCheck = j + col;
      if(gameMap[rowCheck] && gameMap[rowCheck][colCheck] && gameMap[rowCheck][colCheck].visible){
        liveCount++;
      }
    }
  }
  return liveCount;
}

function isAliveNextGeneration(alive, liveNeighbours){
  if(alive){
    return liveNeighbours === 2 || liveNeighbours === 3;
  }
  return !alive && liveNeighbours === 3;
}

function redrawCanvas(){
  var cols = canvas.width / opts.squareSize;
  var rows = canvas.height / opts.squareSize;
  for(var i = 0; i < rows; i++){
    for(var j = 0; j < cols; j++){
      var rect = gameMap[i][j];
      rect.visible = rect.aliveNextGeneration;
    }
  }
  canvas.renderAll();
}

function tick(){
  var cols = canvas.width / opts.squareSize;
  var rows = canvas.height / opts.squareSize;
  for(var i = 0; i < rows; i++){
    for(var j = 0; j < cols; j++){
      var liveNeighbours = getLiveNeighbourCount(i, j);
      var rect = gameMap[i][j];
      //since each generation is a pure function of the preceding one, we have to defer setting visibility flag until all cells have been checked
      rect.aliveNextGeneration = isAliveNextGeneration(rect.visible, liveNeighbours);
    }
  }
  redrawCanvas();
}

function init(){
  createCanvas();
  fillGame()
  setInterval(tick, opts.tickSpeed);
}
init();
