import { createClient } from '@supabase/supabase-js'
import config, { isConfigured } from '../config'

export const supabase = isConfigured()
  ? createClient(config.supabaseUrl, config.supabaseAnonKey)
  : null
