const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const w = canvas.width;
const h = canvas.height;

//答えの設定やカウント
const resultMin = 3;
const resultMax = 10;
const result = Math.floor( Math.random() * ( resultMax - resultMin ) + resultMin );
let animalCount = 0;
let catCount = 0;
let tigerCount = 0;

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

//動物の画像の読み込みや設定
const animal0 = new Image();
const animal1 = new Image();
const animal2 = new Image();
const animal = [animal0, animal1, animal2];
let animalType = ["", "", ""];
let animalX = [0, 0, 0];
let animalY = [0, 0, 0];
for(let i=0; i<animal.length; i++){
    selectPositionAndType(i);
}
const animalXsize = 50;
const animalYsize = 50;

//答え表示のために猫と虎を用意
const cat = new Image();
cat.src = "image/cat.png";
const tiger = new Image();
tiger.src = "image/tiger.png";


//スタート・リスタートボタンの設定
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

    //当たり範囲の描画
    ctx.fillStyle = "#ffff";
    ctx.fillRect(atariXmin, atariYmin, atariXsize, atariYsize);

    //動物を一匹ずつ動かす
    for(let i=0; i<animal.length; i++){
        //動物の描画・移動
        moveAnimal(i);

        //コタツの描画
        ctx.drawImage(kotatsu, kotatsuX, kotatsuY, kotatsuXsize, kotatsuYsize);
        
        //当たり範囲に入った時の処理
        if( atariXmin <= animalX[i]  &&  animalX[i] <= atariXmax  &&  atariYmin <= animalY[i]  &&  animalY[i] <= atariYmax ){
            countAnimal(i);

            //コタツに入った匹数 + 画面に出てくる動物の数が設定した答え以下の場合
            if(animalCount + animal.length <= result){
                selectPositionAndType(i); //動物の位置を初期化する
            }

            //答えの匹数分だけ既に生成済みの場合
            else if(animalCount < result){
                createAnimalToFar(i); //画面外の遠くに生成する
            }

            //こたつに入った動物の合計が、答えの数に達したら正解発表の処理をする。
            else{
                showCorrectAnswer();
                clearInterval(id);
                return;
            }
        }
    }
}

//動物の初期位置や種類を決める
function selectPositionAndType(i){
    animalX[i] = Math.random() * w;
    animalY[i] = Math.random() * h;
    //召喚NGエリアの設定
    const ngAreaXsize = w/10 * 2; //wの２割(200)
    const ngAreaYsize = h/10 * 2; //hの２割(120)
    const ngAreaXmin = atariXmin - ngAreaXsize;
    const ngAreaXmax = atariXmax + ngAreaXsize;
    const ngAreaYmin = atariYmin - ngAreaYsize;
    const ngAreaYmax = atariYmax + ngAreaYsize;
    if( ngAreaXmin <= animalX[i]  &&  animalX[i] <= ngAreaXmax && ngAreaYmin <= animalY[i]  &&  animalY[i] <= ngAreaYmax ){
        if(animalY[i] <= h/2){
            animalY[i] = 0;
        }else{
            animalY[i] = h;
        }
    }

    //動物の種類（猫or虎）を乱数で決める
    const animalRandomNum = Math.floor( Math.random() * 2 );
    if(animalRandomNum === 0){
        animal[i].src = "image/cat.png";
        animalType[i] = "cat";
    }else{
        animal[i].src = "image/tiger.png";
        animalType[i] = "tiger";
    }
}

//動物の描画・移動
function moveAnimal(i){
    ctx.drawImage(animal[i], animalX[i], animalY[i], animalXsize, animalYsize);

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

//当たり範囲に入った動物をカウントする
function countAnimal(i){
    animalCount++;
    if(animalType[i] === "cat"){
        catCount++;
    }else if(animalType[i] === "tiger"){
        tigerCount++;
    }
}

//画面外に動物を生成する
function createAnimalToFar(i){
    animalX[i] = Number.MAX_SAFE_INTEGER;
    animalY[i] = Number.MAX_SAFE_INTEGER;
}

//答え合わせの処理
function showCorrectAnswer(){
    //背景を青で塗り直す（リセットする）
    ctx.fillStyle = "#B8E2FC";
    ctx.fillRect(0, 0, w, h);

    //正解・不正解の判定
    const answer = window.prompt("猫は何匹いるでしょうか？\n※半角数字で回答しましょう。");
    ctx.font = "30px 'ＭＳ ゴシック'";
    ctx.fillStyle = "#333333";
    if(answer == catCount){    
        ctx.fillText("正解！ 正解は" + catCount + "匹です。", 250, 100);
    }else{
        ctx.fillText("残念！ 正解は" + catCount + "匹です", 250, 100);
    }

    //答えの表示
    showAnimal(cat, catCount, 250, 250);
    showAnimal(tiger, tigerCount, 250, 350);
}

//答えの引数を表示
function showAnimal(animalImage, count, startX, animalY){
    for(let i=0; i<count; i++){
        animalX = startX + (50 * i);
        ctx.drawImage(animalImage, animalX, animalY, animalXsize, animalYsize);
    }
}
