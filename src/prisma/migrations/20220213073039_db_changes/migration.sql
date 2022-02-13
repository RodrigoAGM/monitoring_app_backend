/*
  Warnings:

  - You are about to drop the column `dni` on the `doctor` table. All the data in the column will be lost.
  - You are about to drop the column `dni` on the `patient` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[identification]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `identification` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Doctor_dni_key` ON `doctor`;

-- DropIndex
DROP INDEX `Patient_dni_key` ON `patient`;

-- DropIndex
DROP INDEX `User_email_key` ON `user`;

-- DropIndex
DROP INDEX `User_username_key` ON `user`;

-- AlterTable
ALTER TABLE `doctor` DROP COLUMN `dni`;

-- AlterTable
ALTER TABLE `patient` DROP COLUMN `dni`;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `username`,
    ADD COLUMN `idType` ENUM('DNI', 'CE') NOT NULL DEFAULT 'DNI',
    ADD COLUMN `identification` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_identification_key` ON `User`(`identification`);
