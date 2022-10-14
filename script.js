const ROW = 8
const COL = 8
const CROSS_OVER_LENGTH = 3
const NUM_OF_IND = 4

const htmlPopulation = document.querySelector('.population')
const htmlSelection = document.querySelector('.populationAfterFitness')
const htmlCrossOver = document.querySelector('.populationAfterCrossOver')
const htmlMutation = document.querySelector('.populationAfterMutation')
const nextBtn = document.querySelector('.nextBtn')
const chessboard = document.querySelector('.chessboard')
const fitnessCell = document.querySelectorAll('.fitnessCell')

class Chromosome {
    constructor() {
        this.Gene = []
        this.Fitness = 0
    }
}

let Population = []

function selection(population) {
    for (let i = 0; i < population.length - 1; i++) {
        for (let j = i + 1; j < population.length; j++) {
            if (population[i].Fitness < population[j].Fitness) {
                let temp = population[i]
                population[i] = population[j]
                population[j] = temp
            }
        }
    }
    let fitnessArray = []
    for (let i = 0; i < NUM_OF_IND; i++) {
        fitnessArray.push(Population[i].Fitness)
    }
    let minFitness = Math.min(...fitnessArray)
    var count = 0;
    for (let i = 0; i < NUM_OF_IND; i++) {
        if (Population[i].Fitness === minFitness) {
            count++
        }
    }
    if (count == 1) {
        var temp = []
        for (let i = 0; i < COL; i++) {
            temp[i] = population[2].Gene[i]
        }
        for (let i = 0; i < COL; i++) {
            population[3].Gene[i] = temp[i]
        }
        delete (temp)
        var temp = []
        for (let i = 0; i < COL; i++) {
            temp[i] = population[1].Gene[i]
        }
        for (let i = 0; i < COL; i++) {
            population[2].Gene[i] = temp[i]
        }
    } else if (count == 2) {
        var temp = []
        for (let i = 0; i < COL; i++) {
            temp[i] = population[0].Gene[i]
        }
        for (let i = 0; i < COL; i++) {
            population[2].Gene[i] = temp[i]
        }
        delete (temp)
        var temp = []
        for (let i = 0; i < COL; i++) {
            temp[i] = population[1].Gene[i]
        }
        for (let i = 0; i < COL; i++) {
            population[3].Gene[i] = temp[i]
        }
    } else if (count == 3) {
        var temp = []
        for (let i = 0; i < COL; i++) {
            temp[i] = population[2].Gene[i]
        }
        for (let i = 0; i < COL; i++) {
            population[3].Gene[i] = temp[i]
        }
        delete (temp)
        var temp = []
        for (let i = 0; i < COL; i++) {
            temp[i] = population[0].Gene[i]
        }
        for (let i = 0; i < COL; i++) {
            population[2].Gene[i] = temp[i]
        }
    }
}

function fitnessCalculation(individual) {
    let result = 0;
    let fitness;
    for (let i = 0; i < COL - 1; i++) {
        fitness = COL - (i + 1)
        // Kiem tra theo hang
        for (let j = i + 1; j < COL; j++) {
            if (individual[i] === individual[j]) {
                fitness--
            }
        }
        // Kiem tra theo duong cheo
        for (let j = 1; j < COL; j++) {
            if (i + j < COL) {
                if (individual[i] + j < COL) {
                    if (individual[i] + j === individual[i + j]) {
                        fitness--
                    }
                }
                if (individual[i] - j >= 0) {
                    if (individual[i] - j === individual[i + j]) {
                        fitness--
                    }
                }
            }
        }
        result += fitness
    }
    return result
}
function crossOver(individualA, individualB, firstIndex) {
    if (COL - firstIndex >= CROSS_OVER_LENGTH) {
        for (let i = firstIndex; i < CROSS_OVER_LENGTH; i++) {
            let temp = individualA[i]
            individualA[i] = individualB[i]
            individualB[i] = temp
        }
    } else {
        for (let i = firstIndex; i > firstIndex - CROSS_OVER_LENGTH; i--) {
            let temp = individualA[i]
            individualA[i] = individualB[i]
            individualB[i] = temp
        }
    }
}

var mutationIndex
var mutationIndexValue
function mutation(individual) {
    mutationIndex = Math.floor(Math.random() * 8)
    mutationIndexValue = Math.floor(Math.random() * 8)
    individual[mutationIndex] = mutationIndexValue
}

function goalCheck(population) {
    for (let i = 0; i < NUM_OF_IND; i++) {
        if (population[i].Fitness === 28) {
            return true
        }
    }
}

