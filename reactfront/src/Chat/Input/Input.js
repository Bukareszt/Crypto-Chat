import React, {useState} from "react";


const useLogicForInput = ({onSendMessage, onKeyAdd})=>{
  const [text, setMsgText] = useState('');
  const [key, setKey] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSendMessage(text);
    setMsgText('');
  }

  const handleKeySubmit =(e) => {
    e.preventDefault();
    onKeyAdd(key);
    setKey('');
  }

  return {
    text, setMsgText,
    key, setKey,
    handleSubmit, handleKeySubmit
  }

}

const Input = (props) => {
  const {
    text, setMsgText,
    key, setKey,
    handleSubmit, handleKeySubmit
  } = useLogicForInput(props)
 
    return (
      <div class="row">
        <div class="col-lg-8">
          <form onSubmit={handleSubmit}>
            <input
              onChange={(e) => setMsgText(e.target.value)}
              value={text}
              type="text"
              maxLength="40"
              placeholder="Enter your message and press ENTER"
              autoFocus="true"
            />
          </form>
          </div>
          <div class="col-lg-8">
          <form onSubmit={handleKeySubmit}>
            <textarea rows="1" cols="132"
              onChange={(e) => setKey(e.target.value)}
              value={key}
              type="text"
              placeholder="Enter your friend key and click button!"
              autoFocus="false"
            />
            <button type="button" class="btn btn-dark" type="submit">Add qr key</button>
          </form>
          </div>
      </div>
    );
}

export default Input;
