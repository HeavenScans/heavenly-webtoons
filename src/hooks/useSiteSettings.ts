import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export type SettingsMap = Record<string, Record<string, unknown>>;

export function useSiteSettings() {
  const [settings, setSettings] = useState<SettingsMap>({});
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("site_settings").select("key,value");
    const map: SettingsMap = {};
    (data ?? []).forEach((row: { key: string; value: unknown }) => {
      map[row.key] = (row.value as Record<string, unknown>) ?? {};
    });
    setSettings(map);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = useCallback(async (key: string, value: Record<string, unknown>) => {
    const { error } = await supabase
      .from("site_settings")
      .upsert({ key, value }, { onConflict: "key" });
    if (error) throw error;
    await load();
  }, [load]);

  return { settings, loading, save, reload: load };
}