import { NextResponse } from 'next/server';

export async function GET() {
  // Google Drive file ID from the sharing link
  const fileId = '1u7XohCu77a9lW1GGdF3G1dz_rV5NEjDa';
  // Redirect to Google Drive direct download link
  const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
  
  return NextResponse.redirect(downloadUrl);
}
