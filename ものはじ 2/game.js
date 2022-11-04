const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const w =canvas.width;
const h =canvas.height;

const resultMin =3;
const resultMax =20;
const result =createRandomNumber(resultMin, resultMax);
console.log(result);
let catCount =0;
let tigerCount =0;
let totalCount =0;

//初期設定(一次元配列までなので配列でゴリ押しする。)
const animalSizeX =50;
const animalSizeY =50;
const animal1 =new Image();
const animal2 =new Image();
const animal3 =new Image();
const animal =[animal1,animal2,animal3];
const animalX =[Math.random() *w, Math.random() *w, Math.random() *w];
const animalY =[Math.random() *h, Math.random() *h, Math.random() *h];
const animalType =["","",""];
for(let i=0; i<animal.length; i++){
    selectPositionAndType(i); //X座標、Y座標、動物の種類を決定
}

//X座標、Y座標、動物の種類を決定
function selectPositionAndType(i){
    //任意の範囲外に猫が召喚されるまで再抽選を行う
    if(200 <=animalX[i] && animalX[i] <=800 && 150<=animalY[i] && animalY[i]<=450){
        animalY[i] =500;
    }

    animalRandom =Math.floor(Math.random()*2);
    if(animalRandom==0){
        animal[i].src ="image/cat.png";
        animalType[i] ="cat";
    }else{
        animal[i].src ="image/tiger.png";
        animalType[i] ="tiger";
    }
}

//当たり判定の範囲の設定
const atariXmin =450;
const atariXmax =550;
const atariSizeX =atariXmax - atariXmin;
const atariYmin =280;
const atariYmax =320;
const atariSizeY =atariYmax - atariYmin;

//こたつの設定
const kotatsu =new Image();
kotatsu.src ="image/kotatsu.png";
const kotatsuSizeX =400;
const kotatsuSizeY =200;
const kotatsuX =w/2 -kotatsuSizeX/2;
const kotatsuY =h/2 -kotatsuSizeY/2;

//猫・虎の最後に答えで使う用
const cat =new Image();
cat.src ="image/cat.png";
const tiger =new Image();
tiger.src ="image/tiger.png";


const startButton = document.getElementById('start');
kotatsu.onload =()=>ctx.drawImage(kotatsu, kotatsuX, kotatsuY, kotatsuSizeX, kotatsuSizeY);
let id;
let flag =false;
startButton.addEventListener('click', () => {
    if(flag===false){
        id = setInterval(draw,10);
        startButton.textContent ="もう１度";
        flag =true;
    }else{
        startButton.textContent ="スタート";
        location.reload();
    }
});

function draw(){
    //初期描画
    ctx.fillStyle = "#B8E2FC";
    ctx.fillRect(0, 0, w, h);
    
    //あたり範囲
    ctx.fillStyle = "#ffff";
    ctx.fillRect(atariXmin, atariYmin, atariSizeX, atariSizeY);

    //動物たちを一匹ずつ動かす
    for(let i=0; i<animal.length; i++){
        //動物の描画・移動
        ctx.drawImage(animal[i], animalX[i], animalY[i], 50, 50);
        //以下の傾きやx,yの動きは基本的にはコピペ予定
        let tilt = (h/2 - animalY[i]) / (w/2 - animalX[i]); //中心と動物の現在地をつなぐ直線の傾き
        let x = Math.sqrt(1 / (1 + tilt * tilt)); //Xの移動方向
        let y =tilt * x; //Yの移動方向
        let speed =2;
        if(animalX[i] <w/2){
            animalX[i] += x *speed;
            animalY[i] += y *speed;
        }else{
            animalX[i] -= x *speed;
            animalY[i] -= y *speed;
        }

        ctx.drawImage(kotatsu, kotatsuX, kotatsuY, kotatsuSizeX, kotatsuSizeY); //コタツの描画
        //動物が当たり範囲内に入った時の処理
        if(atariXmin <=animalX[i] && animalX[i] <=atariXmax && atariYmin<=animalY[i] && animalY[i]<=atariYmax){
            //それぞれの動物たちのカウンターを増やす
            if(animalType[i]=="cat"){
                catCount++;
            }
            else if(animalType[i]=="tiger"){
                tigerCount++;
            }
            totalCount =catCount + tigerCount;
            console.log(totalCount);

            //動物の合計が最初の答えより少なかったら動物を再生成して繰り返す
            if(totalCount+3 <=result){
                selectPositionAndType(i);
            }
            else if(totalCount <result){ //答えの分が既に生成されている場合は、画面外の遠くに作る
                animalX[i] =Number.MAX_SAFE_INTEGER;
                animalY[i] =Number.MAX_SAFE_INTEGER;
            }

            //動物の合計が最初の答えに達したら、正解発表の処理をする
            else{
                clearInterval(id);
                let answer =window.prompt("猫は何匹いるでしょうか？\n※半角数字で回答しましょう。");
                ctx.fillStyle = "#B8E2FC";
                ctx.fillRect(0, 0, w, h);

                //正解・不正解の判定
                ctx.font = "30px 'ＭＳ ゴシック'";
                ctx.fillStyle = "#333333";
                if(answer==catCount){    
                    ctx.fillText("正解！ 正解は"+catCount+"匹です。", 250, 100);
                }else{
                    ctx.fillText("残念！ 正解は"+catCount+"匹です", 250, 100);
                }
                //答えの表示
                showResult(catCount, 250, 250, cat);
                showResult(tigerCount, 250, 350, tiger);
                return;
            }
        }
    }
}

function showResult(animalCount, startX, animalY, animalImage){
    for(let i=0; i<animalCount; i++){
        let animalX =startX +(50 *i);
        ctx.drawImage(animalImage,animalX,animalY,animalSizeX,animalSizeY)
    }
}

function createRandomNumber(min, max){
    return Math.floor(Math.random() * (max - min) +min);
}
