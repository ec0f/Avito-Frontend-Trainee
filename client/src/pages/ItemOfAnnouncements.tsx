import React, { useEffect } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { observer } from 'mobx-react-lite';
import { useNavigate, useParams } from 'react-router-dom';
import { announcementViewStore } from '../store';
import { getMissingFieldsForAnnouncement } from '../store/helpers';
import { CATEGORY_LABELS, FIELD_LABELS, getAnnouncementEditRoute } from '../utils/consts';

const formatPrice = (price: number | null) =>
  new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(price ?? 0);

const formatDate = (value: string) =>
  new Date(value).toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  });

const ItemOfAnnouncements = observer(() => {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      void announcementViewStore.fetchAnnouncement(Number(id));
    }

    return () => {
      announcementViewStore.clear();
    };
  }, [id]);

  if (announcementViewStore.isLoading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#F6F8FB',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (announcementViewStore.error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{announcementViewStore.error}</Alert>
      </Container>
    );
  }

  if (!announcementViewStore.selectedAnnouncement) {
    return null;
  }

  const item = announcementViewStore.selectedAnnouncement;
  const missingFields = getMissingFieldsForAnnouncement(item);

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F6F8FB', py: 4 }}>
      <Container maxWidth="lg">
        <Stack spacing={3}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Stack spacing={1.5}>
              <Typography variant="h4" fontWeight={800}>
                {item.title}
              </Typography>

              <Button
                variant="contained"
                startIcon={<EditOutlinedIcon />}
                onClick={() => navigate(getAnnouncementEditRoute(item.id))}
                sx={{
                  textTransform: 'none',
                  borderRadius: 2,
                  width: 'fit-content',
                }}
              >
                Редактировать
              </Button>
            </Stack>

            <Stack alignItems="flex-end" spacing={0.5}>
              <Typography variant="h4" fontWeight={800}>
                {formatPrice(item.price)}
              </Typography>

              <Typography color="text.secondary">
                Опубликовано: {formatDate(item.createdAt)}
              </Typography>

              <Typography color="text.secondary">
                Отредактировано: {formatDate(item.updatedAt)}
              </Typography>
            </Stack>
          </Stack>

          <Divider />

          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={3}
            alignItems="flex-start"
          >
            <Paper
              elevation={0}
              sx={{
                width: 320,
                height: 240,
                borderRadius: 0,
                border: '1px solid #E5E7EB',
                backgroundColor: '#F3F4F6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Typography color="text.secondary">Изображение</Typography>
            </Paper>

            <Stack spacing={3} sx={{ flex: 1, width: '100%' }}>
              {missingFields.length > 0 && (
                <Paper
                  elevation={2}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: '#F6EEDF',
                    maxWidth: 380,
                  }}
                >
                  <Stack spacing={1}>
                    <Typography variant="subtitle2" fontWeight={700}>
                      Требуются доработки
                    </Typography>

                    <Typography variant="body2">
                      У объявления не заполнены поля:
                    </Typography>

                    <Box component="ul" sx={{ m: 0, pl: 2 }}>
                      {missingFields.map((field) => (
                        <li key={field}>
                          <Typography variant="body2">{field}</Typography>
                        </li>
                      ))}
                    </Box>
                  </Stack>
                </Paper>
              )}

              <Stack spacing={1}>
                <Typography variant="h5" fontWeight={700}>
                  Характеристики
                </Typography>

                <Stack spacing={1}>
                  <Stack direction="row" spacing={4}>
                    <Typography color="text.secondary" sx={{ width: 120 }}>
                      Категория
                    </Typography>
                    <Typography>{CATEGORY_LABELS[item.category]}</Typography>
                  </Stack>

                  {Object.entries(item.params ?? {}).map(([key, value]) => (
                    <Stack key={key} direction="row" spacing={4}>
                      <Typography color="text.secondary" sx={{ width: 120 }}>
                        {FIELD_LABELS[key] ?? key}
                      </Typography>
                      <Typography>{String(value)}</Typography>
                    </Stack>
                  ))}
                </Stack>
              </Stack>
            </Stack>
          </Stack>

          <Stack spacing={1}>
            <Typography variant="h5" fontWeight={700}>
              Описание
            </Typography>

            <Typography sx={{ maxWidth: 420 }}>
              {item.description || 'Описание пока не заполнено'}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
            <Chip label={CATEGORY_LABELS[item.category]} />
            {item.needsRevision && (
              <Chip
                label="Требует доработок"
                sx={{
                  backgroundColor: '#FFF4E5',
                  color: '#B54708',
                  fontWeight: 700,
                }}
              />
            )}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
});

export default ItemOfAnnouncements;
