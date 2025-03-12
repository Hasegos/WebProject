const saveButton = document.getElementById("saveButton");
const API = document.getElementById("ApiImformation"); // ul태그
const imformation = document.getElementById("imformation");
const inputCharacter = document.getElementById("inputCharacter"); // 캐릭터 이름 입력
const characterList = document.getElementById("characterList"); // 즐겨찾기 내용


// 캐릭터 정보
async function charactersImformation() {
    // 캐릭터 이름
    const repCharacter = inputCharacter.value;   
      
    // 해당 안에 내용 초기화
    API.innerHTML = "";

    // 입력값이 없을 경우
    if(repCharacter == null || repCharacter == ""){
        alert("캐릭터 이름을 입력해주세요");
    }

    // API키
    const key = localStorage.getItem("APIkey");    

    try{
        const cleanKey = key.trim().replace(/\s+/g,''); // 공백 줄바꿈 삭제

        // ASCII가 아닌 문자가 포함되어있을 경우 / null 값을 경우
        if(!/^[\x00-\x7F]*$/.test(cleanKey) || cleanKey == null){
            throw new Error("API키가 유효 하지않습니다.");
        }   
        const apiurl =  await fetch(`https://developer-lostark.game.onstove.com/characters/${repCharacter}/siblings`,{
            method: "GET",
            headers : {
                "accept" : "application/json",
                "authorization" : `bearer ${key}`,
            }   
        });

        const imageCharacterUrl = await fetch(`https://developer-lostark.game.onstove.com/armories/characters/${repCharacter}/profiles`,{
            method: "GET",
            headers : {
                "accept" : "application/json",
                "authorization" : `bearer ${key}`,
            }
        });
        const image = await imageCharacterUrl.json();
        
        // 각 오류들 에러 발생
        if(apiurl.status === 401){
            throw new Error("해당 API키는 유효하지않습니다.");
        }        
        else if(apiurl.status === 403){
            throw new Error("해당 API키의 접근권한이 없습니다.");
        }
        else if(apiurl.status === 404){
            throw new Error("해당 캐릭터가 없습니다.");
        }
        else if(!apiurl.ok){
            throw new Error("알 수 없는 오류가 발생했습니다. 콘솔을 확인하세요.");
        }        
        const response = await apiurl.json(); 
        searchCharacter(response, repCharacter,image.CharacterImage);        
    }catch(e){      
        console.error("에러 발생 : " , e.message);
        alert(e.message);
    } 
}

// 캐릭터 찾기 함수
function searchCharacter(response,repCharacter,image){
    
    const img = new Image();
    img.src = image;
    img.style.width = "200px";
    for(item of response){

        if(item.CharacterName == repCharacter){
            const div = document.createElement("div");
            
            // 부모 밑 자식으로 요소 추가가능하게끔 (선택한 요소에 텍스트 삽입하도록)
            const CharacterClassName = document.createTextNode("직업 : "+item.CharacterClassName);            
            const CharacterName = document.createTextNode(item.CharacterName + " ");
            const ItemAvgLevel = document.createTextNode(item.ItemAvgLevel + " ");
            const ServerName = document.createTextNode(item.ServerName + " 이미지 : ");
            API.appendChild(div);   

            const br = document.createElement("br");

            div.append(CharacterClassName,br, CharacterName,br.cloneNode(),
                    ItemAvgLevel,br.cloneNode(), ServerName,br.cloneNode(),
                    img
            );                
    
            localStorage.setItem("CharacterClassName", item.CharacterClassName);
            localStorage.setItem("CharacterName", item.CharacterName);
            localStorage.setItem("ItemAvgLevel", item.ItemAvgLevel);
            localStorage.setItem("ServerName" ,item.ServerName );
            localStorage.setItem("image" ,image);
        }
        else{
            console.log("해당 캐릭터는 존재하지않습니다.");
        }    
    }
}

// 저장 버튼 클릭시
function saveImformation(){
    const img = document.createElement("img");    
    const div = document.createElement("div");

    const button = document.createElement("button");
    button.textContent = "삭제하기";
    
    // 해당 이미지 삭제하기
    button.addEventListener("click", function (){
        div.remove();
    })    
    
    const CharacterClassName = document.createTextNode("직업 : "+ localStorage.getItem("CharacterClassName"));            
    const CharacterName = document.createTextNode("캐릭터 이름 : " + localStorage.getItem("CharacterName"));
    const ItemAvgLevel = document.createTextNode("클래스 이름 : " + localStorage.getItem("CharacterClassName"));
    const ServerName = document.createTextNode("아이템 레벨 : "  + localStorage.getItem("ItemAvgLevel"));
    const image = localStorage.getItem("image"); // 객체가 아닌 이미지 형태로 그대로가져와야함        

    img.src = image;   
    img.style.width = "200px";
    characterList.appendChild(div);    

    const br = document.createElement("br");

    div.append(CharacterClassName,br, CharacterName,br.cloneNode(),
        ItemAvgLevel,br.cloneNode(), ServerName,br.cloneNode(),
        img ,br.cloneNode(), button
    );     
}

imformation.addEventListener("click",charactersImformation);
saveButton.addEventListener("click",saveImformation );