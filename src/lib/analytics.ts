export const initGoogleAnalytics = (id?: string) => {
  if (!id || typeof window === 'undefined') return;
  if ((window as any).gtag) return;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.appendChild(script);

  const inline = document.createElement('script');
  inline.innerHTML = `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${id}', { send_page_view: false });`;
  document.head.appendChild(inline);
};

export const gaPageview = (path: string) => {
  if (typeof window === 'undefined') return;
  const w = window as any;
  if (typeof w.gtag === 'function') {
    w.gtag('event', 'page_view', { page_path: path });
  }
};

export const initFacebookPixel = (id?: string) => {
  if (!id || typeof window === 'undefined') return;
  const w = window as any;
  if (w.fbq) return;

  const script = document.createElement('script');
  script.innerHTML = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod? n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js'); fbq('init', '${id}'); fbq('consent','grant'); fbq('track', 'PageView');`;
  document.head.appendChild(script);

  const noscript = document.createElement('noscript');
  noscript.innerHTML = `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${id}&ev=PageView&noscript=1"/>`;
  document.body.appendChild(noscript);
};

export const fbPageview = () => {
  if (typeof window === 'undefined') return;
  const w = window as any;
  if (w.fbq) w.fbq('track', 'PageView');
};

export default {};
