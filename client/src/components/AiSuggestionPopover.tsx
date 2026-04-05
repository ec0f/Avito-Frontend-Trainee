import React from 'react';
import { Button, Fade, Paper, Popper, Stack, Typography } from '@mui/material';

interface Props {
  anchorEl: HTMLElement | null;
  open: boolean;
  title: string;
  value: string;
  onApply: () => void;
  onClose: () => void;
}

const AiSuggestionPopover = ({
  anchorEl,
  open,
  title,
  value,
  onApply,
  onClose,
}: Props) => {
  return (
    <Popper
      open={open}
      anchorEl={anchorEl}
      placement="bottom-start"
      transition
      sx={{ zIndex: 1500 }}
    >
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={150}>
          <Paper
            elevation={4}
            sx={{
              mt: 1,
              p: 2,
              width: 300,
              borderRadius: 2,
              border: '1px solid #E5E7EB',
              backgroundColor: '#FFFFFF',
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
                {value}
              </Typography>

              <Stack direction="row" spacing={1}>
                <Button
                  size="small"
                  variant="contained"
                  onClick={onApply}
                  sx={{ textTransform: 'none' }}
                >
                  Применить
                </Button>

                <Button
                  size="small"
                  variant="outlined"
                  onClick={onClose}
                  sx={{ textTransform: 'none' }}
                >
                  Закрыть
                </Button>
              </Stack>
            </Stack>
          </Paper>
        </Fade>
      )}
    </Popper>
  );
};

export default AiSuggestionPopover;
