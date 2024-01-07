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
    `currentOwner` INTEGER NOT NULL,
    `previousOwner` INTEGER NOT NULL,
    `price` DOUBLE NOT NULL DEFAULT 0,
    `manufacturerId` INTEGER NOT NULL,
    `distributorId` INTEGER NOT NULL,
    `retailerId` INTEGER NOT NULL,
    `customerId` INTEGER NOT NULL,
    `productLocation` INTEGER NOT NULL DEFAULT 0,
    `productState` INTEGER NOT NULL DEFAULT 0,

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

    UNIQUE INDEX `Entity_metamaskAddress_key`(`metamaskAddress`),
    UNIQUE INDEX `Entity_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Verifications` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entityId` INTEGER NOT NULL,
    `verificationId` VARCHAR(191) NOT NULL,
    `accountVerified` BOOLEAN NOT NULL DEFAULT false,
    `verificationPaid` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `Verifications_entityId_key`(`entityId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ProductInstances` ADD CONSTRAINT `ProductInstances_currentOwner_fkey` FOREIGN KEY (`currentOwner`) REFERENCES `Entity`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductInstances` ADD CONSTRAINT `ProductInstances_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Products`(`uid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Verifications` ADD CONSTRAINT `Verifications_entityId_fkey` FOREIGN KEY (`entityId`) REFERENCES `Entity`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
