-- CreateTable
CREATE TABLE "FailedImport" (
    "id" SERIAL NOT NULL,
    "rss_id" INTEGER NOT NULL,
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FailedImport_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FailedImport" ADD CONSTRAINT "FailedImport_rss_id_fkey" FOREIGN KEY ("rss_id") REFERENCES "Rss"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
