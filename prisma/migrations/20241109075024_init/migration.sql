/*
  Warnings:

  - You are about to alter the column `symbol` on the `PlayerTradingStyleDetails` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Json`.
  - You are about to drop the column `currentPrice` on the `UserAllTrades` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `PlayerTradingStyleDetails` ADD COLUMN `timeInterval` JSON NULL,
    ADD COLUMN `toolsName` JSON NULL,
    MODIFY `symbol` JSON NULL;

-- AlterTable
ALTER TABLE `UserAllTrades` DROP COLUMN `currentPrice`;
