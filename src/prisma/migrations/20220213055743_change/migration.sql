/*
  Warnings:

  - You are about to drop the column `priority` on the `monitoringplan` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `monitoringplan` DROP COLUMN `priority`,
    ADD COLUMN `priorityTypeId` INTEGER NULL;

-- CreateTable
CREATE TABLE `PriorityType` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `MonitoringPlan` ADD CONSTRAINT `MonitoringPlan_priorityTypeId_fkey` FOREIGN KEY (`priorityTypeId`) REFERENCES `PriorityType`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
