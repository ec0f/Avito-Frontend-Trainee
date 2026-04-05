import React, { useEffect, useMemo, useRef } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  MenuItem,
  Paper,
  Select,
  Stack,
  SxProps,
  TextField,
  Theme,
  Typography,
} from '@mui/material';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import { observer } from 'mobx-react-lite';
import { useNavigate, useParams } from 'react-router-dom';
import AiSuggestionPopover from '../components/AiSuggestionPopover';
import AiErrorNotice from '../components/AiErrorNotice';
import { announcementEditStore } from '../store';
import { AnnouncementCategory, ParamKey } from '../store/types';
import {
  CATEGORY_FIELD_CONFIG,
  CATEGORY_OPTIONS,
  FIELD_OPTIONS,
  getAnnouncementItemRoute,
} from '../utils/consts';

const getWarningFieldSx = (isWarning: boolean): SxProps<Theme> => {
  if (!isWarning) {
    return {};
  }

  return {
    '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
      borderColor: '#F5A623',
    },
    '& .MuiInputLabel-root': {
      color: '#F5A623',
    },
  };
};

const getOptionsKey = (category: AnnouncementCategory, fieldName: string): string => {
  if (fieldName !== 'type') {
    return fieldName;
  }

  if (category === 'electronics') {
    return 'type_electronics';
  }

  if (category === 'real_estate') {
    return 'type_real_estate';
  }

  return 'type';
};

