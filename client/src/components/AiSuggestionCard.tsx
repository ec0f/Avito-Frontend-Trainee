import React from 'react';
import { Button, Paper, Stack, Typography } from '@mui/material';

interface Props {
  title: string;
  text: string;
  onApply: () => void;
  onClose: () => void;
}

const AiSuggestionCard = ({ title, text, onApply, onClose }: Props) => {
  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        width: 270,
        borderRadius: 1,
        border: '1px solid #E5E7EB',
      }}
    >
      <Stack spacing={1.5}>
        <Typography variant="subtitle2" fontWeight={700}>
          {title}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            whiteSpace: 'pre-line',
            color: '#374151',
          }}
        >
          {text}
        </Typography>

        <Stack direction="row" spacing={1}>
          <Button size="small" variant="contained" onClick={onApply}>
            Применить
          </Button>

          <Button size="small" variant="outlined" onClick={onClose}>
            Закрыть
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default AiSuggestionCard;
