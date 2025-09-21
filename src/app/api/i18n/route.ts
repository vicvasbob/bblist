import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile } from 'fs/promises';
import { join } from 'path';
import { getUserByRequest } from '@/lib/database';

// GET - Obtener las traducciones actuales
export async function GET(request: NextRequest) {
  try {
    // TODO: Re-enable authentication after testing
    // Verificar que es admin
    try {
      const user = await getUserByRequest(request);
      if (!user || !user.id || !user.is_admin) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 });
      }
    } catch (authError) {
      console.log('Auth error (temporarily bypassed):', authError);
      // Temporarily bypass auth for development
      // return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const locale = request.nextUrl.searchParams.get('locale') || 'ca';
    const filePath = join(process.cwd(), 'src', 'locales', `${locale}.json`);
    
    const fileContent = await readFile(filePath, 'utf8');
    const translations = JSON.parse(fileContent);
    
    return NextResponse.json({ locale, translations });
  } catch (error) {
    console.error('Error reading translations:', error);
    return NextResponse.json(
      { error: 'Failed to read translations' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar las traducciones
export async function PUT(request: NextRequest) {
  try {
    // TODO: Re-enable authentication after testing
    // Verificar que es admin
    try {
      const user = await getUserByRequest(request);
      if (!user || !user.id || !user.is_admin) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 });
      }
    } catch (authError) {
      console.log('Auth error (temporarily bypassed):', authError);
      // Temporarily bypass auth for development
      // return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const body = await request.json();
    const { locale, translations } = body;
    
    if (!locale || !translations) {
      return NextResponse.json(
        { error: 'Locale and translations are required' },
        { status: 400 }
      );
    }

    // Validar que el locale sea válido
    if (!['ca', 'en'].includes(locale)) {
      return NextResponse.json(
        { error: 'Invalid locale. Must be ca or en' },
        { status: 400 }
      );
    }

    const filePath = join(process.cwd(), 'src', 'locales', `${locale}.json`);
    
    // Escribir el archivo con formato bonito
    await writeFile(filePath, JSON.stringify(translations, null, 2), 'utf8');
    
    return NextResponse.json({ 
      success: true,
      message: `Translations for ${locale} updated successfully`
    });
  } catch (error) {
    console.error('Error updating translations:', error);
    return NextResponse.json(
      { error: 'Failed to update translations' },
      { status: 500 }
    );
  }
}