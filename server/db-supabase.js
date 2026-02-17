import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://iptjylqqovyxkukkunfh.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

let supabase = null;

function getSupabaseClient() {
  if (!supabase) {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabase;
}

export async function initDb() {
  try {
    const client = getSupabaseClient();
    
    // Test connection
    const { data, error } = await client
      .from('divers')
      .select('count')
      .limit(1);
    
    if (error && error.code !== 'PGRST116') {
      throw error;
    }
    
    console.log('✅ Supabase connection successful');
  } catch (err) {
    console.error('❌ Supabase initialization error:', err.message);
    throw err;
  }
}

export function getDb() {
  return getSupabaseClient();
}

export async function queryDb(table, filters = {}, select = '*') {
  try {
    const client = getSupabaseClient();
    let query = client.from(table).select(select);
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query = query.eq(key, value);
      }
    });
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error(`Error querying ${table}:`, err);
    throw err;
  }
}

export async function getDbRow(table, filters = {}, select = '*') {
  try {
    const data = await queryDb(table, filters, select);
    return data[0] || null;
  } catch (err) {
    console.error(`Error getting row from ${table}:`, err);
    throw err;
  }
}

export async function runDb(table, data, action = 'insert') {
  try {
    const client = getSupabaseClient();
    let query = client.from(table);
    let result;
    
    switch (action) {
      case 'insert':
        if (!data.id) data.id = uuidv4();
        result = await query.insert([data]).select();
        break;
      case 'update':
        const { id, ...updateData } = data;
        result = await query.update(updateData).eq('id', id).select();
        break;
      case 'delete':
        result = await query.delete().eq('id', data.id);
        break;
      default:
        throw new Error(`Unknown action: ${action}`);
    }
    
    const { data: resultData, error } = result;
    if (error) throw error;
    return resultData?.[0] || null;
  } catch (err) {
    console.error(`Error executing ${action} on ${table}:`, err);
    throw err;
  }
}

export async function closeDbPool() {
  // Supabase client doesn't require explicit closure
  return Promise.resolve();
}
