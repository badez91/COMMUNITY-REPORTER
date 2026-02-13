-- CreateTable
CREATE TABLE "CloseConfirmation" (
    "id" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "CloseConfirmation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CloseConfirmation_reportId_userId_key" ON "CloseConfirmation"("reportId", "userId");

-- AddForeignKey
ALTER TABLE "CloseConfirmation" ADD CONSTRAINT "CloseConfirmation_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CloseConfirmation" ADD CONSTRAINT "CloseConfirmation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
