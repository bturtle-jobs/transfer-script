import React, { useState,useEffect } from "react";
import './NumberPad.css';

const NumberPad = (props) => {
  let location=handleNumberPadLocation();
  const [inputNumKey, setInputNumKey] = useState("");
  const [numberPadLocation,setNumberPadLocation] = useState(location);
  const [beforeInputKey,setBeforeInputKey] = useState('');

  const numberList = "7 8 9 4 5 6 1 2 3 clear 0 del";
  const numberButtonList = numberList.split(" ");

  let numberButtons = numberButtonList.map((number, index) =>
    (index + 1) % 3 === 0 ? (
      <span>
        <button
          className="NumberButtonStyle"
          onClick={() => setTextField({ number })}
        >
          {number}
        </button>
        <br></br>
      </span>
    ) : (
      <button
        className="NumberButtonStyle"
        onClick={() => setTextField({ number })}
      >
        {number}
      </button>
    )
  );
  
  function handleNumberPadLocation(){
    let location;
    if(props.numberPadLocation['top'] > 800)
    {
      location = {
        position : 'fixed',
        left : (props.numberPadLocation['left'] + 290) + 'px',
        top : (props.numberPadLocation['top'] - 370) +'px'
      }
    }
    else
    {
      location = {
        position : 'fixed',
        left : (props.numberPadLocation['left'] + 290) + 'px',
        top : (props.numberPadLocation['top']) +'px'
      }
    }
    return location;
  }

  function setTextField(number) {
    if (number["number"] === "del") {
      setInputNumKey(inputNumKey.substring(0, inputNumKey.length - 1));
      props.keyboardInput(inputNumKey.substring(0, inputNumKey.length - 1));
    } else if (number["number"] === "clear") {
      setInputNumKey("");
      props.keyboardInput("");
    } else {
      setInputNumKey(inputNumKey + number["number"]);
      props.keyboardInput(inputNumKey + number["number"]);
      setBeforeInputKey(number["number"]);
    }
  }
  
  useEffect(()=>{
    if(!props.nowUseKeyboard)
    {
      setBeforeInputKey('');
      setInputNumKey('');
    }else
    {
      setInputNumKey(beforeInputKey);
    }
  },[props.nowUseKeyboard]);

  useEffect(()=>{
    let location=handleNumberPadLocation();
    setInputNumKey("");
    setNumberPadLocation(location);
  },[props.nowNumberPadInputSelector]);

  document.getElementsByTagName('body')[0].addEventListener('click', function(event) { // 키보드 외부 영역 클릭시 키보드 닫기
    try
    {
        let width = document.getElementById('numberPadSection').getBoundingClientRect().left;
        let height = document.getElementById('numberPadSection').getBoundingClientRect().top;
        let mouseWidth = event.clientX;
        let mouseHeight = event.clientY;
        if(!((mouseHeight >= height) && (mouseHeight <= height+530)) || !((mouseWidth >= width) && (mouseWidth <= width+350))){
            props.closeKeyboard();
        }
    }catch{
    }
});

  return (
    <div
      maxWidth="xs"
      id="numberPadSection"
      className="NumberContainer2"
      style={numberPadLocation}
    >
      <div className="KeybaordHeader" onMouseDown={(e)=>startDrag(e)}>
      </div>
      <div
        style={{
          marginTop: "2vh",
          textAlign: "center"
        }}
      >
        {numberButtons}
      </div>
    </div>
  );
  
  
  // 이미지 움직이기
  function moveDrag(e){
    document.getElementById('numberPadSection').style.left = (e.clientX - 160) +"px";
    document.getElementById('numberPadSection').style.top = (e.clientY - 30) +"px";
    return false;
  }
  
  // 드래그 시작
  function startDrag(e){
    let obj = document.getElementById('numberPadSection');
    let e_obj = window.event? window.event : e;
    document.onmousemove = moveDrag;
    document.onmouseup = stopDrag;
    if(e_obj.preventDefault)e_obj.preventDefault();
  }
  
  // 드래그 멈추기
  function stopDrag(){
    document.onmousemove = null;
    document.onmouseup = null;
  }

};


export default NumberPad;