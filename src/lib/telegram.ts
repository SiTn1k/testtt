interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
  is_premium?: boolean;
  is_bot?: boolean;
  is_fake?: boolean;
  is_scam?: boolean;
}

interface WebAppInitData {
  user?: TelegramUser;
  auth_date: number;
  hash: string;
  start_param?: string;
  [key: string]: unknown;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        initData: string;
        initDataUnsafe: WebAppInitData;
        version: string;
        platform: string;
        colorScheme: 'light' | 'dark';
        themeParams: Record<string, string>;
        isExpanded: boolean;
        viewportHeight: number;
        viewportStableHeight: number;
        isClosingConfirmationEnabled: boolean;
        headerColor: string;
        backgroundColor: string;
        bottomBarColor: string;
        ready: () => void;
        expand: () => void;
        close: () => void;
        onEvent: (eventType: string, callback: () => void) => void;
        offEvent: (eventType: string, callback: () => void) => void;
        sendData: (data: string) => void;
        openLink: (url: string) => void;
        openInvoice: (url: string, callback?: (status: string) => void) => void;
        showPopup: (params: { title?: string; message: string; buttons?: Array<{ id?: string; type?: string; text?: string }> }, callback?: (buttonId: string) => void) => void;
        showAlert: (message: string, callback?: () => void) => void;
        showConfirm: (message: string, callback?: (confirmed: boolean) => void) => void;
        HapticFeedback?: {
          impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
          notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
          selectionChanged: () => void;
        };
        MainButton?: {
          text: string;
          color: string;
          textColor: string;
          isVisible: boolean;
          isActive: boolean;
          isLoading: boolean;
          setText: (text: string) => void;
          onClick: (callback: () => void) => void;
          offClick: (callback: () => void) => void;
          show: () => void;
          hide: () => void;
          enable: () => void;
          disable: () => void;
          showLoader: () => void;
          hideLoader: () => void;
        };
      };
    };
  }
}

export function initTelegram(): void {
  if (window.Telegram?.WebApp) {
    window.Telegram.WebApp.ready();
    window.Telegram.WebApp.expand();

    if (window.Telegram.WebApp.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
    }
  }
}

export function getTelegramUser(): TelegramUser | null {
  if (!window.Telegram?.WebApp) {
    return null;
  }

  const initData = window.Telegram.WebApp.initData;
  const initDataUnsafe = window.Telegram.WebApp.initDataUnsafe;
  const user = initDataUnsafe?.user;

  // Basic integrity: must have initData string and valid user object
  if (!initData || !user) {
    return null;
  }

  // Reject flagged users
  if (user.is_fake || user.is_scam || user.is_bot) {
    console.warn("Telegram user flagged as fake/scam/bot");
    return null;
  }

  // Check auth_date freshness (reject initData older than 24h)
  if (initDataUnsafe.auth_date) {
    const authAge = Date.now() / 1000 - initDataUnsafe.auth_date;
    if (authAge > 86400) {
      console.warn("Telegram initData expired");
      return null;
    }
  }

  return {
    id: user.id,
    first_name: user.first_name || 'Guest',
    last_name: user.last_name,
    username: user.username,
    language_code: user.language_code || 'en',
    photo_url: user.photo_url,
    is_premium: user.is_premium || false,
    is_bot: user.is_bot || false,
    is_fake: user.is_fake || false,
    is_scam: user.is_scam || false
  };
}

export function getTelegramInitData(): string {
  return window.Telegram?.WebApp?.initData || '';
}

export function getStartParam(): string | null {
  // First check Telegram WebApp API
  const startParam = window.Telegram?.WebApp?.initDataUnsafe?.start_param;
  if (startParam) return startParam;

  // Fallback: check URL parameter tgWebAppStartParam (for direct links)
  const urlParams = new URLSearchParams(window.location.search);
  const urlStartParam = urlParams.get('tgWebAppStartParam');
  if (urlStartParam) return urlStartParam;

  return null;
}

export function closeTelegram(): void {
  if (window.Telegram?.WebApp) {
    window.Telegram.WebApp.close();
  }
}

export function openTelegramLink(url: string): void {
  if (window.Telegram?.WebApp) {
    window.Telegram.WebApp.openLink(url);
  }
}

export function showTelegramAlert(message: string): void {
  if (window.Telegram?.WebApp) {
    window.Telegram.WebApp.showAlert(message);
  }
}

export function showTelegramConfirm(message: string, callback: (confirmed: boolean) => void): void {
  if (window.Telegram?.WebApp) {
    window.Telegram.WebApp.showConfirm(message, callback);
  }
}

export function triggerHapticFeedback(type: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft'): void {
  if (window.Telegram?.WebApp?.HapticFeedback) {
    window.Telegram.WebApp.HapticFeedback.impactOccurred(type);
  }
}

export function triggerHapticNotification(type: 'error' | 'success' | 'warning'): void {
  if (window.Telegram?.WebApp?.HapticFeedback) {
    window.Telegram.WebApp.HapticFeedback.notificationOccurred(type);
  }
}

export function triggerHapticSelection(): void {
  if (window.Telegram?.WebApp?.HapticFeedback) {
    window.Telegram.WebApp.HapticFeedback.selectionChanged();
  }
}

export function showMainButton(text: string, callback: () => void): void {
  const btn = window.Telegram?.WebApp?.MainButton;
  if (btn) {
    btn.setText(text);
    btn.onClick(callback);
    btn.show();
  }
}

export function hideMainButton(): void {
  window.Telegram?.WebApp?.MainButton?.hide();
}

export function setMainButtonLoading(loading: boolean): void {
  const btn = window.Telegram?.WebApp?.MainButton;
  if (btn) {
    if (loading) {
      btn.showLoader();
      btn.disable();
    } else {
      btn.hideLoader();
      btn.enable();
    }
  }
}
