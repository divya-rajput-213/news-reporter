"use client";

import {
  AppBar,
  Box,
  Container,
  IconButton,
  Paper,
  Toolbar,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CancelIcon from "@mui/icons-material/Close";
import { useEffect, useRef, useState, FormEvent } from "react";
import Head from "next/head";
import NewsCard from "@/components/NewsCard";
import Loading from "@/components/Loading";
import ErrorMessage from "@/components/ErrorMessage";
import Search from "@/components/Search"; // Import the SearchForm component

import { Article } from "@/types/types";

const Home = () => {
  const [news, setNews] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");  const [isEditing, setIsEditing] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.length > 2) {
        fetchSuggestions(query);
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setSuggestions([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [news, loading]);

   // Fetch suggestions from the API
   const fetchSuggestions = async (query: string) => {
    try {
      const res = await fetch(
        `/api/suggestions?query=${encodeURIComponent(query)}`
      );
      if (!res.ok) throw new Error("Failed to fetch suggestions");
      const data = await res.json();
      console.log('data) ', data)
      setSuggestions(data.suggestions)//Limit to 8 suggestions
    } catch (err) {
      console.error("Error fetching suggestions:", err);
    }
  };

  const handleSearch = async (e: FormEvent<HTMLFormElement> | null, suggestion?: string) => {
    if (e) e.preventDefault();
  
    const searchTerm = suggestion || query;
    if (!searchTerm.trim()) return;
  
    setSubmittedQuery(searchTerm);
    setQuery("");
    setIsEditing(false);
    setSuggestions([]);
    setLoading(true);
    setError("");
  
    try {
      const url = `/api/news?query=${encodeURIComponent(searchTerm)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (res.ok) {
        setNews(data.articles || []);  // Ensure this is correct
      } else {
        setError(data.error?.message || "Failed to fetch news.");
      }
    } catch (err) {
      console.error("Error fetching news:", err);
      setError("An error occurred while fetching the news.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <>
      <Head>
        <title>Insightly | Chat News</title>
        <meta name="description" content="Fetch news in a chatbot style" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Top AppBar */}
      <AppBar
        position="static"
        sx={{ background: "linear-gradient(to right, #1976d2, #42a5f5)" }}
      >
        <Toolbar sx={{ justifyContent: "center" }}>
          <Typography variant="h5" fontWeight="bold">
            Insightly Chat News
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Main UI */}
      <Container
        maxWidth="md"
        sx={{ py: 4, display: "flex", flexDirection: "column", gap: 4 }}
      >
        {/* Search Box */}
        <Search
          query={query}
          setQuery={setQuery}
          handleSearch={handleSearch}
          suggestions={suggestions}
        />

        {/* Chat Box */}
        <Paper
          ref={chatContainerRef}
          elevation={3}
          sx={{
            p: 3,
            borderRadius: 4,
            height: "70vh",
            overflowY: "auto",
            background: "#f5f5f5",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {/* Submitted Query */}
          {submittedQuery && !loading && (
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Box
                sx={{
                  bgcolor: "#1976d2",
                  color: "white",
                  p: 2,
                  borderRadius: "20px 20px 0 20px",
                  maxWidth: "70%",
                  wordBreak: "break-word",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 1,
                }}
              >
                <Typography variant="body1" sx={{ flexGrow: 1 }}>
                  {submittedQuery}
                </Typography>
                {!isEditing ? (
                  <IconButton
                    size="small"
                    sx={{ color: "white" }}
                    onClick={() => {
                      setQuery(submittedQuery);
                      setIsEditing(true);
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                ) : (
                  <IconButton
                    size="small"
                    sx={{ color: "white" }}
                    onClick={() => {
                      setQuery("");
                      setIsEditing(false);
                    }}
                  >
                    <CancelIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
            </Box>
          )}

          {loading && <Loading />}
          {error && <ErrorMessage message={error} />}
          <NewsCard news={news} />
        </Paper>
      </Container>
    </>
  );
};

export default Home;
