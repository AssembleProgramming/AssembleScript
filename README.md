![AssembleScript](https://github.com/AssembleProgramming/AssembleScript/assets/104154041/1f7809c0-1516-435d-b112-f761de5cc491)

AssembleScript is a programming language designed for avengers to write powerful scripts and fight against evil forces. This repository contains the source code and documentation for AssembleScript.

## Supported File-Extensions
The `.avenger` file extension is commonly used for code written in AssembleScript.

Here is the demo file for the code written in AssembleScript. [download](https://github.com/AssembleProgramming/AssembleScript/files/11951651/test.avenger.zip)

## Setup

Download Node.js. Run this followed commands:

```bash
# Clone the Repository
git clone https://github.com/AssembleProgramming/AssembleScript.git

# Install Deno using npm: In the terminal, execute the following command to install Deno globally using npm:
sudo npm install -g deno (MAC)
sudo snap install deno (LINUX)
npm install -g deno (WINDOWS)

# Verify the installation: After the installation is complete, you can verify that Deno has been installed correctly by running the following command:
deno --version

# Run the project
deno run -A main.ts

# Format your entire code with this command
deno fmt

# Add your test code to test.txt
```
<hr>
<hr>
<hr>

<div align="center">
<h1> 📚 Documentation and Usage Guide </h1>
</div>

## KeyWords

The following keywords in AssembleScript have significant references to the Marvel Cinematic Universe:

- `newAvenger` (let): In the Marvel universe, new heroes emerge to join forces and fight against evil. Similar to the let keyword, in AssembleScript `newAvenger` represents the creation of a new variable, symbolizing the arrival of a new Avenger.

- `newEternal` (const): The Eternals, a powerful group of immortal beings in the Marvel universe, possess steadfastness and unchanging qualities. Similar to the const keyword, `newEternal` in AssembleScript signifies the declaration of a constant value that remains immutable throughout the program.

- `vision` (print): Vision, a synthetic being possessing superhuman abilities, has enhanced vision and perception. In AssembleScript, the `vision` keyword is referred to as print, allowing you to visualize and display output to the console.

- `multiverse - madness` (switch - case): The Marvel multiverse is a complex web of alternate realities and dimensions. The `multiverse - madness` statement in AssembleScript represents the ability to navigate through different scenarios, just like traversing the multiverse. The `madness` keyword within switch case signifies the chaos and unpredictability encountered in different dimensions.

- `ifWorthy - otherwise` (if - else): AssembleScript embraces the notion of worthiness, a concept frequently explored in the Marvel universe. The if - else construct in AssembleScript is represented by `ifWorthy - otherwise`, where the keyword `ifWorthy` represents a condition that must be met to proceed, while `otherwise` offers an alternative path if the condition is not fulfilled.

- `endGame` (Break): The Avengers: Endgame movie signifies the culmination of an epic saga and the end of an era. In AssembleScript, the break statement is symbolically referred to as `endGame`, signifying the end or termination of a loop.

- `SHIELD` (True): In the Marvel universe, SHIELD (Strategic Homeland Intervention, Enforcement, and Logistics Division) represents an organization dedicated to protecting the world from various threats. In AssembleScript, the true value is denoted by `SHIELD`, indicating a state of truth or validation.

- `HYDRA` (False): HYDRA, a secret organization seeking to subvert and manipulate events from within, poses a constant threat in the Marvel universe. In AssembleScript, the false value is symbolized by `HYDRA`, representing falsehood or negation.

- `wakandaFor` loop (For Loop): Wakanda, a technologically advanced nation in the Marvel universe, embraces progress and innovation. The for loop in AssembleScript is aptly named `wakandaFor`, signifying a iteration and advancement.

- `fightUntil` loop (While Loop): Marvel superheroes engage in relentless battles, fighting until they overcome their adversaries. Similarly, the while loop in AssembleScript is referred to as `fightUntil`, embodying the determination to continue executing a block of code until a condition is met.

- `null` : In the Marvel universe, the concept of nullifying or negating powers or threats is prevalent. In AssembleScript, `null` represents the absence of a value or the state of nothingness.

- `team` (Array): The Avengers, a team of superheroes with diverse abilities, join forces to achieve common goals. In AssembleScript, the `team` keyword  represents array, symbolizing the formation of an array or a team of values working together.

Embrace the spirit of superheroes as you code in AssembleScript, harnessing the power of these keywords to build marvelous programs!

To write scripts in AssembleScript, follow the syntax described blelow. The language supports variables, operators, if-else statements, switch statements, and loops.Use .a Here are some important points to keep in mind:

### 🛡 Variables

Declare variables using the `newAvenger` keyword followed by the variable name and initial value.

Declare const using the `newEternal` keyword followed by the variable name and value.

Variable name must not contain any number or any other special character otherthan `UNDERSCORE` 

```diff
---INVALID: $thanos, gor69, iamgoblintheno1, @dormamu, %hella

+++VALID: _ironman, captain_america, __moon_knight, spiderman
```


```css
newAvenger a = "Strange";
newAvenger b = 3000;
newEternal PI = 3.142;
newEternal AI = "Jarvis";
```

### 🛡 Print

To Print in console use `vision()`

```css
vision("Love You 3000");
```

### 🛡 Switch Statements

Use the `multiverse` keyword for switch statements. Check the value of a variable and execute the corresponding `madness` or the `default` block.

```diff
@@ Instead of break keyword use `endgame`@@

```

```css
newAvenger name = "iron";
multiverse(name){
    madness "captain":
        endgame;
    madness "iron":
        endgame;
    default:
        endgame;
}
```

### 🛡 If-Else Statements

Use the `ifWorthy` keyword for conditional statements. If the condition is true, execute the code within the curly braces; otherwise, execute the code in the `otherwise` block.

```diff
@@ Instead of True keyword use `SHIELD`@@
@@ Instead of False keyword use `HYDRA`@@
```

```css
newAvenger isTrue = SHIELD;
newAvenger isFalse = HYDRA;

ifWorthy(isTrue){
    vision("Hello World!");
}
otherwise{
    vision("Hello Thanos!");
}
```

### 🛡 Loops

AssembleScript supports for and while loops.

- For Loops
  Use the `wakandaFor` keyword for loops. Declare a new variable, specify the condition, and execute the code within the loop. Use `step` to increment or decrement the value of interator.

```diff
@@ use blank `vision()` for a newline@@

```

```css
wakandaFor i in 0 to 10 {
     vision(i);
}
vision();
wakandaFor i in 10 to 0 step 2{
    vision(i);
}
```

- While Loops
  Use the `fightUntil` keyword for while loops. Specify the condition and execute the code within the loop.

```css
newAvenger i = 0;
fightUntil(i < 10){
    vision(i);
    i = i + 1;
}
```

### 🛡 Comments

In AssembleScript, you can add comments to your code to provide explanations, document your intentions, or leave notes for yourself or other developers. Marvel Cinematic Universe-inspired comments in AssembleScript add a touch of superhero flair to your code.

```diff
$ Single Line Comments $

$
Multi-line
Comments
$
```

```diff
$ This variable stores the hero's strength $
newAvenger power = 100;

```

### 🛡 General Information

- DataTypes
```diff
@@ {number} {string} {null} {boolean} @@
```

- Operator
  
    - Assignment : `=`
    - Binary : `+`(ADD) &nbsp;&nbsp;&nbsp;&nbsp; `-`(SUB)&nbsp;&nbsp;&nbsp;&nbsp; `*`(MUL)&nbsp;&nbsp;&nbsp;&nbsp; `/`(DIV) &nbsp;&nbsp;&nbsp;&nbsp;`%`(MOD)&nbsp;&nbsp;&nbsp;&nbsp; `^`(POW)
    - Relop : `<` &nbsp;&nbsp;&nbsp;&nbsp; `>` &nbsp;&nbsp;&nbsp;&nbsp;  `<=` &nbsp;&nbsp;&nbsp;&nbsp; `>=`  &nbsp;&nbsp;&nbsp;&nbsp; `==`  &nbsp;&nbsp;&nbsp;&nbsp; `!=`
    - Unary : `!`  &nbsp;&nbsp;&nbsp;&nbsp; `<MINUS>` &nbsp;&nbsp;&nbsp;&nbsp;
    - Logical : `&&` &nbsp;| &nbsp; `and` &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; `||` &nbsp; | &nbsp; `or` 

### 🛡 Built-In Methods

- General Methods
```js
typeOf(varName);
vision(args);
```
- Number Methods
```js
time();          //To get the current time in AssembleScript
random();        //return random number between 0-1 exclusive
abs(number);     //return absolute value
floor(number);   //rounds a number down to the nearest integer.
ceil(number);    //rounds a number up to the nearest integer.
sin(angle);      //calculates the sine of an angle.
cos(angle);      //calculates the cosine of an angle.
tan(angle);      //calculates the tangent of an angle.
iSin(number);    //calculates the inverse sine of a number.
iCos(number);    //calculates the inverse sine of a number.
iTan(number);    //calculates the inverse sine of a number.
sqrt(number);    //calculates the square root of a number.
pow(a, b);       //calculates the power of a number a raised to b.
min(num1, num2); //returns the smallest of two numbers num1 and num2.
max(num1, num2); //returns the largest of two numbers num1 and num2.
```
- String Methods
```js
len(string);                        //returns the length of string
charAt(string, index);              // returns the character at given index
concat(string1, string2);           // returns the string with the concatenation of given two strings
toLowerCase(string);                //returns the string in lower case
toUpperCase(string);                //returns the string in uppercase
indexOf(string, char):              //returns the index of character from string
subStr(string, startIdx, endIdx);   //returns the substring from start index to end index
trim(string);                       // removes leading 
```



## 🤝 Contributing

Contributions are welcome! If you find a bug or have suggestions for improvement, please open an issue or submit a pull request.

## 🙏 Acknowledgements

Thanks to the creators and maintainers of TypeScript and Deno for their invaluable tools and documentation.

That's it! Start writing powerful scripts using AssembleScript and unleash your superhero potential!
