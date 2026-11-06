// Messaging between the simulated home and the GreenHome app.
// Always uses BroadcastChannel (same browser, works offline). If config.js has
// Supabase keys it also uses Supabase Realtime, so the pages can run on different devices.
window.connectDemo = (onMessage, onStatus) => {
  const me = Math.random().toString(36).slice(2), seen = new Set();
  const receive = m => {
    if (!m || m.from === me || seen.has(m.id)) return;
    seen.add(m.id);
    onMessage(m);
  };

  const bc = new BroadcastChannel('greenhome-demo');
  bc.onmessage = e => receive(e.data);
  let remote = null;
  queueMicrotask(() => onStatus('local'));

  const cfg = window.GREENHOME_SUPABASE;
  if (cfg && cfg.url && cfg.key) {
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.109.0/dist/umd/supabase.js';
    s.onload = () => {
      const ch = supabase.createClient(cfg.url, cfg.key).channel('greenhome-demo');
      ch.on('broadcast', {event: 'msg'}, m => receive(m.payload));
      ch.subscribe(status => {
        remote = status === 'SUBSCRIBED' ? ch : null;
        onStatus(remote ? 'supabase' : 'local');
      });
    };
    document.head.append(s);
  }

  return msg => {
    const m = {...msg, id: me + Math.random().toString(36).slice(2), from: me};
    bc.postMessage(m);
    if (remote) remote.send({type: 'broadcast', event: 'msg', payload: m});
  };
};
