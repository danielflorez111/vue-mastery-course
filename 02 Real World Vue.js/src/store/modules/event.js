import EventService from "@/services/EventService.js";

export const state = {
    events: [],
    totalEvents: 0,
    event: {}
};

export const mutations = {
    ADD_EVENT(state, event) {
        state.events.push(event);
    },
    SET_EVENTS(state, events) {
        state.events = events;
    },
    SET_TOTAL_EVENTS(state, totalEvents) {
        state.totalEvents = totalEvents;
    },
    SET_EVENT(state, event) {
        state.event = event;
    }
};

export const actions = {
    createEvent({ commit, dispatch }, event) {
        return EventService.postEvent(event)
            .then(() => {
                commit('ADD_EVENT', event);

                const notification = {
                    type: 'success',
                    message: 'Your event has been created'
                };
                dispatch('notification/add', notification, { root: true });
            }).catch(error => {
                const notification = {
                    type: 'error',
                    message: `There was a problem creating event: ${error.message}`
                };
                dispatch('notification/add', notification, { root: true });
                throw error;
            });
    },
    fetchEvents({ commit, dispatch }, { perPage, page }) {
        EventService.getEvents(perPage, page)
            .then(res => {
                const totalEvents = res.headers['x-total-count'];
                commit('SET_EVENTS', res.data);
                commit('SET_TOTAL_EVENTS', totalEvents);
            }).catch(error => {
                const notification = {
                    type: 'error',
                    message: `There was a problem fetching events: ${error.message}`
                };
                dispatch('notification/add', notification, { root: true });
            });
    },
    fetchEvent({ commit, getters, dispatch }, id) {
        const event = getters.getEventById(id);

        if (event) {
            commit('SET_EVENT', event);
        } else {
            EventService.getEvent(id)
                .then(res => {
                    commit('SET_EVENT', res.data);
                }).catch(error => {
                    const notification = {
                        type: 'error',
                        message: `There was a problem fetching event: ${error.message}`
                    };
                    dispatch('notification/add', notification, { root: true });
                });
        }
    }
};

export const getters = {
    getEventById: state => id => {
        return state.events.find(event => event.id === id);
    }
};
