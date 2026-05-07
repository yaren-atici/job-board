import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lrwitudptbmevidltzyh.supabase.co'
const supabaseKey = 'sb_publishable_e-KGs1S3t40BqW22HqFrsw_bhSwPTc4'

export const supabase = createClient(supabaseUrl, supabaseKey)