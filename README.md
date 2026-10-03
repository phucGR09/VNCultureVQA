# VNCultureVQA — Project Page

Source code for the project page of **VNCultureVQA: Benchmarking VQA for Vietnamese Cultural Events** (WACV 2027).

VNCultureVQA is a large-scale benchmark for knowledge-grounded Visual Question Answering on Vietnamese cultural
content: 28,655 articles, 107,947 image–article pairs and 691,830 question–answer pairs across six cognitive levels.

## Structure

```
index.html              # the page
static/css/index.css    # theme (red/gold tokens on top of Bulma)
static/js/data.js       # every number shown on the page (tables + charts)
static/js/index.js      # table rendering, Chart.js charts, tabs, carousel, lightbox
static/images/          # figures exported from the paper (WebP)
```

All statistics and results are transcribed from the paper into `static/js/data.js`; edit numbers there, not in the
HTML. Placeholders still to be filled are marked with `TODO` in `index.html`.

## Local preview

```bash
python -m http.server 8000
# open http://localhost:8000
```

## Citation

```bibtex
@inproceedings{TODO,
  title  = {VNCultureVQA: Benchmarking VQA for Vietnamese Cultural Events},
  author = {Phan, Van-Phuc and Pham, Minh-Tan and Le, Trung-Nghia},
  year   = {2027}
}
```

## Website License

Template adapted from [Nerfies](https://github.com/nerfies/nerfies.github.io).

<a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-sa/4.0/88x31.png" /></a><br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/">Creative Commons Attribution-ShareAlike 4.0 International License</a>.
