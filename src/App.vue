<template>
  <div id="app">
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>-->
    <router-view />
  </div>
</template>

<style lang="scss">
#app {
  font-family: "Roboto Condensed", sans-serif;
  color: white;
}
/* button {
  background-color: #21ce9ac8;
  border: none;
  color: whitesmoke;
  padding: 0.5em;
  font-size: 1em;
  cursor: pointer;
  border-radius: 2px;
  transition: border-color 150ms, box-shadow 150ms ease-out, -webkit-box-shadow 150ms ease-out;
  &:hover {
    background-color: #21ce99;
    color: white;
    /* box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3); */
/* transition: border-color 150ms, box-shadow 150ms ease-out, -webkit-box-shadow 150ms ease-out; */
/* } */
/* } */
button {
  color: whitesmoke;
  transition: all 0.3s ease-in-out;
  background-color: #303032;
  border: none;
  font-size: 1em;
  cursor: pointer;
  &:hover {
    color: #21ce99;
    transition: opacity 0.3s ease-in-out;
  }
}
</style>
