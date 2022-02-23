/*
  Warnings:

  - A unique constraint covering the columns `[monitoringPlanId]` on the table `Prescription` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `monitoringPlanId` to the `Prescription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `prescription` ADD COLUMN `monitoringPlanId` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Prescription_monitoringPlanId_key` ON `Prescription`(`monitoringPlanId`);

-- AddForeignKey
ALTER TABLE `Prescription` ADD CONSTRAINT `Prescription_monitoringPlanId_fkey` FOREIGN KEY (`monitoringPlanId`) REFERENCES `MonitoringPlan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
