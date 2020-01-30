<template>
  <div>
    <div class="nav">
      <div class="logo">
        <img src="@/assets/logo.svg" />
        <h1>Finder</h1>
      </div>
      <div class="links">
        <span><router-link to="/about">About</router-link></span>
      </div>
    </div>

    <div class="body">
      <h1>
        The
        <b>better</b> way to find your next
        <b class="highlight">restaurant</b>
      </h1>

      <h3 class="subtitle">Search through cuisines, establishments, and curated lists</h3>

      <router-link to="/map">
        <div class="btn highlight">Get Started</div>
      </router-link>
    </div>

    <img src="@/assets/food.svg" class="hamburger">
  </div>
</template>

<style>
.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 50px 75px;
}

.logo {
  display: flex;
  font-family: "Varela Round", sans-serif;
}

.logo > img {
  margin-right: 30px;
}

.links {
  display: flex;
  align-items: center;
}

.links > span {
  margin: 8px;
  color: #5e6271;
  font-size: 24px;
  font-family: "Source Sans Pro", sans-serif;
  font-weight: 500;
}

.highlight {
  color: #db4437;
}

.body {
  display: flex;
  align-items: center;
  flex-direction: column;
  font-size: 26px;
  font-family: "Source Sans Pro", sans-serif;
  padding: 0 75px;
  text-align: center;
}

h1 {
  font-weight: 100;
}

.subtitle {
  color: #5e6271;
  font-size: 28px;
}

.btn {
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  box-shadow: 0px 4px 24px rgba(0, 0, 0, 0.16);
  border-radius: 16px;
  padding: 0 22px;
  height: 59px;
  width: 300px;
  font-size: 22px;
  font-weight: 700;
  margin-top: 15px;
  transition: all 0.2s ease-in-out;
  border: 2px solid transparent;
  margin-bottom: 60px;
}

a {
  color: inherit;
  text-decoration: none;
}

.btn:hover {
  border: 2px solid #db4437;
}

.hamburger{
  width: 25%;
  margin: auto;
  display: block;
}

@media only screen and (max-width: 425px) {
  .links{
    display: none;
  }
  .logo > h1{
    display: none;
  }
  .logo > img {
    margin-right: 0;
  }
  .nav{
    justify-content: center;
  }
  html, body{
    overflow-y: auto !important;
  }
  .hamburger{
    display: none;
  }
}

</style>