const saveButton = document.getElementById("saveButton");
const APIkey = document.getElementById("APIkey");

// api키 저장
function apiSave(){
    try{
        // null 값이거나 빈칸일때
        if(APIkey.value == null || APIkey.value == ""){
            alert("API키 입력해주세요");
        }
        else{
            const loaclSaveApikey = APIkey.value;        
            localStorage.setItem("APIkey", loaclSaveApikey);
            alert("API키 저장되었습니다.");
        }
    }
    catch(e){
        console.error(e);
    }   
}

saveButton.addEventListener("click", apiSave);