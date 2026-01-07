(function() {
  'use strict';

  const AI_SOURCES = {
    'chatgpt.com': 'ChatGPT',
    'chat.openai.com': 'ChatGPT',
    'claude.ai': 'Claude',
    'perplexity.ai': 'Perplexity',
    'gemini.google.com': 'Gemini',
    'bard.google.com': 'Bard',
    'copilot.microsoft.com': 'Copilot',
    'you.com': 'You.com',
    'phind.com': 'Phind',
    'character.ai': 'Character.AI',
    'poe.com': 'Poe',
    'searchgpt.com': 'SearchGPT'
  };

  let config = {
    endpoint: null,
    siteId: null,
    sessionId: null,
    distinctId: null,
    superProperties: {}
  };

  function detectAISource() {
    const referrer = document.referrer;
    if (!referrer) return null;

    try {
      const referrerUrl = new URL(referrer);
      const hostname = referrerUrl.hostname.toLowerCase();

      for (const [domain, source] of Object.entries(AI_SOURCES)) {
        if (hostname === domain || hostname.endsWith('.' + domain)) {
          return {
            source,
            domain: hostname,
            url: referrer
          };
        }
      }
    } catch (e) {
      console.debug('AISource: Invalid referrer URL');
    }

    return null;
  }

  function getDefaultProperties() {
    const ua = navigator.userAgent;
    let deviceType = 'Desktop';
    let browser = 'Unknown';
    let os = 'Unknown';

    if (/Mobile|Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
      deviceType = 'Mobile';
    } else if (/Tablet|iPad/i.test(ua)) {
      deviceType = 'Tablet';
    }

    if (/Chrome/i.test(ua)) browser = 'Chrome';
    else if (/Firefox/i.test(ua)) browser = 'Firefox';
    else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browser = 'Safari';
    else if (/Edge/i.test(ua)) browser = 'Edge';

    if (/Windows/i.test(ua)) os = 'Windows';
    else if (/Mac/i.test(ua)) os = 'macOS';
    else if (/Linux/i.test(ua)) os = 'Linux';
    else if (/Android/i.test(ua)) os = 'Android';
    else if (/iOS/i.test(ua)) os = 'iOS';

    return {
      $device_type: deviceType,
      $browser: browser,
      $os: os,
      $screen_width: screen.width,
      $screen_height: screen.height,
      $viewport_width: window.innerWidth,
      $viewport_height: window.innerHeight,
      $language: navigator.language,
      $timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      $user_agent: ua,
      $current_url: window.location.href,
      $host: window.location.hostname,
      $pathname: window.location.pathname,
      $search: window.location.search
    };
  }

  function generateId() {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  function getStoredValue(key) {
    try {
      return sessionStorage.getItem(`aisource_${key}`) || localStorage.getItem(`aisource_${key}`);
    } catch (e) {
      return null;
    }
  }

  function setStoredValue(key, value, persistent = false) {
    try {
      const storage = persistent ? localStorage : sessionStorage;
      storage.setItem(`aisource_${key}`, value);
    } catch (e) {
      console.debug('AISource: Could not store value');
    }
  }

  function sendEvent(eventName, properties = {}) {
    if (!config.siteId || !config.endpoint) {
      console.warn('AISource: Not initialized');
      return;
    }

    const payload = {
      event: eventName,
      properties: {
        ...config.superProperties,
        ...getDefaultProperties(),
        ...properties,
        time: Date.now(),
        $insert_id: generateId(),
        token: config.siteId
      },
      distinct_id: config.distinctId,
      session_id: config.sessionId
    };

    const request = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      keepalive: true
    };

    if (navigator.sendBeacon && eventName === 'Page Left') {
      navigator.sendBeacon(config.endpoint, JSON.stringify(payload));
    } else {
      fetch(config.endpoint, request).catch(e =>
        console.debug('AISource: Event failed', e)
      );
    }
  }

  function init() {
    const script = document.currentScript || document.querySelector('script[data-site]');
    config.siteId = script ? script.getAttribute('data-site') : null;
    config.endpoint = script?.getAttribute('data-endpoint') || 'https://aisource.vercel.app/api/track';

    if (!config.siteId) {
      console.warn('AISource: data-site attribute required');
      return;
    }

    config.sessionId = getStoredValue('session_id');
    if (!config.sessionId) {
      config.sessionId = generateId();
      setStoredValue('session_id', config.sessionId);
    }

    config.distinctId = getStoredValue('distinct_id');
    if (!config.distinctId) {
      config.distinctId = generateId();
      setStoredValue('distinct_id', config.distinctId, true);
    }

    const aiSource = detectAISource();
    const startTime = Date.now();
    let engaged = false;

    config.superProperties = {
      $ai_source: aiSource?.source || null,
      $ai_domain: aiSource?.domain || null,
      $ai_referrer: aiSource?.url || null,
      $referrer: document.referrer || '$direct',
      $referring_domain: document.referrer ? new URL(document.referrer).hostname : '$direct'
    };

    sendEvent('Page Viewed', {
      $title: document.title
    });

    const trackEngagement = () => {
      if (!engaged) {
        engaged = true;
        sendEvent('Page Engaged', {
          $title: document.title,
          time_to_engage: Date.now() - startTime
        });
      }
    };

    ['scroll', 'click', 'keydown', 'mousemove', 'touchstart'].forEach(event => {
      document.addEventListener(event, trackEngagement, { once: true, passive: true });
    });

    window.addEventListener('beforeunload', () => {
      const timeOnPage = Date.now() - startTime;
      sendEvent('Page Left', {
        $title: document.title,
        time_on_page: timeOnPage,
        engaged: engaged
      });
    });

    setInterval(() => {
      if (engaged && document.visibilityState === 'visible') {
        sendEvent('Page Heartbeat', {
          $title: document.title,
          time_on_page: Date.now() - startTime
        });
      }
    }, 30000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.aisource = {
    track: function(eventName, properties = {}) {
      sendEvent(eventName, properties);
    },

    identify: function(distinctId, properties = {}) {
      if (distinctId) {
        config.distinctId = distinctId;
        setStoredValue('distinct_id', distinctId, true);
      }

      if (Object.keys(properties).length > 0) {
        sendEvent('$identify', { $set: properties });
      }
    },

    register: function(properties) {
      Object.assign(config.superProperties, properties);
    },

    reset: function() {
      try {
        ['distinct_id', 'session_id'].forEach(key => {
          localStorage.removeItem(`aisource_${key}`);
          sessionStorage.removeItem(`aisource_${key}`);
        });
      } catch (e) {}

      config.distinctId = generateId();
      config.sessionId = generateId();
      config.superProperties = {};
      setStoredValue('distinct_id', config.distinctId, true);
      setStoredValue('session_id', config.sessionId);
    }
  };
})();