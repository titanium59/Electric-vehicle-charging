<template>
  <div class="main-bg">
    <!-- Navbar -->
    <nav class="navbar">
      <div class="navbar-title">EV Stations</div>
      <div>
        <button v-if="isLoggedIn" @click="logout" class="nav-btn logout">Logout</button>
        <template v-else>
          <button @click="goToLogin" class="nav-btn login">Login</button>
          <button @click="goToSignup" class="nav-btn signup">Signup</button>
        </template>
      </div>
    </nav>

    <!-- Add Station Button -->
    <div class="center-btn">
      <button @click="goToCreate" class="add-btn">Add New Charging Station</button>
    </div>

    <!-- Mapbox Map -->
    <div id="map" style="width: 100%; height: 500px; margin-bottom: 32px;"></div>

    <!-- Stations List -->
    <div v-if="stations.length" class="stations-list">
      <div v-for="station in stations" :key="station._id" class="station-card">
        <div @click="goToStation(station._id)" class="station-info">
          <div class="station-title">{{ station.name }}</div>
          <div><b>Location:</b> {{ station.location.coordinates.join(', ') }}</div>
          <div><b>Status:</b> {{ station.status }}</div>
          <div><b>Power Output:</b> {{ station.powerOutput }} kW</div>
          <div><b>Connector Type:</b> {{ station.connectorType }}</div>
        </div>
        <div v-if="station.owner && station.owner._id === loggedInOwnerId" class="station-actions">
          <button @click.stop="editStation(station._id)" class="edit-btn">Edit</button>
          <button @click.stop="deleteStation(station._id)" class="delete-btn">Delete</button>
        </div>
      </div>
    </div>
    <p v-else class="no-stations">No stations found.</p>
  </div>
</template>

<script>
import mapboxgl from 'mapbox-gl';

export default {
  data() {
    return {
      stations: [],
      loggedInOwnerId: localStorage.getItem('ownerId'),
      map: null
    }
  },
  computed: {
    isLoggedIn() {
      return !!localStorage.getItem('token');
    },
    geojsonStations() {
      return {
        type: "FeatureCollection",
        features: this.stations
          .filter(station => station.location && station.location.coordinates)
          .map(station => ({
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: station.location.coordinates
            },
            properties: {
              id: station._id,
              name: station.name,
              status: station.status,
              powerOutput: station.powerOutput,
              connectorType: station.connectorType,
              owner: station.owner ? station.owner.name : ''
            }
          }))
      };
    }
  },
  watch: {
    stations: {
      handler() {
        if (this.map && this.map.getSource('stations')) {
          this.map.getSource('stations').setData(this.geojsonStations);
        }
      },
      deep: true
    }
  },
  mounted() {
    this.fetchStations();
    // Initialize Mapbox
    mapboxgl.accessToken = process.env.VUE_APP_MAPBOX_TOKEN || 'pk.eyJ1IjoidGl0YW5pdW01OTYiLCJhIjoiY2w2bmIwNWxwMHRqOTNqbzcxNWxzN240ZCJ9.zpgHYiL8reD3OPg-t1_TuQ';
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [-103.5917, 40.6699],
      zoom: 3
    });

    this.map.on('load', () => {
      this.map.addSource('stations', {
        type: 'geojson',
        data: this.geojsonStations,
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50
      });

      this.map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'stations',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': [
            'step',
            ['get', 'point_count'],
            '#51bbd6',
            100,
            '#f1f075',
            750,
            '#f28cb1'
          ],
          'circle-radius': [
            'step',
            ['get', 'point_count'],
            20,
            100,
            30,
            750,
            40
          ]
        }
      });

      this.map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'stations',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': ['get', 'point_count_abbreviated'],
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 12
        }
      });

      this.map.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'stations',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': '#11b4da',
          'circle-radius': 8,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#fff'
        }
      });

      // inspect a cluster on click
      this.map.on('click', 'clusters', (e) => {
        const features = this.map.queryRenderedFeatures(e.point, {
          layers: ['clusters']
        });
        const clusterId = features[0].properties.cluster_id;
        this.map.getSource('stations').getClusterExpansionZoom(
          clusterId,
          (err, zoom) => {
            if (err) return;
            this.map.easeTo({
              center: features[0].geometry.coordinates,
              zoom: zoom
            });
          }
        );
      });

      // When a click event occurs on a feature in the unclustered-point layer, open a popup
      this.map.on('click', 'unclustered-point', (e) => {
        const coordinates = e.features[0].geometry.coordinates.slice();
        const props = e.features[0].properties;
        let html = `<b>${props.name}</b><br>Status: ${props.status}<br>Power: ${props.powerOutput} kW<br>Connector: ${props.connectorType}`;
        new mapboxgl.Popup()
          .setLngLat(coordinates)
          .setHTML(html)
          .addTo(this.map);
      });

      this.map.on('mouseenter', 'clusters', () => {
        this.map.getCanvas().style.cursor = 'pointer';
      });
      this.map.on('mouseleave', 'clusters', () => {
        this.map.getCanvas().style.cursor = '';
      });
    });
  },
  methods: {
    fetchStations() {
      fetch('http://localhost:3000/stations')
        .then(res => res.json())
        .then(data => {
          this.stations = data
        })
        .catch(() => {
          this.stations = []
        })
    },
    goToCreate() {
      this.$router.push('/create');
    },
    goToLogin() {
      this.$router.push('/login');
    },
    goToSignup() {
      this.$router.push('/signup');
    },
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('ownerId');
      this.loggedInOwnerId = null;
      window.location.reload();
    },
    goToStation(id) {
      this.$router.push(`/stations/${id}`);
    },
    editStation(id) {
      this.$router.push(`/stations/${id}/edit`);
    },
    async deleteStation(id) {
      if (confirm('Are you sure you want to delete this station?')) {
        await fetch(`http://localhost:3000/stations/${id}`, { 
          method: 'DELETE',
          headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });
        this.fetchStations();
      }
    }
  }
}
</script>

