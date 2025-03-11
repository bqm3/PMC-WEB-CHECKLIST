import React from 'react';
import {
  Dialog,
  DialogContent,
  CircularProgress,
  Typography,
  Stack,
  Paper,
  keyframes,
  Box,
} from '@mui/material';

interface LoadingDialogProps {
  open: boolean;
  message?: string;
  description?: string;
}

export default function LoadingDialog({
  open,
  message = 'Đang tải',
  description = 'Vui lòng chờ trong giây lát',
}: LoadingDialogProps) {
  // Animation cho hiệu ứng bouncing
  const bounce = keyframes`
    0%, 80%, 100% { transform: translateY(0); } 
    40% { transform: translateY(-8px); }
  `;

  const dot = '...';

  return (
    <Dialog
      open={open}
      aria-labelledby="loading-dialog-title"
      PaperProps={{
        component: Paper,
        sx: {
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(8px)',
          borderRadius: 3,
          boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
        },
      }}
    >
      <DialogContent>
        <Stack
          spacing={2}
          alignItems="center"
          justifyContent="center"
          sx={{
            textAlign: 'center',
            minWidth: 280,
            minHeight: 200,
            p: 4,
          }}
        >
          <CircularProgress size={70} thickness={4} />
          <Typography variant="h6" color="text.primary" fontWeight="bold">
            {message}
          </Typography>

          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '2px',
            }}
          >
            {`${description}`}
            {dot.split('').map((char, i) => (
              <Box
                key={i}
                component="span"
                sx={{
                  display: 'inline-block',
                  animation: `${bounce} 1.2s ${i * 0.1}s infinite`,
                  color: 'text.secondary',
                  fontSize: '16px',
                }}
              >
                {char === ' ' ? '\u00A0' : char} {/* Giữ khoảng trắng đúng */}
              </Box>
            ))}
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
