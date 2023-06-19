
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import jwt from 'jsonwebtoken';
const API_URL = "http://localhost:5000/api/user/";
//const API_URL = "http://192.168.225.23:5000/api/user/"



export default   {

    isAuthenticated() {
      const token = localStorage.getItem('userTicket')
        if (token) {
          return true
        } else {
          return false
        }
    },

    getGuestUser(){
        return {name: "Guest 123", userId: "guest123", email: "coolboy69@gg.com"}
    },

    authenticate(cb) {
      this.isAuthenticated = true;
      setTimeout(cb, 100); // fake async
    },

    signout(cb) {
      this.isAuthenticated = false;
      setTimeout(cb, 100);
    },


    loginWithGoogle(res) {
      var data = {
        name: res.profileObj.name,
        email : res.profileObj.email,
        image: res.profileObj.imageUrl
      }

      return axios
        .post(API_URL + "login", data)
        .then(response => {
          console.log(response.data); 
          if (response.data.accessToken) {
            localStorage.setItem("userTicket", JSON.stringify(response.data.accessToken));          
          }
          return response.data;
        });
    },

    loginAsGuest(){
      var userData = {
        name: "Cool Guest", 
        id: "y2jsdqakq9rqyvtd4gf6g", 
        email: "coolboy69@gg.com"
      }

      const accessToken = jwt.sign(userData, "thisisaguesttokenwithsomeshittystring8", {expiresIn: '24h'});
      localStorage.setItem("userTicket", JSON.stringify(accessToken));   
      return accessToken;   

    },

    logout() {
      localStorage.removeItem("userTicket");
    },

    getCurrentUser() {
       return jwtDecode(localStorage.getItem('userTicket'));
     },
  };

//or, use firebase auth
/*
import firebase from 'firebase/app';
import 'firebase/auth';
import jwtDecode from 'jwt-decode';
import jwt from 'jsonwebtoken';

const firebaseConfig = {
  // Add your Firebase config here
  // apiKey: "YOUR_API_KEY",
  // authDomain: "YOUR_AUTH_DOMAIN",
  // projectId: "YOUR_PROJECT_ID",
  // ...
};

firebase.initializeApp(firebaseConfig);

export default {
  isAuthenticated() {
    const user = firebase.auth().currentUser;
    return user !== null;
  },

  getGuestUser() {
    return { name: 'Guest 123', userId: 'guest123', email: 'coolboy69@gg.com' };
  },

  authenticate(cb) {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        const { displayName, email, photoURL } = result.user;
        const data = {
          name: displayName,
          email: email,
          image: photoURL,
        };
        return axios.post(API_URL + 'login', data);
      })
      .then((response) => {
        console.log(response.data);
        if (response.data.accessToken) {
          localStorage.setItem('userTicket', JSON.stringify(response.data.accessToken));
        }
        cb();
      })
      .catch((error) => {
        console.log(error);
        cb(error);
      });
  },

  signout(cb) {
    firebase
      .auth()
      .signOut()
      .then(() => {
        localStorage.removeItem('userTicket');
        cb();
      })
      .catch((error) => {
        console.log(error);
        cb(error);
      });
  },

  loginAsGuest() {
    var userData = {
      name: 'Cool Guest',
      id: 'y2jsdqakq9rqyvtd4gf6g',
      email: 'coolboy69@gg.com',
    };

    const accessToken = jwt.sign(userData, 'thisisaguesttokenwithsomeshittystring8', { expiresIn: '24h' });
    localStorage.setItem('userTicket', JSON.stringify(accessToken));
    return accessToken;
  },

  logout() {
    firebase.auth().signOut();
    localStorage.removeItem('userTicket');
  },

  getCurrentUser() {
    return jwtDecode(localStorage.getItem('userTicket'));
  },
};

*/
