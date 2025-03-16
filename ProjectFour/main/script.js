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

    once = true;

    // 입력값이 없을 경우
    if(repCharacter == null || repCharacter == ""){
        alert("캐릭터 이름을 입력해주세요");
        return;
    }

    // API키
    const key = localStorage.getItem("APIkey");    

    try{
        const cleanKey = key.trim().replace(/\s+/g,''); // 공백 줄바꿈 삭제

        // ASCII가 아닌 문자가 포함되어있을 경우 / null 값을 경우
        if(!/^[\x00-\x7F]*$/.test(cleanKey) || cleanKey == null){
            throw new Error("API키가 유효 하지않습니다.");
        }      
        // 캐릭터 정보 url
        const characterUrl = await fetch(`https://developer-lostark.game.onstove.com/armories/characters/${repCharacter}/profiles`,{
            method: "GET",
            headers : {
                "accept" : "application/json",
                "authorization" : `bearer ${key}`,
            }
        });
        // 캐릭터 정보
        const characterImformation = await characterUrl.json();       
        
        // 캐릭터 장비 url
        const characterEquipmentUrl= await fetch(`https://developer-lostark.game.onstove.com/armories/characters/${repCharacter}/equipment`,{
            method: "GET",
            headers : {
                "accept" : "application/json",
                "authorization" : `bearer ${key}`,
            }
        });

        // 캐릭터 아이템 정보
        const characterEquipment  = await characterEquipmentUrl.json();
        console.log(characterEquipment)


        // 캐릭터 각인 url
        const characterEngravingUrl= await fetch(`https://developer-lostark.game.onstove.com/armories/characters/${repCharacter}/engravings`,{
            method: "GET",
            headers : {
                "accept" : "application/json",
                "authorization" : `bearer ${key}`,
            }
        });

        const characterEngraving = await characterEngravingUrl.json();
        console.log(characterEngraving);       
        
        // 각 오류들 에러 발생
        if(characterUrl.status === 401){
            throw new Error("해당 API키는 유효하지않습니다.");
        }        
        else if(characterUrl.status === 403){
            throw new Error("해당 API키의 접근권한이 없습니다.");
        }
        else if(characterUrl.status === 404){
            throw new Error("해당 캐릭터가 없습니다.");
        }
        else if(!characterUrl.ok){
            throw new Error("알 수 없는 오류가 발생했습니다. 콘솔을 확인하세요.");
        }                
                        // 캐릭터 자체 정보, 캐릭터 장비정보, 캐릭터 각인정보
        searchCharacter(characterImformation, characterEquipment,
             characterEngraving);        
    }catch(e){      
        console.error("에러 발생 : " , e.message);
        alert(e.message);
    } 
}

// 캐릭터 찾기 함수
function searchCharacter(characterImformation, characterEquipment, characterEngraving){   
    // 각인 + 아이템 정보
    const imformationPlusEquipment = document.createElement("div");
    // 캐릭터 정보
    const divImformation = document.createElement("div");
    // 캐릭터 아이템 정보
    const divEquipment = document.createElement("div");
    // 캐릭터 각인 정보
    const divEngraving = document.createElement("div");    

    // 아이템 정보 + 각인 정보 묶음
    imformationPlusEquipment.style.marginBottom = "10px"
    if(characterImformation.CharacterName == inputCharacter.value){       

        // 캐릭터 자체 정보 공간
        API.appendChild(divImformation);
        // 캐릭터 자체 정보
        searchCharacterImformation(characterImformation,divImformation);               
        
        // API(캐릭터 정보)에 각인 + 아이템 정보추가
        API.appendChild(imformationPlusEquipment);

        // 캐릭터 아이템 정보 공간
        imformationPlusEquipment.appendChild(divEquipment);
        // 캐릭터 아이템 정보
        searchCharacterEquipment(divEquipment,characterEquipment);        

        // 캐릭터 각인 정보 공간
        imformationPlusEquipment.appendChild(divEngraving)
        // 캐릭터 각인 정보
        searchCharacterEngraving(divEngraving,characterEngraving);

        // 해당 값을 로컬에 저장 x , 브라우저 나가면 삭제방식
        sessionStorage.setItem("CharacterClassName", characterImformation.CharacterClassName);
        sessionStorage.setItem("CharacterName", characterImformation.CharacterName);
        sessionStorage.setItem("ItemAvgLevel", characterImformation.ItemAvgLevel);
        sessionStorage.setItem("ServerName" ,characterImformation.ServerName );
        sessionStorage.setItem("image" ,characterImformation.CharacterImage);
    }
    else{
        console.log("해당 캐릭터는 존재하지않습니다.");
    }    
}

