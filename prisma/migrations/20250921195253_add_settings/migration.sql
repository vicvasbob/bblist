-- CreateTable
CREATE TABLE "public"."Settings" (
    "id" SERIAL NOT NULL,
    "baby_name" TEXT NOT NULL DEFAULT 'Joana',
    "welcome_message" TEXT NOT NULL DEFAULT 'Benvinguts a la llista de regals per la Joana!',
    "products_title" TEXT NOT NULL DEFAULT '🍼Benvinguts a la llista de regals per la Joana!',
    "products_description" TEXT NOT NULL DEFAULT 'Ajuda''ns a prepararnos per la petita reservan regals que t''agradaria portar',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);