// Population
var fitnessArray = []
for (var i = 0; i < NUM_OF_IND; i++) {
    var geneArray = []
    for (var j = 0; j < htmlPopulation.children[i].children.length; j++) {
        if (htmlPopulation.children[i].children[j].value) {
            geneArray.push(htmlPopulation.children[i].children[j].value - 1)
        }
    }
    var gene = new Chromosome()
    gene.Gene = geneArray
    Population[i] = gene
}

// Chessboard
for (let i = 0; i < NUM_OF_IND; i++) {
    for (let j = 0; j < COL; j++) {
        chessboard.children[i].children[COL - Population[i].Gene[j] - 1].children[j].value = 'x'
        chessboard.children[i].children[COL - Population[i].Gene[j] - 1].children[j].classList.add('active')
    }
}

function fillFitnessCell () {
    let fitness;
    for (let c = 0; c < NUM_OF_IND; c++) {
        let result = 0
        for (let i = 0; i < COL - 1; i++) {
            fitness = COL - (i + 1)
            // Kiem tra theo hang
            for (let j = i + 1; j < COL; j++) {
                if (Population[c].Gene[i] === Population[c].Gene[j]) {
                    fitness--
                }
            }
            // Kiem tra theo duong cheo
            for (let j = 1; j < COL; j++) {
                if (i + j < COL) {
                    if (Population[c].Gene[i] + j < COL) {
                        if (Population[c].Gene[i] + j === Population[c].Gene[i + j]) {
                            fitness--
                        }
                    }
                    if (Population[c].Gene[i] - j >= 0) {
                        if (Population[c].Gene[i] - j === Population[c].Gene[i + j]) {
                            fitness--
                        }
                    }
                }
            }
            fitnessCell[c].children[i * 2].innerHTML = fitness
            result += fitness
        }
        fitnessCell[c].children[14].innerHTML = result
    }
}
fillFitnessCell()
for (let i = 0; i < NUM_OF_IND; i++) {
    Population[i].Fitness = fitnessCalculation(Population[i].Gene)
}

