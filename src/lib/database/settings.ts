import { prisma } from '../prisma';

export interface Settings {
  id: number;
  baby_name: string;
  welcome_message: string;
  products_title: string;
  products_description: string;
  created_at: Date;
  updated_at: Date;
}

// Obtener la configuración (crea una si no existe)
export async function getSettings(): Promise<Settings> {
  let settings = await prisma.settings.findFirst();
  
  if (!settings) {
    // Si no existe, crear una con valores por defecto
    settings = await prisma.settings.create({
      data: {
        baby_name: "Joana",
        welcome_message: "Benvinguts a la llista de regals per la Joana!",
        products_title: "🍼Benvinguts a la llista de regals per la Joana!",
        products_description: "Ajuda'ns a prepararnos per la petita reservan regals que t'agradaria portar"
      }
    });
  }
  
  return settings;
}

// Actualizar la configuración
export async function updateSettings(data: {
  baby_name?: string;
  welcome_message?: string;
  products_title?: string;
  products_description?: string;
}): Promise<Settings> {
  // Obtener el primer registro de settings
  let settings = await prisma.settings.findFirst();
  
  if (!settings) {
    // Si no existe, crear uno primero
    settings = await getSettings();
  }
  
  // Actualizar el registro
  return await prisma.settings.update({
    where: { id: settings.id },
    data: {
      ...data,
      updated_at: new Date()
    }
  });
}