/* @ds-bundle: {"format":4,"namespace":"Santosha","components":[{"name":"Button"},{"name":"TextLink"},{"name":"Tag"},{"name":"SiteHeader"},{"name":"Hero"},{"name":"Band"},{"name":"ServiceCard"},{"name":"EventCard"},{"name":"Testimonial"},{"name":"PullQuote"},{"name":"FaqItem"},{"name":"TextField"},{"name":"NewsletterSignup"},{"name":"SiteFooter"}]} */
(function () {
  var React = window.React;
  var h = React.createElement;

  function cx() {
    var out = [];
    for (var i = 0; i < arguments.length; i++) { if (arguments[i]) out.push(arguments[i]); }
    return out.join(' ');
  }
  function omit(obj, keys) {
    var out = {};
    for (var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k) && keys.indexOf(k) === -1) out[k] = obj[k]; }
    return out;
  }
  var uid = 0;
  function useId(prefix) {
    var ref = React.useRef(null);
    if (ref.current === null) { uid += 1; ref.current = (prefix || 'sn') + '-' + uid; }
    return ref.current;
  }

  /* Button: pill-shaped action. variant primary | secondary | citrus | on-band */
  function Button(p) {
    var variant = p.variant || 'primary';
    var cls = cx('sn-btn', 'label', 'sn-btn--' + variant, p.size === 'lg' && 'sn-btn--lg', p.className);
    var rest = omit(p, ['variant', 'size', 'className', 'children', 'href']);
    if (p.href) return h('a', Object.assign({ className: cls, href: p.href }, rest), p.children);
    return h('button', Object.assign({ type: 'button', className: cls }, rest), p.children);
  }

  /* TextLink: "See all services »" style link. Adds the guillemet. */
  function TextLink(p) {
    var rest = omit(p, ['className', 'children', 'tone']);
    return h('a', Object.assign({ className: cx('sn-textlink', 'label', p.tone === 'on-band' && 'sn-textlink--on-band', p.className) }, rest),
      h('span', { className: 'sn-textlink__text' }, p.children),
      h('span', { className: 'sn-textlink__arrow', 'aria-hidden': 'true' }, '»'));
  }

  /* Tag: a word or two of category or status. tone neutral | forest | aubergine | citrus | sprout */
  function Tag(p) {
    return h('span', { className: cx('sn-tag', 'caption', 'sn-tag--' + (p.tone || 'neutral'), p.className) }, p.children);
  }

  /* SiteHeader: logo, primary nav and the booking button; collapses to a menu under 860px. */
  function SiteHeader(p) {
    var open = React.useState(false);
    var isOpen = open[0], setOpen = open[1];
    var menuId = useId('sn-menu');
    var links = p.links || [];
    var navList = h('ul', { className: 'sn-header__links' }, links.map(function (l) {
      return h('li', { key: l.label },
        h('a', { className: cx('sn-header__link', 'label'), href: l.href || '#', 'aria-current': l.current ? 'page' : undefined }, l.label));
    }));
    return h('header', { className: cx('sn-header', p.className) },
      h('div', { className: 'sn-header__bar' },
        h('a', { className: 'sn-header__brand', href: p.homeHref || '/' },
          h('img', { src: p.logoSrc, alt: p.logoAlt || 'Santosha plant-based nutrition', className: 'sn-header__logo' })),
        h('nav', { className: 'sn-header__nav', 'aria-label': 'Main' }, navList),
        h('div', { className: 'sn-header__actions' },
          p.cta ? h(Button, { href: p.cta.href, variant: 'primary', className: cx('sn-header__cta', p.cta.shortLabel && 'sn-header__cta--has-short'), 'aria-label': p.cta.shortLabel ? p.cta.label : undefined },
            h('span', { className: 'sn-header__cta-full' }, p.cta.label),
            p.cta.shortLabel ? h('span', { className: 'sn-header__cta-short' }, p.cta.shortLabel) : null) : null,
          h('button', { type: 'button', className: cx('sn-header__toggle', 'label'), 'aria-expanded': isOpen ? 'true' : 'false', 'aria-controls': menuId, onClick: function () { setOpen(!isOpen); } }, isOpen ? 'Close' : 'Menu'))),
      h('div', { id: menuId, className: 'sn-header__panel', hidden: !isOpen },
        h('nav', { 'aria-label': 'Main' }, navList)));
  }

  /* Hero: page opener. layout split (text beside photo) | overlay (text on a scrimmed photo). */
  function Hero(p) {
    var layout = p.layout || 'split';
    var text = h('div', { className: 'sn-hero__text' },
      p.eyebrow ? h('p', { className: cx('sn-hero__eyebrow', 'eyebrow') }, p.eyebrow) : null,
      h(p.titleAs || 'h1', { className: cx('sn-hero__title', p.titleStyle || 'display-xl') }, p.title),
      p.lead ? h('p', { className: cx('sn-hero__lead', 'lead') }, p.lead) : null,
      (p.actions || p.children) ? h('div', { className: 'sn-hero__actions' }, p.actions || p.children) : null);
    var vref = React.useRef(null);
    var reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    var ps = React.useState(reduce);
    var paused = ps[0], setPaused = ps[1];
    React.useEffect(function () {
      var v = vref.current;
      if (!v) return;
      v.muted = true;
      if (!reduce) { var pr = v.play(); if (pr && pr.catch) pr.catch(function () { setPaused(true); }); }
    }, [p.video]);
    function togglePause() {
      var v = vref.current;
      if (!v) return;
      if (v.paused) { v.play(); setPaused(false); } else { v.pause(); setPaused(true); }
    }
    var img = p.video
      ? h('video', { ref: vref, className: 'sn-hero__img', src: p.video, poster: p.videoPoster || p.image, muted: true, loop: true, playsInline: true, autoPlay: !reduce, preload: 'auto', 'aria-hidden': 'true', tabIndex: -1 })
      : (p.image ? h('img', { className: 'sn-hero__img', src: p.image, alt: p.imageAlt || '' }) : null);
    var pause = p.video ? h('button', { key: 'p', type: 'button', className: cx('sn-hero__pause', 'label'), onClick: togglePause,
      'aria-label': paused ? 'Play background video' : 'Pause background video' }, paused ? 'Play' : 'Pause') : null;
    return h('section', { className: cx('sn-hero', 'sn-hero--' + layout, p.video && 'sn-hero--video', layout === 'overlay' && 'sn-onband', p.className),
        'aria-label': p.video && p.videoLabel ? p.videoLabel : undefined },
      layout === 'overlay'
        ? [img && h('div', { key: 'm', className: 'sn-hero__media' }, img), h('div', { key: 'i', className: 'sn-hero__inner' }, text),
           p.credit ? h('p', { key: 'c', className: cx('sn-hero__credit', 'caption') }, p.credit) : null, pause]
        : [h('div', { key: 'i', className: 'sn-hero__inner' }, text),
           h('figure', { key: 'm', className: 'sn-hero__media' }, img, p.credit ? h('figcaption', { className: 'caption' }, p.credit) : null, pause)]);
  }

  /* Band: a full-width section in a brand color. tone forest | aubergine | sunk */
  function Band(p) {
    var tone = p.tone || 'forest';
    var onBand = tone === 'forest' || tone === 'aubergine';
    return h('section', { className: cx('sn-band', 'sn-band--' + tone, onBand && 'sn-onband', p.className) },
      h('div', { className: 'sn-band__inner' },
        h('div', { className: 'sn-band__head' },
          p.eyebrow ? h('p', { className: 'eyebrow sn-band__eyebrow' }, p.eyebrow) : null,
          h(p.titleAs || 'h2', { className: 'display sn-band__title' }, p.title)),
        h('div', { className: 'sn-band__body' },
          h('div', { className: 'body sn-band__copy' }, p.children),
          p.actions ? h('div', { className: 'sn-band__actions' }, p.actions) : null)));
  }

  /* ServiceCard: one bookable service with its price. */
  function ServiceCard(p) {
    return h('article', { className: cx('sn-card', 'sn-service', p.className) },
      p.image ? h('img', { className: 'sn-card__img', src: p.image, alt: p.imageAlt || '' }) : null,
      h('div', { className: 'sn-card__body' },
        p.tags && p.tags.length ? h('div', { className: 'sn-card__tags' }, p.tags.map(function (t) {
          return typeof t === 'string' ? h(Tag, { key: t }, t) : h(Tag, { key: t.label, tone: t.tone }, t.label);
        })) : null,
        h(p.titleAs || 'h3', { className: 'heading-2 sn-card__title' }, p.title),
        h('p', { className: cx('sn-service__price', !p.price && 'sn-service__price--inquire') },
          p.price ? h('span', { className: 'price' }, p.price) : (p.note ? h('span', { className: 'price' }, p.note) : null),
          p.price ? (p.note ? h('span', { className: 'body-sm sn-service__note' }, p.note) : null)
                  : h('span', { className: 'body-sm sn-service__note' }, 'Inquire for pricing')),
        h('div', { className: 'body-sm sn-card__desc' }, p.children),
        p.href ? h('div', { className: 'sn-card__foot' }, h(TextLink, { href: p.href }, p.ctaLabel || 'Book this')) : null));
  }

  /* EventCard: a dated event with venue and status. */
  function EventCard(p) {
    var status = p.status;
    return h('article', { className: cx('sn-card', 'sn-event', status === 'past' && 'sn-event--past', p.className) },
      h('div', { className: 'sn-event__date', 'aria-hidden': 'true' },
        h('span', { className: 'eyebrow sn-event__month' }, p.month),
        h('span', { className: 'heading-1 sn-event__day' }, p.day),
        p.weekday ? h('span', { className: 'caption sn-event__weekday' }, p.weekday) : null),
      h('div', { className: 'sn-event__body' },
        h('p', { className: 'sn-visually-hidden' }, [p.weekday, p.month, p.day].filter(Boolean).join(' ')),
        h(p.titleAs || 'h3', { className: 'heading-2 sn-event__title' },
          p.href ? h('a', { href: p.href, className: 'sn-event__link' }, p.title) : p.title),
        h('p', { className: 'body-sm sn-event__meta' }, [p.time, p.venue].filter(Boolean).join(' · ')),
        (p.tags && p.tags.length) || status ? h('div', { className: 'sn-card__tags' },
          status === 'presale' ? h(Tag, { tone: 'citrus' }, 'Pre-sale') : null,
          status === 'soldout' ? h(Tag, { tone: 'neutral' }, 'Sold out') : null,
          status === 'past' ? h(Tag, { tone: 'neutral' }, 'Past event') : null,
          (p.tags || []).map(function (t) { return typeof t === 'string' ? h(Tag, { key: t, tone: 'aubergine' }, t) : h(Tag, { key: t.label, tone: t.tone }, t.label); })) : null));
  }

  /* Testimonial: a client's words with their name. */
  function Testimonial(p) {
    return h('figure', { className: cx('sn-testimonial', p.className) },
      h('blockquote', { className: cx('sn-testimonial__quote', p.featured ? 'quote' : 'body') }, p.children),
      h('figcaption', { className: 'sn-testimonial__cite' },
        h('span', { className: 'label' }, '— ' + p.name),
        p.org ? h('span', { className: 'caption sn-testimonial__org' }, p.org) : null));
  }

  /* PullQuote: a large quotation from a person or source. */
  function PullQuote(p) {
    return h('figure', { className: cx('sn-pullquote', p.className) },
      h('blockquote', { className: 'quote sn-pullquote__text' }, p.children),
      h('figcaption', { className: 'sn-pullquote__cite' },
        h('span', { className: 'label' }, '— ' + p.cite),
        p.source ? h('span', { className: 'caption sn-pullquote__source' }, p.source) : null));
  }

  /* FaqItem: one question that opens to its answer. */
  function FaqItem(p) {
    return h('details', { className: cx('sn-faq', p.className), open: p.defaultOpen || undefined },
      h('summary', { className: 'sn-faq__q' },
        h('span', { className: 'heading-3' }, p.question),
        h('span', { className: 'sn-faq__icon', 'aria-hidden': 'true' })),
      h('div', { className: 'body sn-faq__a' }, p.children));
  }

  /* TextField: labelled input or textarea with hint and error. */
  function TextField(p) {
    var autoId = useId('sn-field');
    var id = p.id || autoId;
    var hintId = id + '-hint', errId = id + '-error';
    var describedBy = [p.hint ? hintId : null, p.error ? errId : null].filter(Boolean).join(' ') || undefined;
    var rest = omit(p, ['id', 'label', 'hint', 'error', 'multiline', 'className', 'optional']);
    var control = h(p.multiline ? 'textarea' : 'input', Object.assign({
      id: id, className: cx('sn-field__control', 'body'), 'aria-invalid': p.error ? 'true' : undefined, 'aria-describedby': describedBy,
      rows: p.multiline ? (p.rows || 5) : undefined, type: p.multiline ? undefined : (p.type || 'text')
    }, rest));
    return h('div', { className: cx('sn-field', p.error && 'sn-field--error', p.className) },
      h('label', { htmlFor: id, className: 'label sn-field__label' }, p.label, p.optional ? h('span', { className: 'caption sn-field__optional' }, ' (optional)') : null),
      p.hint ? h('p', { id: hintId, className: 'body-sm sn-field__hint' }, p.hint) : null,
      control,
      p.error ? h('p', { id: errId, className: 'body-sm sn-field__error' }, h('strong', null, 'Error: '), p.error) : null);
  }

  /* NewsletterSignup: email sign-up panel with its success message. */
  function NewsletterSignup(p) {
    var st = React.useState(p.initialState || 'idle');
    var state = st[0], setState = st[1];
    var em = React.useState('');
    var email = em[0], setEmail = em[1];
    var fieldId = useId('sn-news');
    function submit(e) {
      e.preventDefault();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setState('error'); return; }
      setState('success');
      if (p.onSubscribe) p.onSubscribe(email);
    }
    var title = p.title || 'Get the newsletter';
    var description = p.description || 'Stay up to date with news, event pre-sales and plant-based tips!';
    if (state === 'success') {
      return h('section', { className: cx('sn-news', 'sn-news--done', p.className), 'aria-live': 'polite' },
        h('p', { className: 'heading-2 sn-news__done' }, p.successMessage || 'Yay plants! Thank you for subscribing!'));
    }
    return h('section', { className: cx('sn-news', p.className) },
      h('div', { className: 'sn-news__head' },
        h('h2', { className: 'heading-2 sn-news__title' }, title),
        h('p', { className: 'body sn-news__desc' }, description)),
      h('form', { className: 'sn-news__form', onSubmit: submit, noValidate: true },
        h(TextField, { id: fieldId, label: 'Email address', type: 'email', autoComplete: 'email', value: email,
          onChange: function (e) { setEmail(e.target.value); if (state === 'error') setState('idle'); },
          error: state === 'error' ? 'Enter an email address like name@example.com.' : null }),
        h(Button, { type: 'submit', variant: 'primary', className: 'sn-news__btn' }, p.buttonLabel || 'Sign up')),
      h('p', { className: 'caption sn-news__fine' }, p.privacyNote || 'We respect your privacy.'));
  }

  /* SiteFooter: the forest band that closes every page. */
  function SiteFooter(p) {
    var cols = p.columns || [];
    return h('footer', { className: cx('sn-footer', 'sn-onband', p.className) },
      h('div', { className: 'sn-footer__inner' },
        h('div', { className: 'sn-footer__brand' },
          p.markSrc ? h('img', { src: p.markSrc, alt: '', className: 'sn-footer__mark' }) : null,
          h('p', { className: 'tagline sn-footer__tag' }, p.tagline || 'Find your santosha…'),
          p.location ? h('p', { className: 'body-sm sn-footer__loc' }, p.location) : null),
        cols.map(function (c) {
          return h('nav', { key: c.title, className: 'sn-footer__col', 'aria-label': c.title },
            h('h3', { className: 'heading-3 sn-footer__title' }, c.title),
            h('ul', { className: 'sn-footer__list' }, c.links.map(function (l) {
              return h('li', { key: l.label }, h('a', { className: 'body-sm sn-footer__link', href: l.href || '#' }, l.label));
            })));
        })),
      p.legal ? h('div', { className: 'sn-footer__legal' }, h('p', { className: 'caption' }, p.legal)) : null);
  }

  var api = { Button: Button, TextLink: TextLink, Tag: Tag, SiteHeader: SiteHeader, Hero: Hero, Band: Band, ServiceCard: ServiceCard,
    EventCard: EventCard, Testimonial: Testimonial, PullQuote: PullQuote, FaqItem: FaqItem, TextField: TextField,
    NewsletterSignup: NewsletterSignup, SiteFooter: SiteFooter };
  window.Santosha = window.Santosha || {};
  Object.assign(window.Santosha, api);
})();
