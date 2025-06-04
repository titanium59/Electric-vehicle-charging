<template>
  <div class="form-bg">
    <div class="form-card">
      <h2 class="form-title">Owner Login</h2>
      <form @submit.prevent="login" class="form-fields">
        <label>Name:
          <input v-model="name" required class="form-input" />
        </label>
        <label>Password:
          <input v-model="password" type="password" required class="form-input" />
        </label>
        <button type="submit" class="form-btn primary">Login</button>
      </form>
      <p v-if="error" class="form-error">{{ error }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: '',
      password: '',
      error: ''
    }
  },
  methods: {
    async login() {
      this.error = '';
      try {
        const res = await fetch('http://localhost:3000/owners/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: this.name, password: this.password })
        });
        const data = await res.json();
        if (res.ok) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('ownerId', data.owner.id);
          this.$router.push('/');
        } else {
          this.error = data.error || 'Login failed';
        }
      } catch (e) {
        this.error = 'Network error';
      }
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
.form-error {
  color: #ef4444;
  text-align: center;
  margin-top: 10px;
}
</style>