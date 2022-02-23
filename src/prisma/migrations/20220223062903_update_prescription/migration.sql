/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `DischargePaper` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `DischargePaper_code_key` ON `DischargePaper`(`code`);
