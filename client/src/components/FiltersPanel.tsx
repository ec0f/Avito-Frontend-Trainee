import React from 'react';
import {
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  Paper,
  Stack,
  Switch,
  Typography,
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import { announcementsStore } from '../store';
import { AnnouncementCategory } from '../store/types';
import { CATEGORY_OPTIONS } from '../utils/consts';

const FiltersPanel = observer(() => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 4,
        border: '1px solid #E9EDF3',
      }}
    >
      <Stack spacing={3}>
        <Typography variant="h6" fontWeight={700}>
          Фильтры
        </Typography>

        <Divider />

        <Stack spacing={1.5}>
          <Typography variant="subtitle2" fontWeight={700}>
            Категории
          </Typography>

          <FormGroup>
            {CATEGORY_OPTIONS.map((option) => (
              <FormControlLabel
                key={option.value}
                control={
                  <Checkbox
                    checked={announcementsStore.selectedCategories.includes(option.value)}
                    onChange={() =>
                      announcementsStore.toggleCategory(
                        option.value as AnnouncementCategory
                      )
                    }
                  />
                }
                label={option.label}
              />
            ))}
          </FormGroup>
        </Stack>

        <Divider />

        <FormControlLabel
          control={
            <Switch
              checked={announcementsStore.needsRevisionOnly}
              onChange={(event) =>
                announcementsStore.setNeedsRevisionOnly(event.target.checked)
              }
            />
          }
          label="Только требующие доработки"
        />

        <Button
          variant="outlined"
          onClick={announcementsStore.resetFilters}
          sx={{
            height: 44,
            borderRadius: 3,
            textTransform: 'none',
            fontWeight: 600,
          }}
        >
          Сбросить фильтры
        </Button>
      </Stack>
    </Paper>
  );
});

export default FiltersPanel;
