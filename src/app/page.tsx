"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Head from "next/head";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  TextField,
  Button,
  CircularProgress,
  Box,
  Paper,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CancelIcon from "@mui/icons-material/Close";
import NewsCard from "../components/NewsCard";


interface Article {
  title: string;
  description: string;
  link: string;
  date: string; // Assuming 'publishedAt' is available
}

export default function Home() {
  const [news, setNews] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [query, setQuery] = useState(""); // typing field
  const [submittedQuery, setSubmittedQuery] = useState(""); // after submit
  const [isEditing, setIsEditing] = useState(false); // ✨ edit mode

  const chatContainerRef = useRef<HTMLDivElement>(null);

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!query.trim()) return;

    setSubmittedQuery(query); // Save what user typed
    setQuery(""); // ✨ Clear the search input field after search
    setIsEditing(false); // Exit edit mode if searching new

    setLoading(true);

    const url = `/api/news?query=${encodeURIComponent(
      submittedQuery || query
    )}`;
    const res = await fetch(url);
    const data = await res.json();

    setNews(data.articles || []);
    setLoading(false);

    if (data.error) {
      setError(data.error.message);
    }
  };

  useEffect(() => {
    // Scroll to bottom when new news arrives
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
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
        {/* Search Form */}
        <Box component="form" onSubmit={handleSearch} display="flex" gap={2}>
          <TextField
            variant="outlined"
            label="Ask for latest news..."
            fullWidth
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button type="submit" variant="contained" sx={{ px: 4 }}>
            Search
          </Button>
        </Box>

        {/* Chat Area */}
        <Paper
          ref={chatContainerRef}
          id="chat-container"
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
          {/* User Query */}
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
                {!isEditing && (
                  <IconButton
                    size="small"
                    sx={{ color: "white" }}
                    onClick={() => {
                      setQuery(submittedQuery); // Load the text back into the input field
                      setIsEditing(true); // Set edit mode to true
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                )}
                {isEditing && (
                  <IconButton
                    size="small"
                    sx={{ color: "white" }}
                    onClick={() => {
                      setQuery(""); // Clear the query field
                      setIsEditing(false); // Exit edit mode
                    }}
                  >
                    <CancelIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
            </Box>
          )}

          {/* Loading State */}
          {loading && (
            <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
              <Box
                sx={{
                  bgcolor: "#e0e0e0",
                  p: 2,
                  borderRadius: "20px 20px 20px 0",
                  maxWidth: "60%",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Thinking...
                </Typography>
                <CircularProgress size={20} sx={{ mt: 1 }} />
              </Box>
            </Box>
          )}

          {/* Error Message */}
          {error && (
            <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
              <Box
                sx={{
                  bgcolor: "#ffcdd2",
                  p: 2,
                  borderRadius: "20px 20px 20px 0",
                  maxWidth: "70%",
                  wordBreak: "break-word",
                }}
              >
                <Typography variant="body2" color="error">
                  {error}
                </Typography>
              </Box>
            </Box>
          )}

          {/* News Articles */}
          
           <NewsCard news={news}/>
        
        </Paper>
      </Container>
    </>
  );
}
