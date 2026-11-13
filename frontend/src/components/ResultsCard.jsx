import { useState } from 'react';
import { getRules } from '../lib/recyclingRules';

// Round down so a 99.6% result never shows as 100%
const percent = (x) => `${Math.floor(x * 100)}%`;

// Green for items that can be recycled or reused, grey for general waste
const badgeStyle = (recyclability) =>
  recyclability === 'Not recyclable' || recyclability === 'Unknown'
    ? 'bg-gray-100 text-charcoal-muted'
    : 'bg-mint-light text-forest';

/**
 * Shows the results of a recycling classifier scan, including the category, recyclability, points earned, and advice.
 * When the results are not confident, it shows the top 3 predictions with their probabilities.
 *
 * 'results' is what the classifyImage() returns: { top, confident, threshold }.
 * The card is remounted for each new photo, so the user's pick resets itself
 */
export default function ResultsCard({ results, saveStatus = 'idle', onPick }) {
  const [picked, setPicked] = useState(null);

  // The first pick is final, so one photo can only score once
  function handlePick(option) {
    if (picked) return;
    setPicked(option);
    onPick?.(option);
  }

  const category = results.confident ? results.top[0].category : picked;
  const rules = category ? getRules(category) : null;
  const confidence = results.top.find((r) => r.category === category)?.confidence;

  return (
    <section
      className="flex flex-col gap-4 rounded-[18px] bg-white p-5 shadow-sm outline outline-[1.3px] -outline-offset-[1.3px] outline-gray-200"
      aria-live="polite"
      data-testid="results"
    >
      {/* Not sure: let the user choose */}
      {!results.confident && (
        <div>
          <h3 id="pick-heading" className="text-base font-semibold text-charcoal">
            Not sure what this is
          </h3>
          <p className="mt-0.5 text-[13px] leading-[18px] text-charcoal-muted">
            Choose the closest match to see how to recycle it.
          </p>
          <div className="mt-3 flex flex-col gap-2" role="radiogroup" aria-labelledby="pick-heading">
            {results.top.map(({ category: option, confidence: optionConfidence }) => {
              const selected = picked === option;
              return (
                <button
                  key={option}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => handlePick(option)}
                  disabled={picked !== null && !selected}
                  className={`flex items-center gap-3 rounded-xl border px-3.5 py-3 text-left text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-forest/40 ${
                    selected
                      ? 'border-forest bg-mint-light text-forest'
                      : picked
                        ? 'border-gray-200 text-charcoal opacity-50'
                        : 'border-gray-200 text-charcoal hover:border-mint hover:bg-cream'
                  }`}
                >
                  <span
                    className={`flex size-4 shrink-0 items-center justify-center rounded-full border ${
                      selected ? 'border-forest' : 'border-gray-300'
                    }`}
                    aria-hidden="true"
                  >
                    {selected && <span className="size-2 rounded-full bg-forest" />}
                  </span>
                  <span className={`flex-1 ${selected ? 'font-semibold' : 'font-medium'}`}>
                    {getRules(option).label}
                  </span>
                  <span className="text-xs tabular-nums text-charcoal-muted">{percent(optionConfidence)}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* The answer, its points, and advice */}
      {rules && (
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-charcoal-muted">
                {results.confident ? 'Identified as' : 'You chose'}
              </p>
              <h3 className="mt-0.5 text-[22px] font-semibold leading-7 text-charcoal">{rules.label}</h3>
            </div>
            {results.confident && confidence != null && (
              <span className="shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium tabular-nums text-charcoal-muted">
                {percent(confidence)} match
              </span>
            )}
          </div>

          <span className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${badgeStyle(rules.recyclability)}`}>
            {rules.recyclability}
          </span>

          <p className="text-sm leading-relaxed text-charcoal-muted">{rules.advice}</p>

          <div className="flex items-center justify-between rounded-xl bg-mint-light px-4 py-3">
            <span className="text-sm font-medium text-forest-dark">Points earned</span>
            <span className="text-lg font-bold tabular-nums text-forest">+{rules.points}</span>
          </div>
          {saveStatus === 'saving' && <p className="text-xs text-charcoal-muted">Saving your points...</p>}
          {saveStatus === 'saved' && <p className="text-xs font-medium text-forest">Added to your score</p>}
          {saveStatus === 'error' && (
            <p className="text-xs text-red-700" role="alert">
              We couldn't save your points. Your result is still correct, so please try again later.
            </p>
          )}
        </div>
      )}
    </section>
  );
}