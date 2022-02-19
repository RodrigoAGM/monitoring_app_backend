/*
  Warnings:

  - You are about to drop the `medicalcare` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `medicalcare` DROP FOREIGN KEY `MedicalCare_doctorId_fkey`;

-- DropForeignKey
ALTER TABLE `medicalcare` DROP FOREIGN KEY `MedicalCare_patientId_fkey`;

-- DropTable
DROP TABLE `medicalcare`;
