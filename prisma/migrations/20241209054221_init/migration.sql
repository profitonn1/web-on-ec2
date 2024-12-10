/*
  Warnings:

  - You are about to alter the column `balanceINR` on the `UserFullDetails` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Double`.

*/
-- AlterTable
ALTER TABLE `UserFullDetails` MODIFY `balanceINR` DOUBLE NOT NULL;
