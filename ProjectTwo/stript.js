const screen = document.getElementById("screen"); // 스크린 
const buttons = document.querySelectorAll("button") // 버튼


// 필요 기능 : 계산, 버튼을 눌렀을시 해당 숫자를 스크린에다가 보여주는함수

// 연산자 정규식
let operator = /^(\d+|\*\*|[+\-*/])$/;

// 숫자 정규식
let number = /[0-9]/g;

// 스크린 초기화
function clearScreen(){
    screen.value = "";
}

// 스크린에 추가
function addScreen(value){
    screen.value += value;
}

// 버튼 클릭시
function buttonClick(event) {
    event.preventDefault(); // 새로고침 방어
    const buttonText = event.target.innerText; // 버튼클릭시 숫자

    if(number.test(buttonText) == true){
        addScreen(buttonText);
    }
    else if(operator.test(buttonText) == true){
        addScreen(buttonText);
    }
}
// 각 버튼마다 이벤트 발생시
function buttonListeners () {
    buttons.forEach((button) => {
        button.addEventListener("click", buttonClick);
    });
}


// 계산함수
function calculate(operator, numbers){
    const [num1 ,num2] = numbers.map(Number);

    switch(operator){
        case "+":
            return num1 + num2;
        case "-":
            return num1 - num2;
        case "*":   
            return num1 * num2;
        case "/":
            return num1 / num2;
        default :
            break;
    }
}

function resultButton(){
    const screenValue = screen.value;       
    if(screenValue.includes("+")){      
        const [num1, num2] = screenValue.split("+");
        screen.value = calculate("+", [num1,num2]);
        alert(screen.value);
    }
    else if(screenValue.includes("-")){
        const [num1, num2] = screenValue.split("-");
        screen.value = calculate("-", [num1,num2]);
        alert(screen.value);
    }
    else if(screenValue.includes("*")){
        const [num1, num2] = screenValue.split("*");
        screen.value = calculate("*", [num1,num2]);
        alert(screen.value);
    }
    else if(screenValue.includes("/")){
        const [num1, num2] = screenValue.split("/");
        screen.value = calculate("/", [num1,num2]);
        alert(screen.value);
    }
}

document.getElementById("resetButton").addEventListener("click",clearScreen);

document.getElementById("resultButton").addEventListener("click",resultButton);

buttonListeners();

