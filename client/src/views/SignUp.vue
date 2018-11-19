<template>
<section><h1>Sign Up</h1>
<form>
  <div class="form-group">
    <label for="username">Username</label>
    <input type="text" class="form-control" id="username" aria-describedby="usernameHelp" placeholder="Enter username">
        <p id="usernameHelp" class="form-text text-muted">Username must be longer than 2 characters and shorter than 30.
        Username can only contain alphanumeric characters and underscore.</p>

    
  </div>
  <div class="form-group">
    <label for="password">Password</label>
    <input type="password" class="form-control" id="password"
    aria-describedby="passwordHelp" placeholder="Password">
    <p id="passwordHelp" class="form-text text-muted">Username must be Password must be 10 or more characters long.</p>
  </div>
  
  <button type="submit" class="btn btn-primary">Submit</button>
</form></section>
  
  
</template>

<script>
export default {};
</script>

<style>
</style>
