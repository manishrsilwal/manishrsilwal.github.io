/* Tessel shared helpers — loaded by the web app (as window.Tessel) and by
   the Node CLI (require/import). Keep this file dependency-free. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.Tessel = factory();
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  // Byte-mode data capacity per version (1–40) for each error correction
  // level, per ISO/IEC 18004. Used to predict the symbol's module count.
  const BYTE_CAPACITY = {
    L: [17, 32, 53, 78, 106, 134, 154, 192, 230, 271, 321, 367, 425, 458, 520, 586, 644, 718, 792, 858, 929, 1003, 1091, 1171, 1273, 1367, 1465, 1528, 1628, 1732, 1840, 1952, 2068, 2188, 2303, 2431, 2563, 2699, 2809, 2953],
    M: [14, 26, 42, 62, 84, 106, 122, 152, 180, 213, 251, 287, 331, 362, 412, 450, 504, 560, 624, 666, 711, 779, 857, 911, 997, 1059, 1125, 1190, 1264, 1370, 1452, 1538, 1628, 1722, 1809, 1911, 1989, 2099, 2213, 2331],
    Q: [11, 20, 32, 46, 60, 74, 86, 108, 130, 151, 177, 203, 241, 258, 292, 322, 364, 394, 442, 482, 509, 565, 611, 661, 715, 751, 805, 868, 908, 982, 1030, 1112, 1168, 1228, 1283, 1351, 1423, 1499, 1579, 1663],
    H: [7, 14, 24, 34, 44, 58, 64, 84, 98, 119, 137, 155, 177, 194, 220, 250, 280, 310, 338, 382, 403, 439, 461, 511, 535, 593, 625, 658, 698, 742, 790, 842, 898, 958, 983, 1051, 1093, 1139, 1219, 1273],
  };

  function normalizeUrl(url) {
    const trimmed = (url || "").trim();
    if (!trimmed) return "";
    return /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed) ? trimmed : `https://${trimmed}`;
  }

  function safeFilename(name) {
    return (name || "").trim().replace(/[\\/:*?"<>|]/g, "").replace(/\s+/g, " ").slice(0, 120);
  }

  // Modules per side of the QR symbol that will encode `data` at `ecc`.
  function moduleCount(data, ecc) {
    const bytes = new TextEncoder().encode(data || " ").length;
    const caps = BYTE_CAPACITY[ecc] || BYTE_CAPACITY.H;
    const version = caps.findIndex((c) => c >= bytes) + 1;
    return version === 0 ? 177 : 17 + 4 * version;
  }

  // ISO/IEC 18004 requires a quiet zone of at least 4 modules on every side.
  // Returns the pixel margin that gives exactly 4 modules of quiet zone when
  // the symbol plus both quiet zones fill a canvas of `size` pixels.
  function quietZoneMargin(size, data, ecc) {
    return Math.ceil((4 * size) / (moduleCount(data, ecc) + 8));
  }

  return { BYTE_CAPACITY, normalizeUrl, safeFilename, moduleCount, quietZoneMargin };
});
