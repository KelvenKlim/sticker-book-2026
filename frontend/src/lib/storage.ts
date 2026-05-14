import { useEffect, useState, useCallback } from "react";
import type { StickerStatus } from "./stickers";

export interface StickerEntry {
  status: StickerStatus;
  duplicates: number; // extra copies beyond the kept one
}

export type StickerMap = Record<string, StickerEntry>;

const KEY = "wc2026-stickers-v1";

function load(): StickerMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return {};
    return JSON.parse(raw) as StickerMap;
  } catch {
    return {};
  }
}

let listeners: Array<() => void> = [];
let cache: StickerMap | null = null;

function getMap(): StickerMap {
  if (cache === null) cache = load();
  return cache;
}

function setMap(next: StickerMap) {
  cache = next;
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY, JSON.stringify(next));
  }
  listeners.forEach((l) => l());
}

export function useStickerStore() {
  const [, setTick] = useState(0);
  
  const forceUpdate = useCallback(() => {
    setTick((t) => t + 1);
  }, []);
  
  useEffect(() => {
    listeners.push(forceUpdate);
    return () => {
      listeners = listeners.filter((x) => x !== forceUpdate);
    };
  }, [forceUpdate]);

  const map = getMap();

  const get = useCallback((code: string): StickerEntry => {
    return getMap()[code] ?? { status: "missing", duplicates: 0 };
  }, []);

  const setEntry = useCallback((code: string, entry: StickerEntry) => {
    const next = { ...getMap() };
    if (entry.status === "missing" && entry.duplicates === 0) {
      delete next[code];
    } else {
      next[code] = entry;
    }
    setMap(next);
  }, []);

  const cycle = useCallback((code: string) => {
    const cur = getMap()[code] ?? { status: "missing" as StickerStatus, duplicates: 0 };
    if (cur.status === "missing") setEntry(code, { status: "owned", duplicates: 0 });
    else if (cur.status === "owned") setEntry(code, { status: "duplicate", duplicates: 1 });
    else setEntry(code, { status: "missing", duplicates: 0 });
  }, [setEntry]);

  const addDuplicate = useCallback((code: string) => {
    const cur = getMap()[code] ?? { status: "missing" as StickerStatus, duplicates: 0 };
    if (cur.status === "missing") {
      setEntry(code, { status: "duplicate", duplicates: 1 });
    } else {
      setEntry(code, { status: "duplicate", duplicates: (cur.duplicates || 0) + 1 });
    }
  }, [setEntry]);

  const removeDuplicate = useCallback((code: string) => {
    const cur = getMap()[code];
    if (!cur) return;
    const dups = Math.max(0, (cur.duplicates || 0) - 1);
    if (dups === 0) {
      setEntry(code, { status: "owned", duplicates: 0 });
    } else {
      setEntry(code, { status: "duplicate", duplicates: dups });
    }
  }, [setEntry]);

  const markOwned = useCallback((code: string) => {
    setEntry(code, { status: "owned", duplicates: 0 });
  }, [setEntry]);

  const clear = useCallback((code: string) => {
    setEntry(code, { status: "missing", duplicates: 0 });
  }, [setEntry]);

  return { map, get, setEntry, cycle, addDuplicate, removeDuplicate, markOwned, clear };
}
