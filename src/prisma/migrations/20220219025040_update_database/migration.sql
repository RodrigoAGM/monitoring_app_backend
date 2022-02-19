/*
  Warnings:

  - You are about to drop the column `heartRate` on the `monitoringplan` table. All the data in the column will be lost.
  - You are about to drop the column `saturation` on the `monitoringplan` table. All the data in the column will be lost.
  - You are about to drop the column `temperature` on the `monitoringplan` table. All the data in the column will be lost.
  - You are about to alter the column `status` on the `patient` table. The data in that column could be lost. The data in that column will be cast from `Enum("patient_status")` to `Enum("Patient_status")`.

*/
-- AlterTable
ALTER TABLE `monitoringplan` DROP COLUMN `heartRate`,
    DROP COLUMN `saturation`,
    DROP COLUMN `temperature`;

-- AlterTable
ALTER TABLE `patient` MODIFY `status` ENUM('ON_MONITORING', 'DISCHARGED') NULL DEFAULT 'DISCHARGED';

-- CreateTable
CREATE TABLE `DailyReport` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `temperature` DECIMAL(65, 30) NOT NULL,
    `saturation` DECIMAL(65, 30) NOT NULL,
    `heartRate` DECIMAL(65, 30) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `monitoringPlanId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `DailyReport` ADD CONSTRAINT `DailyReport_monitoringPlanId_fkey` FOREIGN KEY (`monitoringPlanId`) REFERENCES `MonitoringPlan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
