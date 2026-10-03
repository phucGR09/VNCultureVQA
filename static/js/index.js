/* VNCultureVQA project page — tables, charts and UI behaviour.
   Data lives in static/js/data.js (window.VNC_DATA). */
(function () {
  'use strict';

  var D = window.VNC_DATA;
  var css = getComputedStyle(document.documentElement);
  var tok = function (name) { return css.getPropertyValue(name).trim(); };

  var C = {
    ink: tok('--ink'), ink2: tok('--ink-2'), muted: tok('--muted'), surface: tok('--surface'),
    red: tok('--red'), single: tok('--single'),
    grid: '#ece6dc', axis: '#d6cec3', other: '#cfc7bd',
    // Categorical slots (validated): one per model, fixed order
    series: [tok('--series-1'), tok('--series-2'), tok('--series-3'), tok('--series-4')],
    // Ordinal red ramp (validated): context levels L1→L3 / difficulty meta-groups
    ord: [tok('--ord-1'), tok('--ord-2'), tok('--ord-3')]
  };

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var fmtInt = function (v) { return v.toLocaleString('en-US'); };
  var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------
     Navbar
     ------------------------------------------------------------------ */
  var burger = $('.navbar-burger');
  var menu = $('#nav-menu');
  if (burger && menu) {
    burger.addEventListener('click', function () {
      var open = !menu.classList.contains('is-active');
      burger.classList.toggle('is-active', open);
      menu.classList.toggle('is-active', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    $$('a.navbar-item', menu).forEach(function (a) {
      a.addEventListener('click', function () {
        burger.classList.remove('is-active');
        menu.classList.remove('is-active');
      });
    });
  }

  // Highlight the nav link of the section in view
  if ('IntersectionObserver' in window) {
    var navLinks = $$('#nav-menu a.navbar-item');
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        navLinks.forEach(function (a) {
          a.classList.toggle('is-active', a.getAttribute('href') === '#' + e.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    navLinks.forEach(function (a) {
      var target = document.getElementById(a.getAttribute('href').slice(1));
      if (target) sectionObserver.observe(target);
    });
  }

  /* ------------------------------------------------------------------
     Count-up stat cards
     ------------------------------------------------------------------ */
  function countUp(el) {
    var target = +el.getAttribute('data-count');
    if (reducedMotion || target < 10) { el.textContent = fmtInt(target); return; }
    var start = null, dur = 1200;
    function frame(ts) {
      if (start === null) start = ts;
      var p = Math.min(1, (ts - start) / dur);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmtInt(Math.round(target * eased));
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  if ('IntersectionObserver' in window) {
    var countObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { countUp(e.target); countObserver.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    $$('.stat-value[data-count]').forEach(function (el) { countObserver.observe(el); });
  }

  /* ------------------------------------------------------------------
     Tables
     ------------------------------------------------------------------ */
  function renderOverallTable() {
    var t = $('#table-overall');
    if (!t) return;
    var fmt = function (v, f) {
      if (f === 'int') return fmtInt(v);
      if (f === '2') return v.toFixed(2);
      return v;
    };
    // Totals keep the paper's precision (e.g. 16.9, 6.41)
    var fmtTotal = function (v, f) { return f === 'int' ? fmtInt(v) : String(v); };
    var html = '<thead><tr><th style="text-align:left">Statistic</th>';
    D.splits.forEach(function (s) { html += '<th class="num">' + s + '</th>'; });
    html += '<th class="num">Total</th></tr></thead><tbody>';
    D.overall.forEach(function (row) {
      html += '<tr><td>' + row.label + '</td>';
      row.values.forEach(function (v) { html += '<td class="num">' + fmt(v, row.fmt) + '</td>'; });
      html += '<td class="num"><strong>' + fmtTotal(row.total, row.fmt) + '</strong></td></tr>';
    });
    t.innerHTML = html + '</tbody>';
  }

  function renderComparisonTable() {
    var t = $('#table-comparison');
    if (!t) return;
    var html = '<thead><tr><th style="text-align:left">Dataset</th><th>Language</th><th>Domain</th>' +
      '<th>Modality</th><th>Knowledge</th><th class="num"># Images</th><th class="num"># QA</th></tr></thead><tbody>';
    D.comparison.forEach(function (r) {
      html += '<tr' + (r.ours ? ' class="ours"' : '') + '><td>' + r.name + '</td><td>' + r.lang + '</td><td>' +
        r.domain + '</td><td>' + r.modality + '</td><td>' + r.knowledge + '</td><td class="num">' +
        fmtInt(r.images) + '</td><td class="num">' + fmtInt(r.qa) + '</td></tr>';
    });
    t.innerHTML = html + '</tbody>';
  }

  function renderModelTable() {
    var t = $('#table-models');
    if (!t) return;
    var html = '<thead><tr>';
    D.modelConfigHeader.forEach(function (h, i) {
      html += '<th' + (i === 0 ? ' style="text-align:left"' : '') + '>' + h + '</th>';
    });
    html += '</tr></thead><tbody>';
    D.modelConfig.forEach(function (row) {
      html += '<tr>';
      row.forEach(function (c, i) {
        html += i === 0 ? '<td class="model-cell">' + c + '</td>' : '<td class="center">' + c + '</td>';
      });
      html += '</tr>';
    });
    t.innerHTML = html + '</tbody>';
  }

  // Best / runner-up per column within a split (lowest wins for latency)
  function rankColumns(split) {
    var rows = [];
    D.models.forEach(function (m) { D.results[split][m].forEach(function (r) { rows.push(r); }); });
    return D.metrics.map(function (metric, ci) {
      var vals = rows.map(function (r) { return r[ci]; });
      var uniq = vals.filter(function (v, i) { return vals.indexOf(v) === i; })
        .sort(function (a, b) { return metric.lowerIsBetter ? a - b : b - a; });
      return { best: uniq[0], second: uniq[1] };
    });
  }

  function renderResultTables() {
    var host = $('#results-tables');
    if (!host) return;
    var html = '';
    D.splits.slice(1).forEach(function (split, si) {
      var ranks = rankColumns(split);
      html += '<div class="tab-pane' + (si === 0 ? ' is-active' : '') + '" id="res-' + split + '">' +
        '<div class="table-wrap"><table class="vn-table">' +
        '<thead><tr class="group-row"><th rowspan="2" style="text-align:left">Model</th><th rowspan="2">Level</th>' +
        '<th colspan="4">N-gram / Lexical</th><th colspan="3">BERTScore</th><th rowspan="2">CIDEr</th>' +
        '<th rowspan="2">Latency (ms)</th></tr><tr>';
      D.metrics.slice(0, 7).forEach(function (m) { html += '<th>' + m.label + '</th>'; });
      html += '</tr></thead><tbody>';
      D.models.forEach(function (model) {
        D.results[split][model].forEach(function (row, li) {
          html += '<tr' + (li === 0 ? ' class="model-start"' : '') + '>';
          if (li === 0) html += '<td class="model-cell" rowspan="3">' + model + '</td>';
          html += '<td class="center"><span class="lvl-pill L' + (li + 1) + '">L' + (li + 1) + '</span></td>';
          row.forEach(function (v, ci) {
            var cls = 'num';
            if (v === ranks[ci].best) cls += ' best';
            else if (v === ranks[ci].second) cls += ' second';
            var txt = D.metrics[ci].key === 'lat' ? v.toLocaleString('en-US', { minimumFractionDigits: 1 }) : v.toFixed(4);
            html += '<td class="' + cls + '">' + txt + '</td>';
          });
          html += '</tr>';
        });
      });
      html += '</tbody></table></div></div>';
    });
    host.innerHTML = html;
  }

  function renderTaxonomy() {
    var host = $('#taxonomy-cards');
    if (!host) return;
    var icons = ['fa-eye', 'fa-link', 'fa-brain'];
    var html = '';
    D.levelGroups.forEach(function (g, gi) {
      var levels = D.levels.filter(function (l) { return l.group === gi; });
      var share = levels.reduce(function (s, l) { return s + l.pct; }, 0);
      html += '<div class="column is-4"><div class="card-plain tax-card g' + gi + '">' +
        '<h4><i class="fas ' + icons[gi] + '" style="color:' + C.ord[gi] + ';margin-right:0.4rem"></i>' + g + '</h4>' +
        '<div class="tax-share">' + share.toFixed(1) + '%<small>of QA pairs</small></div>';
      levels.forEach(function (l) {
        html += '<div class="level-row"><span class="level-id">' + l.id + '</span><span class="level-name">' + l.name +
          '</span><span class="level-pct">' + l.pct.toFixed(1) + '%</span></div>' +
          '<div class="level-bar"><span style="width:' + (l.pct / 35 * 100).toFixed(1) + '%"></span></div>';
      });
      html += '</div></div>';
    });
    host.innerHTML = html;
  }

  function escapeHtml(t) {
    return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; });
  }

  // Hero mosaic: tiles whose file is missing fall back to a placeholder
  function renderGallery() {
    var host = $('#hero-mosaic');
    if (!host || !D.gallery) return;
    host.innerHTML = D.gallery.map(function (g) {
      return '<div class="tile"><img src="' + g.src + '" alt="' + escapeHtml(g.alt) + '" title="' + escapeHtml(g.alt) +
        '" loading="lazy" decoding="async"></div>';
    }).join('');
    $$('img', host).forEach(function (img) {
      img.addEventListener('error', function () {
        var tile = img.parentElement;
        tile.classList.add('is-empty');
        tile.innerHTML = '<i class="far fa-image" aria-hidden="true"></i>';
      });
    });
  }

  function renderExamples() {
    var host = $('#example-grid');
    if (!host || !D.examples) return;
    host.innerHTML = D.examples.map(function (ex) {
      return '<article class="example-card">' +
        '<div class="photo"><img src="' + ex.img + '" alt="' + escapeHtml(ex.alt) + '" loading="lazy"></div>' +
        '<div class="qa">' +
        '<p class="q"><span class="lbl">Q</span>' + escapeHtml(ex.q) + '</p>' +
        '<p><span class="lbl">A</span>' + escapeHtml(ex.a) + '</p>' +
        (ex.pred ? '<p class="pred"><span class="lbl">Model prediction:</span>' + escapeHtml(ex.pred) + '</p>' : '') +
        '</div></article>';
    }).join('');
  }

  renderGallery();
  renderExamples();
  renderOverallTable();
  renderComparisonTable();
  renderModelTable();
  renderResultTables();
  renderTaxonomy();

  /* ------------------------------------------------------------------
     Charts
     ------------------------------------------------------------------ */
  var charts = {};
  var builders = {};

  if (window.Chart) {
    Chart.defaults.font.family = "'Noto Sans', system-ui, sans-serif";
    Chart.defaults.font.size = 12;
    Chart.defaults.color = C.muted;
    Chart.defaults.borderColor = C.grid;
    Chart.defaults.maintainAspectRatio = false;
    Chart.defaults.animation.duration = reducedMotion ? 0 : 600;
    // Legends are HTML (see renderLegend) so they wrap and use text tokens
    Chart.defaults.plugins.legend.display = false;
    Chart.defaults.plugins.tooltip.backgroundColor = C.ink;
    Chart.defaults.plugins.tooltip.titleColor = '#fff';
    Chart.defaults.plugins.tooltip.bodyColor = '#f6ebcd';
    Chart.defaults.plugins.tooltip.padding = 10;
    Chart.defaults.plugins.tooltip.cornerRadius = 8;
    Chart.defaults.plugins.tooltip.boxPadding = 4;
    Chart.defaults.plugins.tooltip.usePointStyle = true;
  }

  // Draws value labels at the end of horizontal bars (opt-in per chart)
  var endLabels = {
    id: 'endLabels',
    afterDatasetsDraw: function (chart, args, opts) {
      if (!opts || !opts.enabled) return;
      var ctx = chart.ctx;
      ctx.save();
      ctx.font = "600 11px 'Noto Sans', system-ui, sans-serif";
      ctx.fillStyle = C.ink2;
      ctx.textBaseline = 'middle';
      chart.data.datasets.forEach(function (ds, di) {
        chart.getDatasetMeta(di).data.forEach(function (bar, i) {
          var v = ds.data[i];
          if (v === null || v === undefined) return;
          ctx.fillText(opts.format(v, i), bar.x + 6, bar.y);
        });
      });
      ctx.restore();
    }
  };

  function renderLegend(id, items, line) {
    var el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = items.map(function (it) {
      return '<span class="item"><span class="sw' + (line ? ' line' : '') + '" style="background:' + it.color +
        '"></span>' + it.label + '</span>';
    }).join('');
  }

  var gridX = function (show) { return { display: show, color: C.grid, drawTicks: false }; };
  var bar = { borderRadius: 4, borderSkipped: 'start', borderWidth: 0 };

  builders['chart-lengths'] = function (el) {
    var q = D.overall[4].values, a = D.overall[5].values;
    renderLegend('legend-lengths', [{ label: 'Avg. question length', color: C.series[0] },
                                    { label: 'Avg. answer length', color: C.series[1] }]);
    return new Chart(el, {
      type: 'bar',
      data: {
        labels: D.splits,
        datasets: [
          Object.assign({ label: 'Avg. question length', data: q, backgroundColor: C.series[0] }, bar),
          Object.assign({ label: 'Avg. answer length', data: a, backgroundColor: C.series[1] }, bar)
        ]
      },
      options: {
        datasets: { bar: { categoryPercentage: 0.6, barPercentage: 0.9 } },
        scales: {
          x: { grid: { display: false }, border: { color: C.axis } },
          y: { beginAtZero: true, grid: gridX(true), border: { display: false }, title: { display: true, text: 'words' } }
        },
        plugins: {
          tooltip: { callbacks: { label: function (i) { return ' ' + i.dataset.label + ': ' + i.parsed.y.toFixed(2) + ' words'; } } }
        }
      }
    });
  };

  function horizontalBar(el, labels, data, colors, fmt, xOpts, padRight) {
    return new Chart(el, {
      type: 'bar',
      data: { labels: labels, datasets: [Object.assign({ data: data, backgroundColor: colors }, bar)] },
      plugins: [endLabels],
      options: {
        indexAxis: 'y',
        layout: { padding: { right: padRight || 56 } },
        datasets: { bar: { categoryPercentage: 0.8, barPercentage: 0.85 } },
        scales: {
          x: Object.assign({ grid: gridX(true), border: { display: false }, ticks: { display: false } }, xOpts || {}),
          y: { grid: { display: false }, border: { color: C.axis }, ticks: { color: C.ink2 } }
        },
        plugins: {
          endLabels: { enabled: true, format: fmt },
          tooltip: { callbacks: { label: function (i) { return ' ' + fmt(i.raw, i.dataIndex); } } }
        }
      }
    });
  }

  builders['chart-sources'] = function (el) {
    return horizontalBar(el,
      D.sources.map(function (s) { return s.name; }),
      D.sources.map(function (s) { return s.images; }),
      C.single,
      function (v, i) { return fmtInt(v) + ' (' + D.sources[i].pct + '%)'; }, null, 96);
  };

  builders['chart-categories'] = function (el) {
    return horizontalBar(el,
      D.categories.map(function (c) { return c.name; }),
      D.categories.map(function (c) { return c.pct; }),
      C.single,
      function (v) { return v.toFixed(1) + '%'; });
  };

  builders['chart-comparison'] = function (el) {
    var rows = D.comparison.slice().sort(function (a, b) { return b.qa - a.qa; });
    return horizontalBar(el,
      rows.map(function (r) { return r.name; }),
      rows.map(function (r) { return r.qa; }),
      rows.map(function (r) { return r.ours ? C.red : C.other; }),
      function (v) { return v >= 1000 ? Math.round(v / 1000) + 'k' : String(v); },
      { type: 'logarithmic', min: 1000, grid: { display: false } });
  };

  function isVisible(el) { return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length); }

  function buildVisibleCharts() {
    if (!window.Chart) return;
    Object.keys(builders).forEach(function (id) {
      if (charts[id]) return;
      var el = document.getElementById(id);
      if (el && isVisible(el)) charts[id] = builders[id](el);
    });
  }

  /* ------------------------------------------------------------------
     Tabs & segmented controls
     ------------------------------------------------------------------ */
  $$('.tabs[data-tabs]').forEach(function (tabs) {
    var links = $$('a[data-tab]', tabs);
    links.forEach(function (a) {
      a.addEventListener('click', function () {
        links.forEach(function (l) {
          l.parentElement.classList.toggle('is-active', l === a);
          var pane = document.getElementById(l.getAttribute('data-tab'));
          if (pane) pane.classList.toggle('is-active', l === a);
        });
        buildVisibleCharts();
      });
    });
  });

  function segmented(group, onChange) {
    if (!group) return;
    var buttons = $$('button', group);
    buttons.forEach(function (b) {
      b.addEventListener('click', function () {
        buttons.forEach(function (x) { x.classList.toggle('is-active', x === b); });
        onChange(b.getAttribute('data-v'));
      });
    });
  }

  // Image swappers (question types)
  $$('.segmented[data-swap]').forEach(function (g) {
    var img = document.getElementById(g.getAttribute('data-swap'));
    var pattern = g.getAttribute('data-pattern');
    segmented(g, function (v) { img.src = pattern.replace('{v}', v); });
  });

  // Word cloud viewer
  var wc = { split: 'train', field: 'question' };
  var splitNames = { train: 'train', test1: 'Test 1', test2: 'Test 2', test3: 'Test 3' };
  function updateWordcloud() {
    var img = $('#wc-img');
    img.src = './static/images/wc_' + wc.split + '_' + wc.field + '.webp';
    img.alt = 'Word cloud of English-translated ' + wc.field + 's in the ' + splitNames[wc.split] + ' split.';
  }
  segmented($('.segmented[data-wc="split"]'), function (v) { wc.split = v; updateWordcloud(); });
  segmented($('.segmented[data-wc="field"]'), function (v) { wc.field = v; updateWordcloud(); });

  buildVisibleCharts();

  /* ------------------------------------------------------------------
     KaTeX
     ------------------------------------------------------------------ */
  if (window.renderMathInElement) {
    renderMathInElement(document.body, {
      delimiters: [{ left: '$$', right: '$$', display: true }, { left: '\\(', right: '\\)', display: false }],
      throwOnError: false
    });
  }

  /* ------------------------------------------------------------------
     Lightbox for figures
     ------------------------------------------------------------------ */
  var lightbox = $('#lightbox');
  var lightImg = lightbox && $('img', lightbox);
  document.addEventListener('click', function (e) {
    var img = e.target.closest && e.target.closest('.paper-figure img, .example-card img, .wc-frame img, .mosaic img');
    if (img && lightbox) {
      lightImg.src = img.currentSrc || img.src;
      lightImg.alt = img.alt;
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
    } else if (lightbox && e.target.closest && e.target.closest('#lightbox')) {
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lightbox) lightbox.classList.remove('is-open');
  });

  /* ------------------------------------------------------------------
     Copy BibTeX
     ------------------------------------------------------------------ */
  $$('.copy-btn[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var text = document.getElementById(btn.getAttribute('data-copy')).textContent;
      var done = function () {
        var old = btn.innerHTML;
        btn.textContent = 'Copied!';
        setTimeout(function () { btn.innerHTML = old; }, 1500);
      };
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(done);
    });
  });
})();
