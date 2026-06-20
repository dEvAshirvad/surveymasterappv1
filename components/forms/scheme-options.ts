import type { Option } from "./types";

export const SCHEME_NONE_VALUE = "__scheme_none__";

export const schemeNoneOption: Option = {
  value: SCHEME_NONE_VALUE,
  label: { en: "— No scheme —", hi: "— कोई योजना नहीं —" },
};

export function withSchemeNoneOption(options: Option[]): Option[] {
  if (options.some((option) => option.value === SCHEME_NONE_VALUE)) {
    return options;
  }
  return [schemeNoneOption, ...options];
}

export function hasSchemeNoneOption(options: Option[] | undefined): boolean {
  return (options ?? []).some((option) => option.value === SCHEME_NONE_VALUE);
}

export function toSchemeSelectValue(stored: string): string {
  return stored || SCHEME_NONE_VALUE;
}

export function fromSchemeSelectValue(selected: string): string {
  return selected === SCHEME_NONE_VALUE ? "" : selected;
}

export function resolveSelectValue(stored: string, options: Option[] | undefined): string {
  if (hasSchemeNoneOption(options)) {
    return toSchemeSelectValue(stored);
  }
  return stored;
}

export function resolveSelectChange(next: string, options: Option[] | undefined): string {
  if (hasSchemeNoneOption(options)) {
    return fromSchemeSelectValue(next);
  }
  return next;
}
