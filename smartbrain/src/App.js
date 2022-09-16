import React from 'react'
import './App.css';
import Navigation from './components/Navigation/Navigation'
import Logo from './components/Logo/Logo'
import Rank from './components/Rank/Rank'
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import Particles from "react-particles";
import { loadFull } from "tsparticles";
import { useCallback } from "react";
import placeholder from './components/Logo/placeholder.png';
import Modal from './components/Modal/Modal';
import Profile from './components/Profile/Profile';
import server from './ServerSettings';
import ErrorMessage from './components/ErrorMessage/ErrorMessage';
import axios from 'axios';

const particlesInit = async (main) => {
    // console.log(main);

    // you can initialize the tsParticles instance (main) here, adding custom shapes or presets
    // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
    // starting from v2 you can add only the features you need reducing the bundle size
    await loadFull(main);
  };

  const particlesLoaded = (container) => {
    // console.log(container);
  };
const initialState = {
     input: '',
      imageUrl: '',
      box: [],
      route: 'signin',
      isProfileOpen: false,
      showBoundingBox: false,
      errorMessage: {
        isActive: false,
        message: ''
      },
      user: {
            id: '',
            name: '',
            email: '',
            entries: 0,
            joined: '',
            pet: '',
            age: ''
        }
}


class App extends React.Component {

  constructor() {
    super();
    this.state = initialState;
  }

  componentDidMount() {
    const token = window.sessionStorage.getItem('token');
    if (token) {
     fetch(`${server}/signin`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      })
      .then(resp => resp.json())
      .then(data => {
        if (data && data.id) {
          fetch(`${server}/profile/${data.id}`, {
            method: 'get',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': token
            }
            })
            .then(resp => resp.json())
            .then(user => {
              if (user && user.email)
              {
                this.loadUser(user);
                this.onRouteChange('home');
              }
            })
            .catch(console.log);
        }
      })
      .catch(console.log);
    }
  }
  

  loadUser = (data) => {
    this.setState({user: {
            id: data.id,
            name: data.name,
            email: data.email,
            entries: data.entries,
            joined: data.joined
    }})
  }

  calculateFaceLocation = (data) => {
    if (data && data.outputs)
    {
      const clarifaiFaces = data.outputs[0].data.regions;
      const image = document.getElementById('inputImage');
      const width = Number(image.width);
      const height = Number(image.height);
  
      const boxes = clarifaiFaces.map(face => {
          return {
                    leftCol: face.region_info.bounding_box.left_col * width,
                    topRow: face.region_info.bounding_box.top_row * height,
                    rightCol: width - (face.region_info.bounding_box.right_col * width),
                    bottomRow: height - (face.region_info.bounding_box.bottom_row * height)
                 }
      });
      return boxes;  
    }
    return;
  }

  displayFaceBox = (box) => {
    if (box) {
      this.setState({box: box, showBoundingBox: true});
    }
  }
  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }
 
  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input, showBoundingBox: false, errorMessage: {isActive: false}});
    fetch(`${server}/imageurl`, {
            method: 'post',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': window.sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                input: this.state.input,
                 })
            })
             .then(response => {
                if (response.status === 400) {
                  throw new Error('Bad Request');
                }
                console.log("works");
                this.SetError(false, undefined);
                return response.json();
              })
             .then((predictObj) => {
              console.log(predictObj);
                if (predictObj) {
                  fetch(`${server}/image`, {
                    method: 'put',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': window.sessionStorage.getItem('token')
                    },
                    body: JSON.stringify({
                        id: this.state.user.id,
                         })
                    })
                    .then(response => response.json())
                    .then(count => {
                        this.setState(Object.assign(this.state.user, {
                            entries: count.entries
                        }));
                    })
                    .catch();
                }
                this.displayFaceBox(this.calculateFaceLocation(predictObj));
            }
     )
      .catch((err) => this.SetError(true, 'Please enter a valid URL'));
  }

  onRouteChange = (route) => {
    if (route =='signin')
    {
        this.setState(initialState);
        window.sessionStorage.clear();
    }
    this.SetError(false, undefined);
    this.setState({route: route});
  }

  toggleModal = () => {
    this.setState(prevState => ({
        ...prevState,
        isProfileOpen: !prevState.isProfileOpen
    }))
  }

  SetError = (active, msg) => {
    this.setState({ 
      errorMessage: {
        isActive: active,
        message: msg
      }
    })
  } 


render() {
  const { route, imageUrl, box, isProfileOpen, user, errorMessage } = this.state;

  return (
    <div className="App">

        {
           isProfileOpen && 
           <Modal>
            <Profile
             user={user}
             isProfileOpen={isProfileOpen}
             toggleModal={this.toggleModal}
             loadUser={this.loadUser}
             />
           </Modal>
        }
      {
        route === 'home' ? 
        <div>
         <Navigation onRouteChange={this.onRouteChange} 
            toggleModal={this.toggleModal}/>
          <Logo />
          <Rank name={this.state.user.name} entries={this.state.user.entries} />
          <ImageLinkForm onInputChange= {this.onInputChange} onButtonSubmit = {this.onButtonSubmit} />
          {errorMessage.isActive && <ErrorMessage errorMessage={errorMessage.message}/>}
          <FaceRecognition showBoundingBox={this.state.showBoundingBox}  box={box} imageUrl = {imageUrl} />
        </div> 
        : 
        (route === 'signin') ?
        <SignIn setError={this.SetError} errorMessage={this.state.errorMessage} loadUser = {this.loadUser} onRouteChange = {this.onRouteChange} /> 
        :
        <Register loadUser = {this.loadUser} onRouteChange = {this.onRouteChange} />
      }
       <Particles
            className='particles'
            id="tsparticles"
            init={particlesInit}
            loaded={particlesLoaded}
            options={{
                background: {
                    color: {
                        value: "#0d47a1",
                    },
                    opacity: 0
                },
                fpsLimit: 120,
                interactivity: {
                    events: {
                        onClick: {
                            enable: false,
                            mode: "push",
                        },
                        onHover: {
                            enable: false,
                            mode: "repulse",
                        },
                        resize: true,
                    },
                    modes: {
                        push: {
                            quantity: 4,
                        },
                        repulse: {
                            distance: 200,
                            duration: 0.4,
                        },
                    },
                },
                particles: {
                    color: {
                        value: "#ffffff",
                    },
                    links: {
                        color: "#ffffff",
                        distance: 150,
                        enable: true,
                        opacity: 0.5,
                        width: 1,
                    },
                    collisions: {
                        enable: true,
                    },
                    move: {
                        directions: "none",
                        enable: true,
                        outModes: {
                            default: "bounce",
                        },
                        random: false,
                        speed: 2,
                        straight: false,
                    },
                    number: {
                        density: {
                            enable: true,
                            area: 700,
                        },
                        value: 80,
                    },
                    opacity: {
                        value: 0.2,
                    },
                    shape: {
                        type: "circle",
                    },
                    size: {
                        value: { min: 1, max: 5 },
                    },
                },
                detectRetina: true,
            }}
          />
      </div>
    );
  }
}

export default App;