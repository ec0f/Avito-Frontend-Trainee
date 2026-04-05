import React from 'react';
import { Box, Button, Pagination, Stack, Typography } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { announcementsStore } from '../store';
import { PAGE_SIZE } from '../utils/consts';

const AnnouncementsPagination = observer(() => {
  if (!announcementsStore.total) {
    return null;
  }

  const start = (announcementsStore.page - 1) * PAGE_SIZE + 1;
  const end = Math.min(announcementsStore.page * PAGE_SIZE, announcementsStore.total);

  return (
    <Box
      sx={{
        mt: 4,
        p: 2.5,
        border: '1px solid #E9EDF3',
        borderRadius: 4,
        backgroundColor: '#FFFFFF',
      }}
    >
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={2}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', md: 'center' }}
      >
        <Typography variant="body2" color="text.secondary">
          Показано {start}–{end} из {announcementsStore.total}
        </Typography>

        <Stack direction="row" spacing={1.5} alignItems="center">
          <Button
            variant="outlined"
            disabled={announcementsStore.page === 1}
            onClick={() => announcementsStore.setPage(announcementsStore.page - 1)}
            sx={{
              height: 40,
              borderRadius: 3,
              textTransform: 'none',
            }}
          >
            Назад
          </Button>

          <Pagination
            count={announcementsStore.totalPages}
            page={announcementsStore.page}
            onChange={(_, page) => announcementsStore.setPage(page)}
            shape="rounded"
            siblingCount={0}
            boundaryCount={1}
          />

          <Button
            variant="outlined"
            disabled={announcementsStore.page === announcementsStore.totalPages}
            onClick={() => announcementsStore.setPage(announcementsStore.page + 1)}
            sx={{
              height: 40,
              borderRadius: 3,
              textTransform: 'none',
            }}
          >
            Вперёд
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
});

export default AnnouncementsPagination;
