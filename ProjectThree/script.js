/* 실수부분 : 이미저장된 즐겨찾기 명언이랑 기존 명언이랑 비교할때 로컬스토리지 이용하기 */

const quoteDisplayArea = document.querySelector("#quoteContainer");
const currentQuote = document.getElementById("quote");
const loadingSpinner = document.getElementById("loader");
const favoriteQuoteList = document.getElementById("quotePickList");
const nextQuoteButton = document.getElementById("nextQuote");
const saveQuoteButton = document.getElementById("selectQuote");


let currentQuoteText = "";
let isQuoteSaved = false;


function showLoadingSpinner(){
    loadingSpinner.style.display = "block";
    // 로딩중텍스트는 보이게
    quoteDisplayArea.style.display = "none";
    // 명언텍스트는 보이지않게
}

function hideLoadingSpinner(){
    loadingSpinner.style.display = "none";
    // 로딩중텍스트는 보이게
    quoteDisplayArea.style.display = "block";
    // 명언텍스트는 보이지않게
}


// 비동기 API키 파싱
async function fetchKoreaQuote() {
    showLoadingSpinner();

    const apiUrl = "https://korean-advice-open-api.vercel.app/api/advice";
    try{
        const response = await fetch(apiUrl);        
        const data = await response.json();        
        currentQuoteText = data.message;       
        
        currentQuote.innerText = currentQuoteText;
        localStorage.setItem("currentQuote",currentQuoteText);

        // api를 통해 데이터를 가져오기만하고
        // 아직 로컬스토리지에 저장한거는 명언을 저장한걸로 치지않는다.
        // 정확히는 로컬스토리에 저장한것과 즐겨찾기에 명언이 존재해야지 
        // 이제 이때서야 isQuoteSaved가 됬다고 true를 설정한다.    
        isQuoteSaved = false;
    }
    catch(error){
        console.error(`에러 발생 : ${error}`);
        currentQuote.innerText = "명언을 불러올 수 없습니다."
    }

    hideLoadingSpinner();    
}


// 명언 즐겨찾기 리스트에 추가
function saveFavoriteQuote(){    

    const storedQuote = localStorage.getItem("currentQuote");  
    //  리스트에 명언이 있는 체크 , 값이 있는 지 확인
    if(isQuoteSaved == false && storedQuote !== null && !isQuoteAlreadyInList(storedQuote)){
        const listItem = document.createElement("li");
        // <li> </li>;
        listItem.innerText = storedQuote;
        // <li> 명언 </li>;
        favoriteQuoteList.appendChild(listItem);
        // <ul>
        //     <li>명언 ~~</li>
        // </ul> 
        isQuoteSaved = true; // 명언이 저장되었음을 표시
    }
    else if(isQuoteSaved == true){
        alert("이 명언은 이미 저장되었습니다.");
    }else{
        alert("이 명언은 즐겨찾기에 추가되었습니다.");
    }
    
}

function isQuoteAlreadyInList(quote){
    const listItems = favoriteQuoteList.getElementsByTagName("li");
    for(item of listItems){ // 하나씩 명언 담기
        if(item.innerText === quote){ // 로컬스토리지에 이미 저장된 값과 해당명언이 같다면
            return true; // true로 반환
            // 데이터가 이미 존재하는 경우 더이상 중복데이터 저장 x
        }
    }
    return false; 
    // 데이터가 중복되지않은 경우
}

// 다음 버튼 클릭시 새로운 명언 추가
nextQuoteButton.addEventListener("click",fetchKoreaQuote);
// 선택 버튼 클릭시 명언을 즐겨찾기에 추가
saveQuoteButton.addEventListener("click",saveFavoriteQuote);

// 페이지 로드시 첫 명언 호출

fetchKoreaQuote();