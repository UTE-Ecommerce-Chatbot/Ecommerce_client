import { API_URL } from "../constants/constants";
import axios from "axios";
import axiosClient from "actions/constants/axiosClient";

export const getSimilarProduct = (tags, category, brand) => {
  // const tagsData = {tags: tags}
  return axios({
    method: "POST",
    data: tags,
    url: `${API_URL}/api/recommend/similar/${category}`,
  });
};

export const getListRecommendForUser = () => {
  // const tagsData = {tags: tags}
  return axiosClient({
    method: "POST",
    url: `${API_URL}/api/recommend/list`,
  });
};

export const getListRecentViewed = (id) => {
  return axios({
      method: 'GET',
      url: `${API_URL}/api/recommend/view/${id}`
  });
}
