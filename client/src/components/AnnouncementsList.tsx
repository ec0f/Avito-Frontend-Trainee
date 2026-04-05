import React from 'react';
import { Alert, Box, Skeleton, Stack, Typography } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { announcementsStore } from '../store';
import AnnouncementCard from './AnnouncementCard';

const AnnouncementsList = observer(() => {
  if (announcementsStore.error) {
    return (
      <Alert severity="error" sx={{ borderRadius: 3 }}>
        {announcementsStore.error}
      </Alert>
    );
  }

  if (announcementsStore.isLoading) {
    return (
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md:
              announcementsStore.layout === 'grid' ? 'repeat(2, minmax(0, 1fr))' : '1fr',
            xl:
              announcementsStore.layout === 'grid' ? 'repeat(3, minmax(0, 1fr))' : '1fr',
          },
          gap: 3,
        }}
      >
        {Array.from({ length: 6 }).map((_, index) => (
          <Stack
            key={index}
            sx={{
              border: '1px solid #E9EDF3',
              borderRadius: 4,
              overflow: 'hidden',
            }}
          >
            <Skeleton variant="rectangular" height={220} />
            <Stack spacing={2} sx={{ p: 3 }}>
              <Skeleton width={120} height={28} />
              <Skeleton width="90%" height={32} />
              <Skeleton width={160} height={36} />
            </Stack>
          </Stack>
        ))}
      </Box>
    );
  }

  if (!announcementsStore.items.length) {
    return (
      <Stack
        spacing={1}
        alignItems="center"
        justifyContent="center"
        sx={{
          minHeight: 240,
          border: '1px dashed #D0D5DD',
          borderRadius: 4,
          backgroundColor: '#FCFCFD',
        }}
      >
        <Typography variant="h6" fontWeight={700}>
          Ничего не найдено
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Попробуй изменить фильтры или строку поиска
        </Typography>
      </Stack>
    );
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          md: announcementsStore.layout === 'grid' ? 'repeat(2, minmax(0, 1fr))' : '1fr',
          xl: announcementsStore.layout === 'grid' ? 'repeat(3, minmax(0, 1fr))' : '1fr',
        },
        gap: 3,
      }}
    >
      {announcementsStore.items.map((item) => (
        <AnnouncementCard key={item.id} item={item} layout={announcementsStore.layout} />
      ))}
    </Box>
  );
});

export default AnnouncementsList;
