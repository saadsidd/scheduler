import { useState, useEffect } from "react";
import axios from "axios";

export default function useApplicationData() {

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  // Gets days, appointments, and interviewers data only once from api
  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ]).then(all => {
      setState(prev => {
        return ({ ...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data })
    });
    });
  }, []);

  // Sets the current day
  const setDay = day => setState({ ...state, day });

  // Makes put request to /api/appointments/:id and returns a promise
  const bookInterview = function(id, interview) {

    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    // Creating new appointments object with new interview to use in setState
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios.put(`/api/appointments/${id}`, appointment)
      .then(() => {
        setState(prev => {
          // Get new returned days object with spot updated to use in setState
          const days = updateSpots(prev, appointments, id);
          return { ...prev, appointments, days }
        });
      });
    
  }

  // Makes delete request to /api/appointments/:id and returns a promise
  const cancelInterview = function(id) {

    const appointment = {
      ...state.appointments[id],
      interview: null
    };

    // Creating new appointments object with null interview to use in setState
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios.delete(`/api/appointments/${id}`)
      .then(() => {
        setState(prev => {
          // Get new returned days object with spot updated to use in setState
          const days = updateSpots(prev, appointments, id);
          return { ...prev, appointments, days }
        });
      });
  }

  const updateSpots = function(state, appointments, id) {
    let daysCopy = [];

    // Create a deep copy of the days array so state is not mutated
    state.days.forEach(day => {
      daysCopy.push({
        ...day,
        appointments: [...day.appointments],
        interviewers: [...day.interviewers]
      })
    });

    daysCopy.forEach(day => {

      // Find day which contains the passed in appointment id
      if (day.appointments.includes(id)) {

        // Compare prev interview (old) with appointments interview (new from put/delete request)
        // to either add or subtract spots
        if (state.appointments[id].interview !== null && appointments[id].interview === null) {
          day.spots++;
        }
        else if (state.appointments[id].interview === null && appointments[id].interview !== null) {
          day.spots--;
        }
      }
    });

    return daysCopy;

  }

  return { state, setDay, bookInterview, cancelInterview }
}