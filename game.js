var buttonColours = ["red", "blue", "green", "yellow"];
var gamePattern = [];
var userClickedPattern = [];

var started = false;
var level = 0;

function nextSequence() {
    var randomNumber = Math.floor(Math.random() * 4);   // Generate random number 0-4
    var randomChosenColour = buttonColours[randomNumber];   // Convert and associate random number with colour
    var chosenColourString = "#" + randomChosenColour;  // String of new random colour

    /* Add new random colour to game pattern array */
    gamePattern.push(randomChosenColour);

    /** Moved audio code to 'playSound' function **/
    playSound(randomChosenColour);
    
    /* Fade element of new random colour */
    $(chosenColourString).fadeOut(100).fadeIn(100);

    /* Increase level every time this function is called */
    $("#level-title").text("Level " + level);
    level++;

    userClickedPattern = [];

    //return userClickedPattern;  // Why return this and not 'gamePattern'? After looking into it, don't know why there was a return at all, leave commented out for review
}

/*** Use jQuery to detect when any buttons are clicked and trigger handler function ***/
$(".btn").on("click", function() {
    var userChosenColour = $(this).attr("id");

    userClickedPattern.push(userChosenColour);
    playSound(userChosenColour);
    animatePress(userChosenColour);

    // checkAnswer(userClickedPattern[userClickedPattern.length - 1]);  // Intended to use the index of the last answer to return the last user selected color
    checkAnswer(userClickedPattern.lastIndexOf(userChosenColour));  // Uses the index of the last given answer, i.e. an INTEGER
});

/*** Add sounds to user button click ***/
function playSound(name) {
    /* Create and play sound of new random colour */
    const audio = new Audio("sounds/" + name + ".mp3");
    audio.play();
}

/*** Add animations to user button click ***/
function animatePress(currentColour) {
    var clickedButton = "#" + currentColour;
    $(clickedButton).addClass("pressed");
    setTimeout(function() {
        $(clickedButton).removeClass("pressed");
    }, 100);
    //$(clickedButton).addClass("pressed").delay(100).removeClass("pressed"); // .delay() requires coding your own queue
}

/*** Use jQuery to detect when a keyboard key has been pressed ***/
$(document).on("keypress", function() {
    if(started === false) {
        nextSequence();
        $("#level-title").text("Level 0");
        started = true;
    }
});

/*** Called after user has clicked and chosen their answer ***/
function checkAnswer(currentLevel) {    // 'currentLevel' taken in as an INTEGER
    if(userClickedPattern[currentLevel] === (gamePattern[currentLevel])) {  // Because 'currentLevel' is the index of the last given answer, this method checks same elements in both arrays
        if(userClickedPattern.length === gamePattern.length) {  // Checks if user has finished current sequence
            setTimeout(function() {
                nextSequence();    
            }, 1000); 
        }
    }else {
        playSound("wrong");

        $("body").addClass("game-over"); 
        setTimeout(function() {
            $("body").removeClass("game-over");    
        }, 200); 

        $("h1").text("Game Over, Press Any Key to Restart");

        startOver();
    }
}

/*** Called if user chooses wrong answer ***/
function startOver() {
    level = 0;
    gamePattern = [];
    started = false;
}
