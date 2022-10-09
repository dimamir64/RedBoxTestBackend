const defaultUser = {
  email: 'admin@dm64.ru',
  avatarUrl: '/dist/avatar.jpg',
  login: '79000000000',
  password: 'tester',
  token: null
};
const tokend=null;
import axios from 'axios';
//import sha256 from 'crypto-js/aes';
//import regeneratorRuntime from '@babel/runtime/regenerator';

const API_URL = 'https://river.germes.rdbx.dev/api/auth/jwt/';

export default {
  _user: defaultUser,
  token: tokend,
  loggedIn() {
//    console.log('loggedIn',this._user);
    const t2=JSON.parse(sessionStorage.getItem('user'))?.access_token;
    const r=!!t2;
    console.log('loggedIn r',r,t2);
    return r;
  },

  authHeader() {
    let user = JSON.parse(localStorage.getItem('user'));
    if (user && user.accessToken) {
      return { Authorization: 'Bearer ' + user.access_token }; // for Spring Boot back-end
      // return { 'x-access-token': user.access_token };       // for Node.js Express back-end
    } else {
      return {};
    }
  },

  getToken() {
      return  this.token ;
  },

async logIn  (email, login, password) {
    try {
      console.log(email, login, password);
      this._user = { ...defaultUser, email, login, password };
      sessionStorage.removeItem('user');
      this.token =null;
      axios
      .post(API_URL + 'login', {
        username: this._user.login,
        password: this._user.password,
        accept_token: null,
        rememberMe: true
      })
      .then(response => {
        if (response.data.data.access_token) {
          console.log('access_token получен');
          this._user.token = response.data.data.access_token;
          this.token = response.data.data.access_token;
          sessionStorage.setItem('user', JSON.stringify(response.data.data));
        }
        const r = {isOk: true, data: this._user};
        console.log('logIn isOk2',r);
        return r;
    })
      .catch(error => {
        console.log(error.message)
        console.log('Ошибка авторизации1');
        return {
          isOk: false,
          message: "Ошибка авторизации1"
        };
        });
    }
    catch {
      console.log('Ошибка авторизации2');
      return {
        isOk: false,
        message: "Ошибка авторизации2"
      };
    }
  },

  async logOut() {
    this._user = null;
    sessionStorage.removeItem('user');
  },

  async getUser() {
    try {
      // Send request

      return {
        isOk: true,
        data: this._user
      };
    }
    catch {
      return {
        isOk: false
      };
    }
  },

  async resetPassword(email) {
    try {
      // Send request
      console.log(email);

      return {
        isOk: true
      };
    }
    catch {
      return {
        isOk: false,
        message: "Ошибка сброса пароля"
      };
    }
  },

  async changePassword(email, recoveryCode) {
    try {
      // Send request
      console.log(email, recoveryCode);

      return {
        isOk: true
      };
    }
    catch {
      return {
        isOk: false,
        message: "Ошибка изменения пароля"
      }
    }
  },

  async createAccount(email, password) {
    try {
      // Send request
      console.log(email, password);

      return {
        isOk: true
      };
    }
    catch {
      return {
        isOk: false,
        message: "Ошибка создания аккаунта"
      };
    }
  }
};
/*          const rt=response.data.data.refresh_token;
          const t=response.data.data.access_token;
          let t1,t2;
          t1=sha256.encrypt(t,rt);
          t2=sha256.decrypt(t1,rt);
          if (t==t2) 
          {console.log('t==t2')}
           else {console.log('t!=t2')}
          t1=`${t1}`;
          console.log(t1);
          sessionStorage.setItem('token', t1);
          sessionStorage.setItem('rt', JSON.stringify(response.data.data.refresh_token));
          const token=`${sha256.decrypt( sessionStorage.getItem('token'),rt)}`;
          console.log('tok',token);
          console.log('t2',t2);*/
          //t2=JSON.parse(sessionStorage.getItem('user')).access_token;

