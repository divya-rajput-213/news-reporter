"use client";
import { useEffect, useState } from "react";
import Head from "next/head";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  TextField,
  Button,
  Grid,
  CircularProgress,
  Alert,
  Box,
  Paper,
} from "@mui/material";

import NewsCard from "../components/NewsCard";
import AiInsights from "../components/AiInsights";
import NewsFilter from "../components/NewsFilter";

export default function Home() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [query, setQuery] = useState("");
  const [aiAnalysis, setAiAnalysis] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const count = 10;

  const handleSearch = async (e: any,type:string) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch(
      `https://gnews.io/api/v4/search?q=${encodeURIComponent(
        type
      )}&token=ed144c499040c0c1260fea06f4b5be79&lang=en&max=${count}`
    );
    const data = await res.json();
    setNews(data.articles || []);
    setLoading(false);
    if (data.error) {
      setError(data.error.message);
    }
  };

  const analyzeArticle = async (article: any) => {
    setAiLoading(true);
    setAiAnalysis("");
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: article.title,
          content: article.description,
          url: article.url,
        }),
      });
      if (!res.ok) throw new Error("AI analysis failed");
      const data = await res.json();
      setAiAnalysis(data.analysis);
    } catch {
      setAiAnalysis(
        "AI insights are unavailable right now. Please try again later."
      );
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    if (aiLoading === false && aiAnalysis) {
      // Scroll to the bottom of the page when the API call is finished
      window.scrollTo(0, document.body.scrollHeight);
    }
  }, [aiLoading, aiAnalysis]);

  return (
    <>
      <Head>
        <title>Insightly | Smart News & AI Analysis</title>
        <meta
          name="description"
          content="Explore trending headlines and let AI explain them."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {(loading || aiLoading) && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            bgcolor: "rgba(255, 255, 255, 0.9)",
            zIndex: 2000, // HIGH z-index to stay above all MUI components
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress size={60} color="primary" />
        </Box>
      )}

      <AppBar
        position="static"
        sx={{
          background: "linear-gradient(90deg, #1e88e5 0%, #3d5afe 100%)", // Slightly updated gradient
          boxShadow: 4,
          padding: "24px 0", // Adjusted padding for better spacing
          borderRadius: "0 0 20px 20px", // Rounded bottom corners
          textAlign: "center",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography
            variant="h3"
            fontWeight={700} // Bold heading
            color="white"
            sx={{ fontSize: "2.2rem", letterSpacing: "1px" }} // Reduced size with letter spacing for elegance
          >
            Insightly
          </Typography>

          <Typography
            variant="h6"
            color="white"
            sx={{
              fontSize: "1.1rem", // Slightly smaller size
              fontWeight: 300, // Lighter weight for the subtitle
              opacity: 0.9,
              letterSpacing: "0.5px", // Light letter spacing for readability
            }}
          >
            Smart news. Smarter insights.
          </Typography>

          {/* Decorative line */}
          <Box
            sx={{
              width: "60px", // Slightly wider line
              height: "3px",
              backgroundColor: "#fff",
              borderRadius: "10px",
              marginTop: 2,
            }}
          />
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Hero Section */}
        <Paper
          elevation={5}
          sx={{
            px: 5,
            py: 6,
            borderRadius: 6,
            mb: 6,
            textAlign: "center",
            background: "#ffffff",
            boxShadow: "0px 12px 24px rgba(0, 0, 0, 0.1)",
            transition: "all 0.3s ease-in-out",
            "&:hover": {
              boxShadow: "0px 20px 40px rgba(0, 0, 0, 0.15)",
            },
          }}
        >
          {/* Title with reduced font size */}
          <Typography
            variant="h5" // Changed to h5 for smaller title
            fontWeight="bold"
            color="primary.main"
            mb={2}
          >
            Explore Top Stories from Around the World
          </Typography>

          {/* Description with reduced font size */}
          <Typography variant="body2" color="text.secondary" mb={4}>
            Use AI to uncover the deeper meaning behind today’s headlines.
          </Typography>

          <Box
            component="form"
            onSubmit={(e)=>handleSearch(e,query)}
            display="flex"
            gap={2} // Reduced the gap
            justifyContent="center"
            alignItems="center"
            sx={{ maxWidth: 800, margin: "0 auto" }}
          >
            <TextField
              variant="outlined"
              label="Search world events or breaking news..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              sx={{
                width: "75%",
                borderRadius: "50px",
                "& .MuiInputBase-root": {
                  borderRadius: "50px",
                },
              }}
            />
            <Button
              variant="contained"
              size="medium" // Changed to medium for a smaller button
              color="primary"
              type="submit"
              sx={{
                px: 3, // Adjusted padding for a smaller button
                py: 1.5,
                borderRadius: "50px",
                fontWeight: 600,
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "scale(1.05)",
                },
              }}
            >
              Search
            </Button>
          </Box>
        </Paper>

        {/* Category Filter */}
        <NewsFilter
        setQuery={setQuery}
        handleSearch={handleSearch}
        />

        {/* News & Insights */}
        {news?.length > 0 && (
          <Grid container spacing={5} mt={4}>
            <Grid item xs={12} md={8}>
              <Typography variant="h4" fontWeight="bold" mb={3}>
                Trending Stories
              </Typography>

              {loading && (
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  height={300}
                >
                  <CircularProgress color="primary" />
                </Box>
              )}

              {error && <Alert severity="error">{error}</Alert>}

              {!loading && !error && news.length === 0 && (
                <Alert severity="info">
                  No news found for your query. Try exploring another topic!
                </Alert>
              )}

              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap", // Ensures that items wrap into the next row when needed
                  justifyContent: "center", // Centers the cards horizontally
                  gap: 4, // Adds space between the cards
                  width: "100%",
                  maxWidth: 1200, // Max width of the grid
                  margin: "auto", // Centers the grid
                }}
              >
                {news.map((article, index) => (
                  <Box
                    key={index}
                    sx={{
                      flex: "1 1 calc(33.33% - 16px)", // 3 items per row on larger screens
                      minWidth: 280, // Minimum width for each card
                      display: "flex",
                      justifyContent: "center", // Centers each card
                    }}
                  >
                    <NewsCard
                      article={article}
                      onAnalyze={() => analyzeArticle(article)}
                    />
                  </Box>
                ))}
              </Box>
            </Grid>

            {/* Insights Panel */}
            {aiAnalysis?.length > 0 && (
              <Grid item xs={12} md={4}>
                <AiInsights analysis={aiAnalysis} />
              </Grid>
            )}
          </Grid>
        )}
      </Container>
    </>
  );
}
