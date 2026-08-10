import axios from "axios";

const endpointUrl = "https://properties.redlobosgroup.com";

export async function getProperties() {
  const response = await axios
    .get(`${endpointUrl}/server/properties`, {})
    .then((res: any) => res)
    .catch((err: any) => err.message);
  return response;
}

export async function getPropertyImages(property_id: any) {
  const response = await axios
    .get(`${endpointUrl}/server/property/${property_id}/images`, {})
    .then((res: any) => res)
    .catch((err: any) => err.message);
  return response;
}

export async function getPropertyAmenities(property_id: any) {
  const response = await axios
    .get(`${endpointUrl}/server/property/${property_id}/amenities`, {})
    .then((res: any) => res)
    .catch((err: any) => err.message);
  return response;
}

export async function getPropertyEvents(property_id: any) {
  const response = await axios
    .get(`${endpointUrl}/server/property/${property_id}/events`, {})
    .then((res: any) => res)
    .catch((err: any) => err.message);
  return response;
}

export async function getPropertyDetails(property_id: any) {
  const response = await axios
    .get(`${endpointUrl}/server/property/${property_id}`, {})
    .then((res: any) => res)
    .catch((err: any) => err.message);
  return response;
}
