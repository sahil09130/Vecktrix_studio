"use client";

import { useId, useState } from "react";
import { partnersConfig, partnersCopy } from "@/content/partners";

const inr = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

/** Illustrative only: commission on an eligible fee at a chosen indicative rate. */
export function EarningsCalculator() {
  const id = useId();
  const [fee, setFee] = useState(partnersConfig.exampleFee);
  const [rate, setRate] = useState(partnersConfig.calculatorRates[0]);
  const commission = Math.round((Math.max(0, fee) * rate) / 100);

  return (
    <div className="grid gap-10 rounded-3xl border border-line bg-surface p-6 md:grid-cols-[1fr_1fr] md:p-10">
      <div className="space-y-8">
        <div>
          <label htmlFor={`${id}-fee`} className="eyebrow mb-3 block">{partnersCopy.calculator.feeLabel}</label>
          <input
            id={`${id}-fee`}
            type="number"
            min={0}
            step={1000}
            value={fee}
            onChange={(e) => setFee(Number(e.target.value))}
            className="w-full rounded-xl border border-line bg-bg px-4 py-3 font-mono text-lg text-fg focus:border-accent"
          />
        </div>
        <fieldset>
          <legend className="eyebrow mb-3">{partnersCopy.calculator.rateLabel}</legend>
          <div className="flex flex-wrap gap-2">
            {partnersConfig.calculatorRates.map((r) => (
              <label
                key={r}
                className="cursor-pointer rounded-full border border-line px-5 py-2 text-sm has-[:checked]:border-accent has-[:checked]:text-accent has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent"
              >
                <input
                  type="radio"
                  name={`${id}-rate`}
                  value={r}
                  checked={rate === r}
                  onChange={() => setRate(r)}
                  className="sr-only"
                />
                {r}%
              </label>
            ))}
          </div>
        </fieldset>
        <p className="text-sm text-muted">{partnersCopy.calculator.intro}</p>
      </div>

      <div className="flex flex-col justify-between gap-8 rounded-2xl border border-line bg-bg p-6">
        <div>
          <p className="eyebrow mb-3">{partnersCopy.calculator.resultLabel}</p>
          <p className="font-display text-5xl font-bold tracking-tight text-accent md:text-6xl" aria-live="polite">
            ₹{inr.format(commission)}
          </p>
          <p className="mt-3 font-mono text-xs text-muted">
            {rate}% of ₹{inr.format(Math.max(0, fee))}
          </p>
        </div>
        <p className="text-sm leading-relaxed text-muted">{partnersCopy.calculator.example}</p>
      </div>
    </div>
  );
}
