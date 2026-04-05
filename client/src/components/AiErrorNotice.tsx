import React from 'react';
import { Button, Paper, Stack, Typography } from '@mui/material';

interface Props {
  message: string;
  onClose: () => void;
}

const AiErrorNotice = ({ message, onClose }: Props) => {
  return (
    <Paper
      elevation={0}
      sx={{
        mt: 1.5,
        p: 2,
        borderRadius: 2,
        backgroundColor: '#FDECEC',
        border: '1px solid #F5C2C2',
      }}
    >
      <Stack spacing={1.5}>
        <Typography
          variant="subtitle2"
          sx={{
            color: '#D32F2F',
            fontWeight: 700,
          }}
        >
          Произошла ошибка при запросе к AI
        </Typography>

        <Typography variant="body2" sx={{ color: '#5F2120' }}>
          {message}
        </Typography>

        <Stack direction="row">
          <Button
            size="small"
            variant="outlined"
            color="error"
            onClick={onClose}
            sx={{ textTransform: 'none' }}
          >
            Закрыть
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default AiErrorNotice;
