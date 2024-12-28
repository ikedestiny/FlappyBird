//board
let board;
let boardWidth=360;
let boardHeight=640;
let context;

//bird
let birdWidth =34;
let birdHeight = 24;
let birdX = boardWidth/8;
let birdY = boardHeight/2;
let birdImage;
let bird ={
    x:birdX,
    y:birdY,
    height:birdHeight,
    width:birdWidth
}


//pipes
let pipes = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImage, bottomPipeImage;

//physics
let velX = -2;
let velY = 0;//initial bird jump speed
let gravity = 0.4

//gameplay
let gameover = false;
let score =0;

window.onload = function(){
    board = document.getElementById('board');
    board.height=boardHeight;
    board.width = boardWidth;
    context = board.getContext('2d');//used for drawing on the board

    //draw the bird;
    // context.fillStyle = 'red';
    // context.fillRect(bird.x,bird.y,bird.width,bird.height);

    //load image of bird
    birdImage = new Image(birdWidth,birdHeight);
    birdImage.src = "img/flappybird.png";
    birdImage.onload = ()=>{
        context.drawImage(birdImage,bird.x,bird.y,bird.width,bird.height);

    }
    topPipeImage = new Image();
    topPipeImage.src="img/toppipe.png";
    bottomPipeImage = new Image();
    bottomPipeImage.src="img/bottompipe.png";
    requestAnimationFrame(update);  
    setInterval(placePipes,1500)//function that places the pipes every 1.5s

    document.addEventListener('keydown',movebird);
}


 //main game loop
 function update(){
        requestAnimationFrame(update);

        if(gameover){
            return;
        }
        context.clearRect(0,0,board.width,board.height);
        velY+=gravity
        bird.y=Math.max(bird.y+velY,0);//makes ssure the bird doesnt fly out of the canvas
        context.drawImage(birdImage,bird.x,bird.y,bird.width,bird.height);

        if(bird.y>board.height){
            gameover=true;
        }

        //pipes
        for(let i = 0; i<pipes.length;i++){
            let pipe = pipes[i];
            pipe.x += velX;
            context.drawImage(pipe.img,pipe.x,pipe.y,pipe.width,pipe.height);

            if(!pipe.passed&&bird.x>pipe.x+pipe.width){
                score+=0.5;//0.5 because the pipes are in pairs
                pipe.passed=true;
            }

            

            if(detectCollision(bird,pipe)){
                gameover = true;
            }
        }

        //clear pipes to avoid memory issues
        while(pipes.length>0&& pipes[0].x<-pipeWidth){
            pipes.shift();//removes first element from array
        }

        //score
        context.fillStyle ='white';
        context.font = '45px sans-serif';
        context.fillText("score: "+score,5,45);

        if(gameover){
            context.fillStyle ='red';
            context.fillText("GAME OVER",5,90);
        }
   
 }


 function placePipes(){
    if(gameover){
        return;
    }
    let randomPipeY = pipeY-pipeHeight/4-Math.random()*(pipeHeight/2);
    let openingSpace = board.height/4;


    let toppipe = {
        img:topPipeImage,
        x:pipeX,
        y:randomPipeY,
        width:pipeWidth,
        height:pipeHeight,
        passed:false
    };

    pipes.push(toppipe);


    let bottomPipe = {
        img:bottomPipeImage,
        x:pipeX,
        y:randomPipeY+pipeHeight+openingSpace,
        width:pipeWidth,
        height:pipeHeight,
        passed:false
    };

    pipes.push(bottomPipe);


    
 }

 function movebird(e){
    if(e.code =='Space' || e.code == 'ArrowUp'){
        //jump
        velY = -6;
    }

    //RESET 
    if(gameover){
        bird.y = birdY;
        pipes=[];
        score = 0;
        gameover = false;
        birdImage.src = "img/flappybird.png";
    }
 }

 function detectCollision(a,b){
    return a.x<b.x+b.width&&
    a.x+a.width>b.x&&
    a.y+a.height>b.y&&
    a.y<b.y+b.height;
 }

