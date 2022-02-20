/*
  Warnings:

  - Made the column `emergencyTypeId` on table `monitoringplan` required. This step will fail if there are existing NULL values in that column.
  - Made the column `priorityTypeId` on table `monitoringplan` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `monitoringplan` DROP FOREIGN KEY `MonitoringPlan_emergencyTypeId_fkey`;

-- DropForeignKey
ALTER TABLE `monitoringplan` DROP FOREIGN KEY `MonitoringPlan_priorityTypeId_fkey`;

-- AlterTable
ALTER TABLE `emergencytype` MODIFY `name` VARCHAR(250) NOT NULL;

-- AlterTable
ALTER TABLE `monitoringplan` MODIFY `emergencyTypeId` INTEGER NOT NULL,
    MODIFY `priorityTypeId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `prioritytype` MODIFY `name` VARCHAR(250) NOT NULL;

-- AddForeignKey
ALTER TABLE `MonitoringPlan` ADD CONSTRAINT `MonitoringPlan_emergencyTypeId_fkey` FOREIGN KEY (`emergencyTypeId`) REFERENCES `EmergencyType`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MonitoringPlan` ADD CONSTRAINT `MonitoringPlan_priorityTypeId_fkey` FOREIGN KEY (`priorityTypeId`) REFERENCES `PriorityType`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
