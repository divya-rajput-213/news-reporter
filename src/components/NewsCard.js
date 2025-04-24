import Image from 'next/image';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Stack,
} from '@mui/material';
import { OpenInNew, AutoAwesome } from '@mui/icons-material';

export default function NewsCard({ article, onAnalyze }) {
  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        overflow: 'hidden',
        boxShadow: 4,
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: 8,
        },
        height: '100%',
        width: '100%', // Make sure card width is 100% of the grid item
      }}
    >
      {/* Image Section */}
      {article.image ? (
        <Box sx={{ position: 'relative', height: 220 }}>
          <Image
            src={article.image}
            alt={article.title}
            fill
            style={{ objectFit: 'cover', borderRadius: '4px' }}
            unoptimized
          />
        </Box>
      ) : (
        <Box
          sx={{
            height: 220,
            backgroundColor: '#f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontStyle: 'italic',
            color: 'text.secondary',
            borderRadius: '4px',
          }}
        >
          No image available
        </Box>
      )}

      {/* Content Section */}
      <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column' }}>
        <Typography
          variant="h6"
          component="h3"
          fontWeight={600}
          gutterBottom
          sx={{
            minHeight: 60,
            color: '#333',
            '&:hover': {
              color: 'primary.main',
              cursor: 'pointer',
            },
          }}
        >
          {article.title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          mb={2}
          sx={{
            fontSize: '0.9rem',
            lineHeight: 1.5,
            color: '#555',
            flex: 1,
          }}
        >
          {article.description?.substring(0, 150)}
          {article.description?.length > 150 ? '...' : ''}
        </Typography>

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mt={2}
        >
          <Typography variant="caption" color="text.secondary">
            {new Date(article.publishedAt).toLocaleDateString()}
          </Typography>

          {/* Buttons Section */}
          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={<AutoAwesome />}
              onClick={onAnalyze}
              sx={{
                fontWeight: 600,
                textTransform: 'capitalize',
                borderRadius: '20px',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.05)',
                },
              }}
            >
              Analyze
            </Button>
            <Button
              variant="outlined"
              size="small"
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              startIcon={<OpenInNew />}
              sx={{
                fontWeight: 600,
                textTransform: 'capitalize',
                borderRadius: '20px',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.05)',
                },
              }}
            >
              Visit
            </Button>
          </Stack>
        </Stack>
      </CardContent>

    </Card>
  );
}
