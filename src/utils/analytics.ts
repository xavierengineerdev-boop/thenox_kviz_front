export interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  utm_id?: string;
  utm_source_platform?: string;
  gclid?: string;
  fbclid?: string;
  msclkid?: string;
  ttclid?: string;
  yclid?: string;
  gbraid?: string;
  wbraid?: string;
  _ga?: string;
  mc_eid?: string;
}

export interface UserData {
  userAgent: string;
  language: string;
  platform: string;
  screenWidth: number;
  screenHeight: number;
  timezone: string;
  timestamp: string;
  realIP?: string;
}

export interface AnalyticsEvent {
  event: string;
  userData: UserData;
  utmParams: UTMParams;
  pageUrl: string;
  referrer: string;
  data?: Record<string, any>;
}

export const getUTMParams = (): UTMParams => {
  const params = new URLSearchParams(window.location.search);
  const result: UTMParams = {};
  
  const utm_source = params.get('utm_source');
  if (utm_source) result.utm_source = utm_source;
  
  const utm_medium = params.get('utm_medium');
  if (utm_medium) result.utm_medium = utm_medium;
  
  const utm_campaign = params.get('utm_campaign');
  if (utm_campaign) result.utm_campaign = utm_campaign;
  
  const utm_term = params.get('utm_term');
  if (utm_term) result.utm_term = utm_term;
  
  const utm_content = params.get('utm_content');
  if (utm_content) result.utm_content = utm_content;
  
  const utm_id = params.get('utm_id');
  if (utm_id) result.utm_id = utm_id;
  
  const utm_source_platform = params.get('utm_source_platform');
  if (utm_source_platform) result.utm_source_platform = utm_source_platform;
  
  const gclid = params.get('gclid');
  if (gclid) result.gclid = gclid;
  
  const fbclid = params.get('fbclid');
  if (fbclid) result.fbclid = fbclid;
  
  const msclkid = params.get('msclkid');
  if (msclkid) result.msclkid = msclkid;
  
  const ttclid = params.get('ttclid');
  if (ttclid) result.ttclid = ttclid;
  
  const yclid = params.get('yclid');
  if (yclid) result.yclid = yclid;
  
  const gbraid = params.get('gbraid');
  if (gbraid) result.gbraid = gbraid;
  
  const wbraid = params.get('wbraid');
  if (wbraid) result.wbraid = wbraid;
  
  const _ga = params.get('_ga');
  if (_ga) result._ga = _ga;
  
  const mc_eid = params.get('mc_eid');
  if (mc_eid) result.mc_eid = mc_eid;
  
  return result;
};

let realIP: string | undefined;

// Fetch real IP asynchronously
(async () => {
  try {
    const ipResponse = await fetch('https://api.ipify.org?format=json');
    if (ipResponse.ok) {
      const ipData = await ipResponse.json();
      realIP = ipData.ip;
    }
  } catch (error) {
    console.warn('Failed to fetch real IP:', error);
  }
})();

export const getUserData = (): UserData => {
  const result: UserData = {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    timestamp: new Date().toISOString(),
  };
  
  if (realIP) {
    result.realIP = realIP;
  }
  
  return result;
};

export const logEvent = async (event: string, data?: Record<string, any>): Promise<void> => {
  const analyticsEvent: AnalyticsEvent = {
    event,
    userData: getUserData(),
    utmParams: getUTMParams(),
    pageUrl: window.location.href,
    referrer: document.referrer,
  };
  
  if (data) {
    analyticsEvent.data = data;
  }

  // Сохраняем события только в localStorage, без отправки на сервер
  if (localStorage) {
    const events = JSON.parse(localStorage.getItem('analytics_events') || '[]');
    events.push(analyticsEvent);
    localStorage.setItem('analytics_events', JSON.stringify(events));
  }

  // Отправка на сервер отключена, чтобы избежать ошибок 404
  // Если нужно включить, раскомментируйте код ниже
  /*
  try {
    const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:3001');
    const response = await fetch(`${API_URL}/api/analytics/event`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(analyticsEvent),
    });

    if (!response.ok) {
      // Тихий режим - не логируем ошибки
    }
  } catch (error) {
    // Тихий режим - не логируем ошибки
  }
  */
};

export const logPageView = (): void => {
  logEvent('page_view');
};

export const logQuizStart = (): void => {
  logEvent('quiz_start');
};

export const logQuizStep = (step: number, data?: Record<string, any>): void => {
  logEvent('quiz_step', { step, ...data });
};

export const logQuizComplete = async (formData: Record<string, any>): Promise<void> => {
  await logEvent('quiz_complete', formData);

  try {
    // В продакшене используем относительный путь, в разработке - полный URL
    const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:3001');
    const requestData = {
      lead: formData,
      utmParams: getUTMParams(),
      userData: getUserData(),
    };

    const response = await fetch(`${API_URL}/api/lead`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    // Проверяем тип контента перед парсингом JSON
    const contentType = response.headers.get('content-type');
    let responseData: any;
    
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      // Если ответ не JSON, читаем как текст для диагностики (но не используем)
      await response.text();
      // Тихий режим - не показываем ошибки пользователю, только логируем
      console.warn('Server returned non-JSON response for lead:', {
        status: response.status,
        statusText: response.statusText,
        contentType,
      });
      return; // Выходим без ошибки
    }

    if (response.ok) {
      console.log('Lead sent successfully');
      if (!responseData.telegramSent) {
        console.warn('Lead was saved but failed to send to Telegram bot');
      }
    } else {
      // Тихий режим - не показываем ошибки пользователю
      console.warn('Failed to send lead to server', {
        status: response.status,
        statusText: response.statusText,
      });
    }
  } catch (error: any) {
    // Тихий режим - не показываем ошибки пользователю
    // Логи сохраняются в localStorage, можно отправить позже
    console.warn('Error sending lead (silent mode)');
  }
};

export const getAnalyticsData = (): AnalyticsEvent[] => {
  if (localStorage) {
    return JSON.parse(localStorage.getItem('analytics_events') || '[]');
  }
  return [];
};

export const clearAnalyticsData = (): void => {
  if (localStorage) {
    localStorage.removeItem('analytics_events');
  }
};
