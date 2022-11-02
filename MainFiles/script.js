
class runGame {
    constructor (element, options ={}) {

        this.useCategoryIds=options.useCategoryIds || [14, 2929, 67, 10, 18280];
    
        //Information Arrays
        this.categories = [];
        this.clues = {};

        //Currently
        this.currentClue = null;
        this.score = 0

        //Elements
        this.boardElement = element.querySelector(".main");
        this.scoreCount = element.querySelector(".totalScore");
    }

    initGame() {
        this.scoreCount.textContent = this.score;
        this.fetchCategories();
    }

    fetchCategories() {
        const categories =
        this.useCategoryIds.map(categoryId => {
            return new Promise((resolve,reject) => {
                fetch(`https://jservice.io/api/category?id=${categoryId}`)
                    .then(response =>
                        response.json()).then(data => {
                            console.log(data)
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
                    var clueId = categoryIndex + "-" + index;
                    newCategory.clues.push(clueId);

                    this.clues[clueId] = {
                       question: clue.question,
                       answer: clue.answer,
                       value: (index + 1) * 100
                    }
                 })

                this.categories.push(newCategory);
            })
            console.log(this)
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

        this.boardElement.appendChild(column);

    }

 }

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