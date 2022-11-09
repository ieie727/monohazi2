//キャンバスの描画部分
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const w = canvas.width;
const h = canvas.height;

//結果となる引数を乱数で決める
const resultMin = 3;
const resultMax = 20;
const result = Math.floor( Math.random() * ( resultMax - resultMin ) + resultMin );
let catCount = 0;
let tigerCount = 0;
let totalCount = 0;

//初期設定(一次元配列までなので配列でゴリ押しする。)
const animalXsize = 50;
const animalYsize = 50;
const animal1 = new Image();
const animal2 = new Image();
const animal3 = new Image();
const animal = [animal1, animal2, animal3];
const animalX = ["", "", ""];
const animalY = ["", "", ""];
const animalType = ["", "", ""];
for(let i=0; i<animal.length; i++){
    selectPositionAndType(i); //X座標、Y座標、動物の種類を決定
}

//X座標、Y座標、動物の種類を決定
function selectPositionAndType(i){
    animalX[i] = Math.random() *w;
    animalY[i] = Math.random() *h;
    //当たり範囲(またはその近く)に動物が召喚されそうな場合、Y座標の値を調整
    if( 200 <= animalX[i]  &&  animalX[i] <= 800  &&  150 <= animalY[i]  &&  animalY[i] <= 450 ){
        if( animalY[i] < 500 ){
            animalY[i] = 0;
        }else{
            animalY[i] = h;
        }
    }
    //動物の種類（猫or虎）を乱数で決める
    animalRandom = Math.floor( Math.random() * 2 );
    if(animalRandom === 0){
        animal[i].src = "image/cat.png";
        animalType[i] = "cat";
    }else{
        animal[i].src = "image/tiger.png";
        animalType[i] = "tiger";
    }
}

//当たり判定の範囲の設定
const atariXmin = 450;
const atariXmax = 550;
const atariXsize = atariXmax - atariXmin;
const atariYmin = 270;
const atariYmax = 330;
const atariYsize = atariYmax - atariYmin;

//こたつの設定
const kotatsu = new Image();
kotatsu.src = "image/kotatsu.png";
const kotatsuXsize = 400;
const kotatsuYsize = 200;
const kotatsuX = w/2 - kotatsuXsize/2;
const kotatsuY = h/2 - kotatsuYsize/2;

//猫・虎の最後に答えで使う用
const cat = new Image();
cat.src = "image/cat.png";
const tiger = new Image();
tiger.src = "image/tiger.png";

//スタート・リスタートボタンの設定（コピペのみ）
const startButton = document.getElementById('start');
kotatsu.onload = () => ctx.drawImage(kotatsu, kotatsuX, kotatsuY, kotatsuXsize, kotatsuYsize);
let id;
let flag = false;
startButton.addEventListener('click', () => {
    if(flag === false){
        id = setInterval(draw, 10);
        startButton.textContent = "もう１度";
        flag = true;
    }else{
        startButton.textContent = "スタート";
        location.reload();
    }
});


function draw(){
    //初期描画
    ctx.fillStyle = "#B8E2FC";
    ctx.fillRect(0, 0, w, h);
    
    //あたり範囲
    ctx.fillStyle = "#ffff";
    ctx.fillRect(atariXmin, atariYmin, atariXsize, atariYsize);

    //動物たちを一匹ずつ動かす
    for(let i=0; i<animal.length; i++){
        moveAnimal(i); //動物の描画・移動
        ctx.drawImage(kotatsu, kotatsuX, kotatsuY, kotatsuXsize, kotatsuYsize); //コタツの描画
        
        //動物が当たり範囲内に入った時の処理
        if( atariXmin <= animalX[i]  &&  animalX[i] <= atariXmax  &&  atariYmin <= animalY[i]  &&  animalY[i] <= atariYmax ){
            updateCount(i); //それぞれの動物たちのカウンターを増やす

            //動物の合計が最初の答えより少なかったら動物を再生成して繰り返す
            if(totalCount + animal.length <= result){
                selectPositionAndType(i);
            }

            //答えの分が既に生成されている場合は、画面外の遠くに作る
            else if(totalCount < result){
                createAnimalToFar(i);
            }

            //動物の合計が最初の答えに達したら、正解発表の処理をする
            else{
                showCorrectAnswer();
                return;
            }
        }
    }
}


//動物を動かす
function moveAnimal(i){
    ctx.drawImage(animal[i], animalX[i], animalY[i], animalXsize, animalYsize);

    //以下の傾きやx,yの動きは基本的にはコピペ予定
    let tilt = (h/2 - animalY[i]) / (w/2 - animalX[i]); //中心と動物の現在地をつなぐ直線の傾き
    let x = Math.sqrt(1 / (1 + tilt * tilt)); //Xの移動方向
    let y = tilt * x; //Yの移動方向
    let speed = 2; //★★ここの値を変更すると動物の移動速度が倍速になる★★
    if(animalX[i] < w/2){
        animalX[i] += x * speed;
        animalY[i] += y * speed;
    }else{
        animalX[i] -= x * speed;
        animalY[i] -= y * speed;
    }
}

//それぞれの動物たちのカウンターを増やす
function updateCount(i){
    if(animalType[i] === "cat"){
        catCount++;
    }
    else if(animalType[i] === "tiger"){
        tigerCount++;
    }
    totalCount = catCount + tigerCount;
}

//遠くに動物を召喚する
function createAnimalToFar(i){
    animalX[i] = Number.MAX_SAFE_INTEGER;
    animalY[i] = Number.MAX_SAFE_INTEGER;
}

//正解発表
function showCorrectAnswer(){
    clearInterval(id); //intervalの繰り返しを止める
    let answer = window.prompt("猫は何匹いるでしょうか？\n※半角数字で回答しましょう。");
    ctx.fillStyle = "#B8E2FC";
    ctx.fillRect(0, 0, w, h);

    //正解・不正解の判定
    ctx.font = "30px 'ＭＳ ゴシック'";
    ctx.fillStyle = "#333333";
    if(answer === catCount){    
        ctx.fillText("正解！ 正解は"+catCount+"匹です。", 250, 100);
    }else{
        ctx.fillText("残念！ 正解は"+catCount+"匹です", 250, 100);
    }
    //答えの表示
    showResultAnimal(catCount, 250, 250, cat);
    showResultAnimal(tigerCount, 250, 350, tiger);
}

//結果表示用の関数
function showResultAnimal(animalCount, startX, animalY, animalImage){
    for(let i=0; i<animalCount; i++){
        let animalX = startX + (50 * i);
        ctx.drawImage(animalImage, animalX, animalY, animalXsize, animalYsize);
    }
}
