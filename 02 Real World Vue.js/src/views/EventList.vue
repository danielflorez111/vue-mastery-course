<template>
  <div>
    <h1>Events for {{ user.user.name }}</h1>
    <EventCard v-for="event in event.events" :key="event.id" :event="event" />

    <div class="pagination-container">
      <span v-show="page != 1">
        <router-link :to="{ name:'event-list', query: { page: page - 1 }}" rel="prev">Previous</router-link>
      </span>
      <span v-show="event.totalEvents > page * 2">
        <router-link :to="{ name:'event-list', query: { page: page + 1 }}" rel="next">Next</router-link>
      </span>
    </div>
  </div>
</template>

<script>
import EventCard from "@/components/EventCard.vue";
import { mapState } from "vuex";

export default {
  components: {
    EventCard
  },
  created() {
    this.$store.dispatch("fetchEvents", {
      perPage: 2,
      page: this.page
    });
  },
  computed: {
    page() {
      return parseInt(this.$route.query.page) || 1;
    },
    ...mapState(["event", "totalEvents", "user"])
  }
};
</script>

<style scoped>
.pagination-container {
  display: flex;
  justify-content: space-between;
}
</style>