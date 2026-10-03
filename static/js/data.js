// All numbers shown on the page, transcribed from the WACV 2027 paper.
// Tables and charts are rendered from this object so values live in one place.
window.VNC_DATA = {

  // Hero mosaic (30 tiles). Real photos are cropped from the paper figures; the
  // remaining slots load static/images/gallery/NN.webp and show a placeholder tile
  // until that file exists. TODO: add dataset photos as gallery/01.webp … 30.webp.
  gallery: (function () {
    var real = {
      0:  { src: "./static/images/samples/songco.webp",     alt: "Sán Chỉ artists performing Sóong Cọ singing" },
      4:  { src: "./static/images/samples/phuocbien.webp",  alt: "Khmer Phước Biển festival in Sóc Trăng" },
      8:  { src: "./static/images/samples/quanho.webp",     alt: "Quan họ singing in a traditional house in Hà Nội" },
      12: { src: "./static/images/samples/thuongtieu.webp", alt: "Thượng Tiêu ceremonial pole at the start of spring" },
      16: { src: "./static/images/samples/quangtri.webp",   alt: "Visitors at the Quảng Trị Citadel" },
      20: { src: "./static/images/samples/gate.webp",       alt: "Traditional gate of a historic relic" },
      24: { src: "./static/images/samples/longdoison.webp", alt: "Long Đọi Sơn pagoda" },
      28: { src: "./static/images/samples/hoian.webp",      alt: "Welcoming ceremony in Hội An" }
    };
    var out = [];
    for (var i = 0; i < 30; i++) {
      out.push(real[i] || { src: "./static/images/gallery/" + String(i + 1).padStart(2, "0") + ".webp", alt: "" });
    }
    return out;
  })(),

  // Dataset samples (3 × 2 grid). Q/A transcribed from the paper figures.
  // TODO: category / level tags; higher-resolution photos for the last two.
  examples: [
    { img: "./static/images/samples/songco.webp", alt: "Sán Chỉ artists performing Sóong Cọ singing on stage",
      q: "Những người đang biểu diễn trong bức ảnh là ai?",
      a: "Những nghệ sĩ người Sán Chỉ đang biểu diễn điệu hát Sóong Cọ." },
    { img: "./static/images/samples/phuocbien.webp", alt: "Khmer community gathered at a pagoda for the Phước Biển festival",
      q: "Ý nghĩa của lễ hội Phước Biển đối với đồng bào Khmer Sóc Trăng là gì?",
      a: "Lễ hội nhằm tạ ơn biển cả đã cho con người nguồn hải sản quý giá và cầu nguyện cho người đi biển được bình yên." },
    { img: "./static/images/samples/thuongtieu.webp", alt: "Thượng Tiêu ceremonial pole raised in front of an imperial building",
      q: "Cột nêu trong hình có ý nghĩa biểu tượng gì?",
      a: "Cột nêu là biểu tượng cho nghi lễ Thượng Tiêu – dấu mốc mở đầu mùa xuân, mang ý nghĩa cầu an, xua đuổi điều không may và chúc phúc cho năm mới." },
    { img: "./static/images/samples/quanho.webp", alt: "Quan họ singers seated in a traditional wooden house",
      q: "Bối cảnh kiến trúc trong ảnh gợi nhớ đến không gian văn hóa nào của Việt Nam?",
      a: "Không gian kiến trúc cổ kính với cột gỗ chạm trổ, tranh treo và bàn thờ, thể hiện không gian văn hóa Quan họ truyền thống." },
    { img: "./static/images/samples/hoian.webp", alt: "Officials greeting a visitor under umbrellas in Hội An",
      q: "Thời tiết trong ảnh có gì đặc biệt và ảnh hưởng đến buổi lễ đón khách như thế nào?",
      a: "Thời tiết mưa liên tục, nhưng chính quyền Hội An vẫn tổ chức đón tiếp nồng hậu, khiến du khách hào hứng và thích thú.",
      pred: "Thời tiết liên tục đổ mưa, nhưng chính quyền TP Hội An vẫn tổ chức đón tiếp nồng hậu." },
    { img: "./static/images/samples/longdoison.webp", alt: "Red-tiled roof and wooden columns of Long Đọi Sơn pagoda",
      q: "Kiến trúc đặc trưng nào của Chùa Long Đọi Sơn được thể hiện rõ nhất qua hình ảnh?",
      a: "Kiến trúc mái ngói đỏ, cột gỗ vững chãi và bậc thềm rộng.",
      pred: "Đền thờ được xây dựng theo kiến trúc truyền thống, với mái ngói đỏ rực rỡ và cột gỗ lớn." }
  ],

  // Table: Overall statistics (sec/dataset_statistics.tex, tab:overall_stats)
  splits: ["Train", "Test 1", "Test 2", "Test 3"],
  overall: [
    { label: "Images",                       values: [53972, 21589, 21589, 10797],  total: 107947, fmt: "int" },
    { label: "QA pairs",                     values: [338987, 140156, 142005, 70682], total: 691830, fmt: "int" },
    { label: "News articles",                values: [14331, 5733, 5733, 2858],    total: 28655,  fmt: "int" },
    { label: "Avg. QA pairs / image",        values: [6.28, 6.49, 6.58, 6.55],     total: 6.41,   fmt: "2" },
    { label: "Avg. question length (words)", values: [16.50, 16.49, 17.34, 18.62], total: 16.9,   fmt: "2" },
    { label: "Avg. answer length (words)",   values: [30.31, 30.23, 35.68, 42.27], total: 32.6,   fmt: "2" },
    { label: "Split ratio (images)",         values: ["50.0%", "20.0%", "20.0%", "10.0%"], total: "100%", fmt: "str" }
  ],

  // Table: Source distribution (tab:source_distribution)
  sources: [
    { name: "plo.vn",             images: 36905, pct: 34.2 },
    { name: "baovanhoa.vn",       images: 31427, pct: 29.2 },
    { name: "nld.com.vn",         images: 16630, pct: 15.4 },
    { name: "tienphong.vn",       images: 11782, pct: 10.9 },
    { name: "nhandan.vn",         images: 8118,  pct: 7.5 },
    { name: "vanhoanghethuat.vn", images: 2779,  pct: 2.6 },
    { name: "vietnam.vn",         images: 84,    pct: 0.1 },
    { name: "maivang.nld.com.vn", images: 74,    pct: 0.1 }
  ],

  // Image semantic categories (text + fig/image_category_distribution.png)
  categories: [
    { name: "Events / Ceremonies", pct: 43.2 },
    { name: "Traditional Arts",    pct: 20.2 },
    { name: "Culture",             pct: 13.5 },
    { name: "Society",             pct: 10.0 },
    { name: "Locations",           pct: 5.5 },
    { name: "People",              pct: 4.0 },
    { name: "Architecture",        pct: 1.5 },
    { name: "Food & Cuisine",      pct: 1.1 },
    { name: "Objects",             pct: 0.9 },
    { name: "Others",              pct: 0.1 }
  ],

  // Six-level cognitive taxonomy (sec/dataset_statistics.tex)
  levels: [
    { id: "L1", name: "Object Recognition",          pct: 3.4,  group: 0 },
    { id: "L2", name: "Spatial & Action",            pct: 4.8,  group: 0 },
    { id: "L3", name: "Named Entity Grounding",      pct: 28.9, group: 1 },
    { id: "L4", name: "Detailed Attribute Inference", pct: 25.7, group: 1 },
    { id: "L5", name: "Contextual Reasoning",        pct: 32.7, group: 2 },
    { id: "L6", name: "Global Synthesis",            pct: 4.7,  group: 2 }
  ],
  levelGroups: ["Visual-Only Perception", "Multimodal Integration", "High-level Reasoning"],

  // Results (sec/experiments.tex, tab:results_test1..3)
  // Column order: EM, Token F1, BLEU, METEOR, BERT-P, BERT-R, BERT-F1, CIDEr, Latency (ms)
  metrics: [
    { key: "em",     label: "EM",       group: "N-gram / Lexical" },
    { key: "f1",     label: "F1",       group: "N-gram / Lexical", long: "Token F1" },
    { key: "bleu",   label: "BLEU",     group: "N-gram / Lexical", long: "BLEU-4" },
    { key: "meteor", label: "METEOR",   group: "N-gram / Lexical" },
    { key: "bp",     label: "P",        group: "BERTScore", long: "BERTScore P" },
    { key: "br",     label: "R",        group: "BERTScore", long: "BERTScore R" },
    { key: "bf1",    label: "F1",       group: "BERTScore", long: "BERTScore F1" },
    { key: "cider",  label: "CIDEr",    group: "CIDEr" },
    { key: "lat",    label: "Latency (ms)", group: "Latency", lowerIsBetter: true }
  ],
  models: ["Vintern-1B-v3.5", "InternVL3-8B", "Gemma3-VL-12B-it", "Qwen2.5-VL-7B-Instruct"],
  results: {
    "Test 1": {
      "Vintern-1B-v3.5":        [[0.0007, 0.2714, 0.1109, 0.2372, 0.8690, 0.8606, 0.8644, 0.3988, 3864.9],
                                 [0.0006, 0.3249, 0.1228, 0.3352, 0.8681, 0.8792, 0.8732, 0.4460, 3043.1],
                                 [0.0058, 0.2822, 0.1064, 0.2304, 0.8745, 0.8585, 0.8662, 0.5681, 994.9]],
      "InternVL3-8B":           [[0.0014, 0.2713, 0.1053, 0.2314, 0.8681, 0.8561, 0.8617, 0.3934, 5788.4],
                                 [0.0174, 0.3721, 0.1869, 0.3592, 0.8778, 0.8740, 0.8754, 0.7329, 11540.5],
                                 [0.0122, 0.3296, 0.1346, 0.2767, 0.8840, 0.8659, 0.8746, 0.7585, 1505.5]],
      "Gemma3-VL-12B-it":       [[0.0014, 0.2747, 0.0973, 0.2311, 0.8608, 0.8602, 0.8603, 0.4195, 9614.3],
                                 [0.0000, 0.3160, 0.1450, 0.2893, 0.8645, 0.8680, 0.8660, 0.6624, 8678.1],
                                 [0.0000, 0.3260, 0.1541, 0.2868, 0.8588, 0.8670, 0.8626, 0.7104, 2014.9]],
      "Qwen2.5-VL-7B-Instruct": [[0.0014, 0.3327, 0.1415, 0.3109, 0.8747, 0.8738, 0.8740, 0.4655, 1397.9],
                                 [0.0000, 0.3533, 0.1526, 0.3775, 0.8659, 0.8856, 0.8753, 0.3850, 1720.1],
                                 [0.0000, 0.3715, 0.1849, 0.3446, 0.8801, 0.8801, 0.8798, 0.7792, 374.6]]
    },
    "Test 2": {
      "Vintern-1B-v3.5":        [[0.0000, 0.2971, 0.1140, 0.2463, 0.8767, 0.8613, 0.8687, 0.3880, 4360.8],
                                 [0.0000, 0.3313, 0.1293, 0.3199, 0.8726, 0.8788, 0.8753, 0.4645, 11263.2],
                                 [0.0027, 0.2776, 0.0880, 0.2111, 0.8767, 0.8517, 0.8638, 0.3364, 982.7]],
      "InternVL3-8B":           [[0.0014, 0.2963, 0.1137, 0.2473, 0.8749, 0.8578, 0.8660, 0.3921, 4601.0],
                                 [0.0081, 0.3481, 0.1693, 0.3289, 0.8736, 0.8695, 0.8711, 0.5442, 5044.7],
                                 [0.0034, 0.3126, 0.1039, 0.2424, 0.8843, 0.8577, 0.8706, 0.4475, 1502.9]],
      "Gemma3-VL-12B-it":       [[0.0000, 0.2959, 0.0964, 0.2346, 0.8685, 0.8579, 0.8630, 0.3743, 8098.1],
                                 [0.0000, 0.3279, 0.1312, 0.2752, 0.8708, 0.8639, 0.8672, 0.5285, 9067.5],
                                 [0.0000, 0.3177, 0.1215, 0.2535, 0.8632, 0.8596, 0.8612, 0.4341, 2341.5]],
      "Qwen2.5-VL-7B-Instruct": [[0.0000, 0.3185, 0.1282, 0.2811, 0.8747, 0.8702, 0.8722, 0.4233, 1667.1],
                                 [0.0007, 0.3658, 0.1486, 0.3660, 0.8716, 0.8854, 0.8783, 0.5353, 1649.3],
                                 [0.0000, 0.3573, 0.1463, 0.3007, 0.8841, 0.8718, 0.8777, 0.5623, 766.6]]
    },
    "Test 3": {
      "Vintern-1B-v3.5":        [[0.0000, 0.2782, 0.0970, 0.2235, 0.8752, 0.8566, 0.8655, 0.2618, 5572.1],
                                 [0.0000, 0.3200, 0.1321, 0.3069, 0.8684, 0.8736, 0.8706, 0.3656, 6033.7],
                                 [0.0009, 0.2676, 0.0742, 0.1960, 0.8764, 0.8485, 0.8620, 0.2493, 1048.2]],
      "InternVL3-8B":           [[0.0000, 0.2950, 0.1015, 0.2409, 0.8774, 0.8594, 0.8680, 0.3405, 5814.1],
                                 [0.0070, 0.3511, 0.1679, 0.3282, 0.8769, 0.8727, 0.8744, 0.4643, 5157.3],
                                 [0.0000, 0.2885, 0.0811, 0.2169, 0.8802, 0.8523, 0.8658, 0.2742, 1608.0]],
      "Gemma3-VL-12B-it":       [[0.0000, 0.2750, 0.0756, 0.2092, 0.8656, 0.8527, 0.8589, 0.2235, 8957.5],
                                 [0.0000, 0.2987, 0.1015, 0.2381, 0.8677, 0.8562, 0.8617, 0.3369, 8443.8],
                                 [0.0000, 0.3092, 0.1057, 0.2424, 0.8652, 0.8569, 0.8608, 0.3278, 2445.0]],
      "Qwen2.5-VL-7B-Instruct": [[0.0000, 0.2972, 0.1086, 0.2523, 0.8714, 0.8646, 0.8678, 0.3726, 1752.7],
                                 [0.0009, 0.3547, 0.1485, 0.3423, 0.8704, 0.8803, 0.8752, 0.5274, 1791.5],
                                 [0.0023, 0.3361, 0.1380, 0.2798, 0.8860, 0.8659, 0.8755, 0.5633, 716.7]]
    }
  }
};
