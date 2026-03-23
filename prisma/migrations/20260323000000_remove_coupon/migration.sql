-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_couponId_fkey";

-- DropIndex
DROP INDEX "coupons_active_idx";

-- DropIndex
DROP INDEX "coupons_pizzeriaId_idx";

-- DropIndex
DROP INDEX "coupons_pizzeriaId_code_key";

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "couponId";

-- DropTable
DROP TABLE "coupons";
