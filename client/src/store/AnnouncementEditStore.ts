import { makeAutoObservable, reaction, runInAction } from 'mobx';
import { API_URL } from '../utils/consts';
import {
  requestAiDescription,
  requestAiPrice,
  AiSuggestion,
  AiSuggestionKind,
} from '../utils/ai';
import {
  buildEditFormFromAnnouncement,
  buildUpdatePayload,
  createEmptyParams,
  getMissingFieldKeysFromForm,
  getMissingFieldLabelsFromForm,
  readDraft,
  removeDraft,
  writeDraft,
} from './helpers';
import {
  AnnouncementCategory,
  AnnouncementItem,
  EditAnnouncementForm,
  ParamKey,
} from './types';

type AiRequestStatus = 'idle' | 'loading' | 'success' | 'error';

class AnnouncementEditStore {
  editForm: EditAnnouncementForm | null = null;
  currentEditId: number | null = null;
  loadedAnnouncement: AnnouncementItem | null = null;

  isLoading = false;
  isSaving = false;

  error = '';
  saveError = '';

  draftRestored = false;

  activeAiKind: AiSuggestionKind | null = null;
  aiSuggestion: AiSuggestion | null = null;
  aiError = '';

  priceAiStatus: AiRequestStatus = 'idle';
  descriptionAiStatus: AiRequestStatus = 'idle';

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });

    reaction(
      () => (this.currentEditId && this.editForm ? JSON.stringify(this.editForm) : ''),
      () => {
        if (this.currentEditId && this.editForm) {
          writeDraft(this.currentEditId, this.editForm);
        }
      }
    );
  }

  get missingFieldKeys(): string[] {
    if (!this.editForm) {
      return [];
    }

    return getMissingFieldKeysFromForm(this.editForm);
  }

  get missingFieldLabels(): string[] {
    if (!this.editForm) {
      return [];
    }

    return getMissingFieldLabelsFromForm(this.editForm);
  }

  getAiStatus(kind: AiSuggestionKind): AiRequestStatus {
    return kind === 'price' ? this.priceAiStatus : this.descriptionAiStatus;
  }

  setAiStatus(kind: AiSuggestionKind, status: AiRequestStatus) {
    if (kind === 'price') {
      this.priceAiStatus = status;
    } else {
      this.descriptionAiStatus = status;
    }
  }

  async prepare(id: number) {
    this.isLoading = true;
    this.error = '';
    this.saveError = '';
    this.aiError = '';
    this.aiSuggestion = null;
    this.activeAiKind = null;
    this.draftRestored = false;
    this.priceAiStatus = 'idle';
    this.descriptionAiStatus = 'idle';

    try {
      const response = await fetch(`${API_URL}/items/${id}`);

      if (!response.ok) {
        throw new Error('Не удалось загрузить объявление');
      }

      const data = await response.json();

      const draft = readDraft(id);

      runInAction(() => {
        this.currentEditId = id;
        this.loadedAnnouncement = data;
        this.editForm = draft ?? buildEditFormFromAnnouncement(data);
        this.draftRestored = Boolean(draft);
      });
    } catch (error) {
      runInAction(() => {
        this.error =
          error instanceof Error ? error.message : 'Не удалось загрузить объявление';
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  reset() {
    this.editForm = null;
    this.currentEditId = null;
    this.loadedAnnouncement = null;
    this.isLoading = false;
    this.isSaving = false;
    this.error = '';
    this.saveError = '';
    this.draftRestored = false;
    this.activeAiKind = null;
    this.aiSuggestion = null;
    this.aiError = '';
    this.priceAiStatus = 'idle';
    this.descriptionAiStatus = 'idle';
  }

  dismissDraftRestored() {
    this.draftRestored = false;
  }

  setCategory(category: AnnouncementCategory) {
    if (!this.editForm) {
      return;
    }

    this.editForm.category = category;
    this.editForm.params = createEmptyParams(category);
    this.closeAiFeedback();
  }

  setField(field: 'title' | 'price' | 'description', value: string) {
    if (!this.editForm) {
      return;
    }

    this.editForm[field] = value;
  }

  setParam(field: ParamKey, value: string) {
    if (!this.editForm) {
      return;
    }

    this.editForm.params[field] = value;
  }

  async save() {
    if (!this.currentEditId || !this.editForm) {
      return false;
    }

    this.isSaving = true;
    this.saveError = '';

    try {
      if (!this.editForm.title.trim()) {
        throw new Error('Название обязательно');
      }

      if (
        this.editForm.price.trim() === '' ||
        Number.isNaN(Number(this.editForm.price)) ||
        Number(this.editForm.price) < 0
      ) {
        throw new Error('Цена должна быть числом не меньше 0');
      }

      const response = await fetch(`${API_URL}/items/${this.currentEditId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(buildUpdatePayload(this.editForm)),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        const serverMessage =
          errorBody?.error?.errors?.[0]?.message ||
          errorBody?.error ||
          'Не удалось сохранить изменения';

        throw new Error(serverMessage);
      }

      removeDraft(this.currentEditId);
      return true;
    } catch (error) {
      runInAction(() => {
        this.saveError =
          error instanceof Error ? error.message : 'Не удалось сохранить изменения';
      });

      return false;
    } finally {
      runInAction(() => {
        this.isSaving = false;
      });
    }
  }

  removeCurrentDraft() {
    if (!this.currentEditId) {
      return;
    }

    removeDraft(this.currentEditId);
  }

  private buildAiContext() {
    if (!this.editForm) {
      throw new Error('Форма не готова');
    }

    return {
      category: this.editForm.category,
      title: this.editForm.title.trim(),
      price: this.editForm.price.trim() ? Number(this.editForm.price) : null,
      description: this.editForm.description.trim(),
      params: Object.entries(this.editForm.params).reduce<Record<string, string>>(
        (acc, [key, value]) => {
          if (value && String(value).trim() !== '') {
            acc[key] = String(value).trim();
          }
          return acc;
        },
        {}
      ),
      missingFields: this.missingFieldLabels,
    };
  }

  async requestAiSuggestion(kind: AiSuggestionKind) {
    if (!this.editForm) {
      return;
    }

    this.activeAiKind = kind;
    this.aiSuggestion = null;
    this.aiError = '';
    this.setAiStatus(kind, 'loading');

    try {
      const context = this.buildAiContext();

      const suggestion =
        kind === 'price'
          ? await requestAiPrice(context)
          : await requestAiDescription(context);

      runInAction(() => {
        this.aiSuggestion = suggestion;
        this.aiError = '';
        this.setAiStatus(kind, 'success');
      });
    } catch (error) {
      runInAction(() => {
        this.aiSuggestion = null;
        this.aiError =
          error instanceof Error ? error.message : 'Не удалось получить ответ от AI';
        this.setAiStatus(kind, 'error');
      });
    }
  }

  requestAiPriceSuggestion() {
    console.log('[AI] price button clicked');
    return this.requestAiSuggestion('price');
  }

  requestAiDescriptionSuggestion() {
    console.log('[AI] description button clicked');
    return this.requestAiSuggestion('description');
  }

  applyAiSuggestion() {
    if (!this.editForm || !this.aiSuggestion) {
      return;
    }

    if (this.aiSuggestion.kind === 'description') {
      this.editForm.description = String(this.aiSuggestion.applyValue);
    }

    if (this.aiSuggestion.kind === 'price') {
      this.editForm.price = String(this.aiSuggestion.applyValue);
    }

    this.aiSuggestion = null;
  }

  closeAiFeedback() {
    this.aiSuggestion = null;
    this.aiError = '';
  }
}

export default AnnouncementEditStore;
