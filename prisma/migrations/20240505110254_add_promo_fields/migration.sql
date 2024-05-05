-- DropIndex
DROP INDEX "Promo_title_key";

-- AlterTable
ALTER TABLE "Promo" ADD COLUMN     "href" VARCHAR(255),
ADD COLUMN     "href_text" VARCHAR(255),
ADD COLUMN     "media_id" INTEGER,
ADD COLUMN     "news_id" INTEGER,
ADD COLUMN     "text" TEXT;

-- AddForeignKey
ALTER TABLE "Promo" ADD CONSTRAINT "Promo_media_id_fkey" FOREIGN KEY ("media_id") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Promo" ADD CONSTRAINT "Promo_news_id_fkey" FOREIGN KEY ("news_id") REFERENCES "News"("id") ON DELETE SET NULL ON UPDATE CASCADE;
