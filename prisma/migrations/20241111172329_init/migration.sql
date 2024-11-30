-- CreateTable
CREATE TABLE `symmbolPrice` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `btcusd` VARCHAR(191) NOT NULL,
    `ethusd` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `symmbolPrice_id_key`(`id`),
    UNIQUE INDEX `symmbolPrice_btcusd_key`(`btcusd`),
    UNIQUE INDEX `symmbolPrice_ethusd_key`(`ethusd`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
