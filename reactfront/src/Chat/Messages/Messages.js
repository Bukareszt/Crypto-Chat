import React  from "react";
import './Messages.css'


const Msg = ({message, currentMember}) => {
        const { member, text, dateOfSend } = message;
        let changedtext;
        let changedUsername;
        const messageFromMe = member.username === currentMember.username;
        const classNameForDiv = messageFromMe ? "chat-message left" : "chat-message right";
        if(text.length > 50){
          changedtext = text.slice(0,50);
        }
        if(member.username.length > 20){
          changedUsername = member.username.slice(0,20);
        }
        else{
          changedtext = text
          changedUsername = member.username
        }
        return (
          <div class={classNameForDiv}>
              <img class="message-avatar" src={member.avatarUrl} alt=""/>
                <div class="message">
                <p class="message-author" >{changedUsername}</p>
                <span class="message-date"> {dateOfSend} </span>
                <span class="message-content">{changedtext}</span>
                </div>
            </div>
            )
}



            
function Messages(props) {
      return (
          <div class="row">
            <div class="col-md-8 ">
              <div class="chat-discussion">
              {props.messages.map(m => (<Msg key={m.text} message={m} currentMember={props.currentMember} />))}
              </div>
            </div>
            <div class="col-md-4">
                <h3>Counter of avalible users: {props.onlineUsers}</h3>
                <h3>Your Qr code to share with friends!</h3>
                <div class="wp-block inverse no-margin">
                      <img src={props.code} alt='' />
                </div>
                <button type="button" class="btn btn-dark" onClick={props.deleteHistory}>Delete all messages</button>
            </div>
          </div>
      );
    }
  
export default Messages;
