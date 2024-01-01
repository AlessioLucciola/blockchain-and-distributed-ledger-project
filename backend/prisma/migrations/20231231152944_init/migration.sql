-- CreateTable
CREATE TABLE `Products` (
    `uid` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`uid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProductInstances` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `productId` INTEGER NOT NULL,
    `soldById` INTEGER NULL,
    `price` DOUBLE NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Entity` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `surname` VARCHAR(191) NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `address_1` VARCHAR(191) NOT NULL,
    `address_2` VARCHAR(191) NULL,
    `companyName` VARCHAR(191) NULL,
    `shopName` VARCHAR(191) NULL,
    `metamaskAddress` VARCHAR(191) NOT NULL,
    `role` ENUM('admin', 'manufacturer', 'distributor', 'retailer', 'customer') NOT NULL,

    UNIQUE INDEX `Entity_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ProductInstances` ADD CONSTRAINT `ProductInstances_soldById_fkey` FOREIGN KEY (`soldById`) REFERENCES `Entity`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductInstances` ADD CONSTRAINT `ProductInstances_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Products`(`uid`) ON DELETE RESTRICT ON UPDATE CASCADE;