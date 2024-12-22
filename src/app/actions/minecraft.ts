'use server'

import { ApiResponse } from '@/types/api';

export async function getServerStatus(): Promise<ApiResponse> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/minecraft`);
    const data = await response.json();
    console.log('Server action received data:', data); // Debug-Log

    return {
      success: true,
      data
    };
  } catch (error) {
    console.error('Server action error:', error);
    return {
      success: false,
      error: 'Fehler bei der Server-Abfrage'
    };
  }
} 