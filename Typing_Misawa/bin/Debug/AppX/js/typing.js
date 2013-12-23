var isReady, keycode_dictionary, pos, rand, setTypingPosition, typing;

rand = function(n) {
  return Math.floor(Math.random() * n);
};

setTypingPosition = function(pos) {
  var array;
  if (typing) {
    array = typing.split("");
    array.splice(pos, 0, "</span><span class=\"next\">");
    array.splice(pos + 2, 0, "</span>");
    array.splice(0, 0, "<span class=\"active\">");
    $(".typing").html(array.join(""));
  }
};

isReady = false;

typing = "";

pos = 0;

startTime = new Date();

var max_question_num = 1;
var all_question_num = 1;
var question_array = random_num(max_question_num, all_question_num);
console.log(question_array);
var question_length = random_num(max_question_num, all_question_num).length;

question_clear_num = 0;

function init_state() {

    isReady = false;
    typing = "";
    pos = 0;

}



function get_question(question_num) {

    $.getJSON("./contents.json", function (data) {
        $("body").css({
            "background-image": "url(" +data.contents[question_num].image + ")"
        });
        var comment, index, title, wisdom;
        $("body").css({
            "background-image": "url(" + data.contents[question_num].image + ")"
        });
        console.log('QUESTION_NUM:' + question_num);
        index = rand(data.contents.length);
        title = data.title;
        wisdom = data.contents[question_num].wisdom;
        typing = data.contents[question_num].typing;
        comment = data.contents[question_num].comment;
        //console.log(wisdom);
        $(".title").html(title);
        $(".wisdom").html(wisdom);
        setTypingPosition(0);
        $(".comment").html(comment);
        return isReady = true;
    });
}

//重複なしに乱数を発生させるプログラム
function random_num(num,all_question_num) {
    //乱数の配列生成
    var random = new Array();
    for (i = 1; i < num; i++) {
        //random[i] = Math.floor(Math.random() * num);
        random[i] = Math.floor(Math.random() * all_question_num);
    }
    var j;
    //random[0] = Math.floor(Math.random() * num);
    random[0] = Math.floor(Math.random() * all_question_num);

    //配列内に重複してるものがあるか探査．あったら重複しなくなるまで乱数発生
    for (i = 1; i < num; i++) {
        j = 0;
        while (j < i) {
            while (random[i] == random[j]) {
                //random[i] = Math.floor(Math.random() * num);
                random[i] = Math.floor(Math.random() * all_question_num);
                j = 0;
            }
            j++;
        }
    }

    return random;
}

function show_result() {

    var nowTime = new Date();
    var resultTime = nowTime.getTime() - startTime.getTime();
    var bestScore =window.localStorage.getItem('bestScore');
    console.log(bestScore);
    if (bestScore == null) {
        console.log('--null---');
        bestScore = resultTime;
        window.localStorage.setItem('bestScore', resultTime);
    } else if (bestScore > resultTime) {
        bestScore = resultTime;
        window.localStorage.setItem('bestScore', resultTime);
    }
    var resultHour = Math.floor(resultTime / (60 * 60 * 1000));

    if (resultHour > 1) {
        $("#result_time").text("一時間超");
        $("#result_eval").text("遅すぎて測定不可");
        $("#result").show("slow");
    } else {
        $("#result_time").text(changeforMSec(resultTime));
        $("#result_eval").text("Best Score:"+changeforMSec(bestScore));       
        $("#result").show("slow");
    }
    
}

function changeforMSec(resultTime) {

    var resultHour = Math.floor(resultTime / (60 * 60 * 1000));
    var tmpHour = resultTime - (resultHour * 60 * 60 * 1000);
    var resultMinutes = Math.floor(tmpHour / (60 * 1000));
    var tmpMinutes = tmpHour - (resultMinutes * 60 * 1000);
    var resultSecond = Math.floor(tmpMinutes / 1000);
    var resultMSecond = tmpMinutes % 1000;
    var time = resultMinutes + ":" + resultSecond + ":" + resultMSecond;
    return time;
}

$(window).keydown(function (e) {
  var letter;
  letter = keycode_dictionary[e.keyCode];
  is_shift = e.shiftKey;
  //大文字判定 -1
  is_large_word = typing[pos].indexOf(typing[pos].toLowerCase());
  console.log(e.keyCode);
  if (letter) {
      if (is_large_word == -1 && is_shift == 1) {
          console.log('Large word');
          console.log(typing[pos]);
          small_letter = typing[pos].toLowerCase();
          console.log(letter + ':' + small_letter);
          check_word(letter, small_letter);
      } else {
          check_word(letter, typing[pos]);
      }
  }
  return true;
});

function check_word(letter, check_letter) {

    if (letter ===check_letter) {
        pos++;
        if (pos === typing.length) {
            //window.location.reload();
            if (question_clear_num != (question_length - 1)) {
                init_state();
                question_clear_num += 1;
                get_question(question_array[question_clear_num]);
            } else {
                show_result();
            }
        } else {
            setTypingPosition(pos);
        }
    }



}

$(function () {
    $("#result").hide();
    var question_num = 0;    
    get_question(question_array[0]);
    
    //START TIEMR
    //setInterval("countUpTimer()", 10);//count upt by 0.01

    $("#again_btn").click(function () {
        window.location.reload();
    });

});

keycode_dictionary = {
  48: "0",
  49: "1",
  50: "2",
  51: "3",
  52: "4",
  53: "5",
  54: "6",
  55: "7",
  56: "8",
  57: "9",
  65: "a",
  66: "b",
  67: "c",
  68: "d",
  69: "e",
  70: "f",
  71: "g",
  72: "h",
  73: "i",
  74: "j",
  75: "k",
  76: "l",
  77: "m",
  78: "n",
  79: "o",
  80: "p",
  81: "q",
  82: "r",
  83: "s",
  84: "t",
  85: "u",
  86: "v",
  87: "w",
  88: "x",
  89: "y",
  90: "z",
  32:" ",
  188: ",",
  189: "-",
  190: "."
};
