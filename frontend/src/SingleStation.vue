<template>
  <div v-if="station">
    <h2>{{ station.name }}</h2>
    <p>Location: {{ station.location.coordinates.join(', ') }}</p>
    <p>Status: {{ station.status }}</p>
    <p>Power Output: {{ station.powerOutput }} kW</p>
    <p>Connector Type: {{ station.connectorType }}</p>
    <button
      v-if="station.owner && station.owner._id === loggedInOwnerId"
      @click="goToEdit"
    >Edit</button>
    <button @click="goBack">Back</button>
  </div>
  <div v-else>
    <p>Loading...</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      station: null,
      loggedInOwnerId: localStorage.getItem('ownerId')
    }
  },
  mounted() {
    fetch(`http://localhost:3000/stations/${this.$route.params.id}`)
      .then(res => res.json())
      .then(data => {
        this.station = data
      })
  },
  methods: {
    goToEdit() {
      this.$router.push(`/stations/${this.$route.params.id}/edit`);
    },
    goBack() {
      this.$router.push('/');
    }
  }
}
</script>