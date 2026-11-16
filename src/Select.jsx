import { Children, isValidElement, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown } from "lucide-react";

function plainText(node) {
  return Children.toArray(node).map((child) => isValidElement(child) ? plainText(child.props.children) : String(child)).join("");
}

// Styled listbox: keeps all choices consistent on desktop, mobile and file://.
export default function Select({ children, value, onChange, className = "", disabled, name, id, ...props }) {
  const options = Children.toArray(children).filter(isValidElement).map((child) => ({
    value: String(child.props.value ?? plainText(child.props.children)),
    label: plainText(child.props.children),
    disabled: !!child.props.disabled,
  }));
  const selected = Math.max(0, options.findIndex((item) => item.value === String(value)));
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(selected);
  const [position, setPosition] = useState({});
  const [label, setLabel] = useState("");
  const trigger = useRef(null), list = useRef(null), typed = useRef(""), typeTimer = useRef(null);
  const unique = useId().replace(/:/g, ""), listId = `${unique}-options`;
  useEffect(() => {
    const parentLabel = trigger.current?.closest("label");
    if (parentLabel) {
      const text = [...parentLabel.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join(" ").trim();
      setLabel(text);
    }
  }, [children]);
  useEffect(() => {
    if (!open) return;
    function align() {
      const box = trigger.current.getBoundingClientRect();
      const below = window.innerHeight - box.bottom - 12;
      const above = box.top - 12;
      const up = below < 180 && above > below;
      setPosition({ left: Math.max(8, Math.min(box.left, window.innerWidth - box.width - 8)), width: Math.min(box.width, window.innerWidth - 16), maxHeight: Math.max(100, Math.min(300, up ? above : below)), ...(up ? { bottom: window.innerHeight - box.top + 6 } : { top: box.bottom + 6 }) });
    }
    function outside(e) {
      if (!trigger.current?.contains(e.target) && !list.current?.contains(e.target)) setOpen(false);
    }
    align();
    document.addEventListener("pointerdown", outside);
    window.addEventListener("resize", align);
    window.addEventListener("scroll", align, true);
    return () => { document.removeEventListener("pointerdown", outside); window.removeEventListener("resize", align); window.removeEventListener("scroll", align, true); };
  }, [open]);
  useEffect(() => { if (open) document.getElementById(`${unique}-${active}`)?.scrollIntoView({ block: "nearest" }); }, [active, open, unique]);
  useEffect(() => () => clearTimeout(typeTimer.current), []);
  function choose(index) {
    if (!options[index] || options[index].disabled) return;
    onChange?.({ target: { value: options[index].value, name }, currentTarget: { value: options[index].value, name } });
    setOpen(false);
    trigger.current?.focus();
  }
  function keydown(e) {
    if (["ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)) {
      e.preventDefault();
      if (!open) { setOpen(true); setActive(e.key === "End" ? options.length - 1 : e.key === "Home" ? 0 : selected); return; }
      const direction = e.key === "ArrowUp" ? -1 : 1;
      let next = e.key === "Home" ? 0 : e.key === "End" ? options.length - 1 : (active + direction + options.length) % options.length;
      for (let i = 0; i < options.length && options[next]?.disabled; i++) next = (next + direction + options.length) % options.length;
      setActive(next);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (open) choose(active); else { setActive(selected); setOpen(true); }
    } else if (e.key === "Escape") { if (open) { e.preventDefault(); e.stopPropagation(); setOpen(false); } }
    else if (e.key === "Tab") setOpen(false);
    else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
      typed.current += e.key.toLocaleLowerCase();
      clearTimeout(typeTimer.current);
      typeTimer.current = setTimeout(() => { typed.current = ""; }, 600);
      const index = options.findIndex((o) => !o.disabled && o.label.toLocaleLowerCase().startsWith(typed.current));
      if (index >= 0) { setOpen(true); setActive(index); }
    }
  }
  return <span className={`wiz-select ${className}`}>
    <button {...props} id={id} type="button" ref={trigger} role="combobox" aria-label={props["aria-label"] || label || name || "Selecionar opção"} aria-haspopup="listbox" aria-expanded={open} aria-controls={listId} aria-activedescendant={open ? `${unique}-${active}` : undefined} disabled={disabled} className={`wiz-select-trigger ${open ? "is-open" : ""}`} onClick={() => { setActive(selected); setOpen((v) => !v); }} onKeyDown={keydown}>
      <span>{options[selected]?.label || "Selecionar"}</span><ChevronDown size={17} />
    </button>
    {name && <input type="hidden" name={name} value={value ?? ""} />}
    {open && createPortal(<div ref={list} id={listId} role="listbox" aria-label={props["aria-label"] || label || "Opções"} className="wiz-select-list" style={position} onMouseDown={(e) => e.preventDefault()}>
      {options.map((item, i) => <div key={`${item.value}-${i}`} id={`${unique}-${i}`} role="option" aria-selected={String(value) === item.value} aria-disabled={item.disabled || undefined} className={`wiz-select-option ${active === i ? "is-highlighted" : ""} ${String(value) === item.value ? "is-selected" : ""}`} onMouseMove={() => setActive(i)} onClick={() => choose(i)}>
        <span>{item.label}</span>{String(value) === item.value && <Check size={16} />}
      </div>)}
    </div>, document.body)}
  </span>;
}
