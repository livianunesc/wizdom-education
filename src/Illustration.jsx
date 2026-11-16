export default function Illustration({ small = false }) {
  return (
    <svg
      className={small ? "owl-art small" : "owl-art"}
      viewBox="0 0 340 230"
      role="img"
      aria-label="Corujinha Wizi estudando com tranquilidade"
    >
      <ellipse cx="174" cy="209" rx="142" ry="10" fill="#d9d3e9" opacity=".5" />
      <path
        d="M282 195v-57m0 24c-35-5-39-29-39-29 30-4 39 29 39 29m0 13c31-7 38-33 38-33-30-3-38 33-38 33m0-30c-22-7-24-33-24-33 27 5 24 33 24 33"
        stroke="#879879"
        strokeWidth="3"
        fill="#b9c8a3"
      />
      <path d="M265 177h35l-7 30h-21z" fill="#ded3bf" />
      <path d="M267 179h31" stroke="#c5b69e" strokeWidth="4" />
      <rect x="37" y="178" width="93" height="14" rx="4" fill="#b6c6ba" />
      <path d="M46 183h78" stroke="#edf1e8" strokeWidth="3" />
      <rect x="47" y="192" width="91" height="14" rx="3" fill="#a59abb" />
      <path d="M55 197h78" stroke="#e9e2f2" strokeWidth="3" />
      <path
        d="M97 58q-6-28 10-34l24 24q37-17 69-1l25-24q17 23 6 49c29 31 27 95-3 118-32 26-98 22-125-5-27-27-32-85-6-127"
        fill="#9e91ba"
      />
      <path d="M109 85q-14-25-7-39l27 18m68 0 23-19q6 21-6 40" fill="#c5b9dc" />
      <ellipse cx="160" cy="138" rx="60" ry="62" fill="#e2d9ef" />
      <path
        d="M113 90q26-20 49 1 23-22 48 0l-8 38q-20 19-40-1-20 20-41 0z"
        fill="#f9f5fd"
      />
      <path
        d="M127 104q9-11 18 0m34 0q9-11 18 0"
        fill="none"
        stroke="#534864"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <ellipse cx="124" cy="117" rx="7" ry="4" fill="#dbb8c6" />
      <ellipse cx="201" cy="117" rx="7" ry="4" fill="#dbb8c6" />
      <path d="m155 116 8 10 8-10" fill="#d3ac71" />
      <path
        d="M100 129q-24 23-1 49l22-26m102-23q25 25 0 49l-20-26"
        fill="#9383ae"
      />
      <path
        d="M111 161q27-8 51 7 25-15 56-7l-3 39q-31-4-53 9-24-14-50-10z"
        fill="#f8f5ed"
        stroke="#b5a894"
        strokeWidth="2"
      />
      <path
        d="M162 169v37m-41-32 30 5m-30 4 30 5m22-9 33-5m-33 14 33-5"
        stroke="#d2c9b9"
        strokeWidth="2"
      />
      <path
        d="m142 207-7 5m41-5 7 5"
        stroke="#c0a274"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M54 77v14m-7-7h14m186-19v10m-5-5h10M77 119l3 4-3 4-3-4z"
        stroke="#a99ac2"
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
