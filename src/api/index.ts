import axios from "axios";

// All property calls go through the Express proxy to avoid browser CORS issues
// with the upstream https://properties.redlobosgroup.com API.
const base = "/api/properties";

export async function getProperties() {
  return axios.get(base).catch((err: any) => err.message);
}

export async function getPropertyImages(property_id: any) {
  return axios.get(`${base}/${property_id}/images`).catch((err: any) => err.message);
}

export async function getPropertyAmenities(property_id: any) {
  return axios.get(`${base}/${property_id}/amenities`).catch((err: any) => err.message);
}

export async function getPropertyEvents(property_id: any) {
  return axios.get(`${base}/${property_id}/events`).catch((err: any) => err.message);
}

export async function getPropertyDetails(property_id: any) {
  return axios.get(`${base}/${property_id}`).catch((err: any) => err.message);
}
