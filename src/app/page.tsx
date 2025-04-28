"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Head from "next/head";
import { AppBar, Toolbar, Typography, Container, Box, Paper, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CancelIcon from "@mui/icons-material/Close";
import NewsCard from "../components/NewsCard";
import Search from "@/components/Search";
import Loading from "@/components/Loading";
import ErrorMessage from "@/components/ErrorMessage";
import { Article } from "@/types/types";

const Home = () => {
  const [news, setNews] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [query, setQuery] = useState<string>("");
  const [submittedQuery, setSubmittedQuery] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Handle Search
  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!query.trim()) return;

    setSubmittedQuery(query);
    setQuery(""); 
    setIsEditing(false); 

    setLoading(true);

    try {
      const url = `/api/news?query=${encodeURIComponent(submittedQuery || query)}`;
      const res = await fetch(url);
      const data = await res.json();

      if (res.ok) {
        setNews(data.articles || []);
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

  // Scroll to bottom when new news arrives
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [news, loading]);

  return (
    <>
      <Head>
        <title>Insightly | Chat News</title>
        <meta name="description" content="Fetch news in a chatbot style" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Top Bar */}
      <AppBar
        position="static"
        sx={{
          background: "linear-gradient(90deg, #1e88e5 0%, #3d5afe 100%)",
          boxShadow: 4,
        }}
      >
        <Toolbar sx={{ justifyContent: "center" }}>
          <Typography variant="h5" fontWeight="bold">
            Insightly Chat News
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Main Container */}
      <Container
        maxWidth="md"
        sx={{ py: 4, display: "flex", flexDirection: "column", gap: 4 }}
      >
        {/* Search Bar */}
        <Search query={query} setQuery={setQuery} handleSearch={handleSearch} />

        {/* Chat Area */}
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

          {/* Loading State */}
          {loading && <Loading />}

          {/* Error Message */}
          {error && <ErrorMessage message={error} />}

          {/* News Articles */}
          <NewsCard news={news} />
        </Paper>
      </Container>
    </>
  );
};

export default Home;
