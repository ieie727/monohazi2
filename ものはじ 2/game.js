console.log("-----NEW GAME-----");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let result =Math.floor(Math.random() *20);
while(result<3){
    result =Math.floor(Math.random() *20);
}
let catCount =0;
let tigerCount =0;
let totalCount =0;

//初期設定　＆一次元配列までなので配列でゴリ押しする。
const animal1 =new Image();
const animal2 =new Image();
const animal3 =new Image();
const animal =[animal1,animal2,animal3];
const animalX =[Math.random()*1000,Math.random()*1000,Math.random()*1000];
const animalY =[Math.random()*600, Math.random()*600, Math.random()*600];
const animalType =["","",""];
for(let i=0; i<animal.length; i++){
    //任意の範囲外に猫が召喚されるまで再抽選を行う
    while(200 <=animalX[i] && animalX[i] <=800 && 150<=animalY[i] && animalY[i]<=450){
        animalX[i] =Math.random()*1000;
        animalY[i] =Math.random()*600;
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

//こたつの設定
const kotatsu =new Image();
kotatsu.src ="image/kotatsu.png";
const kotatsuX =1000/2 -400/2;
const kotatsuY =600/2 -200/2;
//猫・虎の最後に答えで使う用
const cat =new Image();
cat.src ="image/cat.png";
const tiger =new Image();
tiger.src ="image/tiger.png";
const id =setInterval(draw, 10);


function draw(){
    //初期描画
    ctx.fillStyle = "#B8E2FC";
    ctx.fillRect(0, 0, 1000, 800);

    //動物たちを一匹ずつ動かす
    for(let i=0; i<animal.length; i++){
        //動物の描画・移動
        ctx.drawImage(animal[i], animalX[i], animalY[i], 50, 50);
        let tilt = (300 - animalY[i]) / (500 - animalX[i]); //以下の傾きやx,yの動きは基本的にはコピペ予定
        let x = Math.sqrt(1 / (1 + tilt * tilt));
        let y =tilt * x;
        let speed =2;
        if(animalX[i] <500){
            animalX[i] += x *speed;
            animalY[i] += y *speed;
        }else{
            animalX[i] -= x *speed;
            animalY[i] -= y *speed;
        }

        ctx.drawImage(kotatsu, kotatsuX, kotatsuY, 400, 200); //コタツの描画
        //動物が当たり範囲内に入った時の処理
        if(450 <=animalX[i] && animalX[i] <=550 && 280<=animalY[i] && animalY[i]<=320){
            //それぞれの動物たちのカウンターを増やす
            if(animalType[i]=="cat"){
                catCount++;
            }
            else if(animalType[i]=="tiger"){
                tigerCount++;
            }
            totalCount =catCount + tigerCount;

            //動物の合計が最初の答えより少なかったら動物を再生成して繰り返す
            if(totalCount+3 <=result){
                while(200 <=animalX[i] && animalX[i] <=800 && 150<=animalY[i] && animalY[i]<=450){
                    animalX[i] =Math.random()*1000;
                    animalY[i] =Math.random()*600;
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
            else if(totalCount <result){ //答えの分が既に生成されている場合は、画面外の遠くに作る
                animalX[i] =100000000000000;
                animalY[i] =100000000000000;
            }

            //動物の合計が最初の答えに達したら、正解発表の処理をする
            else{
                clearInterval(id);
                let answer =window.prompt("猫は何匹いるでしょうか？\n※半角数字で回答しましょう。");
                
                ctx.fillStyle = "#B8E2FC";
                ctx.fillRect(0, 0, 1000, 800);
                //正解・不正解の判定
                if(answer==catCount){
                    ctx.font = "30px 'ＭＳ ゴシック'";
                    ctx.fillStyle = "#333333";
                    ctx.fillText("正解！ 正解は"+catCount+"匹です。", 250, 100);
                }else{
                    ctx.font = "30px 'ＭＳ ゴシック'";
                    ctx.fillStyle = "#333333";
                    ctx.fillText("残念！ 正解は"+catCount+"匹です", 250, 100);
                }
                //答えの表示
                for(let i=0; i<catCount; i++){
                    let catX =250 +(50*i);
                    ctx.drawImage(cat, catX, 250, 50, 50);
                }
                for(let i=0; i<tigerCount; i++){
                    let tigerX =250 +(50*i);
                    ctx.drawImage(tiger, tigerX, 350, 50, 50);
                }
                return;
            }
        }
    }
}