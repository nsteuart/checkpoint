const config = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL || '',
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
}

export function isConfigured() {
  return Boolean(config.supabaseUrl && config.supabaseAnonKey)
}

export default config
