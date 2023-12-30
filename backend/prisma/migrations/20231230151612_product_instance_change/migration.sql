-- AlterTable
ALTER TABLE `ProductInstances` ADD COLUMN `soldById` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `ProductInstances` ADD CONSTRAINT `ProductInstances_soldById_fkey` FOREIGN KEY (`soldById`) REFERENCES `Entity`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
