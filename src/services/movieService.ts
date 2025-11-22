import axios from "axios";
import type { Movie } from "../types/movie";

export interface TMDBSearchResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

const BASE_URL = "https://api.themoviedb.org/3";
const token = import.meta.env.VITE_TMDB_TOKEN;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  },
});

export async function fetchMovies(query: string, page: number) {
  const response = await axiosInstance.get<TMDBSearchResponse>(
    "/search/movie",
    {
      params: {
        query,
        include_adult: false,
        language: "en-US",
        page,
      },
    }
  );

  return response.data;
}

export function getImageUrl(
  path: string | null,
  size: "w500" | "original" = "w500"
) {
  if (!path) return "";
  return `https://image.tmdb.org/t/p/${size}${path}`;
}
