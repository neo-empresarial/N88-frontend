/**
 * Utilitário para gerenciar persistência de dados em localStorage com expiração
 * Todos os dados persistem por 1 dia (24 horas)
 */

const EXPIRATION_TIME_MS = 24 * 60 * 60 * 1000; // 1 dia em milissegundos

interface StorageData<T> {
  data: T;
  expiresAt: number;
}

/**
 * Salva dados em localStorage com timestamp de expiração (1 dia)
 */
export const setWithExpiration = <T,>(key: string, value: T): void => {
  try {
    const storageData: StorageData<T> = {
      data: value,
      expiresAt: Date.now() + EXPIRATION_TIME_MS,
    };
    localStorage.setItem(key, JSON.stringify(storageData));
  } catch (error) {
    console.error(`Erro ao salvar em localStorage (${key}):`, error);
  }
};

/**
 * Recupera dados de localStorage, verificando expiração
 * Retorna null se dados não existem ou expiraram
 */
export const getWithExpiration = <T,>(key: string): T | null => {
  try {
    const item = localStorage.getItem(key);
    if (!item) return null;

    const storageData: StorageData<T> = JSON.parse(item);

    // Verificar se expirou
    if (Date.now() > storageData.expiresAt) {
      localStorage.removeItem(key);
      return null;
    }

    return storageData.data;
  } catch (error) {
    console.error(`Erro ao recuperar de localStorage (${key}):`, error);
    return null;
  }
};

/**
 * Remove dados de localStorage
 */
export const removeFromStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Erro ao remover de localStorage (${key}):`, error);
  }
};

/**
 * Remove múltiplas chaves de localStorage
 */
export const removeMultipleFromStorage = (keys: string[]): void => {
  keys.forEach(key => removeFromStorage(key));
};
