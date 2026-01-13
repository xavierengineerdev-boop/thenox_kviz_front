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
  return {
    utm_source: params.get('utm_source') || undefined,
    utm_medium: params.get('utm_medium') || undefined,
    utm_campaign: params.get('utm_campaign') || undefined,
    utm_term: params.get('utm_term') || undefined,
    utm_content: params.get('utm_content') || undefined,
    utm_id: params.get('utm_id') || undefined,
    utm_source_platform: params.get('utm_source_platform') || undefined,
    gclid: params.get('gclid') || undefined,
    fbclid: params.get('fbclid') || undefined,
    msclkid: params.get('msclkid') || undefined,
    ttclid: params.get('ttclid') || undefined,
    yclid: params.get('yclid') || undefined,
    gbraid: params.get('gbraid') || undefined,
    wbraid: params.get('wbraid') || undefined,
    _ga: params.get('_ga') || undefined,
    mc_eid: params.get('mc_eid') || undefined,
  };
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
  return {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    timestamp: new Date().toISOString(),
    realIP,
  };
};

export const logEvent = async (event: string, data?: Record<string, any>): Promise<void> => {
  const analyticsEvent: AnalyticsEvent = {
    event,
    userData: getUserData(),
    utmParams: getUTMParams(),
    pageUrl: window.location.href,
    referrer: document.referrer,
    data,
  };

  console.log('Analytics Event:', analyticsEvent);

  if (localStorage) {
    const events = JSON.parse(localStorage.getItem('analytics_events') || '[]');
    events.push(analyticsEvent);
    localStorage.setItem('analytics_events', JSON.stringify(events));
  }

  try {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    const response = await fetch(`${API_URL}/api/analytics/event`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(analyticsEvent),
    });

    if (!response.ok) {
      console.warn('Failed to send analytics event to server');
    }
  } catch (error) {
    console.error('Error sending analytics event:', error);
  }
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
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    const requestData = {
      lead: formData,
      utmParams: getUTMParams(),
      userData: getUserData(),
    };

    console.log('Sending lead to:', `${API_URL}/api/lead`);
    console.log('Lead data:', requestData);

    const response = await fetch(`${API_URL}/api/lead`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    console.log('Response status:', response.status, response.statusText);

    const responseData = await response.json();

    if (response.ok) {
      console.log('Lead sent successfully', responseData);
      if (!responseData.telegramSent) {
        console.warn('Lead was saved but failed to send to Telegram bot');
      }
    } else {
      console.error('Failed to send lead to server', {
        status: response.status,
        statusText: response.statusText,
        error: responseData,
      });
    }
  } catch (error: any) {
    console.error('Error sending lead:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
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
