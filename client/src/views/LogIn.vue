<template>
  <section>
    <h1>Log In</h1>
    <div v-if="logginIn" style="text-align: center"><img src="../assets/loading.svg" alt=""></div>
    <div v-if="errorMessage" class="alert alert-danger" role="alert">
      {{ errorMessage }}
    </div>
    <form v-if="!logginIn" @submit.prevent="login()">
      <div class="form-group">
        <label for="username">Username</label>
        <input
          v-model="user.username"
          type="text"
          class="form-control"
          id="username"
          aria-describedby="usernameHelp"
          placeholder="Enter username" required/>
            <p id="usernameHelp" class="form-text text-muted">Enter your username to login.</p>
      </div>
     
      <div class="form-group">
        <label for="password">Password</label>
        <input 
        v-model="user.password"
        type="password" class="form-control" id="password"
        aria-describedby="passwordHelp" placeholder="Password" required>
        <p id="passwordHelp" class="form-text text-muted">Enter your password to login.</p>
      </div>

      <button type="submit" class="btn btn-primary">Log In</button>
    </form>
  </section>
  
</template>

<script>
import Joi from 'joi';

const LOGIN_URL = 'http://localhost:5000/auth/login';

const schema = Joi.object().keys({
  username: Joi.string()
    .regex(/(^[a-zA-Z0-9_]*$)/)
    .min(3)
    .max(30)
    .required(),
  password: Joi.string()
    .trim()
    .min(10)
    .required(),
});

export default {
  data: () => ({
    logginIn: false,
    errorMessage: '',
    user: {
      username: '',
      password: '',
    },
  }),
  methods: {
    login() {
      this.errorMessage = '';

      if (this.validUser()) {
        this.logginIn = true;
        const body = {
          username: this.user.username,
          password: this.user.password,
        };
        fetch(LOGIN_URL, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify(body),
        })
          .then(response => {
            if (response.ok) {
              return response.json();
            }
            return response.json().then(error => {
              throw new Error(error.message);
            });
          })
          .then(result => {
            //LOGGED IN
            localStorage.token = result.token;
            setTimeout(() => {
              this.logginIn = false;
              this.$router.push('/dashboard');
            }, 1000);
          })
          .catch(error => {
            setTimeout(() => {
              this.logginIn = false;
              this.errorMessage = error.message;
            }, 1000);
          });
      }
    },

    validUser() {
      const result = Joi.validate(this.user, schema);
      if (result.error === null) {
        return true;
      }

      if (result.error.message.includes('username')) {
        this.errorMessage = 'Username is invalid. 😢';
      } else {
        this.errorMessage = 'Password is invalid 😢';
      }
      return false;
    },
  },
};
</script>

<style>
</style>
