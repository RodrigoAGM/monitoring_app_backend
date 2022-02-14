/*
  Warnings:

  - The primary key for the `refreshtoken` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE `refreshtoken` DROP PRIMARY KEY,
    MODIFY `token` VARCHAR(250) NOT NULL,
    MODIFY `refreshToken` VARCHAR(250) NOT NULL,
    ADD PRIMARY KEY (`refreshToken`);