// 캐릭터 자체 정보
function searchCharacterImformation(characterImformation,divImformation){

    const br = document.createElement("br");

    // 부모 밑 자식으로 요소 추가가능하게끔 (선택한 요소에 텍스트 삽입하도록)
    // 캐릭터 정보
    const CharacterClassName = document.createTextNode("직업 : "+ characterImformation.CharacterClassName);            
    const CharacterName = document.createTextNode("캐릭터 이름 : " + characterImformation.CharacterName);
    const ItemAvgLevel = document.createTextNode("클래스 이름 : " + characterImformation.ItemAvgLevel);
    const ServerName = document.createTextNode("아이템 레벨 : " + characterImformation.ServerName);

    // 이미지 파일 생성
    const characterimg = new Image();
    characterimg.src = characterImformation.CharacterImage;
    characterimg.style.width = "400px";
    characterimg.style.backgroundColor = "white" ;        

    divImformation.append(CharacterClassName,br.cloneNode(), CharacterName,br.cloneNode(),
            ItemAvgLevel,br.cloneNode(), ServerName,br.cloneNode(),            
    ); 
    
    divImformation.append(characterimg); 
}


// 캐릭터 장비 정보
function searchCharacterEquipment(divEquipment,characterEquipment){

    // 아이템 테두리 css
    divEquipment.style.display = "flex";
    divEquipment.style.gap = "10px";
    divEquipment.style.marginBottom = "20px";
    
    let itemsPerPow = 6;      
    let rowContainer = null;    
  

    characterEquipment.forEach((item, index) => {      

        // 안보이게 설정
        if(item.Type === "나침반" || item.Type == "부적"){
            return true;
        } 

        // 첫번째 6개 이후 7개 출력
        if(index === 0  || index === 6){
            
            rowContainer = document.createElement("div");
            rowContainer.style.display ="flex";                
            rowContainer.style.flexDirection = "column";
            rowContainer.style.gap ="10px";                
            
            divEquipment.appendChild(rowContainer);
        }           

        // 아이템 이미지
        const characterEquipmentImage = new Image();                        
        characterEquipmentImage.src = item.Icon;
        characterEquipmentImage.style.width = "40px";
        characterEquipmentImage.style.height = "45px";
        characterEquipmentImage.style.borderRadius = "7px";
        characterEquipmentImage.style.marginRight = "10px";

        // 유물 일경우 
        if(item.Grade == "유물"){
            characterEquipmentImage.style.backgroundImage = "linear-gradient(135deg , rgb(72,34,11), rgb(162,64,6))";            
        }
        // 고대일 경우
        else if(item.Grade == "고대"){
            characterEquipmentImage.style.backgroundImage = "linear-gradient(135deg , rgb(61,35,37), rgb(220,201,153))";
        }       
        // 각 이미지 + 내용 합친 공간
        const itemContainer = document.createElement("div");
        itemContainer.style.display = "flex";                 
        itemContainer.style.fontSize = "15px";


        // 귀걸이,  목걸이, 반지 일떄 연마효과 추가
        if(item.Type == "귀걸이" || item.Type == "목걸이" || item.Type =="반지"){
            const div = document.createElement("div");
            // JSON 문자열 형태로 다시만들기
            const tip = JSON.parse(item.Tooltip);              
            
            console.log(tip);
            // 연마효과 가져오기
            const polishingEffectImformation = tip.Element_005.value.Element_001;           
            // BR태그 기준으로 짜르기
            const polishingEffectSplit = polishingEffectImformation.split("<BR>");           
                        

            // 짜른걸 새로운 배열로 가져오기
            const  polishingEffect = polishingEffectSplit.map(line => {
                return line.replace(/<\/img>/, "").trim(); // </img> 태그 제거
                })
                .map(line => {
                return line.replace(/<img[^>]*>/, "").trim(); // <img> 태그 제거 후 순수 텍스트만 반환
            });                
            
            for(let effect of polishingEffect){
                div.innerHTML += effect + "<br>";
            }
            itemContainer.append(characterEquipmentImage,div);      
        }
        else if(item.Type == "팔찌"){
            const div = document.createElement("div");
            const tip = JSON.parse(item.Tooltip);

            const braceletEffectImformation = tip.Element_004.value.Element_001
            const braceletEffectSplit = braceletEffectImformation.split("<BR>");

            const braceletEffect = braceletEffectSplit.map(line => {
                return line.replace(/<\/img>/, "").trim();
            }).map(line => {
                return line.replace(/<img[^>]*>/, "").trim();
            })
            
            console.log(braceletEffect);

            for(let effect of braceletEffect){
                div.innerHTML += effect + "<br>";
            }
            div.style.width = "390px";
            itemContainer.append(characterEquipmentImage, div);
            itemContainer

        }else{
            itemContainer.append(characterEquipmentImage, item.Name);            
        }
        
        rowContainer.appendChild(itemContainer);
    });
}

