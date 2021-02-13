import React,{Component} from "react";
import './App.css';
import Login from './Login/Login';
import Chat from './Chat/Chat'
import Header from './Header/Header'
import { uniqueNamesGenerator, starWars } from  'unique-names-generator';

const config = {
  dictionaries: [starWars]
}
 
class App extends Component {

  state = {
    username: '',
    roomName: '',
    loggedIn: false
  }

  constructor(props){
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
  }

    handleLogin(username, roomName){
      if(username === ''){
        username = uniqueNamesGenerator(config);
      }
     this.setState({username: username});
     this.setState({roomName: roomName});
     this.setState({loggedIn: true});
  }

  render(){
    const { loggedIn } = this.state
    
    if(!loggedIn){
      return (
        <div>
          <Header/>
          <Login onLogin={this.handleLogin}/>
        </div>
      )
    }

    return (
      <div>
        <Header/>
        <Chat username={this.state.username} roomName={this.state.roomName}/>
      </div>
    )


  }
}

export default App;
