import axios from "axios";
import config from "../config";   // 👈 import the object

const API_URL = `${config.API_BASE_URL}/notes`;  // 👈 build final endpoint

export const getNotes = () => axios.get(API_URL);
export const getNote = (id) => axios.get(`${API_URL}/${id}`);
export const createNote = (note) => axios.post(API_URL, note);
export const updateNote = (id, note) => axios.put(`${API_URL}/${id}`, note);
export const deleteNote = (id) => axios.delete(`${API_URL}/${id}`);
