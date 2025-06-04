<template>
  <div class="form-bg">
    <div class="form-card">
      <h2 class="form-title">Add New Charging Station</h2>
      <form @submit.prevent="submitForm" class="form-fields">
        <label>Name:
          <input v-model="form.name" required class="form-input" />
        </label>
        <label>Latitude:
          <input v-model.number="form.lat" required type="number" step="any" class="form-input" />
        </label>
        <label>Longitude:
          <input v-model.number="form.lng" required type="number" step="any" class="form-input" />
        </label>
        <label>Status:
          <select v-model="form.status" class="form-input">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </label>
        <label>Power Output (kW):
          <input v-model.number="form.powerOutput" required type="number" class="form-input" />
        </label>
        <label>Connector Type:
          <input v-model="form.connectorType" required class="form-input" />
        </label>
        <button type="submit" class="form-btn primary">Create</button>
      </form>
      <button @click="$router.push('/')" class="form-btn secondary">Back</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        name: '',
        lat: '',
        lng: '',
        status: 'active',
        powerOutput: '',
        connectorType: ''
      }
    }
  },
  mounted() {
    // Redirect to login if not logged in
    if (!localStorage.getItem('token')) {
      this.$router.push('/login');
    }
  },
  methods: {
    async submitForm() {
      const payload = {
        name: this.form.name,
        location: { type: 'Point', coordinates: [this.form.lng, this.form.lat] },
        status: this.form.status,
        powerOutput: this.form.powerOutput,
        connectorType: this.form.connectorType,
        owner: localStorage.getItem('ownerId')
      };
      await fetch('http://localhost:3000/stations', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify(payload)
      });
      this.$router.push('/');
    }
  }
}
</script>

<style scoped>
.form-bg {
  min-height: 100vh;
  background: #f4f6fa;
  display: flex;
  align-items: center;
  justify-content: center;
}
.form-card {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.07);
  padding: 36px 32px 28px 32px;
  width: 350px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
.form-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #2563eb;
  margin-bottom: 20px;
  text-align: center;
}
.form-fields {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 18px;
}
.form-input {
  width: 100%;
  margin-top: 4px;
  padding: 8px 10px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 1rem;
  background: #f9fafb;
  transition: border 0.2s;
}
.form-input:focus {
  border: 1.5px solid #2563eb;
  outline: none;
  background: #fff;
}
.form-btn {
  width: 100%;
  padding: 10px 0;
  border: none;
  border-radius: 5px;
  font-size: 1.07rem;
  font-weight: 500;
  margin-top: 8px;
  cursor: pointer;
  transition: background 0.2s;
}
.primary {
  background: #2563eb;
  color: #fff;
}
.primary:hover {
  background: #1d4ed8;
}
.secondary {
  background: #e5e7eb;
  color: #222;
}
.secondary:hover {
  background: #d1d5db;
}
</style>