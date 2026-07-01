import { useState } from 'react'
import { BRAND, CONTACT_FORM, PACKAGES } from '../data'
import { useT } from '../lib/i18n'

// Lead-flow form. No backend: submit composes an honest mailto: to the brand
// inbox with the fields URL-encoded into the body. No fake success state — the
// user's mail client takes over from here.

const labelCls = 'font-mono text-[10px] uppercase tracking-widest text-mist-500'
const fieldCls =
  'mt-2 w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-[14px] text-mist-100 ' +
  'placeholder:text-mist-600 outline-none transition-colors focus-visible:border-amber/50 ' +
  'focus-visible:ring-1 focus-visible:ring-amber/30'

export default function ContactForm() {
  const t = useT()

  const [task, setTask] = useState('')
  const [pkg, setPkg] = useState('')
  const [timeline, setTimeline] = useState('')
  const [budget, setBudget] = useState('')

  function buildMailto() {
    const subject = 'Project idea — Northvector'
    const lines = [
      `${t(CONTACT_FORM.taskLabel)}:`,
      task || '—',
      '',
      `${t(CONTACT_FORM.packageLabel)}: ${pkg || t(CONTACT_FORM.packagePlaceholder)}`,
      `${t(CONTACT_FORM.timelineLabel)}: ${timeline || '—'}`,
      `${t(CONTACT_FORM.budgetLabel)}: ${budget || '—'}`,
    ]
    const body = lines.join('\n')
    return `mailto:${BRAND.contact}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // Hand off to the user's mail client — honest, no backend, no fake success.
    window.location.href = buildMailto()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-xl rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-left sm:p-8"
    >
      <div className="space-y-5">
        <div>
          <label htmlFor="cf-task" className={labelCls}>
            {t(CONTACT_FORM.taskLabel)}
          </label>
          <textarea
            id="cf-task"
            required
            rows={4}
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder={t(CONTACT_FORM.taskPlaceholder)}
            className={`${fieldCls} resize-y`}
          />
        </div>

        <div>
          <label htmlFor="cf-package" className={labelCls}>
            {t(CONTACT_FORM.packageLabel)}
          </label>
          <select
            id="cf-package"
            value={pkg}
            onChange={(e) => setPkg(e.target.value)}
            className={`${fieldCls} appearance-none`}
          >
            <option value="">{t(CONTACT_FORM.packagePlaceholder)}</option>
            {PACKAGES.map((p) => {
              const opt = `${p.letter} · ${t(p.title)}`
              return (
                <option key={p.id} value={opt}>
                  {opt}
                </option>
              )
            })}
          </select>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="cf-timeline" className={labelCls}>
              {t(CONTACT_FORM.timelineLabel)}
            </label>
            <input
              id="cf-timeline"
              type="text"
              value={timeline}
              onChange={(e) => setTimeline(e.target.value)}
              placeholder={t(CONTACT_FORM.timelinePlaceholder)}
              className={fieldCls}
            />
          </div>
          <div>
            <label htmlFor="cf-budget" className={labelCls}>
              {t(CONTACT_FORM.budgetLabel)}
            </label>
            <input
              id="cf-budget"
              type="text"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder={t(CONTACT_FORM.budgetPlaceholder)}
              className={fieldCls}
            />
          </div>
        </div>
      </div>

      <div className="mt-7 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <button
          type="submit"
          className="group inline-flex items-center gap-2 rounded-full bg-mist-100 px-8 py-3.5 text-sm font-medium text-ink-900 transition-transform duration-200 hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
        >
          {t(CONTACT_FORM.submit)}
          <span className="transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0">
            →
          </span>
        </button>

        {/* TODO: replace with Cal.com booking URL — placeholder points at the brand inbox for now. */}
        <a
          href={`mailto:${BRAND.contact}?subject=${encodeURIComponent('Book a call — Northvector')}`}
          className="text-sm text-mist-400 underline decoration-white/20 underline-offset-4 transition-colors hover:text-jade hover:decoration-jade/50"
        >
          {t(CONTACT_FORM.booking)}
        </a>
      </div>

      <p className="mt-6 text-center font-mono text-[11px] leading-relaxed text-mist-600 sm:text-left">
        {t(CONTACT_FORM.privacy)}
      </p>
    </form>
  )
}
