import './App.css';
import {useEffect, useState,useRef} from "react";
import randomWords from 'random-words'
const NUMBER_OF_WORDS=150;
const SECONDS=60;

function App() {

  const [words,setWords]=useState([]);
  const [time,setTime]=useState(SECONDS);
  const [currInput, setCurrInput] = useState("")
  const [currWordIndex, setCurrWordIndex] = useState(0)
  const [correct,setCorrect]=useState(0);
  const [incorrect,setInCorrect]=useState(0);
  const [status,setStatus]=useState("waiting");
  const textRef=useRef(null);
  const [currentCharIndex,setCurrentCharIndex]=useState(-1);
  const [currChar, setCurrChar] = useState("")

  useEffect(()=>{
    setWords(generate());

  },[])

  useEffect(()=>{
    textRef.current.focus();
  },[status])

  function generate(){
    return new Array(NUMBER_OF_WORDS).fill(null).map(()=>randomWords());
  }


  function start(){ 
    if(status==="finish"){
      setWords(generate())
      setCorrect(0);
      setInCorrect(0);
      setCurrWordIndex(0);
      setCurrInput("")
      setCurrentCharIndex(-1);
      setCurrChar("")
    }
    if(status!=="start"){
      setStatus("start");
    }
    const interval=setInterval(()=>
    setTime( (time)=>{

      if(time===0){
        clearInterval(interval);
        setStatus("finish")
        return time
      }
      else{
        return  time-1
      }

    }),1000);

    if(time===0){
      clearInterval(interval)
    }
  }


  function handleKeyDown({keyCode,key}){

    if (keyCode === 32) {
      checkMatch()
      setCurrInput("")
      setCurrWordIndex(currWordIndex + 1)
      setCurrentCharIndex(-1);
    }
    else if(keyCode===8){
      setCurrentCharIndex(currentCharIndex-1);
      setCurrChar("")
    }
    else{
      setCurrentCharIndex(currentCharIndex+1)
      setCurrChar(key)
    }

  }

  function checkMatch() {
    const wordToCompare = words[currWordIndex]
    const doesItMatch = wordToCompare === currInput.trim()
    
    if (doesItMatch) {
      setCorrect(correct + 1)
    } else {
      setInCorrect(incorrect + 1)
    }
  }

  function getCharClass(wordIndex,charIndex,char){
    if(wordIndex===currWordIndex && charIndex===currentCharIndex &&currChar && status!=="finish"){
      if(char===currChar){
        return "green";
      }
      else{
        return "red"
      }

    }
    else if(wordIndex===currWordIndex && currentCharIndex>=words[currWordIndex].length){
      return "red"
    }
   
    else{
      return ""
    }

  }

 
  
  
  return (
    <div className="App">
     

     {/* time */}
     <div className='time'>
       <p>{time}</p>
     </div>

     {/* input */}
     <div className='inp'>
     <input type="text"  ref={textRef}  disabled={status !== "start"} onKeyDown={handleKeyDown} value={currInput} onChange={(e) => setCurrInput(e.target.value)} />

     
     </div>
    


     {/* button */}
     <div className="but">
       <button disabled={status==="finshed"} onClick={start} type='button'  > Start</button>
     </div>


      {/* text */}
      {status==="start" &&

      <div className='text'>
      {words.map((word, i) => (
                  <span key={i}>
                    <span>
                      {word.split("").map((char, idx) => (
                        <span className={getCharClass(i, idx, char)} key={idx}>{char}</span>
                      )) }
                    </span>
                    <span> </span>
                  </span>
                ))}

      </div>
      }

      
      {status==="finish" &&

      <div className='result'>
      <p className='wpm'>Wpm : {correct}</p>
      <p className='acc'>Accuracy : {Math.round(correct/(correct+incorrect)*100)}%</p>

      </div>
      }

      <footer>
        <p> Ⓒ Kawan Idrees 2022 <br />Typing Test App </p>
       
      </footer>
   
    
    </div>
  );
}

export default App;
