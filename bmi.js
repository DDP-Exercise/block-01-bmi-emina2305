"use strict";
/*******************************************************
 *     bmi.js
 *
 *     Write a small program that calculates the Body Mass Index according to parameters,
 *     given by the user. It should generate a textbased representation like the following:
 *
 *     -----------------------------------------------------
 *     Name:		         :LAST NAME:, :First name:
 *     -----------------------------------------------------
 *     Age:                  :age: Years
 *     Height:		         :size:m (i.e. 1,81m)
 *     Weight:	             :weight: kg
 *     Basal Metabolic Rate: <bmr> kcal
 *     Body Mass Index:	     <bmi>
 *     Normal Weight:        <Yes/No>
 *     Danger:		         <Yes/No>
 *     -----------------------------------------------------
 *
 *     To do so, collect data from your users. Values within :colons: are (formatted) user-inputs;
 *     values within <angle brackets> have to be calculated by your software.
 *
 *     You - 2026-03-05
 *******************************************************/

const readline = require("readline-sync");

/*
 * TODO: Declare and assign all necessary constants and variables with user input.
 * Make sure, to help your users understand what they need to type in, by using clear prompt-instructions.
 */

const LINE = "-----------------------------------------------------";
let bmr, bmi, normal, danger;
const RED = "\x1b[31m";
const RESET = "\x1b[0m";

/**
 * Formulas:
 *
 * BMR = A + B × weight [kg] + C × height [cm] − D × age [years]
 *      For women: A=655, B=10, C=2, D=6
 *      For men: A=66, B=14, C=5, D=7
 *
 * BMI = (10000 * weight [kg]) / height² [cm]
 *
 * Normal Weight = Any BMI between 18 and 25 (including 18 and 25).
 * Danger = Any BMI lower than 16 or 30+.
 **/

/*
 * TODO: To calculate the bmr; ask your users which calculation method they would prefer (male or female).
 * Be careful. Users make typos. Make sure that you have a valid answer before moving on.
 */

function printError(message) {
    console.log(RED + "Error: " + message + RESET);
}

function askNonEmptyText(message) {
    while (true) {
        const input = readline.question(message + " ").trim();

        if (input !== "") {
            return input;
        }

        printError("This field must not be empty. Please try again.");
    }
}

function askPositiveNumber(message) {
    while (true) {
        const input = readline.question(message + " ").trim().replace(",", ".");
        const value = Number(input);

        if (input === "") {
            printError("Input must not be empty. Please enter a number.");
            continue;
        }

        if (!Number.isFinite(value)) {
            printError("That is not a valid number. Please try again.");
            continue;
        }

        if (value <= 0) {
            printError("The value must be greater than 0. Please try again.");
            continue;
        }

        return value;
    }
}

function askAge(message) {
    while (true) {
        const age = askPositiveNumber(message);

        if (!Number.isInteger(age)) {
            printError("Age must be a whole number in full years.");
            continue;
        }

        if (age < 1 || age > 130) {
            printError("Please enter a realistic age between 1 and 130.");
            continue;
        }

        return age;
    }
}

function askGender(message) {
    while (true) {
        let input = readline.question(message + " ").trim().toLowerCase();

        if (input === "m" || input === "man") input = "male";
        if (input === "f" || input === "woman") input = "female";

        if (input === "male" || input === "female") {
            return input;
        }

        printError('Please type "male" or "female".');
    }
}

function askHeightInCm(message) {
    while (true) {
        let height = askPositiveNumber(message);

        // smaller than 3 -> m, otherwise cm
        if (height < 3) {
            height *= 100;
        }

        if (height < 30) {
            printError("Height is too small. Please enter a realistic value in cm or m.");
            continue;
        }

        if (height > 300) {
            printError("Height is too large. Please enter a realistic value in cm or m.");
            continue;
        }

        return height;
    }
}

function askWeightInKg(message) {
    while (true) {
        const weight = askPositiveNumber(message);

        if (weight < 1) {
            printError("Weight is too small. Please enter a realistic value in kilograms.");
            continue;
        }

        if (weight > 700) {
            printError("Weight is too large. Please enter a realistic value in kilograms.");
            continue;
        }

        return weight;
    }
}

function formatMetersFromCm(heightCm) {
    return (heightCm / 100).toFixed(2).replace(".", ",") + "m";
}

function formatLine(label, value) {
    return label.padEnd(22, " ") + value;
}

// User input

const lastName = askNonEmptyText("Enter your last name:");
const firstName = askNonEmptyText("Enter your first name:");
const age = askAge("Enter your age in full years:");
const heightCm = askHeightInCm("Enter your height. \nYou may type centimeters (e.g. 170) or meters (e.g. 1.70):");
const weightKg = askWeightInKg("Enter your weight in kilograms (e.g. 77 or 77.5):");
const gender = askGender("Which BMR formula should be used? Type: male or female");

// TODO: To calculate the bmi, use the given formula with all the input you have collected.
// TODO: Once you have the bmi, determine whether or not the weight is normal and if the condition is dangerous.

if (gender === "female") {
    bmr = 655 + (10 * weightKg) + (2 * heightCm) - (6 * age);
} else {
    bmr = 66 + (14 * weightKg) + (5 * heightCm) - (7 * age);
}

bmi = (10000 * weightKg) / (heightCm ** 2);
normal = bmi >= 18 && bmi <= 25;
danger = bmi < 16 || bmi >= 30;

/*
 * TODO: Create the correct output from all your data. Make sure to stick to the promised format! NO EXCEPTIONS!
 * You can use \t to add a Tab-Space. Once your program is completed, the output in the browser console should
 * look EXACTLY like the Example-Output above (with different data, of course).
 *
 *  Valid Example:
 *   -----------------------------------------------------
 *   Name:		           NEUWERSCH, Matthias
 *   -----------------------------------------------------
 *   Age:                  35 Years
 *   Height:               1,78m
 *   Weight:               77 kg
 *   Basal Metabolic Rate: 1789 kcal
 *   Body Mass Index:      24.302487059714682
 *   Normal Weight:        Yes
 *   Danger:               No
 *   -----------------------------------------------------
 */

console.clear();
console.log(LINE);
console.log(formatLine("Name:", lastName.toUpperCase() + ", " + firstName));
console.log(LINE);
console.log(formatLine("Age:", age + " Years"));
console.log(formatLine("Height:", formatMetersFromCm(heightCm)));
console.log(formatLine("Weight:", weightKg + " kg"));
console.log(formatLine("Basal Metabolic Rate:", Math.round(bmr) + " kcal"));
console.log(formatLine("Body Mass Index:", bmi));
console.log(formatLine("Normal Weight:", normal ? "Yes" : "No"));
console.log(formatLine("Danger:", danger ? "Yes" : "No"));
console.log(LINE);

/*
 * TODO: Make sure to TEST YOUR SOFTWARE! Does it work, when People are smaller than 1 meter? Or taller than 2?
 * Tip: An 18-Year old Woman, sized 160cm with 60 kg should have a BMR of 1467 kcal and a BMI of 23.4375.
 */