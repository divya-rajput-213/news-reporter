import { FormEvent } from "react";

// Define the type for each article object
export interface Article {
  title: string;
  snippet: string;
  link: string;
  date: string;
}

// Define the type for the props
export interface NewsCardProps {
  news: Article[]; // Array of articles
}
export interface SearchProps {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  handleSearch: (e: FormEvent<HTMLFormElement>) => void;
}