// 캐릭터 각인 정보
function searchCharacterEngraving(divEngraving,characterEngraving){
    
    // 각인 테두리 css
    divEngraving.style.display = "flex"
    divEngraving.style.flexDirection = "column";
    
    // 클랙스 : 각인
    const engraving = document.createElement("div");    
    engraving.className += "engraving";    
    engraving.innerText = "각인";

    divEngraving.append(engraving);   
   
    

    // 각인 이름 + 유물각인 단계
    for(item of characterEngraving.ArkPassiveEffects){        
        const divEngravingItem = document.createElement("div");
        divEngravingItem.style.marginBottom = "10px";
        divEngravingItem.style.color = "#FF6000";

        // 돌 각인 정보
        const EngravingItemStone = new Image();

        EngravingItemStone.src = "https://cdn-lostark.game.onstove.com/2018/obt/assets/images/pc/profile/img_engrave_icon.png";
        EngravingItemStone.style.width = "26px";
        EngravingItemStone.style.height = "26px";
        EngravingItemStone.style.objectFit = "none";
        EngravingItemStone.style.objectPosition = "0px 0px" ;

        // 유각 정보
        const Engraving = new Image();

        Engraving.src = "https://cdn-lostark.game.onstove.com/2018/obt/assets/images/pc/profile/img_engrave_icon.png";
        Engraving.style.width = "26px";
        Engraving.style.height = "26px";
        Engraving.style.objectFit = "none";
        Engraving.style.objectPosition = "-110px 0px" ;
       
        // 어빌리티 스톤 레벨
        const AbilityStoneLevelspan = document.createElement("span");
        AbilityStoneLevelspan.textContent = "   Lv. " +item.AbilityStoneLevel;
        AbilityStoneLevelspan.style.color = "#00b5ff";

        // X 색상 추가
        const X = document.createElement("span");
        X.textContent = " x ";
        X.style.color = "#e4ba27";
        

        console.log(item);
       
        if(item.AbilityStoneLevel == null){
            divEngravingItem.append(item.Name , Engraving, X , item.Level);
        }else{
            divEngravingItem.append(item.Name , Engraving, X , item.Level , EngravingItemStone, AbilityStoneLevelspan);
        }
        
        divEngraving.append(divEngravingItem);    
    }
    

   
       


  
    

}


// 저장 버튼 클릭시
// 찾기에 정보가 있을때만 save기능만들기
function saveImformation(){

    if(inputCharacter.value == null || inputCharacter.value == ""){
        alert("캐릭터 이름을 입력해주세요");
        return;
    }
    const img = document.createElement("img");    
    const div = document.createElement("div");

    const button = document.createElement("button");
    button.textContent = "삭제하기";
    
    // 해당 이미지 삭제하기
    button.addEventListener("click", function (){
        div.remove();
    })    
    
    const CharacterClassName = document.createTextNode("직업 : "+ sessionStorage.getItem("CharacterClassName"));            
    const CharacterName = document.createTextNode("캐릭터 이름 : " + sessionStorage.getItem("CharacterName"));
    const ItemAvgLevel = document.createTextNode("클래스 이름 : " + sessionStorage.getItem("CharacterClassName"));
    const ServerName = document.createTextNode("아이템 레벨 : "  + sessionStorage.getItem("ItemAvgLevel"));
    const image = sessionStorage.getItem("image"); // 객체가 아닌 이미지 형태로 그대로가져와야함     
    console.log(image);

    img.src = image;   
    img.style.width = "200px";
    characterList.appendChild(div);    

    const br = document.createElement("br");

    div.append(CharacterClassName,br, CharacterName,br.cloneNode(),
        ItemAvgLevel,br.cloneNode(), ServerName,br.cloneNode(),
        img ,br.cloneNode(), button
    );     
}


//  중복 클릭 방지
let isProcessing = false;

imformation.addEventListener("click",function (){

    if(isProcessing) return;

    isProcessing = true;

    

    charactersImformation();

    
    setTimeout(() => {
        isProcessing = false;        
    },1000);
});
saveButton.addEventListener("click",saveImformation );