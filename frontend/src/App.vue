<template>
  <div>  
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: ''
    }
  },
  mounted() {
    fetch('http://localhost:3000/')
      .then(res => res.text())
      .then(data => {
        this.message = data
      })
  }
}
</script>