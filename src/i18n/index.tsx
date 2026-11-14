"use client";

/**
 * i18n Context Provider
 * 
 * Client-side only (SPA/CSR pattern for GitHub Pages static export).
 * Locale is stored in localStorage and applied via HTML dir + lang attributes.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { Locale, Direction } from "@/types";

import arCommon from "./locales/ar/common.json";
import enCommon from "./locales/en/common.json";

// Use interface to avoid circular type alias
interface TranslationObject {
  [key: string]: string | TranslationObject;
}
type TranslationValue = string | TranslationObject;
type Translations = TranslationObject;

const TRANSLATIONS: Record<Locale, Translations> = {
  ar: arCommon as Translations,
  en: enCommon as Translations,
};

const LOCALE_DIRECTION: Record<Locale, Direction> = {
  ar: "rtl",
  en: "ltr",
};

const LOCALE_STORAGE_KEY = "masarmentors_locale";
const DEFAULT_LOCALE: Locale = "ar";

interface I18nContextValue {
  locale: Locale;
  direction: Direction;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string>) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

function getNestedValue(obj: TranslationObject, keyPath: string): string | undefined {
  const keys = keyPath.split(".");
  let current: string | TranslationObject = obj;
  for (const key of keys) {
    if (typeof current !== "object" || current === null) return undefined;
    current = (current as TranslationObject)[key];
  }
  return typeof current === "string" ? current : undefined;
}

function interpolate(template: string, params: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => params[key] ?? `{{${key}}}`);
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    // Read from localStorage on mount
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY) as Locale | null;
    if (stored && (stored === "ar" || stored === "en")) {
      setLocaleState(stored);
    }
  }, []);

  useEffect(() => {
    // Update <html> attributes when locale changes
    const dir = LOCALE_DIRECTION[locale];
    document.documentElement.setAttribute("lang", locale);
    document.documentElement.setAttribute("dir", dir);
    document.documentElement.setAttribute("data-locale", locale);
  }, [locale]);

  const setLocale = useCallback((newLocale: Locale) => {
    localStorage.setItem(LOCALE_STORAGE_KEY, newLocale);
    setLocaleState(newLocale);
  }, []);

  const t = useCallback(
    (key: string, params?: Record<string, string>): string => {
      const translations = TRANSLATIONS[locale];
      const value = getNestedValue(translations, key);
      if (value === undefined) {
        // Fallback to English, then return key
        const fallback = getNestedValue(TRANSLATIONS.en, key);
        return fallback ? (params ? interpolate(fallback, params) : fallback) : key;
      }
      return params ? interpolate(value, params) : value;
    },
    [locale]
  );

  return (
    <I18nContext.Provider
      value={{ locale, direction: LOCALE_DIRECTION[locale], setLocale, t }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside <I18nProvider>");
  return ctx;
}
