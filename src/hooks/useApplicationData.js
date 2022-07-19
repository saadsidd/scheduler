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

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios.put(`/api/appointments/${id}`, appointment)
      .then(() => {
        setState(prev => {
          return { ...prev, appointments }
        });
      });
    
  }

  // Makes delete request to /api/appointments/:id and returns a promise
  const cancelInterview = function(id) {

    const appointment = {
      ...state.appointments[id],
      interview: null
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios.delete(`/api/appointments/${id}`)
      .then(() => {
        setState(prev => {
          return { ...prev, appointments }
        });
      });

  }

  return { state, setDay, bookInterview, cancelInterview }
}