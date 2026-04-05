import React from 'react';
import { Box, Card, CardActionArea, Chip, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AnnouncementListItem } from '../store/types';
import { getAnnouncementItemRoute } from '../utils/consts';

interface Props {
  item: AnnouncementListItem;
  layout: 'grid' | 'list';
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(price);

const getCategoryLabel = (category: AnnouncementListItem['category']) => {
  switch (category) {
    case 'auto':
      return 'Транспорт';
    case 'real_estate':
      return 'Недвижимость';
    case 'electronics':
      return 'Электроника';
    default:
      return category;
  }
};

const getBackground = (category: AnnouncementListItem['category']) => {
  switch (category) {
    case 'auto':
      return 'linear-gradient(135deg, #E8F1FF 0%, #D9E8FF 100%)';
    case 'real_estate':
      return 'linear-gradient(135deg, #FFF0E5 0%, #FFE1CC 100%)';
    case 'electronics':
      return 'linear-gradient(135deg, #EEFCE8 0%, #DCF7D0 100%)';
    default:
      return 'linear-gradient(135deg, #F5F5F5 0%, #EAEAEA 100%)';
  }
};

const AnnouncementCard = ({ item, layout }: Props) => {
  const navigate = useNavigate();

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 4,
        border: '1px solid #E9EDF3',
        overflow: 'hidden',
        height: '100%',
      }}
    >
      <CardActionArea
        onClick={() => navigate(getAnnouncementItemRoute(item.id))}
        sx={{
          display: 'flex',
          flexDirection: layout === 'grid' ? 'column' : 'row',
          alignItems: 'stretch',
          height: '100%',
        }}
      >
        <Box
          sx={{
            width: layout === 'grid' ? '100%' : 220,
            minWidth: layout === 'grid' ? '100%' : 220,
            aspectRatio: layout === 'grid' ? '16 / 10' : '1 / 1',
            background: getBackground(item.category),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            color: '#344054',
          }}
        >
          {getCategoryLabel(item.category)}
        </Box>

        <Stack
          spacing={2}
          sx={{
            p: 2.5,
            width: '100%',
            justifyContent: 'space-between',
          }}
        >
          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
            <Chip
              label={getCategoryLabel(item.category)}
              size="small"
              sx={{
                backgroundColor: '#EEF2F7',
                fontWeight: 600,
              }}
            />

            {item.needsRevision && (
              <Chip
                label="Требует доработок"
                size="small"
                sx={{
                  backgroundColor: '#FFF4E5',
                  color: '#B54708',
                  fontWeight: 700,
                }}
              />
            )}
          </Stack>

          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: '#101828',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              minHeight: 56,
            }}
          >
            {item.title}
          </Typography>

          <Typography variant="h5" sx={{ fontWeight: 800, color: '#111827' }}>
            {formatPrice(item.price)}
          </Typography>
        </Stack>
      </CardActionArea>
    </Card>
  );
};

export default AnnouncementCard;
