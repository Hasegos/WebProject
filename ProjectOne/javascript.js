const wrapper = document.getElementById("wrapper");
const information = document.querySelector("form"); // form 태그 가져오기
const input = document.querySelector("input");

// 각각 input 정보들 가져오기
const nickName = document.querySelector(".nickName");
const userEmail = document.querySelector(".userEmail");
const userPassword = document.querySelector(".userPassword");
const confirmPassword = document.querySelector(".confirmPassword");
const userPhone = document.querySelector(".userPhone");

// 상태를 알려주는 창
const update = (input, message, boolean) => {
    const inputGroup = input.parentElement;
    
    const helperText = inputGroup.getElementsByClassName("helperText")[0];

    // 참일때
    if(boolean == true){
        inputGroup.classList.remove("invalid");
        inputGroup.classList.add("valid");
        helperText.style.visibility = "hidden"; // 안보이게끔
    }
    // 거짓일때
    else{
        inputGroup.classList.remove("valid");
        inputGroup.classList.add("invalid");
        helperText.style.visibility = "visible";
        helperText.innerText = message; // message입력
    }
}

// 닉네임 확인
const checkNickName = (input) => {
    if(input.value.trim() === ""){
        update(input, "닉네임을 기입해주세요", false);
        return false;
    }
    else{
        update(input, "", true);
        return true;
    }
}

// 이메일 형식 확인
const checkEmail = (input) => {
    // 이메일 정규식
    const checkPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;
    // 참 일때
    if(checkPattern.test(input.value.trim()) == true){
        update(input, "", true);
        return true;
    }
    // 거짓일때
    else{
        update(input, "이메일 형식이 맞지 않습니다.", false);
        return false;
    }
}

// 비밀번호 
const checkPassWord = (input) => {
    const checkPattern = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$/;

    if(checkPattern.test(input.value.trim()) == true){
        update(input, "", true);
        return true;
    }
    else {
        update(input, "비밀번호 형식이 맞지않습니다. 숫자,영문자, 특수기호 포함 8자리이상입니다.", false);
        return false;
    }
}


// 비밀번호 한번더 확인
const checkconfirmPassword = (PassWord,confirmPassword ) => {
    // 비번이 서로 틀릴떄
    if(PassWord.value != confirmPassword.value){
        update(confirmPassword, "비밀번호가 서로 맞지않습니다.", false);
        return false;
    }
    else{
        update(confirmPassword, "" , true);
        return true;
    }
}

// 전화번호 형식
const checkPhone = (input) => {
    const checkPattern = /^(01[016789]{1})-?[0-9]{3,4}-?[0-9]{4}$/;
    if(checkPattern.test(input.value.trim()) == true){
        update(input, "", true);
        return true;
    }
    else{
        update(input, "전화번호 형식이 맞지않습니다. (예: 010-1222-2222)");
        return false;
    }

}

// 모든필드가 맞는지 확인
const checkinformation = () => {
    const informationNickName = checkNickName(nickName);
    const informationEmail = checkEmail(userEmail);
    const informationPassword = checkPassWord(userPassword);
    const informationConfirmPassWord = checkconfirmPassword(userPassword,confirmPassword);
    const informationPhone = checkPhone(userPhone);

    return informationNickName && informationEmail && 
    informationPassword && informationConfirmPassWord && informationPhone;
}

// 폼태그에 이벤트 추가
information.addEventListener("submit", (e)=> {
    // 새로고침을 막기 (폼태그가 자동으로 서버에 데이터 전송하기떄문에)
    e.preventDefault();

    // 모든필드가 유효하지않다면
    if(checkinformation() != true){
        alert("모든필드가 유효하지않습니다.")
        console.log("모든필드가 유효하지않습니다.");
        
    }
    else{
        console.log("모든필드가 유효합니다.");
        console.log(nickName.value);
        console.log(userEmail.value);
        console.log(userPassword.value);
        console.log(confirmPassword.value);
        console.log(userPhone.value);
    }
    console.log(e);
})

// input을 클릭 한 곳에 각 메신저로 알려주기
document.querySelectorAll("input").forEach(e => {
    e.addEventListener("input", () => {
        switch(e.id){
            case 'nickName':
                checkNickName(e);                
                break;
            case 'userEmail':
                checkEmail(e);
                break;
            case 'userPassword':
                checkPassWord(e);
                break;
            case 'confirmPassword':
                checkconfirmPassword(userPassword, confirmPassword);
                break;
            case 'userPhone':
                checkPhone(e);
                break;
            default :
                break;
        }
    })

}); 