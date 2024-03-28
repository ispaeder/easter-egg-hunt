const field = document.getElementById("field");
const startBtn = document.getElementById("start-game-btn");
const playAgainBtn = document.getElementById("play-again-btn");
const winMsgArea = document.getElementById("win-msg");
// this array holds the class names for different egg images
const eggColors = ["egg-blue", "egg-pink", "egg-yellow"];
let score = 0;
const scoreSpan = document.getElementById("score-span");
let cellAmount = 0; //per row/column
let cellSize = 0; 
let count = 0; // total Number of cells
let tableString = ""; //contains the code that outputs the table 
let basketPosition = 0;
let blockedPositions = []; //occupied cells
let canMove = true;

//for testing purposes only, can be removed
let t = document.getElementById("test-output");


// create the table and cells
const createField = (fieldSize) => {
    if (fieldSize < 300 || fieldSize > 500) alert("fieldsize between 300 and 500, please");
    
    cellAmount = Math.floor(fieldSize/35); 
    cellSize = Math.floor(fieldSize/cellAmount); 
    
    //t.innerText += "Anzahl: " + cellAmount + " - Größe: " + cellSize;
    
    for (let i = 1; i <= cellAmount; i++) {
        
        tableString += `<tr>`;
        for (let j = 1; j <= cellAmount; j++) {
            count++;
            tableString += `<td id="${count}" style="width: ${cellSize}px; height: ${cellSize}px;"></td>`;
            // use this to display numbers for testing
            //`<td id="${count}" style="width: ${cellSize}px; height: ${cellSize}px;">${count}</td>`;
        }
        tableString += "</tr>";
    }
    
    field.innerHTML = tableString; 
};

createField(300);


// creates a player character (basket) in the field
const createBasket = () => {
    basketPosition = Math.floor(count/2 - Math.random()*cellAmount);
    let spot = document.getElementById(basketPosition);
    spot.classList.add("basket");
    blockedPositions.push(basketPosition);
};


const chooseEggColor = () => {
    let random = Math.floor(Math.random()*eggColors.length);
    return eggColors[random];
};

// create eggs in random, non-occupied places
const createEgg = (numOfEggs) => {
    for (let i = 1; i <= numOfEggs; i++) {
        let rand = Math.floor((Math.random()*count)+1);
        //test: console.log(rand, blockedPositions);
        if(blockedPositions.includes(rand)) {
            i--;
        } else {
           blockedPositions.push(rand);
           let spot = document.getElementById(rand);
           spot.classList.add(chooseEggColor());
        }
    }   
};



// find the edge cells to prevent movements off the field
// class green only for testing, can be removed
for (let i = 1; i<=cellAmount; i++) {
    document.getElementById(i).classList.add("green", "firstRow");
}
for (let j = count-cellAmount+1; j<=count; j++) {
    document.getElementById(j).classList.add("green", "lastRow");
}
for (let k = 1; k <= (count-cellAmount+1); k=k+cellAmount) {
    document.getElementById(k).classList.add("green", "firstColumn");
}
for (let l = cellAmount; l <= count; l=l+cellAmount) {
    document.getElementById(l).classList.add("green", "lastColumn");
}


/*
the following functions moves the basket, if the position that it's 
moved to has an egg, it collects it, if it was the last egg, it ends the game
*/
const makeMove = (spot) => {
    spot.classList.remove("basket"); // removes basket from old basket position
    blockedPositions.shift(); //removes old basketPosition from array
    spot = document.getElementById(basketPosition); // gets cell of new basket position
    
    if(blockedPositions.includes(basketPosition)) {
        for (let egg of eggColors) {   
            if (spot.classList.contains(egg)) {
                spot.classList.remove(egg);
                spot.style.backgroundImage = `url(basket-front.svg), url(${egg}.svg)`;
                break;
            }
        }
        
        const x = blockedPositions.indexOf(basketPosition);
        blockedPositions.splice(x,1);  //removes position of collected egg from array
        score += 10;
        scoreSpan.textContent = score;
        
        spot.style.backgroundColor = "lime";
        canMove = false;
        setTimeout(()=> {
            spot.style.backgroundColor = "rgb(220, 250, 190)";
            spot.style.backgroundImage = "";
            spot.classList.add("basket");
        }, 600);
        
        //if it was the last egg
        if(blockedPositions.length === 0) {
            winMsgArea.innerText = "Congratulations! You've collected all the eggs! =)";
            playAgainBtn.style.display = "inline-block";
        } else setTimeout(()=> {
            canMove = true;
        }, 600);
        
        blockedPositions.unshift(basketPosition);
        
    } else {  
     blockedPositions.unshift(basketPosition);
     spot.classList.add("basket");
    }  
};


// Move functions

const moveUp = (spot) => {
    if((basketPosition - cellAmount) > 0 && !spot.classList.contains("firstRow")) {
        basketPosition -= cellAmount;
        makeMove(spot);
    }
};

const moveDown = (spot) => {
    if((basketPosition + cellAmount) <= count && !spot.classList.contains("lastRow")) {
        basketPosition += cellAmount;
        makeMove(spot);
    }
};

const moveRight = (spot) => {
    if(basketPosition < count && !spot.classList.contains("lastColumn")) {
        basketPosition += 1;
        makeMove(spot);
    }
};

const moveLeft = (spot) => {
    if(basketPosition > 0 && !spot.classList.contains("firstColumn")) {
        basketPosition -= 1;
        makeMove(spot);
    }
};


const moveBasket = (key) => {
    let spot = document.getElementById(basketPosition);
    switch(key) {
        case "ArrowUp":
           moveUp(spot);
        break;
        case "ArrowRight":
           moveRight(spot); 
        break;
        case "ArrowDown":
           moveDown(spot);
        break;
        case "ArrowLeft":
           moveLeft(spot); 
        break;
    };
};


const startGame = () => {
    createBasket();  //basket needs to be created before eggs!
    createEgg(4);
};


// start creates eggs and basket as well
// starts key event
startBtn.addEventListener("click", (e) => { 
    e.target.style.display = "none";
    startGame();
    document.getElementById("score-display").style.display = "block";
    document.addEventListener('keyup', ({key}) => {
        if(canMove) moveBasket(key);
    });
});

// separate let's go and play again buttons, so addEvent Listener will not be called twice
playAgainBtn.addEventListener("click", (e) => {
    if (basketPosition > 0) {
        document.getElementById(basketPosition).classList.remove("basket");
        winMsgArea.textContent = "";
        score = 0;
        scoreSpan.textContent = score;
        blockedPositions = [];
        if(!canMove) canMove = true;
    }
    e.target.style.display = "none";
    startGame();
});


document.addEventListener('keyup', function(event) {
    const key = event.key; // "a", "1", "Shift", etc.
    //t.textContent += key;
});
  



/*
ideas for variations: 

- collect only eggs of one color
- create a random number of eggs
- let user enter a number of how many eggs to create 
- let user enter a number for the size of the field
- add arrow buttons so you can play without a keyboard
- set a countdown for the hunt
-- how many eggs collected until timeout?
-- or: lose if you don't collect all eggs before timeout!
- add a second player and take turns (you might want the second player to use WASD keys, you might also want to limit the amount of moves each player can make per round)
- create an 'enemy' that will make a random move whenever you move, if it hits and egg, it destroys it, if it hits you - game over! (more interesting in a small game field!)
-add levels with less time to collect eggs each round or more enemies each round etc.

[to do: more egg colors, one more basket, enemy graphics for others to play with]
*/