var action = 1;
var start = false
var gene1st = []
var gene2nd = []
var gene3rd = []
var gene4th = []
nextBtn.onclick = function () {
    for (let i = 0; i < NUM_OF_IND; i++) {
        if (Population[i].Fitness === 28) {
            chessboard.children[i].style = 'box-shadow: 0 0 20px 10px red'
        }
    }
    if (action == 0) {
        if (start) {
            for (let i = 0; i < NUM_OF_IND; i++) {
                htmlPopulation.children[i].classList.remove('disable')
            }
            document.querySelector('.fitnessTitle').style.opacity = 0
            document.querySelectorAll('.fitness').forEach(function (e) {
                e.style.opacity = 0
            })
            htmlSelection.style.opacity = 0
            var check = 1
            for (let i = 0; i < NUM_OF_IND; i += 2) {
                if (check === 1) {
                    for (let j = 0; j < CROSS_OVER_LENGTH; j++) {
                        htmlCrossOver.children[i].children[j].classList.remove('active')
                    }
                    for (let j = COL - 1; j >= CROSS_OVER_LENGTH; j--) {
                        htmlCrossOver.children[i + 1].children[j].classList.remove('active')
                    }
                    check = 2
                } else {
                    for (let j = COL - 1; j >= COL - CROSS_OVER_LENGTH; j--) {
                        htmlCrossOver.children[i].children[j].classList.remove('active')
                    }
                    for (let j = 0; j < COL - CROSS_OVER_LENGTH; j++) {
                        htmlCrossOver.children[i + 1].children[j].classList.remove('active')
                    }
                    check = 1
                }
            }
            document.querySelectorAll('.crossOverIcon').forEach(function (e) {
                e.style.opacity = 0
            })
            htmlCrossOver.style.opacity = 0
            for (let i = 0; i < NUM_OF_IND; i++) {
                for (let j = 0; j < COL; j++) {
                    htmlMutation.children[i].children[j].classList.remove('active')
                }
            }
            document.querySelector('.mutationIcon').style.opacity = 0
            document.querySelector('.mutationTitle').style.opacity = 0
            htmlMutation.style.left = '50px'
            setTimeout(function () {
                for (var i = 0; i < NUM_OF_IND; i++) {
                    for (var j = 0; j < htmlPopulation.children[i].children.length; j++) {
                        htmlPopulation.children[i].children[j].value = Population[i].Gene[j] + 1
                    }
                }
                htmlMutation.style.opacity = 0
            }, 1000)
            setTimeout(function () {
                htmlMutation.style.left = '1160px'
            }, 2000)
            // Chessboard
            for (let j = 0; j < COL; j++) {
                chessboard.children[0].children[COL - gene1st[j] - 1].children[j].value = ''
                chessboard.children[0].children[COL - gene1st[j] - 1].children[j].classList.remove('active')
                chessboard.children[1].children[COL - gene2nd[j] - 1].children[j].value = ''
                chessboard.children[1].children[COL - gene2nd[j] - 1].children[j].classList.remove('active')
                chessboard.children[2].children[COL - gene3rd[j] - 1].children[j].value = ''
                chessboard.children[2].children[COL - gene3rd[j] - 1].children[j].classList.remove('active')
                chessboard.children[3].children[COL - gene4th[j] - 1].children[j].value = ''
                chessboard.children[3].children[COL - gene4th[j] - 1].children[j].classList.remove('active')
            }
            for (let i = 0; i < NUM_OF_IND; i++) {
                for (let j = 0; j < COL; j++) {
                    chessboard.children[i].children[COL - Population[i].Gene[j] - 1].children[j].value = 'x'
                    chessboard.children[i].children[COL - Population[i].Gene[j] - 1].children[j].classList.add('active')
                }
            }
            fillFitnessCell()
        }
        action++
    } else if (action == 1) {
        // Fitness calculation
        for (let i = 0; i < NUM_OF_IND; i++) {
            Population[i].Fitness = fitnessCalculation(Population[i].Gene)
            htmlPopulation.children[i].children[htmlPopulation.children[i].children.length - 1].innerHTML = Population[i].Fitness
            fitnessArray[i] = Population[i].Fitness
        }
        var minFitness = Math.min(...fitnessArray)
        for (let i = 0; i < NUM_OF_IND; i++) {
            if (Population[i].Fitness === minFitness) {
                htmlPopulation.children[i].classList.add('disable')
            }
        }
        document.querySelector('.fitnessTitle').style.opacity = 1
        document.querySelectorAll('.fitness').forEach(function (e) {
            e.style.opacity = 1
        })
        action++
        start = true
        for (let i = 0; i < COL; i++) {
            gene1st[i] = Population[0].Gene[i]
            gene2nd[i] = Population[1].Gene[i]
            gene3rd[i] = Population[2].Gene[i]
            gene4th[i] = Population[3].Gene[i]
        }
    } else if (action == 2) {
        // Selection
        selection(Population)
        for (let i = 0; i < NUM_OF_IND; i++) {
            for (let j = 0; j < htmlSelection.children[i].children.length; j++) {
                htmlSelection.children[i].children[j].value = Population[i].Gene[j] + 1
            }
        }
        htmlSelection.style.opacity = 1
        action++
    } else if (action == 3) {
        // Cross - over
        let check = 1
        for (let j = 0; j < NUM_OF_IND; j += 2) {
            if (check === 1) {
                crossOver(Population[j].Gene, Population[j + 1].Gene, 0)
                check = 2
            } else {
                crossOver(Population[j].Gene, Population[j + 1].Gene, COL - 1)
                check = 1
            }
        }
        for (let i = 0; i < NUM_OF_IND; i++) {
            for (let j = 0; j < htmlSelection.children[i].children.length; j++) {
                htmlCrossOver.children[i].children[j].value = Population[i].Gene[j] + 1
            }
        }
        for (let i = 0; i < NUM_OF_IND; i += 2) {
            if (check === 1) {
                for (let j = 0; j < CROSS_OVER_LENGTH; j++) {
                    htmlCrossOver.children[i].children[j].classList.add('active')
                }
                for (let j = COL - 1; j >= CROSS_OVER_LENGTH; j--) {
                    htmlCrossOver.children[i + 1].children[j].classList.add('active')
                }
                check = 2
            } else {
                for (let j = COL - 1; j >= COL - CROSS_OVER_LENGTH; j--) {
                    htmlCrossOver.children[i].children[j].classList.add('active')
                }
                for (let j = 0; j < COL - CROSS_OVER_LENGTH; j++) {
                    htmlCrossOver.children[i + 1].children[j].classList.add('active')
                }
                check = 1
            }
        }
        document.querySelectorAll('.crossOverIcon').forEach(function (e) {
            e.style.opacity = 1
        })
        htmlCrossOver.style.opacity = 1
        action++
    } else if (action == 4) {
        // Mutation
        for (let i = 0; i < NUM_OF_IND; i++) {
            for (let j = 0; j < htmlSelection.children[i].children.length; j++) {
                htmlMutation.children[i].children[j].value = Population[i].Gene[j] + 1
            }
        }
        for (let i = 0; i < NUM_OF_IND; i++) {
            mutation(Population[i].Gene)
            htmlMutation.children[i].children[mutationIndex].classList.add('active')
            htmlMutation.children[i].children[mutationIndex].value = Population[i].Gene[mutationIndex] + 1
        }
        document.querySelector('.mutationIcon').style.opacity = 1
        document.querySelector('.mutationTitle').style.opacity = 1
        htmlMutation.style.opacity = 1
        action = 0
    }
}