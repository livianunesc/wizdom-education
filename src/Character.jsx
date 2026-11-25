import { useState } from 'react';

const characters = ['Lia', 'Bento', 'Sol'];
const skins = ['#ffcfaa', '#c18060', '#825044'];
const hairs = ['#39253a', '#7b453b', '#c77643'];
const clothes = ['#a99cdb', '#79baaa', '#eb9d7c'];

export default function Character({ value = {}, scene = 'book', className = '' }) {
  const { character = 0, skin = 0, hair = 0, outfit = 0 } = value;
  const p = hairs[hair];
  const accessory = scene === 'exams' ? <><circle cx="113" cy="101" r="11" fill="#d5f4ef"/><path d="m119 110 11 13"/></> :
    scene === 'agenda' ? <><rect x="76" y="103" width="35" height="28" rx="4" fill="#dbc7f0"/><path d="M77 112h33m-23-12v8m14-8v8m-16 11h3m6 0h3m6 0h3m-21 5h3m6 0h3"/></> :
    scene === 'review' ? <><rect x="77" y="103" width="31" height="27" rx="4" fill="#f8ddb0"/><path d="M87 111q5-5 9 0 3 5-4 8m0 4h.1"/></> :
    <><path d="m76 105 19 5 17-8v24l-17 8-19-5Z" fill={scene === 'focus' ? '#c2e6d6' : '#ffdfa5'}/><path d="M95 110v24"/></>;
  return <svg className={'notebook-character ' + className} viewBox="0 0 156 174" aria-hidden="true">
    <ellipse cx="76" cy="155" rx="58" ry="10" fill="var(--lavender, #e6ddf4)"/>
    <path d="M20 57v16m-8-8h16m113 18v12m-6-6h12" fill="none" stroke="#a97ba9" strokeWidth="2" strokeLinecap="round"/>
    <g stroke="#392840" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
      {character === 0 && <path d="M43 41Q27 33 24 55q-2 30 15 32l10-29m54-18q17-8 21 17 2 25-13 32l-13-29" fill={p}/>}
      {character === 2 && <><circle cx="43" cy="34" r="18" fill={p}/><circle cx="104" cy="33" r="19" fill={p}/></>}
      <path d="M52 124h44l-4 22H80l-5-12-7 12H55Z" fill="#58638b"/>
      <path d="M54 144h14l1 9H46q-3-4 8-9Zm26 0h13q12 4 10 9H79Z" fill="#fff7ea"/>
      <path d="M55 91q19-10 39 1l11 17-11 6v13H53v-14l-8 2-7-8Z" fill={clothes[outfit]}/>
      <path d="M47 110q4 7 16 8l4-6m25-4 9 7 8-8" fill="none"/>
      <ellipse cx="74" cy="61" rx="35" ry="32" fill={skins[skin]}/>
      <path d={['M39 58Q32 18 72 22q37-2 37 35-18-2-25-17-14 17-45 18Z','M39 57Q30 21 67 23l10-8 4 9q30-5 29 34-14-4-16-15-10 8-17 7l-2-9Q62 56 39 57Z','M38 57q-5-38 36-37 37 0 36 38-15 0-17-15-7 16-18 10-13 8-22-6-5 10-15 10Z'][character]} fill={p}/>
      <path d="M58 65v3m31-3v3m-22 9q7 7 14 0" fill="none"/>
      {character === 1 && <path d="M49 62h17v10H49Zm31 0h17v10H80ZM66 65h14" fill="none"/>}
      <path d="M47 75h5m44 0h5" stroke="#a75260"/>
      {accessory}
    </g>
  </svg>;
}

export function CharacterEditor({ profile, setProfile }) {
  const [value, setValue] = useState(profile.character || {});
  const fields = [
    ['character', 'Personagem', characters],
    ['skin', 'Pele', ['Clara', 'Média', 'Escura']],
    ['hair', 'Cabelo', ['Preto', 'Castanho', 'Ruivo']],
    ['outfit', 'Roupa', ['Lavanda', 'Menta', 'Damasco']],
  ];
  return <section className="card notebook-panel">
    <h2>Seu personagem</h2>
    <Character value={value} />
    <div className="notebook-grid">{fields.map(([key, label, options]) => <label key={key}>{label}
      <select value={value[key] ?? 0} onChange={event => setValue({ ...value, [key]: Number(event.target.value) })}>
        {options.map((option, index) => <option key={option} value={index}>{option}</option>)}
      </select>
    </label>)}</div>
    <button className="button primary" onClick={() => setProfile(current => ({ ...current, character: value }))}>Salvar personagem</button>
  </section>;
}
