import React from 'react';
import { Box, Chip, Container, Stack, Typography } from '@mui/material';
import { observer } from 'mobx-react-lite';
import SearchBar from '../components/SearchBar';
import FiltersPanel from '../components/FiltersPanel';
import AnnouncementsList from '../components/AnnouncementsList';
import AnnouncementsPagination from '../components/AnnouncementsPagination';
import { announcementsStore } from '../store';

const Announcements = observer(() => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#F6F8FB',
        py: 4,
      }}
    >
      <Container maxWidth="xl">
        <Stack spacing={3}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#101828' }}>
              Мои объявления
            </Typography>

            <Chip
              label={announcementsStore.total}
              sx={{
                backgroundColor: '#EEF2F7',
                fontWeight: 700,
              }}
            />
          </Stack>

          <SearchBar />

          <Stack
            direction={{ xs: 'column', lg: 'row' }}
            spacing={3}
            alignItems="flex-start"
          >
            <Box sx={{ width: { xs: '100%', lg: 320 }, flexShrink: 0 }}>
              <FiltersPanel />
            </Box>

            <Stack spacing={3} sx={{ flex: 1, width: '100%' }}>
              <AnnouncementsList />
              <AnnouncementsPagination />
            </Stack>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
});

export default Announcements;
