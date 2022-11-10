
class runGame {
    constructor (element, options ={}) {

        this.useCategoryIds=options.useCategoryIds || [14, 2929, 67, 10, 3061];
    
        //Information Arrays
        this.categories = [];
        this.clues = {};

        //Currently
        this.currentClue = null;
        this.score = 0

        //Elements
        this.boardElement = element.querySelector(".main");
        this.scoreCount = element.querySelector(".totalScore");
        this.questionBoard = element.querySelector(".questionBoard");
        this.questionCard = element.querySelector(".clue");
        this.formElement = element.querySelector("form");
        this.answerElement = element.querySelector("input[name=answer]");
        this.resultElement = element.querySelector(".result");
        this.correctAnsElement = element.querySelector(".correctAnswer")
        this.successElement = element.querySelector(".success")
        this.failureElement = element.querySelector(".failure")

    }   

    initGame() {
        this.boardElement.addEventListener("click", event => {
            if (event.target.dataset.clueId) {
                this.clueEvent(event);
            }
        });

        this.formElement.addEventListener("submit", event => {
            this.submitEvent(event);
        });
        
        this.updateScore(0);
        
        this.fetchCategories();
        
    }

    fetchCategories() {
        const categories =
        this.useCategoryIds.map(categoryId => {
            return new Promise((resolve,reject) => {
                fetch(`https://jservice.io/api/category?id=${categoryId}`)
                    .then(response =>
                        response.json()).then(data => {
                            resolve(data);
                        });
            });
        });
        Promise.all(categories).then(results => {
            results.forEach((result, categoryIndex) =>
            {
                var newCategory = {
                    title: result.title,
                    clues: []
                }

                var clues = shuffle(result.clues).splice(0,5).forEach((clue, index) => {
                    console.log(clue)
                    
                    var clueId = categoryIndex + "-" + index;
                    newCategory.clues.push(clueId);

                    this.clues[clueId] = {
                       question: clue.question,
                       answer: clue.answer,
                       value: (index + 1) * 100
                    };
                 })

                this.categories.push(newCategory);
            });

                this.categories.forEach((c) => {
                    this.addCategory(c);
                });
        });
    }

    addCategory(category) {
        let column = document.createElement('div');
        column.classList.add('column');
        column.innerHTML = (
            `<header>${category.title}</header>
            <ul>
            </ul>`
        ).trim();

        var ul = column.querySelector('ul');
        category.clues.forEach(clueId => {
            var clue = this.clues[clueId];
            ul.innerHTML += `<li><button data-clue-id=${clueId}>${clue.value}</button></li>`
            console.log(clueId);
        })

        this.boardElement.appendChild(column);

    }
    

    updateScore(change) {
        this.score += change;
        this.scoreCount.textContent = this.score;
    }

    clueEvent(event) {
        var clue = this.clues[event.target.dataset.clueId];
        // //marks button as used
        event.target.classList.add("used");
        // //clears out field
        this.answerElement.value = "";
        // //updates clue
        this.currentClue = clue;
        // //updates clue text
        this.questionCard.textContent = this.currentClue.question;
        this.correctAnsElement.textContent = this.currentClue.answer;
        // //hide result
        this.questionBoard.classList.remove("showing-result");
        // //show clue
        this.questionBoard.classList.add("visible");
        this.answerElement.focus();

    }

    submitEvent(event) {
        event.preventDefault();

        var correctAns = this.simplifyAnswer(this.answerElement.value) === 
            this.simplifyAnswer(this.currentClue.answer);
        if (correctAns) {
            this.updateScore(this.currentClue.value)
        }

        this.revealAnswer(correctAns);
    }

    simplifyAnswer(input) {
        var simpleAnswer = input.toLowerCase();
        simpleAnswer = simpleAnswer.replace("<i>","");
        simpleAnswer = simpleAnswer.replace("</i>","");
        simpleAnswer = simpleAnswer.replace (/^a /, "");
        simpleAnswer = simpleAnswer.replace(/^an/, "");
        return simpleAnswer.trim();

    }

    revealAnswer(correctAns) {
        this.successElement.style.display = correctAns ? "block" : "none";
        this.failureElement.style.display = !correctAns ? "block" : "none";
        this.correctAnsElement.style.display = !correctAns ? "block" : "none";

        this.questionBoard.classList.add("showing-result");

        setTimeout (() => {
            this.questionBoard.classList.remove("visible");
        }, 3000);
            
    }

 }

 //sounds
 const clickSound = new Audio("./assets/sounds/Robot blip.mp3");
 const buttons = document.querySelectorAll("button");
 //sound sourced from https://soundbible.com/1682-Robot-Blip.html, no changes have been made
 buttons.forEach( button => {
     button.addEventListener("click", () => {
         clickSound.play();
     })
 })
//taken from stackoverflow for simplicity
 function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;

    
} 

const game = new runGame(document.querySelector('.app'), {});
game.initGame();