<style scoped>
.main-bg {
  min-height: 100vh;
  background: #f4f6fa;
  font-family: 'Segoe UI', Arial, sans-serif;
}
.navbar {
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  padding: 18px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.navbar-title {
  font-size: 2rem;
  font-weight: bold;
  color: #2563eb;
  letter-spacing: 1px;
}
.nav-btn {
  border: none;
  padding: 8px 18px;
  margin-left: 8px;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;
}
.login { background: #2563eb; color: #fff; }
.signup { background: #22c55e; color: #fff; }
.logout { background: #ef4444; color: #fff; }
.login:hover { background: #1d4ed8; }
.signup:hover { background: #16a34a; }
.logout:hover { background: #b91c1c; }

.center-btn {
  display: flex;
  justify-content: center;
  margin: 32px 0 24px 0;
}
.add-btn {
  background: #2563eb;
  color: #fff;
  border: none;
  padding: 12px 28px;
  border-radius: 6px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(37,99,235,0.08);
  transition: background 0.2s;
}
.add-btn:hover {
  background: #1d4ed8;
}

.stations-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 32px;
  margin-bottom: 40px;
}
.station-card {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.07);
  padding: 24px 28px;
  width: 320px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  transition: box-shadow 0.2s;
  cursor: pointer;
}
.station-card:hover {
  box-shadow: 0 8px 24px rgba(37,99,235,0.13);
}
.station-title {
  font-size: 1.3rem;
  font-weight: bold;
  color: #2563eb;
  margin-bottom: 10px;
}
.station-info {
  width: 100%;
  margin-bottom: 12px;
}
.station-actions {
  display: flex;
  gap: 10px;
}
.edit-btn, .delete-btn {
  border: none;
  padding: 7px 16px;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}
.edit-btn { background: #facc15; color: #fff; }
.edit-btn:hover { background: #eab308; }
.delete-btn { background: #ef4444; color: #fff; }
.delete-btn:hover { background: #b91c1c; }
.no-stations {
  text-align: center;
  color: #888;
  margin-top: 48px;
  font-size: 1.2rem;
}
</style>