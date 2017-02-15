function Character(name, type, gender, age, strength, HP) {
	this.name = name;
	this.type = type;
	this.gender = gender;
	this.age = age;
	this.strength = strength;
	this.HP = HP;
	this.printStats = function(){
		console.log("--------------------");
		console.log("Name: " + this.name);
		console.log("Type: " + this.type);
		console.log("Gender: " + this.gender);
		console.log("Age: " + this.age);
		console.log("Strength: " + this.strength);
		console.log("HP: " + this.HP);
		console.log("--------------------");
	};
	this.isAlive = function(){
		if(this.HP < 0) {
			console.log(`
-------------------------
${this.name} has perished.
-------------------------
`)
		}else {
			console.log(`
-------------------------
${this.name} is alive!
-------------------------
`)
		}
	};
	this.attack = function(opponent){
		opponent.HP -= this.strength;
	};
	this.levelUp = function(){
		this.age += 1;
		this.strength += 5;
		this.HP += 25;
	}
}

var characterOne = new Character("Fiona","Enchantress","Female",1080,20,150);
var characterTwo = new Character("Francis","Necromancer","Male",1080,18,140);
var characterThree = new Character("Amara","Sorceress","Female",4000,40,200);

characterOne.printStats();
characterTwo.printStats();
characterThree.printStats();

var inquirer = require("inquirer");

rpg();


// Game start -> User is asked to choose a battle pair. 
// User is then asked to choose a battle sequence - 
//						random: a coin flip is used to decide which character attacks the other based on user's heads or tails selection
//						- randomAttack() function called
//						chosen: user chooses their champion
//						- championAttacks() function called
function rpg() {
	// Get two character names from user with inquirer
	inquirer.prompt([
		{
			type: 'rawlist',
			name: 'battlePair',
			message: 'Choose the characters you want to fight: ',
			choices: [characterOne.name + " vs " + characterTwo.name, characterTwo.name + " vs " + characterThree.name, characterThree.name + " vs " + characterOne.name]
		}
	]).then(function(playerChoice){
		var warriorOne;
		var warriorTwo;
		// console.log("Battle pair: " + playerChoice.battlePair);
		// Random number pointing to index
		switch(playerChoice.battlePair) {
			case (characterOne.name + " vs " + characterTwo.name):

				warriorOne = characterOne;
				warriorTwo = characterTwo;
				break;

			case (characterTwo.name + " vs " + characterThree.name):
				warriorOne = characterTwo;
				warriorTwo = characterThree;
				break;

			case (characterThree.name + " vs " + characterOne.name):
				warriorOne = characterThree;
				warriorTwo = characterOne;
				break;
		}
		if(((characterOne.HP <= 0) && (characterTwo.HP <= 0)) || ((characterOne.HP <= 0) && (characterThree <= 0)) || ((characterTwo.HP <= 0) && (characterThree <= 0))) {
			console.log("Only one warrior stands victorious. Game over.");
			return;
		}else if(characterTwo.HP <= 0) {
			warriorOne = characterThree;
			warriorTwo = characterOne;
			console.log("Sorry. Only one battle pair possible");
		}else if(characterThree <= 0) {
			warriorOne = characterOne;
			warriorTwo = characterTwo;
			console.log("Sorry. Only one battle pair possible");
		}else if(characterOne.HP <= 0) {
			warriorOne = characterTwo;
			warriorTwo = characterThree;
			console.log("Sorry. Only one battle pair possible");
		}
		console.log("Battle pair: " + warriorOne.name + " vs " + warriorTwo.name);
		inquirer.prompt([
			{	
				type: 'list',
				message: 'Choose your battle sequence:',
				choices: ["Random Attack (fate decides who attacks with a coin flip)", "you choose who attacks whom"],
				name: 'attackSequence' 
			}
		]).then(function(userChoice) {
			if(userChoice.attackSequence == ("Random Attack (fate decides who attacks with a coin flip)")){
				randomAttack(warriorOne, warriorTwo);
			}else {
				inquirer.prompt([
					{	
						type: 'list',
						message: 'Who would you like to be your champion?',
						name: 'champion',
						choices: [warriorOne.name, warriorTwo.name]
					}
				]).then(function(user) {
					championAttacks(warriorOne, warriorTwo, user.champion);
				});
			}
		});
		
	});
}

// Prompt to ask user to select who represent them
// Based on user's champion selection, attack() is called
// continueGame() function is called with 'chosen' as gameSequence
function championAttacks(warriorOne, warriorTwo, championName){
	if(championName === warriorOne.name) {
		warriorOne.attack(warriorTwo);
	}else {
		warriorTwo.attack(warriorOne);
	}
	continueGame(warriorOne, warriorTwo, championName);


}

// Randomly choose heads or tails. 
// Prompt user to choose heads or tails. If user gets choice right, character 1 attacks 2. If not, character 2 attacks 1. 
// continueGame() called with 'random' as gameSequence
function randomAttack(warriorOne, warriorTwo) {
	inquirer.prompt([
		{	
			type: 'list',
			name: 'coinFace',
			message: 'Flip coin to randomly attack: ',
			choices: ["Heads","Tails"]
		}
	]). then(function(coinChoice) {
		var compare = Math.floor(Math.random() * 2) === 1 ? 'heads' : 'tails';
		if(coinChoice.coinFace.toLowerCase() === compare) {
			console.log(`
-------------------------
${warriorOne.name} attacks ${warriorTwo.name}
-------------------------
`);
			warriorOne.attack(warriorTwo);
		}else {
			warriorTwo.attack(warriorOne);
			console.log(`
-------------------------
${warriorTwo.name} attacks ${warriorOne.name}
-------------------------
`);
		}
		continueGame(warriorOne, warriorTwo, 'random');
	});
}

// Accepts game sequence, prints stats and isAlive or not
// Asks if user wants to attack again
// Based on reply, - game either attacks again the same way as before, or 
//				   - game asks if user wants to choose another battle pair
// If user chooses to do battle with another pair, transfer control to RPG() 
// Else exit the game
function continueGame(warriorOne, warriorTwo, gameSequence) {
	warriorOne.printStats();
	warriorOne.isAlive();
	warriorTwo.printStats();
	warriorTwo.isAlive();

	if((warriorOne.HP > 0) && (warriorTwo.HP > 0)) {
		inquirer.prompt([
			{
				type: 'confirm',
				message: 'Attack again?',
				name: 'attackAgain'
			}
		]).then(function(confirm) {
			if(confirm.attackAgain) {
				if(gameSequence == 'random'){
					randomAttack(warriorOne, warriorTwo);
				}else {
					championAttacks(warriorOne, warriorTwo, gameSequence);
				}
			}else {
				endOrStartAnotherGame(warriorOne, warriorTwo);
			}
		})
	}else {
		if(warriorOne.HP > 0) {
			warriorOne.levelUp();
			console.log(warriorOne.name + " has leveled up");
			warriorOne.printStats();
		}else {
			warriorTwo.levelUp();
			console.log(warriorTwo.name + " has leveled up");
			warriorTwo.printStats();
		}
		endOrStartAnotherGame(warriorOne, warriorTwo);
	}
}

function endOrStartAnotherGame(warriorOne, warriorTwo) {
	inquirer.prompt([
		{
			type: 'list',
			message: 'Would you like to choose another battle pair or exit?',
			name: 'doWhat',
			choices: ["Choose another pair", "End war"]
		}
	]).then(function(next) {
		if(next.doWhat === "Choose another pair") {
			rpg();
		}else {
			console.log("Ending war");
			return;
		}
	})
}