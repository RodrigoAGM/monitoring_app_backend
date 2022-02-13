/*
  Warnings:

  - You are about to drop the column `bio` on the `doctor` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `doctor` DROP COLUMN `bio`,
    MODIFY `specialty` VARCHAR(191) NULL,
    MODIFY `tuitionNumber` INTEGER NULL;
