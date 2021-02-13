import React, {useState} from 'react';
import './Login.css';


const useLogicForInput = ({onLogin})=>{
  const [username, setUsername] = useState('');
  const [roomname, setRoomname] = useState('');
  const [error, setError] = useState('');

  const handleSubmit =(e) => {
    e.preventDefault();
    if(roomname === ''){
      setError('Room name is required!')
    }else{
      onLogin(username,roomname);
    }
  }


  return {
    username, setUsername,
    roomname, setRoomname,
    handleSubmit,
    error
  }

}

function Login(props) {

  const{username,setUsername,roomname,setRoomname,handleSubmit,error} = useLogicForInput(props)
    
  return (
    <div class="container">
      <div class="row">
        <div class="col-md-6 mx-auto py-4 px-0">
          <div class="card p-0">
          <div class="card-title text-center">
            <h5 class="mt-5">Hello!</h5> <small class="para">In what room you want to chat?</small>
              <form class="login" onSubmit={handleSubmit}>
                <div class="form-group">
                  <input type="text" class="form-control" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username"/>
                </div>
                <div class="form-group">
                  <input type="text" class="form-control" value={roomname} onChange={(e) => setRoomname(e.target.value)} placeholder="Room Name"/>
                  {<p>{error}</p>}
                </div> 
                <button type="submit" class="btn btn-primary">Login</button>
              </form>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/*
  <input
  onChange={e => this.onNameChange(e)}
  value={this.state.username}
  type="text"
  placeholder="Enter your name"
  autofocus="true"
/>
<input
  onChange={e => this.onRoomNameChange(e)}
  value={this.state.roomName}
  type="text"
  placeholder="Enter room name"
  autofocus="false"
/>
<button>Send</button>
*/
export default Login;