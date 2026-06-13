const API_URL = "http://localhost:3000";

export const goalsApi = {
  async getAll() {
    const res = await fetch(`${API_URL}/goals`);
    return res.json();
  },

  async getCompetitions() {
    const res = await fetch(`${API_URL}/competitions`);
    return res.json();
  }
};