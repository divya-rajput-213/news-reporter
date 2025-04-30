import React from "react";
import { Typography, Button, Box } from "@mui/material";
import { OpenInNew } from "@mui/icons-material";
import { NewsCardProps } from "@/types/types";

const formatDate = (dateStr: string) => {
  try {
    const [rawDate] = dateStr.split(","); // Extract "04/30/2025"
    const date = new Date(rawDate);

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
};

const NewsCard: React.FC<NewsCardProps> = ({ news }) => {
  return (
    <Box>
      {news?.map((article, index) => (
        <Box key={index} sx={{ display: "flex", justifyContent: "flex-start", mb: 2 }}>
          <Box
            sx={{
              bgcolor: "#e0e0e0",
              p: 2,
              borderRadius: "20px 20px 20px 0",
              maxWidth: "70%",
              wordBreak: "break-word",
            }}
          >
            <Typography variant="subtitle1" fontWeight="bold">
              {article.title}
            </Typography>
            <Typography variant="body2">{article.snippet}</Typography>

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1 }}>
              <Button
                variant="outlined"
                size="small"
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                startIcon={<OpenInNew />}
                sx={{
                  fontWeight: 600,
                  textTransform: "capitalize",
                  borderRadius: "20px",
                }}
              >
                View
              </Button>
              <Typography variant="body2" color="text.secondary">
                Published on: {formatDate(article.date)}
              </Typography>
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default NewsCard;
