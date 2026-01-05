import { ref, reactive } from "vue";

const API_URL = "http://localhost:5000/api";

export function useAppointments() {
  const appointments = ref([]);
  const todayAppointments = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const selectedAppointment = reactive({});

  const getToken = () => localStorage.getItem("token");

  // Get all appointments
  const fetchAppointments = async () => {
    try {
      loading.value = true;
      const response = await fetch(`${API_URL}/appointments`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch appointments");
      appointments.value = await response.json();
      error.value = null;
    } catch (err) {
      error.value = err.message;
      console.error("Error fetching appointments:", err);
    } finally {
      loading.value = false;
    }
  };

  // Get appointments by date
  const fetchAppointmentsByDate = async (date) => {
    try {
      loading.value = true;
      const dateStr =
        date instanceof Date ? date.toISOString().split("T")[0] : date;
      const response = await fetch(`${API_URL}/appointments/date/${dateStr}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch appointments");
      return await response.json();
    } catch (err) {
      error.value = err.message;
      console.error("Error fetching appointments by date:", err);
    } finally {
      loading.value = false;
    }
  };

  // Get today's appointments
  const fetchTodayAppointments = async () => {
    try {
      loading.value = true;
      const today = new Date().toISOString().split("T")[0];
      const response = await fetch(`${API_URL}/appointments/date/${today}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch today appointments");
      todayAppointments.value = await response.json();
      error.value = null;
    } catch (err) {
      error.value = err.message;
      console.error("Error fetching today appointments:", err);
    } finally {
      loading.value = false;
    }
  };

  // Create appointment
  const createAppointment = async (appointmentData) => {
    try {
      loading.value = true;
      const response = await fetch(`${API_URL}/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(appointmentData),
      });
      if (!response.ok) throw new Error("Failed to create appointment");
      const newAppointment = await response.json();
      appointments.value.push(newAppointment);
      error.value = null;
      return newAppointment;
    } catch (err) {
      error.value = err.message;
      console.error("Error creating appointment:", err);
    } finally {
      loading.value = false;
    }
  };

  // Update appointment
  const updateAppointment = async (id, updateData) => {
    try {
      loading.value = true;
      const response = await fetch(`${API_URL}/appointments/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(updateData),
      });
      if (!response.ok) throw new Error("Failed to update appointment");
      const updated = await response.json();
      const index = appointments.value.findIndex((a) => a._id === id);
      if (index !== -1) {
        appointments.value[index] = updated;
      }
      error.value = null;
      return updated;
    } catch (err) {
      error.value = err.message;
      console.error("Error updating appointment:", err);
    } finally {
      loading.value = false;
    }
  };

  // Update appointment status
  const updateAppointmentStatus = async (id, status) => {
    try {
      loading.value = true;
      const response = await fetch(`${API_URL}/appointments/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error("Failed to update appointment status");
      const updated = await response.json();
      const index = appointments.value.findIndex((a) => a._id === id);
      if (index !== -1) {
        appointments.value[index] = updated;
      }
      error.value = null;
      return updated;
    } catch (err) {
      error.value = err.message;
      console.error("Error updating appointment status:", err);
    } finally {
      loading.value = false;
    }
  };

  // Delete appointment
  const deleteAppointment = async (id) => {
    try {
      loading.value = true;
      const response = await fetch(`${API_URL}/appointments/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      if (!response.ok) throw new Error("Failed to delete appointment");
      appointments.value = appointments.value.filter((a) => a._id !== id);
      error.value = null;
    } catch (err) {
      error.value = err.message;
      console.error("Error deleting appointment:", err);
    } finally {
      loading.value = false;
    }
  };

  return {
    appointments,
    todayAppointments,
    loading,
    error,
    selectedAppointment,
    fetchAppointments,
    fetchAppointmentsByDate,
    fetchTodayAppointments,
    createAppointment,
    updateAppointment,
    updateAppointmentStatus,
    deleteAppointment,
  };
}
