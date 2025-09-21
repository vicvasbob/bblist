/*
  Warnings:

  - The `reserved_by` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropForeignKey
ALTER TABLE "public"."Product" DROP CONSTRAINT "Product_reserved_by_fkey";

-- AlterTable
ALTER TABLE "public"."Product" DROP COLUMN "reserved_by",
ADD COLUMN     "reserved_by" INTEGER;

-- AlterTable
ALTER TABLE "public"."User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "public"."Product" ADD CONSTRAINT "Product_reserved_by_fkey" FOREIGN KEY ("reserved_by") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
