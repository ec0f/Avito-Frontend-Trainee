import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import {
  MenuItem,
  Select,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import { announcementsStore } from '../store';
import { SORT_OPTIONS } from '../utils/consts';
import { LayoutValue, SortValue } from '../store/types';

const CONTROL_HEIGHT = 56;

const SearchBar = observer(() => {
  return (
    <Box>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          backgroundColor: '#FFFFFF',
          color: '#111827',
          borderRadius: 4,
          border: '1px solid #E9EDF3',
          boxShadow: 'none',
        }}
      >
        <Toolbar
          sx={{
            gap: 2,
            alignItems: 'stretch',
            px: 2,
            py: 1.5,
          }}
        >
          <TextField
            fullWidth
            value={announcementsStore.search}
            onChange={(event) => announcementsStore.setSearch(event.target.value)}
            label="Найти объявление..."
            variant="outlined"
            sx={{
              '& .MuiInputBase-root': {
                height: CONTROL_HEIGHT,
                backgroundColor: '#F5F6F8',
              },
            }}
          />

          <ToggleButtonGroup
            exclusive
            value={announcementsStore.layout}
            onChange={(_, value: LayoutValue | null) => {
              if (value) {
                announcementsStore.setLayout(value);
              }
            }}
            sx={{
              height: CONTROL_HEIGHT,
              '& .MuiToggleButton-root': {
                px: 2,
                backgroundColor: '#F5F6F8',
                color: '#4B5563',
                borderColor: '#D1D5DB',
              },
            }}
          >
            <ToggleButton value="grid">Сетка</ToggleButton>
            <ToggleButton value="list">Список</ToggleButton>
          </ToggleButtonGroup>

          <Select
            value={announcementsStore.sort}
            onChange={(event) =>
              announcementsStore.setSort(event.target.value as SortValue)
            }
            sx={{
              minWidth: 220,
              height: CONTROL_HEIGHT,
              backgroundColor: '#F5F6F8',
            }}
          >
            {SORT_OPTIONS.map((option) => (
              <MenuItem value={option.value} key={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </Toolbar>
      </AppBar>
    </Box>
  );
});

export default SearchBar;