const EditAnnouncement = observer(() => {
  const { id } = useParams();
  const navigate = useNavigate();

  const priceButtonRef = useRef<HTMLButtonElement | null>(null);
  const descriptionButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (id) {
      void announcementEditStore.prepare(Number(id));
    }

    return () => {
      announcementEditStore.reset();
    };
  }, [id]);

  if (announcementEditStore.isLoading) {
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

  if (announcementEditStore.error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{announcementEditStore.error}</Alert>
      </Container>
    );
  }

  const form = announcementEditStore.editForm;

  if (!form || !id) {
    return null;
  }

  const categoryFields = CATEGORY_FIELD_CONFIG[form.category];

  const handleCancel = () => {
    navigate(getAnnouncementItemRoute(id));
  };

  const handleSave = async () => {
    const saved = await announcementEditStore.save();

    if (saved) {
      navigate(getAnnouncementItemRoute(id));
    }
  };

  const priceStatus = announcementEditStore.getAiStatus('price');
  const descriptionStatus = announcementEditStore.getAiStatus('description');

  const priceButtonText =
    priceStatus === 'loading'
      ? 'Выполняется запрос'
      : priceStatus === 'success' || priceStatus === 'error'
        ? 'Повторить запрос'
        : 'Узнать рыночную цену';

  const descriptionButtonText =
    descriptionStatus === 'loading'
      ? 'Выполняется запрос'
      : descriptionStatus === 'success' || descriptionStatus === 'error'
        ? 'Повторить запрос'
        : form.description.trim()
          ? 'Улучшить описание'
          : 'Придумать описание';

  const activeAnchor =
    announcementEditStore.activeAiKind === 'price'
      ? priceButtonRef.current
      : announcementEditStore.activeAiKind === 'description'
        ? descriptionButtonRef.current
        : null;

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F6F8FB', py: 4 }}>
      <Container maxWidth="lg">
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 4,
            border: '1px solid #E5E7EB',
          }}
        >
          <Stack spacing={3}>
            <Typography variant="h4" fontWeight={800}>
              Редактирование объявления
            </Typography>

            {announcementEditStore.draftRestored && (
              <Alert severity="info" onClose={announcementEditStore.dismissDraftRestored}>
                Восстановлен черновик из localStorage
              </Alert>
            )}

            {announcementEditStore.saveError && (
              <Alert severity="error">{announcementEditStore.saveError}</Alert>
            )}

            {announcementEditStore.missingFieldLabels.length > 0 && (
              <Alert severity="warning" sx={{ alignItems: 'flex-start' }}>
                <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                  Требуются доработки
                </Typography>

                <Typography variant="body2">
                  У объявления не заполнены поля:{' '}
                  {announcementEditStore.missingFieldLabels.join(', ')}
                </Typography>
              </Alert>
            )}

            <Stack spacing={1} sx={{ maxWidth: 380 }}>
              <Typography variant="subtitle1" fontWeight={700}>
                Категория
              </Typography>

              <Select
                value={form.category}
                onChange={(event) =>
                  announcementEditStore.setCategory(
                    event.target.value as AnnouncementCategory
                  )
                }
                size="small"
              >
                {CATEGORY_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </Stack>

            <Divider />

            <Stack spacing={2}>
              <TextField
                label="* Название"
                value={form.title}
                onChange={(event) =>
                  announcementEditStore.setField('title', event.target.value)
                }
                fullWidth
                sx={{
                  maxWidth: 380,
                  ...getWarningFieldSx(
                    announcementEditStore.missingFieldKeys.includes('title')
                  ),
                }}
              />
            </Stack>

            <Divider />

            <Stack spacing={1.5}>
              <Stack
                direction={{ xs: 'column', md: 'row' }}
                alignItems={{ xs: 'flex-start', md: 'center' }}
                spacing={2}
              >
                <TextField
                  label="* Цена"
                  value={form.price}
                  onChange={(event) =>
                    announcementEditStore.setField(
                      'price',
                      event.target.value.replace(/[^\d]/g, '')
                    )
                  }
                  fullWidth
                  sx={{
                    maxWidth: 380,
                    ...getWarningFieldSx(
                      announcementEditStore.missingFieldKeys.includes('price')
                    ),
                  }}
                />

                <Button
                  ref={priceButtonRef}
                  variant="outlined"
                  color="warning"
                  onClick={() => void announcementEditStore.requestAiPriceSuggestion()}
                  disabled={priceStatus === 'loading'}
                  startIcon={
                    priceStatus === 'loading' ? (
                      <CircularProgress size={16} color="inherit" />
                    ) : (
                      <LightbulbOutlinedIcon />
                    )
                  }
                  sx={{
                    textTransform: 'none',
                    borderRadius: 3,
                  }}
                >
                  {priceButtonText}
                </Button>
              </Stack>

              {announcementEditStore.activeAiKind === 'price' &&
                !announcementEditStore.aiSuggestion &&
                announcementEditStore.aiError && (
                  <AiErrorNotice
                    message={announcementEditStore.aiError}
                    onClose={announcementEditStore.closeAiFeedback}
                  />
                )}
            </Stack>

            <Divider />

            <Stack spacing={2}>
              <Typography variant="h6" fontWeight={700}>
                Характеристики
              </Typography>

              {categoryFields.map((field) => {
                const isWarning = announcementEditStore.missingFieldKeys.includes(
                  field.name
                );
                const fieldValue = String(form.params[field.name as ParamKey] ?? '');
                const optionsKey = getOptionsKey(form.category, field.name);

                if (field.kind === 'select') {
                  return (
                    <Stack key={field.name} spacing={1} sx={{ maxWidth: 380 }}>
                      <Typography variant="body1">{field.label}</Typography>

                      <Select
                        value={fieldValue}
                        onChange={(event) =>
                          announcementEditStore.setParam(
                            field.name as ParamKey,
                            String(event.target.value)
                          )
                        }
                        size="small"
                        displayEmpty
                        sx={getWarningFieldSx(isWarning)}
                      >
                        <MenuItem value="">
                          <span style={{ color: '#9CA3AF' }}>{field.label}</span>
                        </MenuItem>

                        {(FIELD_OPTIONS[optionsKey] ?? []).map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </Stack>
                  );
                }

                return (
                  <TextField
                    key={field.name}
                    label={field.label}
                    value={fieldValue}
                    onChange={(event) =>
                      announcementEditStore.setParam(
                        field.name as ParamKey,
                        event.target.value
                      )
                    }
                    fullWidth
                    sx={{
                      maxWidth: 380,
                      ...getWarningFieldSx(isWarning),
                    }}
                  />
                );
              })}
            </Stack>

            <Divider />

            <Stack spacing={1.5}>
              <Typography variant="h6" fontWeight={700}>
                Описание
              </Typography>

              <TextField
                value={form.description}
                onChange={(event) =>
                  announcementEditStore.setField('description', event.target.value)
                }
                multiline
                minRows={4}
                fullWidth
                inputProps={{ maxLength: 1000 }}
                sx={getWarningFieldSx(
                  announcementEditStore.missingFieldKeys.includes('description')
                )}
              />

              <Stack
                direction={{ xs: 'column', md: 'row' }}
                justifyContent="space-between"
                alignItems={{ xs: 'flex-start', md: 'center' }}
                spacing={2}
              >
                <Button
                  ref={descriptionButtonRef}
                  variant="outlined"
                  color="warning"
                  onClick={() =>
                    void announcementEditStore.requestAiDescriptionSuggestion()
                  }
                  disabled={descriptionStatus === 'loading'}
                  startIcon={
                    descriptionStatus === 'loading' ? (
                      <CircularProgress size={16} color="inherit" />
                    ) : (
                      <LightbulbOutlinedIcon />
                    )
                  }
                  sx={{
                    textTransform: 'none',
                    borderRadius: 3,
                  }}
                >
                  {descriptionButtonText}
                </Button>

                <Typography variant="body2" color="text.secondary">
                  {form.description.length} / 1000
                </Typography>
              </Stack>

              {announcementEditStore.activeAiKind === 'description' &&
                !announcementEditStore.aiSuggestion &&
                announcementEditStore.aiError && (
                  <AiErrorNotice
                    message={announcementEditStore.aiError}
                    onClose={announcementEditStore.closeAiFeedback}
                  />
                )}
            </Stack>

            <Stack direction="row" spacing={1.5}>
              <Button
                variant="contained"
                onClick={() => void handleSave()}
                disabled={announcementEditStore.isSaving}
                sx={{
                  textTransform: 'none',
                  borderRadius: 3,
                  minWidth: 120,
                }}
              >
                Сохранить
              </Button>

              <Button
                variant="contained"
                color="inherit"
                onClick={handleCancel}
                sx={{
                  textTransform: 'none',
                  borderRadius: 3,
                  minWidth: 120,
                }}
              >
                Отменить
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Container>

      <AiSuggestionPopover
        anchorEl={activeAnchor}
        open={Boolean(announcementEditStore.aiSuggestion)}
        title={announcementEditStore.aiSuggestion?.title ?? 'Ответ AI:'}
        value={String(announcementEditStore.aiSuggestion?.applyValue ?? '')}
        onApply={announcementEditStore.applyAiSuggestion}
        onClose={announcementEditStore.closeAiFeedback}
      />
    </Box>
  );
});

export default EditAnnouncement;
