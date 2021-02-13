import React, { useEffect, useReducer, useState } from "react";
import Messages from './Messages/Messages';
import Input from './Input/Input';
import socketIOClient from 'socket.io-client';
import crypto from 'crypto';
import { AvatarGenerator } from 'random-avatar-generator';
import moment from 'moment'



const reducer = (state, action) => {
  if(action.type === 'MEMBER_VALUE'){
    const memberData ={ username: action.payload.username, avatarUrl: action.payload.avatarUrl};
    return{
      ...state,
      member: memberData,
    }
  }
  if(action.type === 'DELETE_MSG'){
    return{
      ...state,
      messages: []
    }
  }
  if(action.type === 'ADD_MSG'){
    const msgData = [...state.messages , action.payload]
    return{
      ...state,
      messages: msgData,
    }
  }
  if(action.type === 'DECRYPTION'){
    return{
      ...state,
      messages: action.payload
    }
  }
  
  return state;
}

let socket;

const initSocket = async (roomName) => {
  socket = await socketIOClient('http://localhost:3001',{query:`roomName=${roomName}`})
}



const Chat = (props) => {

  const defaultState = {
    messages: [],
    member: {
      username:'',
      avatarUrl: '',
    },
    qrCodesForCrypto: []
  }
    const [qrCode, setQrCode] = useState('');
    const [publicKey, setPublicKey] = useState('');
    const [onlineUsers, setOnlineUsers] = useState(0)
    const [state, dispach] = useReducer(reducer, defaultState);

    useEffect(() => {
      const generator = new AvatarGenerator();
      const avatarUrl = generator.generateRandomAvatar();
      const memberData = { username: props.username, avatarUrl: avatarUrl}
      dispach({type:'MEMBER_VALUE', payload: memberData});
      initSocket(props.roomName).then(() => {
        handleSocket()
      })
    }, [])

      const onSendMessage = (msg) => {
        const date = Date.now()
        const msgForSend = {
          text: msg,
          member: state.member,
          dateOfSend: moment(date).format('DD MMMM YYYY')
        }
        encryptMessageAndSend(msg);
        dispach({type:'ADD_MSG', payload: msgForSend});
      }

      const encryptMessageAndSend = (msg) => {
        const encryptedMsgText = crypto.publicEncrypt(publicKey, Buffer.from(msg));
        const encryptedUsername = crypto.publicEncrypt(publicKey, Buffer.from(state.member.username))
        const msgToEmit = {text: encryptedMsgText.toString('base64'), 
        member: {
          username: encryptedUsername.toString('base64'),
          avatarUrl: state.member.avatarUrl
        }}
        socket.emit('send-chat-message', msgToEmit)
      }
      const handleSocket = () => {
          socket.on('chat-message',(msg) => {
            const encryptedMsg = decryptMessage(msg)
            dispach({type:'ADD_MSG', payload: encryptedMsg})
          })

          socket.on('users-count',(usersCount) => {
            const newCount = usersCount
            setOnlineUsers(newCount);
          })
          
          socket.on('qr-code', (qrCodeWithKey) => {
           setQrCode(qrCodeWithKey.privateKey)
           setPublicKey(qrCodeWithKey.publicKey)
          })

          socket.on('chat-history',(chatMsg) => {
            chatMsg.forEach(msg => {
              dispach({type:'ADD_MSG', payload: msg})
            })
          })

          socket.on('chat-delete', () => {
            dispach({type:'DELETE_MSG',payload: null})
          })
        
      }

      const onKeyAdd= (privateKey) => {
        if(!state.qrCodesForCrypto.includes(privateKey)){
        state.qrCodesForCrypto.push(privateKey);
        }
        tryDecrypt();
      }

      const tryDecrypt = () => {
        const decryptedMessages = [];
        state.messages.forEach(message => {
          if(message.member.username === state.member.username){
            decryptedMessages.push(message);
          }
          else{
          const encryptedMsg = decryptMessage(message);
          encryptedMsg ?  decryptedMessages.push(encryptedMsg) : decryptedMessages.push(message);
          }
          
        })
        dispach({type: 'DECRYPTION', payload: decryptedMessages});
      }

      const decryptMessage = (msg) => {
        const qrKeys = [...state.qrCodesForCrypto];
        console.log(qrKeys);
        let encryptedMessage = msg;
        for(const code of qrKeys){
          try{
              const encryptedMsg = crypto.privateDecrypt(code, Buffer.from(msg.text,'base64'));
              const encryptedUsername = crypto.privateDecrypt(code, Buffer.from(msg.member.username,'base64'));
              let message = msg;
              message.text = encryptedMsg.toString("utf8");
              message.member.username  = encryptedUsername.toString("utf8");
              encryptedMessage = message
          }
          catch(err){
            continue
          }
        }
        return encryptedMessage;
      }

      const onMsgDeleteRequest = () => {
        dispach({type:'DELETE_MSG',payload: null})
        socket.emit('delete-messages');
      }

      return(
        <div>
        <div class="ibox-content">
          <Messages
            messages={state.messages}
            currentMember={state.member}
            code={qrCode}
            deleteHistory={onMsgDeleteRequest}
            onlineUsers={onlineUsers}
          />
          <Input
              onSendMessage={onSendMessage}
              onKeyAdd={onKeyAdd}
          />
        </div>
        </div>
      )
  }

  
export default Chat;


