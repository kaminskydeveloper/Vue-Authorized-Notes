<template>
  <div class="home text-center">
    <div class="jumbotron">
      <h1 class="display-3">Authentication App</h1>
      <p class="lead">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Distinctio, odit!</p>
      <hr class="my-4">
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque, rerum!</p>
      <p class="lead">
      <router-link
        class="btn btn-primary btn-lg"
        :to="{name: 'SignUp'}"
        href="#"
        role="button" style="margin-right: 20px">Sign Up</router-link>

      <router-link
        class="btn btn-primary btn-lg"
        :to="{name: 'LogIn'}"
        href="#"
        role="button"
        style="margin-left: 20px">Log In</router-link>
  </p>
</div>
  </div>
</template>

<script>
export default {
  name: 'home',
  components: {},
};
</script>
