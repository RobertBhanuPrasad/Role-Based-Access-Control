import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://wuoifapsvadlubqpcxji.supabase.co/";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1b2lmYXBzdmFkbHVicXBjeGppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIzNjY4NzksImV4cCI6MjA0Nzk0Mjg3OX0.89yBkNPAyeCNsQSrViK8o-ifn76ZACND7fC6t04DIdM";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
